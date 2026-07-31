"use client";

import * as React from "react";
import { track } from "@vercel/analytics";

/**
 * Closes the funnel. Payment happens on Stripe's own page, so the return to
 * /send/success is the only moment the browser can report a completed purchase.
 *
 * Fires once per order id: React StrictMode double-invokes effects in
 * development, and browsers restore this page from the back/forward cache, both
 * of which would otherwise double-count.
 */
const reported = new Set<string>();

export function TrackPurchase({
  orderId,
  plan,
  theme,
}: {
  orderId: string;
  plan: string;
  theme: string;
}) {
  React.useEffect(() => {
    if (reported.has(orderId)) return;
    reported.add(orderId);
    // No email addresses, no amounts tied to a person — just what was bought.
    track("purchase_completed", { plan, theme });
  }, [orderId, plan, theme]);

  return null;
}
