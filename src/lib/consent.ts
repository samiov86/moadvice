/**
 * Cookie consent for Google Analytics.
 *
 * Under ePrivacy and GDPR, analytics cookies need consent *before* they are
 * set, not after — so Consent Mode starts denied and only flips if the visitor
 * says yes. Vercel Analytics is unaffected: it's cookieless and needs no
 * permission, which is why the site still measures something for people who
 * decline.
 *
 * Withdrawing has to be as easy as giving, so the footer can reopen the banner
 * at any time via `REOPEN_CONSENT_EVENT`.
 */

export const CONSENT_STORAGE_KEY = "moadvice.consent";
export const REOPEN_CONSENT_EVENT = "moadvice:reopen-consent";

export type ConsentChoice = "granted" | "denied";

export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    // Private browsing or storage disabled — treat as undecided, which means
    // consent stays denied and the banner shows again next visit.
    return null;
  }
}

export function writeConsent(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Nothing to do: the in-memory update below still applies for this page.
  }

  applyConsent(choice);
}

/** Tell Google about the choice. No-op if the tag never loaded. */
export function applyConsent(choice: ConsentChoice): void {
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void })
    .gtag;
  if (typeof gtag !== "function") return;

  gtag("consent", "update", {
    analytics_storage: choice === "granted" ? "granted" : "denied",
  });
}
