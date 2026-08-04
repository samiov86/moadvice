"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  cancelSubscription,
  resumeSubscription,
  type ActionResult,
} from "@/app/(utility)/dashboard/actions";

/** Cancel / resume for one daily plan, with inline feedback. */
export function SubscriptionControls({
  subscriptionId,
  cancelAtPeriodEnd,
}: {
  subscriptionId: string;
  cancelAtPeriodEnd: boolean;
}) {
  const action = cancelAtPeriodEnd ? resumeSubscription : cancelSubscription;
  const [state, formAction, pending] = React.useActionState<
    ActionResult | null,
    FormData
  >(action, null);

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-3">
      <input type="hidden" name="subscriptionId" value={subscriptionId} />
      <Button
        type="submit"
        size="sm"
        variant={cancelAtPeriodEnd ? "secondary" : "outline"}
        disabled={pending}
      >
        {pending && <Loader2 className="size-4 animate-spin" />}
        {cancelAtPeriodEnd ? "Resume daily messages" : "Cancel this plan"}
      </Button>

      {state && (
        <span
          role="status"
          className={
            state.ok
              ? "text-sm text-muted-foreground"
              : "text-sm text-destructive"
          }
        >
          {state.message}
        </span>
      )}
    </form>
  );
}

/** Opens the Stripe Customer Portal for cards, invoices and cancellations. */
export function BillingPortalButton() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function openPortal() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/portal", { method: "POST" });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        setError(data.error ?? "Couldn't open the billing portal.");
        setLoading(false);
        return;
      }
      window.location.assign(data.url);
    } catch {
      setError("Couldn't reach Stripe. Check your connection.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button variant="outline" onClick={openPortal} disabled={loading}>
        {loading && <Loader2 className="size-4 animate-spin" />}
        Manage billing
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
