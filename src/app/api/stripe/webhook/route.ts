import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { deliverMessage } from "@/lib/delivery";
import { sendEmail } from "@/lib/resend";
import { alertDeliveryFailure } from "@/lib/alerts";
import { senderReceiptEmail } from "@/emails/sender-receipt";
import { deliveryFailedEmail } from "@/emails/delivery-failed";
import { subscriptionStartedEmail } from "@/emails/subscription-started";
import { subscriptionCancelledEmail } from "@/emails/subscription-cancelled";
import { nextUtcHour } from "@/lib/utils";

export const runtime = "nodejs";
/** Stripe signature verification needs the untouched request body. */
export const dynamic = "force-dynamic";

const HANDLED_EVENTS = new Set<Stripe.Event["type"]>([
  "checkout.session.completed",
  "checkout.session.async_payment_failed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("[stripe] signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (!HANDLED_EVENTS.has(event.type)) {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;
      case "checkout.session.async_payment_failed":
        await handleCheckoutFailed(event.data.object);
        break;
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionChange(event.data.object, event.type);
        break;
    }
  } catch (error) {
    // Returning 500 makes Stripe retry, which is what we want for transient
    // failures. Everything here is written to be safe to run twice.
    console.error(`[stripe] handler failed for ${event.type}`, error);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ---------------------------------------------------------------------------

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId ?? session.client_reference_id;
  if (!orderId) {
    console.warn("[stripe] checkout.session.completed without an orderId");
    return;
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { recipient: true, user: true },
  });

  if (!order) {
    console.warn(`[stripe] no order ${orderId}`);
    return;
  }

  // Idempotency: Stripe retries, and we must not send twice or charge twice.
  if (order.status === "PAID") {
    return;
  }

  if (session.payment_status === "unpaid") {
    return; // Async payment method still pending; a later event will land.
  }

  const paidAt = new Date();

  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "PAID",
      paidAt,
      stripePaymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : (session.payment_intent?.id ?? null),
      amountCents: session.amount_total ?? order.amountCents,
      currency: session.currency ?? order.currency,
    },
  });

  if (order.plan === "ONE_OFF") {
    const delivered = await fulfilOneOff(
      order.id,
      order.recipientId,
      order.theme,
    );

    // Only claim it's on its way if it actually went. Otherwise give the money
    // back rather than leaving the sender with a receipt for nothing.
    if (delivered) {
      await sendOneOffReceipt(order.id);
    } else {
      await refundUndeliveredOrder(order.id);
    }
    return;
  }

  await fulfilDailyPlan(session, order.id);
}

/** Returns true when the message actually went out. */
async function fulfilOneOff(
  orderId: string,
  recipientId: string,
  theme: "PERSONAL" | "PROFESSIONAL",
): Promise<boolean> {
  const previous = await prisma.messageSent.findFirst({
    where: { orderId },
    select: { status: true },
  });

  // A retried webhook must not send twice — report the earlier outcome instead.
  if (previous) return previous.status === "SENT";

  const result = await deliverMessage({
    recipientId,
    theme,
    orderId,
    isDaily: false,
    idempotencyKey: `order_${orderId}`,
  });

  return result.status === "SENT";
}

/**
 * We charged for a message that never arrived, so hand the money back.
 *
 * Terms §6 already promises this ("If a message was never delivered because of
 * a fault on our side, we will refund it in full"), and a one-off has no second
 * chance to make good — there is no next day, unlike a daily plan. Doing it
 * automatically is both what we've written down and cheaper than a chargeback.
 */
async function refundUndeliveredOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { recipient: true, user: true },
  });

  if (!order || order.status === "REFUNDED") return;

  let refunded = false;

  if (order.stripePaymentIntentId) {
    try {
      await stripe.refunds.create(
        { payment_intent: order.stripePaymentIntentId, reason: "requested_by_customer" },
        { idempotencyKey: `refund_${order.id}` },
      );
      refunded = true;
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "REFUNDED" },
      });
    } catch (error) {
      console.error(`[stripe] refund failed for order ${order.id}`, error);
    }
  }

  const { subject, html, text } = deliveryFailedEmail({
    recipientEmail: order.recipient.email,
    amountCents: order.amountCents,
    currency: order.currency,
    orderId: order.id,
    refunded,
  });

  await sendEmail({
    to: order.user.email,
    subject,
    html,
    text,
    idempotencyKey: `delivery_failed_${order.id}`,
  });

  await alertDeliveryFailure({
    recipientEmail: order.recipient.email,
    error: "One-off delivery failed",
    context: `one-off order ${order.id}`,
    refunded,
  });
}

async function sendOneOffReceipt(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { recipient: true, user: true },
  });
  if (!order) return;

  const { subject, html, text } = senderReceiptEmail({
    recipientEmail: order.recipient.email,
    recipientName: order.recipient.name,
    theme: order.theme,
    amountCents: order.amountCents,
    currency: order.currency,
    orderId: order.id,
    purchasedAt: order.paidAt ?? order.createdAt,
  });

  await sendEmail({
    to: order.user.email,
    subject,
    html,
    text,
    idempotencyKey: `receipt_${order.id}`,
  });
}

