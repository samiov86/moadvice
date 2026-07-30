import Stripe from "stripe";
import { env } from "@/lib/env";

/**
 * Stripe client. The API version is deliberately not pinned here — the account
 * default is used, which keeps the SDK's TypeScript types and the live API in
 * agreement across upgrades. Pin it if you need reproducible behaviour:
 *   new Stripe(key, { apiVersion: "2025-10-29.clover" })
 */
const globalForStripe = globalThis as unknown as { stripe: Stripe | undefined };

export const stripe =
  globalForStripe.stripe ??
  new Stripe(env.STRIPE_SECRET_KEY, {
    typescript: true,
    appInfo: { name: "Mo Advice", url: "https://moadvice.com" },
  });

if (process.env.NODE_ENV !== "production") {
  globalForStripe.stripe = stripe;
}

/**
 * Find or create the Stripe customer for a sender. We always reuse the same
 * customer so the billing portal shows every subscription they hold.
 */
export async function ensureStripeCustomer(params: {
  email: string;
  name?: string | null;
  existingCustomerId?: string | null;
}): Promise<string> {
  if (params.existingCustomerId) {
    try {
      const existing = await stripe.customers.retrieve(
        params.existingCustomerId,
      );
      if (!existing.deleted) return existing.id;
    } catch {
      // Customer was removed in the Stripe dashboard — fall through and remake.
    }
  }

  const customer = await stripe.customers.create({
    email: params.email,
    name: params.name ?? undefined,
    metadata: { product: "mo-advice" },
  });

  return customer.id;
}
