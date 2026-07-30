import type { MetadataRoute } from "next";

import { absoluteUrl, siteConfig } from "@/lib/site";

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
