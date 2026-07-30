import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: absoluteUrl("/"), lastModified, priority: 1, changeFrequency: "weekly" },
    { url: absoluteUrl("/send"), lastModified, priority: 0.9 },
    { url: absoluteUrl("/terms"), lastModified, priority: 0.3 },
    { url: absoluteUrl("/privacy"), lastModified, priority: 0.3 },
    { url: absoluteUrl("/contact"), lastModified, priority: 0.4 },
  ];
}
