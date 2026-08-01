import type { MetadataRoute } from "next";

import { absoluteUrl, siteConfig } from "@/lib/site";
import { CATEGORY_PAGES } from "@/lib/message-categories";
import { OCCASIONS } from "@/lib/occasions";

/**
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
    { url: absoluteUrl("/"), priority: 1, changeFrequency: "weekly" },
    { url: absoluteUrl("/send"), priority: 0.9, changeFrequency: "monthly" },
    // The message bank — the only pages here with substantial readable content,
    // and the reason anyone might arrive from a search at all.
    { url: absoluteUrl("/messages"), priority: 0.8, changeFrequency: "monthly" },
    ...CATEGORY_PAGES.map((page) => ({
      url: absoluteUrl(`/messages/${page.slug}`),
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
    // Occasion guides. /m/[slug] is deliberately absent: those are noindex,
    // existing to be shared rather than found.
    ...OCCASIONS.map((occasion) => ({
      url: absoluteUrl(`/for/${occasion.slug}`),
      priority: 0.7,
      changeFrequency: "yearly" as const,
    })),
    { url: absoluteUrl("/received"), priority: 0.5, changeFrequency: "yearly" },
    {
      url: absoluteUrl("/terms"),
      lastModified: legalUpdated,
      priority: 0.3,
      changeFrequency: "yearly",
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified: legalUpdated,
      priority: 0.3,
      changeFrequency: "yearly",
    },
    { url: absoluteUrl("/contact"), priority: 0.4, changeFrequency: "yearly" },
  ];
}
