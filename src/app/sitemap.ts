import type { MetadataRoute } from "next";

import { absoluteUrl, siteConfig } from "@/lib/site";
import { CATEGORY_PAGES } from "@/lib/message-categories";
import { OCCASIONS } from "@/lib/occasions";

/**
 * Only URLs that are genuinely written in the language they claim.
 *
 * Spanish appears for the pages that are translated — home, send, and the three
 * legal documents — each declaring its English counterpart via hreflang in the
 * page metadata. /es/messages, /es/received and /es/for/* still render English
 * and are noindex, so listing them here would contradict the page itself.
 *
 * `lastmod` is omitted where no real change date is tracked. It previously used
 * `new Date()`, which told crawlers every page had changed seconds ago, every
 * time they asked — a claim search engines learn to ignore.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const legalUpdated = new Date(siteConfig.legalUpdatedAt);

  /** Paths that exist properly in both languages. */
  const bilingual: Array<{ path: string; priority: number; lastMod?: Date }> = [
    { path: "", priority: 1 },
    { path: "/send", priority: 0.9 },
    { path: "/terms", priority: 0.3, lastMod: legalUpdated },
    { path: "/privacy", priority: 0.3, lastMod: legalUpdated },
    { path: "/contact", priority: 0.4 },
  ];

  const bilingualEntries = bilingual.flatMap(({ path, priority, lastMod }) =>
    (["en", "es"] as const).map((locale) => ({
      url: absoluteUrl(`/${locale}${path}`),
      priority,
      ...(lastMod ? { lastModified: lastMod } : {}),
      changeFrequency: (path === "" ? "weekly" : "monthly") as
        | "weekly"
        | "monthly",
      alternates: {
        languages: {
          en: absoluteUrl(`/en${path}`),
          es: absoluteUrl(`/es${path}`),
        },
      },
    })),
  );

  /** English-only for now: the Spanish versions are noindex until translated. */
  const englishOnly: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/en/messages"),
      priority: 0.8,
      changeFrequency: "monthly",
    },
    ...CATEGORY_PAGES.map((page) => ({
      url: absoluteUrl(`/en/messages/${page.slug}`),
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
    ...OCCASIONS.map((occasion) => ({
      url: absoluteUrl(`/en/for/${occasion.slug}`),
      priority: 0.7,
      changeFrequency: "yearly" as const,
    })),
    {
      url: absoluteUrl("/en/received"),
      priority: 0.5,
      changeFrequency: "yearly",
    },
  ];

  return [...bilingualEntries, ...englishOnly];
}
