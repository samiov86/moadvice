import { Analytics } from "@vercel/analytics/next";

import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { ConsentBanner } from "@/components/analytics/consent-banner";

/** Unset locally, so development never reports into the live property. */
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Everything that belongs inside <body> on every page.
 *
 * Shared because there are now two root layouts — one per route group — and
 * duplicating the analytics wiring across them is exactly how the two quietly
 * drift apart.
 */
export function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/*
        Vercel Web Analytics: cookieless, no cross-site tracking, and no
        personal data leaves the page. It runs for everyone, including people
        who decline below — no cookies means no consent required, so declining
        costs us depth rather than all measurement.
      */}
      <Analytics />

      {gaMeasurementId && (
        <>
          <GoogleAnalytics measurementId={gaMeasurementId} />
          <ConsentBanner />
        </>
      )}
    </>
  );
}