async function fulfilDailyPlan(
  session: Stripe.Checkout.Session,
  orderId: string,
) {
  const stripeSubscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!stripeSubscriptionId) {
    console.warn(`[stripe] daily order ${orderId} has no subscription id`);
    return;
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { recipient: true, user: true },
  });
  if (!order) return;

  const stripeSubscription =
    await stripe.subscriptions.retrieve(stripeSubscriptionId);

  const sendHourUtc = env.DAILY_SEND_HOUR_UTC;
  const now = new Date();

  const existing = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId },
  });

  const subscription = await prisma.subscription.upsert({
    where: { stripeSubscriptionId },
    create: {
      userId: order.userId,
      recipientId: order.recipientId,
      orderId: order.id,
      theme: order.theme,
      status: mapSubscriptionStatus(stripeSubscription.status),
      stripeSubscriptionId,
      stripeCustomerId:
        typeof stripeSubscription.customer === "string"
          ? stripeSubscription.customer
          : stripeSubscription.customer.id,
      stripePriceId: stripeSubscription.items.data[0]?.price.id ?? null,
      sendHourUtc,
      // First message goes out immediately; the cron picks up from tomorrow.
      nextSendAt: nextUtcHour(sendHourUtc, now),
      currentPeriodEnd: periodEndOf(stripeSubscription),
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
    },
    update: {
      status: mapSubscriptionStatus(stripeSubscription.status),
      currentPeriodEnd: periodEndOf(stripeSubscription),
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
    },
  });

  // Only the first run sends the welcome message + confirmation.
  if (existing) return;

  const delivery = await deliverMessage({
    recipientId: order.recipientId,
    theme: order.theme,
    subscriptionId: subscription.id,
    isDaily: true,
    idempotencyKey: `sub_${subscription.id}_first`,
  });

  if (delivery.status === "SENT") {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { lastSentAt: new Date(), sentCount: { increment: 1 } },
    });
  }

  const { subject, html, text } = subscriptionStartedEmail({
    recipientEmail: order.recipient.email,
    recipientName: order.recipient.name,
    theme: order.theme,
    amountCents: order.amountCents,
    currency: order.currency,
    sendHourUtc,
    nextSendAt: subscription.nextSendAt ?? nextUtcHour(sendHourUtc, now),
    subscriptionId: subscription.id,
  });

  await sendEmail({
    to: order.user.email,
    subject,
    html,
    text,
    idempotencyKey: `sub_started_${subscription.id}`,
  });
}

async function handleCheckoutFailed(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId ?? session.client_reference_id;
  if (!orderId) return;

  await prisma.order.updateMany({
    where: { id: orderId, status: "PENDING" },
    data: { status: "FAILED" },
  });
}

async function handleSubscriptionChange(
  stripeSubscription: Stripe.Subscription,
  eventType: "customer.subscription.updated" | "customer.subscription.deleted",
) {
  const existing = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: stripeSubscription.id },
    include: { recipient: true, user: true },
  });

  if (!existing) return;

  const ended =
    eventType === "customer.subscription.deleted" ||
    stripeSubscription.status === "canceled";

  const status = ended
    ? ("CANCELED" as const)
    : mapSubscriptionStatus(stripeSubscription.status);

  await prisma.subscription.update({
    where: { id: existing.id },
    data: {
      status,
      currentPeriodEnd: periodEndOf(stripeSubscription),
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      canceledAt: ended ? (existing.canceledAt ?? new Date()) : null,
      // Stop the cron picking it up the moment it stops being deliverable, and
      // re-arm it on the way back — a plan that recovers from PAST_DUE has a
      // null nextSendAt and would otherwise never send again.
      nextSendAt:
        status === "ACTIVE"
          ? (existing.nextSendAt ?? nextUtcHour(existing.sendHourUtc))
          : null,
    },
  });

  // Notify once: on the transition into a cancelled state, not on every update.
  const alreadyCancelled = existing.status === "CANCELED";
  const scheduledToEnd =
    stripeSubscription.cancel_at_period_end && !existing.cancelAtPeriodEnd;

  if ((ended && !alreadyCancelled) || scheduledToEnd) {
    const { subject, html, text } = subscriptionCancelledEmail({
      recipientEmail: existing.recipient.email,
      recipientName: existing.recipient.name,
      endsAt: ended ? null : periodEndOf(stripeSubscription),
      messagesSent: existing.sentCount,
    });

    await sendEmail({
      to: existing.user.email,
      subject,
      html,
      text,
      idempotencyKey: `sub_cancelled_${existing.id}_${ended ? "ended" : "scheduled"}`,
    });
  }
}

// ---------------------------------------------------------------------------

/**
 * `current_period_end` lives on the subscription item in current Stripe API
 * versions, not on the subscription itself.
 */
function periodEndOf(subscription: Stripe.Subscription): Date | null {
  const timestamp = subscription.items?.data?.[0]?.current_period_end;
  return timestamp ? new Date(timestamp * 1000) : null;
}

function mapSubscriptionStatus(status: Stripe.Subscription.Status) {
  switch (status) {
    case "active":
    case "trialing":
      return "ACTIVE" as const;
    case "past_due":
    case "unpaid":
      return "PAST_DUE" as const;
    case "canceled":
      return "CANCELED" as const;
    case "paused":
      return "PAUSED" as const;
    default:
      return "INCOMPLETE" as const;
  }
}
