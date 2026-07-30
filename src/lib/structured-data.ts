import { PLANS, absoluteUrl, siteConfig } from "@/lib/site";

/**
 * schema.org JSON-LD.
 *
 * Only describes things that are actually visible on the page — FAQ entries
 * come from the same array that renders the FAQ section, and prices come from
 * PLANS, so the markup can't drift from what a visitor sees. Search engines
 * treat that mismatch as spam, and it's the usual way structured data goes bad.
 */

/** The publisher. Feeds brand knowledge panels and sitelinks. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/icon.png"),
    description: siteConfig.description,
    email: siteConfig.supportEmail,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: siteConfig.supportEmail,
      url: absoluteUrl("/contact"),
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: { "@id": absoluteUrl("/#organization") },
    inLanguage: "en",
  };
}

/** The two things you can buy, priced from the same constants the page renders. */
export function productSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": absoluteUrl("/#product"),
    name: `${siteConfig.name} — anonymous compliments by email`,
    description: siteConfig.description,
    image: absoluteUrl("/opengraph-image"),
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: Object.values(PLANS).map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      description: plan.blurb,
      price: (plan.amountCents / 100).toFixed(2),
      priceCurrency: plan.currency.toUpperCase(),
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/send?plan=${plan.id}`),
      ...(plan.mode === "subscription"
        ? {
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: (plan.amountCents / 100).toFixed(2),
              priceCurrency: plan.currency.toUpperCase(),
              billingDuration: 1,
              billingIncrement: 1,
              unitCode: "MON",
            },
          }
        : {}),
    })),
  };
}

export function faqSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": absoluteUrl("/#faq"),
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

/**
 * Serialise for a <script> tag.
 *
 * `<` is escaped so a stray "</script>" inside any string can't close the tag
 * early and inject markup. None of our copy contains one today, but the FAQ and
 * plan text are editable by anyone touching the repo.
 */
export function jsonLd(schema: object): string {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}
