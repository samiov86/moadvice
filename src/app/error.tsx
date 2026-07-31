"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

/**
 * Shown when a page throws. Without this, a live visitor sees Next's default
 * error screen — unbranded, and alarming on a page where they were about to
 * enter a card. The failure itself is reported by `src/instrumentation.ts`.
 */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex flex-1 items-center bg-warm-wash">
      <div className="mx-auto w-full max-w-lg px-5 py-24 text-center sm:px-8">
        <p className="font-display text-5xl text-primary">Oh dear</p>
        <h1 className="mt-6 font-display text-3xl leading-tight">
          Something went wrong at our end
        </h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Not your fault, and we&apos;ve been told about it automatically. If
          you were part-way through sending something,{" "}
          <strong className="font-medium text-foreground">
            nothing has been charged
          </strong>{" "}
          — payment only happens on Stripe&apos;s own page.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={reset}>Try again</Button>
          <Button asChild variant="outline">
            <Link href="/">Back to the homepage</Link>
          </Button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          If it keeps happening, email{" "}
          <a
            href={`mailto:${siteConfig.supportEmail}`}
            className="underline underline-offset-4"
          >
            {siteConfig.supportEmail}
          </a>{" "}
          and we&apos;ll sort it out.
        </p>
      </div>
    </main>
  );
}
