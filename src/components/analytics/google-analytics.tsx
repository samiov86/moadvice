import Script from "next/script";

import { CONSENT_STORAGE_KEY } from "@/lib/consent";

/**
 * Google Analytics 4, gated behind Consent Mode v2.
 *
 * Order is the whole point: the `consent default` command must execute before
 * gtag.js initialises, or the library sets cookies in the window between load
 * and the visitor answering — which is precisely what consent is meant to
 * prevent. Hence `beforeInteractive` for the defaults and `afterInteractive`
 * for the library itself.
 *
 * Everything starts denied. A returning visitor's stored choice is replayed in
 * the same inline block, so consent is restored before any measurement happens
 * rather than a beat later once React has hydrated.
 */
export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  return (
    <>
      {/*
        A plain inline script, not next/script. `beforeInteractive` is only
        honoured directly inside the root layout, and Next's lint rule flags it
        anywhere else — but the ordering guarantee is what matters here, and a
        raw inline script gives it outright: this executes while the HTML is
        parsed, long before gtag.js is fetched afterInteractive.
      */}
      <script
        id="ga-consent-default"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500
});
try {
  if (localStorage.getItem('${CONSENT_STORAGE_KEY}') === 'granted') {
    gtag('consent', 'update', { analytics_storage: 'granted' });
  }
} catch (e) {}
`,
        }}
      />

      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />

      <Script id="ga-init" strategy="afterInteractive">
        {`gtag('js', new Date()); gtag('config', '${measurementId}');`}
      </Script>
    </>
  );
}
