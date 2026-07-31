import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { auth } from "@/lib/auth";
import { stripe, ensureStripeCustomer } from "@/lib/stripe";
import { PLANS, absoluteUrl } from "@/lib/site";
import { normalizeEmail } from "@/lib/utils";
import { clientIpFrom, ipRateLimit, senderRateLimit } from "@/lib/rate-limit";
import { isValidTimeZone } from "@/lib/timezone";

export const runtime = "nodejs";

const checkoutSchema = z.object({
  recipientEmail: z.string().trim().min(3).max(254).email(),
  recipientName: z.string().trim().max(80).optional().or(z.literal("")),
  senderEmail: z.string().trim().min(3).max(254).email(),
  theme: z.enum(["PERSONAL", "PROFESSIONAL"]),
  plan: z.enum(["ONE_OFF", "DAILY"]),
  /** Daily plans only — when the recipient should get it, in their own time. */
  sendHour: z.coerce.number().int().min(0).max(23).optional(),
  sendTimezone: z
    .string()
    .max(64)
    .optional()
    // Validated against the runtime's own zone database rather than a regex:
    // a plausible-looking but unknown zone would silently fall back to UTC.
    .refine((tz) => tz === undefined || isValidTimeZone(tz), {
      message: "Unrecognised timezone",
    }),
});

/**
 * Starts a Stripe Checkout session.
 *
 * Nothing is delivered here — the webhook is the only place that fulfils an
 * order, so a closed browser tab or a failed card can't produce a free message.
 * All this does is create the PENDING order the webhook will look for.
 */
export async function POST(request: Request) {
  // Cheap check first: refuse a flood before touching the database or Stripe.
  const ip = clientIpFrom(request.headers);
  const ipCheck = ipRateLimit(ip);
  if (!ipCheck.ok) {
    return NextResponse.json(
      { error: "That's a lot of requests. Give it a minute and try again." },
      { status: 429, headers: { "Retry-After": String(ipCheck.retryAfter) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the details and try again.",
        issues: parsed.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }

  const { theme, plan } = parsed.data;
  const recipientEmail = normalizeEmail(parsed.data.recipientEmail);
  const senderEmail = normalizeEmail(parsed.data.senderEmail);
  const recipientName = parsed.data.recipientName?.trim() || null;
  const planConfig = PLANS[plan];

  // Respect opt-outs before taking anyone's money.
  const existingRecipient = await prisma.recipient.findUnique({
    where: { email: recipientEmail },
  });

  if (existingRecipient?.unsubscribedAt) {
    return NextResponse.json(
      {
        error:
          "That address has asked not to receive these messages. We can't send there.",
        code: "recipient_unsubscribed",
      },
      { status: 409 },
    );
  }

  try {
    // A signed-in sender keeps their existing account; everyone else gets one
    // created silently, keyed on the email they typed.
    const session = await auth();
    const user = session?.user?.id
      ? await prisma.user.findUnique({ where: { id: session.user.id } })
      : null;

    const sender =
      user ??
      (await prisma.user.upsert({
        where: { email: senderEmail },
        create: { email: senderEmail },
        update: {},
      }));

    // Survives across instances, unlike the IP window above.
    if (!(await senderRateLimit(sender.id))) {
      return NextResponse.json(
        {
          error:
            "You've started a lot of checkouts in the last few minutes. Finish or abandon one, then try again.",
        },
        { status: 429, headers: { "Retry-After": "600" } },
      );
    }

    const stripeCustomerId = await ensureStripeCustomer({
      email: sender.email,
      name: sender.name,
      existingCustomerId: sender.stripeCustomerId,
    });

    if (stripeCustomerId !== sender.stripeCustomerId) {
      await prisma.user.update({
        where: { id: sender.id },
        data: { stripeCustomerId },
      });
    }

    const recipient = await prisma.recipient.upsert({
      where: { email: recipientEmail },
      create: { email: recipientEmail, name: recipientName },
      // Only fill in a name, never overwrite one a previous sender supplied.
      update: existingRecipient?.name ? {} : { name: recipientName },
    });

    const order = await prisma.order.create({
      data: {
        userId: sender.id,
        recipientId: recipient.id,
        plan,
        theme,
        amountCents: planConfig.amountCents,
        currency: planConfig.currency,
        status: "PENDING",
        // Only meaningful for a daily plan; a one-off sends on payment.
        sendHour: plan === "DAILY" ? (parsed.data.sendHour ?? 6) : null,
        sendTimezone:
          plan === "DAILY" ? (parsed.data.sendTimezone ?? "UTC") : null,
      },
    });

    const metadata = {
      orderId: order.id,
      userId: sender.id,
      recipientId: recipient.id,
      plan,
      theme,
    };

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: planConfig.mode,
      customer: stripeCustomerId,
      line_items: [
        {
          price:
            plan === "ONE_OFF"
              ? env.STRIPE_PRICE_ONE_OFF
              : env.STRIPE_PRICE_DAILY,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      client_reference_id: order.id,
      metadata,
      ...(planConfig.mode === "subscription"
        ? { subscription_data: { metadata } }
        : { payment_intent_data: { metadata } }),
      success_url: absoluteUrl(
        "/send/success?session_id={CHECKOUT_SESSION_ID}",
      ),
      cancel_url: absoluteUrl("/send?canceled=1"),
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeCheckoutSessionId: checkoutSession.id },
    });

    if (!checkoutSession.url) {
      throw new Error("Stripe did not return a checkout URL");
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("[checkout] failed", error);
    return NextResponse.json(
      { error: "We couldn't start checkout. Please try again in a moment." },
      { status: 500 },
    );
  }
}
