/**
 * Brand + product constants. Everything user-visible about "Mo Advice" that
 * isn't copy inside a component lives here so a rebrand is a one-file change.
 */

export const siteConfig = {
  name: "Mo Advice",
  domain: "moadvice.com",
  tagline: "More of the good words",
  strapline: "Anonymous compliments that feel like good advice",
  description:
    "Mo Advice sends anonymous compliments by email — short, genuine words that boost someone's confidence and morale. No account needed for the person receiving them.",
  supportEmail: "hello@moadvice.com",

  /**
   * The trader behind the site. "Mo Advice" is a trading name, not a legal
   * entity, so this is who the customer actually contracts with — required on
   * the site by EU distance-selling rules and Spain's LSSI-CE, and the first
   * thing a card issuer looks for in a chargeback.
   */
  legal: {
    name: "Sami Oueslati",
    /** Spanish tax ID. LSSI-CE requires a provider to display it. */
    nif: "41571545B",
    addressLines: ["c/ Madrazo 46", "08006 Barcelona", "Spain"],
    /** Single line, for the footer and email footers. */
    addressInline: "c/ Madrazo 46, 08006 Barcelona, Spain",
    country: "Spain",
    governingLaw: "Spanish law",
  },
  /**
   * When the legal pages last changed, ISO date. Single source for both the
   * "Last updated" line those pages display and the sitemap's `lastmod`, so
   * the two can't disagree. Bump it whenever you edit Terms or Privacy.
   */
  legalUpdatedAt: "2026-08-01",
  /** Absolute origin, used for links inside emails and Stripe redirect URLs. */
  url:
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000",
} as const;

/**
 * Consent to immediate performance, shown at checkout and stored with the order.
 *
 * UK/EU consumers have a 14-day right to withdraw from a distance contract. For
 * a digital service performed straight away, that right is only lost if the
 * consumer expressly consents to immediate performance AND acknowledges losing
 * it — and the trader confirms that on a durable medium afterwards.
 *
 * Without this, "one-off messages are non-refundable" simply wouldn't hold
 * against a UK or EU buyer. The wording is stored per order rather than only
 * referenced, so a dispute can be answered with exactly what was agreed to.
 */
export const WITHDRAWAL_CONSENT_TEXT =
  "I want my message sent straight away, and I understand that once it has been sent I lose my right to cancel within 14 days.";

export type PlanId = "ONE_OFF" | "DAILY";

export interface PlanConfig {
  id: PlanId;
  name: string;
  /** Human price, e.g. "$1". */
  price: string;
  priceSuffix: string;
  amountCents: number;
  currency: string;
  blurb: string;
  features: string[];
  mode: "payment" | "subscription";
}

export const PLANS: Record<PlanId, PlanConfig> = {
  ONE_OFF: {
    id: "ONE_OFF",
    name: "One message",
    price: "$1",
    priceSuffix: "once",
    amountCents: 100,
    currency: "usd",
    blurb: "A single set of kind words, delivered right away.",
    features: [
      "Sent within a minute of paying",
      "Completely anonymous",
      "Personal or professional tone",
      "No account needed for them",
    ],
    mode: "payment",
  },
  DAILY: {
    id: "DAILY",
    name: "Daily words",
    price: "$5",
    priceSuffix: "per month",
    amountCents: 500,
    currency: "usd",
    blurb: "One new message every morning, for as long as you like.",
    features: [
      "A different message every day, at a time you choose",
      "Never repeats until the whole bank is used",
      "Cancel any time in one click",
      "Run several at once, for different people",
    ],
    mode: "subscription",
  },
} as const;

export const THEMES = [
  {
    id: "PERSONAL" as const,
    name: "Personal",
    blurb: "For a friend, a partner, a parent, someone having a hard month.",
    example:
      "There is a person who thinks of you when something goes wrong, before they have thought about what to do. You may never be told that. It is one of the highest things a human being can be to another one.",
    exampleHeadline: "You are somebody's safe place",
  },
  {
    id: "PROFESSIONAL" as const,
    name: "Professional",
    blurb: "For a colleague, a report, a manager, someone carrying a lot at work.",
    example:
      "There is a kind of work that only gets noticed when it stops, and you have been doing it for a long time without stopping. It is not glamorous and it is not accidental — it is a standard you hold when no one is checking.",
    exampleHeadline: "You are the reason things don't fall through",
  },
];

export type ThemeId = (typeof THEMES)[number]["id"];

/** Absolute URL helper — safe to use in emails and server code. */
export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
