"use client";

import * as React from "react";
import { Check, Link2, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Share control for a single message.
 *
 * Prefers the native share sheet, which on a phone reaches WhatsApp, Messages
 * and everything else the person already uses — far more useful than a row of
 * network buttons, and it ships no third-party script. Falls back to copying
 * the link on desktop, where the API mostly doesn't exist.
 */
export function ShareMessage({
  url,
  headline,
}: {
  url: string;
  headline: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  // Resolved after mount: navigator.share doesn't exist during SSR, and
  // guessing would render the wrong button then swap it.
  React.useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  React.useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard can be blocked by permissions or an insecure context.
      // Selecting the URL by hand still works, so fail quietly.
    }
  }

  async function share() {
    try {
      await navigator.share({ title: headline, text: headline, url });
    } catch {
      // Includes the user simply dismissing the sheet — not an error.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-muted-foreground">
        Send this one to someone:
      </span>

      {canShare && (
        <Button size="sm" variant="secondary" onClick={share}>
          <Share2 className="size-4" /> Share
        </Button>
      )}

      <Button size="sm" variant="outline" onClick={copy}>
        {copied ? (
          <>
            <Check className="size-4" /> Link copied
          </>
        ) : (
          <>
            <Link2 className="size-4" /> Copy link
          </>
        )}
      </Button>
    </div>
  );
}
