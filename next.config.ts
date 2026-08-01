import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The Open Graph routes read their fonts with `path.join(process.cwd(), …)`,
   * a path the bundler cannot resolve statically and therefore never traces.
   * That is what made the per-message cards return 500 with ENOENT once
   * deployed, while working perfectly under `next start`, which has the whole
   * repo on disk.
   *
   * `new URL("./_fonts/…", import.meta.url)` is the form webpack *does* follow,
   * and it traces the fonts correctly — but it breaks the prerender in this
   * Next version with ERR_INVALID_ARG_TYPE, failing the build outright. So the
   * readable path stays and the files are named explicitly here instead.
   *
   * Worth retrying `new URL` on a future Next upgrade; if the export succeeds,
   * this block can go.
   */
  outputFileTracingIncludes: {
    "/opengraph-image": ["./src/app/_fonts/**", "./src/app/icon.png"],
    "/twitter-image": ["./src/app/_fonts/**", "./src/app/icon.png"],
    "/m/[slug]/opengraph-image": ["./src/app/_fonts/**", "./src/app/icon.png"],
  },
};

export default nextConfig;
