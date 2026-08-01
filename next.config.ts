import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The Open Graph routes read font files with `path.join(process.cwd(), …)`,
   * which Next's file tracing cannot follow — it only bundles paths it can see
   * statically. Prerendering normally covers this, but a route that ever falls
   * back to on-demand generation would 500 at request time with the fonts
   * missing from the bundle. Listing them explicitly makes that impossible.
   */
  outputFileTracingIncludes: {
    "/opengraph-image": ["./src/app/_fonts/**", "./src/app/icon.png"],
    "/twitter-image": ["./src/app/_fonts/**", "./src/app/icon.png"],
    "/m/[slug]/opengraph-image": ["./src/app/_fonts/**", "./src/app/icon.png"],
  },
};

export default nextConfig;
