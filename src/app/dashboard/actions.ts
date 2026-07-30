"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export interface ActionResult {
  ok: boolean;
  message: string;
}

/**
 * Cancel at period end. The sender keeps the days they've paid for, and the
 * `customer.subscription.updated` webhook writes the confirmation email — so
 * cancelling from the Stripe portal behaves identically to cancelling here.
 */
export async function cancelSubscription(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, message: "Please sign in again." };
  }

  const subscriptionId = String(formData.get("subscriptionId") ?? "");
  if (!subscriptionId) {
    return { ok: false, message: "Missing subscription." };
  }

  const subscription = await prisma.subscription.findFirst({
    where: { id: subscriptionId, userId: session.user.id },
  });

  if (!subscription) {
    return { ok: false, message: "We couldn't find that plan." };
  }

  if (subscription.status === "CANCELED") {
    return { ok: true, message: "That plan has already ended." };
  }

  try {
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { cancelAtPeriodEnd: true },
    });

    revalidatePath("/dashboard");
    return {
      ok: true,
      message:
        "Cancelled. Messages continue until the end of the month you've paid for.",
    };
  } catch (error) {
    console.error("[dashboard] cancel failed", error);
    return {
      ok: false,
      message: "Stripe wouldn't accept that just now. Please try again.",
    };
  }
}

/** Undo a pending cancellation before the period runs out. */
export async function resumeSubscription(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, message: "Please sign in again." };
  }

  const subscriptionId = String(formData.get("subscriptionId") ?? "");
  const subscription = await prisma.subscription.findFirst({
    where: { id: subscriptionId, userId: session.user.id },
  });

  if (!subscription || subscription.status === "CANCELED") {
    return { ok: false, message: "That plan can't be resumed." };
  }

  try {
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { cancelAtPeriodEnd: false },
    });

    revalidatePath("/dashboard");
    return { ok: true, message: "Back on. The daily messages will continue." };
  } catch (error) {
    console.error("[dashboard] resume failed", error);
    return {
      ok: false,
      message: "Stripe wouldn't accept that just now. Please try again.",
    };
  }
}
