import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Nothing here is secret, but none of it is worth indexing either.
      disallow: ["/api/", "/dashboard", "/signin", "/send/success", "/unsubscribe"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
