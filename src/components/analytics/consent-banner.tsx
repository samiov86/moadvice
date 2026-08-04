"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  REOPEN_CONSENT_EVENT,
  readConsent,
  writeConsent,
  type ConsentChoice,
} from "@/lib/consent";
import { cn } from "@/lib/utils";

/**
 * Cookie consent banner.
 *
 * Deliberately not a modal and not full-screen: it doesn't trap focus, doesn't
 * block the page, and "Decline" is the same size and weight as "Accept".
 * Consent obtained by making refusal harder isn't consent, and a banner that
 * nags is worse for the brand than the data is worth.
 *
 * Renders nothing until mounted, since the answer lives in localStorage and
 * guessing during SSR would flash the banner at people who already decided.
 */
export function ConsentBanner() {
  const [choice, setChoice] = React.useState<ConsentChoice | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setChoice(readConsent());
    setMounted(true);

    const reopen = () => setChoice(null);
    window.addEventListener(REOPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(REOPEN_CONSENT_EVENT, reopen);
  }, []);

  if (!mounted || choice !== null) return null;

  const decide = (value: ConsentChoice) => {
    writeConsent(value);
    setChoice(value);
  };

  return (
    <div
      role="region"
      aria-label="Cookie choices"
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6",
        "animate-in fade-in slide-in-from-bottom-4",
      )}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-warm-lg sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
          We&apos;d like to use Google Analytics to understand how people find
          this site. It sets cookies, so we only will if you say yes — decline
          and nothing is stored on your device.{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-foreground"
          >
            How we handle data
          </Link>
          .
        </p>

        <div className="flex shrink-0 gap-3">
          <Button
            variant="outline"
            onClick={() => decide("denied")}
            className="flex-1 sm:flex-none"
          >
            Decline
          </Button>
          <Button
            onClick={() => decide("granted")}
            className="flex-1 sm:flex-none"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Footer control, so withdrawing is as easy as consenting was. */
export function ConsentReopenButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(REOPEN_CONSENT_EVENT))}
      className="text-foreground/80 transition-colors hover:text-primary"
    >
      {label}
    </button>
  );
}
