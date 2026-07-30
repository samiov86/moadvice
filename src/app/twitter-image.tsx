import OpengraphImage from "./opengraph-image";
import { siteConfig } from "@/lib/site";

/**
 * Twitter/X uses the same card as Open Graph — only the renderer is shared,
 * not the route config.
 *
 * Next reads `runtime`, `size` and `contentType` statically, so they can't be
 * re-exported from another module: it warns and silently falls back to the
 * default. Since the image reads font files from disk, it genuinely needs the
 * Node runtime, so these are declared literally here.
 */
export const runtime = "nodejs";
export const alt = `${siteConfig.name} — ${siteConfig.strapline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default OpengraphImage;
