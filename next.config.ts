import type { NextConfig } from "next";

/**
 * Paths that moved under /en when the site gained a second language.
 *
 * Permanent, because they really have moved and the old URLs are indexed —
 * a 308 passes the ranking on rather than starting again. Query strings are
 * preserved by default, which matters for /send?canceled=1 coming back from
 * Stripe and for any link carrying a token.
 *
 * Not listed, because they deliberately did not move: /unsubscribe (its URL is
 * inside every email ever delivered), /dashboard, /signin, /m/:slug and /api.
 */
const MOVED_TO_EN = [
  "/send",
  "/send/success",
  "/messages",
  "/messages/:category",
  "/for/:occasion",
  "/received",
  "/terms",
  "/privacy",
  "/contact",
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Temporary on purpose: the root may later choose a language from the
      // browser, and a cached permanent redirect would make that impossible.
      { source: "/", destination: "/en", permanent: false },
      ...MOVED_TO_EN.map((source) => ({
        source,
        destination: `/en${source}`,
        permanent: true,
      })),
    ];
  },

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
