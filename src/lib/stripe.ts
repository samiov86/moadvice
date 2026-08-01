import Stripe from "stripe";
import { env, isStripeTestMode } from "@/lib/env";

/**
 * Stripe client. The API version is deliberately not pinned here — the account
 * default is used, which keeps the SDK's TypeScript types and the live API in
 * agreement across upgrades. Pin it if you need reproducible behaviour:
 *   new Stripe(key, { apiVersion: "2025-10-29.clover" })
 *
 * Construction is deferred until the first property access. `next build` loads
 * every route module to collect page data, so building the client eagerly would
 * make a deploy require STRIPE_SECRET_KEY at build time — and fail the whole
 * build if it were absent, rather than failing the one request that needs it.
 */
const globalForStripe = globalThis as unknown as { stripe: Stripe | undefined };

function createClient(): Stripe {
  // Loud, once, on the first Stripe call outside production. A local test that
  // opens a real Checkout session is one keystroke away from taking real money,
  // and the only tell is a `cs_live_` buried in a JSON response.
  if (process.env.NODE_ENV !== "production" && !isStripeTestMode()) {
    console.warn(
      "\n\x1b[31m\x1b[1m  STRIPE IS IN LIVE MODE AND THIS IS NOT PRODUCTION\x1b[0m\n" +
        "  Anything you do here can charge real cards. Use sk_test_… locally.\n" +
        "  Run `npm run env:check` to see what else is pointed at production.\n",
    );
  }

  const client =
    globalForStripe.stripe ??
    new Stripe(env.STRIPE_SECRET_KEY, {
      typescript: true,
      appInfo: { name: "Mo Advice", url: "https://moadvice.com" },
    });

  if (process.env.NODE_ENV !== "production") {
    globalForStripe.stripe = client;
  }

  return client;
}

let instance: Stripe | null = null;

export const stripe = new Proxy({} as Stripe, {
  get(_target, property, receiver) {
    instance ??= createClient();
    return Reflect.get(instance, property, receiver);
  },
});

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
