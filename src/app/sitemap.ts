import type { MetadataRoute } from "next";

import { absoluteUrl, siteConfig } from "@/lib/site";
import { CATEGORY_PAGES } from "@/lib/message-categories";
import { OCCASIONS } from "@/lib/occasions";

/**
 * Lists /en only. Spanish pages exist but still render English copy, so they
 * are deliberately not advertised — nor is there an hreflang pair yet. Both
 * arrive when the translation does.
 *
 * `lastmod` is omitted where we don't genuinely track a change date.
 *
 * It previously used `new Date()`, which told crawlers every page had changed
 * seconds ago, every time they asked — a claim that is obviously false and that
 * search engines learn to ignore. The legal pages do have a real date, so they
 * get one; the rest are better off saying nothing than lying.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const legalUpdated = new Date(siteConfig.legalUpdatedAt);

  return [
    { url: absoluteUrl("/en"), priority: 1, changeFrequency: "weekly" },
    { url: absoluteUrl("/en/send"), priority: 0.9, changeFrequency: "monthly" },
    // The message bank — the only pages here with substantial readable content,
    // and the reason anyone might arrive from a search at all.
    { url: absoluteUrl("/en/messages"), priority: 0.8, changeFrequency: "monthly" },
    ...CATEGORY_PAGES.map((page) => ({
      url: absoluteUrl(`/en/messages/${page.slug}`),
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
    // Occasion guides. /m/[slug] is deliberately absent: those are noindex,
    // existing to be shared rather than found.
    ...OCCASIONS.map((occasion) => ({
      url: absoluteUrl(`/en/for/${occasion.slug}`),
      priority: 0.7,
      changeFrequency: "yearly" as const,
    })),
    { url: absoluteUrl("/en/received"), priority: 0.5, changeFrequency: "yearly" },
    {
      url: absoluteUrl("/en/terms"),
      lastModified: legalUpdated,
      priority: 0.3,
      changeFrequency: "yearly",
    },
    {
      url: absoluteUrl("/en/privacy"),
      lastModified: legalUpdated,
      priority: 0.3,
      changeFrequency: "yearly",
    },
    { url: absoluteUrl("/en/contact"), priority: 0.4, changeFrequency: "yearly" },
  ];
}
