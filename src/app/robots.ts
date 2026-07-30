import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

/**
 * Only /api/ is disallowed.
 *
 * /dashboard, /signin, /send/success and /unsubscribe all carry
 * `robots: { index: false }` in their own metadata, and a crawler cannot read a
 * noindex on a page it is forbidden to fetch — so disallowing them here would
 * weaken the guarantee, not strengthen it. A disallowed URL can still surface
 * in results as a bare link if anyone points at it. Crawl is allowed so the
 * noindex is actually seen and obeyed.
 *
 * /api/ has no HTML to carry a meta tag, so it stays disallowed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
