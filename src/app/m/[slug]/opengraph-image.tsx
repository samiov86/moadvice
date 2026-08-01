import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { MESSAGE_BANK } from "@/data/message-bank";
import { siteConfig } from "@/lib/site";

/**
 * A preview card carrying the message itself.
 *
 * This is the point of the /m/[slug] pages: an Open Graph image belongs to a
 * URL, so anchors on a category page all share one generic card. Here the
 * shared link previews the actual words, which is what makes someone open it.
 *
 * Written for Satori — flexbox only, explicit `display: flex` on anything with
 * more than one child, no grid, no radial gradients.
 */
export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "A message from Mo Advice";

/**
 * Prerender all 64 at build time, so a shared link never waits on a render.
 *
 * Prerendering alone is not enough, though: a request that misses the cache
 * still hits the runtime route, and this one previously read fonts from
 * `process.cwd()` — invisible to Next's file tracing, so the .ttf files never
 * shipped and it returned 500 with ENOENT. `new URL(..., import.meta.url)`
 * below is the form the bundler follows, so the fonts travel with the route.
 */
export function generateStaticParams() {
  return MESSAGE_BANK.map((message) => ({ slug: message.slug }));
}

const CREAM = "#FDF8F3";
const SAND = "#F5ECE1";
const PEACH = "#FBE3D6";
const CORAL = "#D9644A";
const INK = "#26221E";
const MUTED = "#6E6459";
const FAINT = "#94897C";

export default async function Image({ params }: { params: { slug: string } }) {
  const message = MESSAGE_BANK.find((entry) => entry.slug === params.slug);

  const [fraunces, inter, quokka] = await Promise.all([
    readFile(path.join(process.cwd(), "src/app/_fonts/Fraunces-SemiBold.ttf")),
    readFile(path.join(process.cwd(), "src/app/_fonts/Inter-Regular.ttf")),
    readFile(path.join(process.cwd(), "src/app/icon.png")),
  ]);

  const quokkaSrc = `data:image/png;base64,${quokka.toString("base64")}`;
  const headline = message?.headline ?? siteConfig.strapline;
  const body = message?.body ?? siteConfig.description;

  // Long messages need a smaller face to stay on the card without clipping.
  const bodySize = body.length > 260 ? 26 : body.length > 200 ? 29 : 32;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: CREAM,
        backgroundImage: `linear-gradient(135deg, ${PEACH} 0%, ${CREAM} 45%, ${SAND} 100%)`,
        padding: 64,
        fontFamily: "Inter",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={quokkaSrc}
          width={44}
          height={44}
          alt=""
          style={{ borderRadius: 22 }}
        />
        <span
          style={{
            marginLeft: 14,
            fontSize: 15,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: FAINT,
          }}
        >
          Someone wanted you to read this
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontFamily: "Fraunces",
            fontSize: 52,
            lineHeight: 1.15,
            color: INK,
            letterSpacing: -0.5,
          }}
        >
          {headline}
        </span>
        <span
          style={{
            marginTop: 24,
            fontFamily: "Fraunces",
            fontSize: bodySize,
            lineHeight: 1.55,
            color: MUTED,
          }}
        >
          {body}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            height: 4,
            width: 56,
            backgroundColor: CORAL,
            borderRadius: 2,
          }}
        />
        <span style={{ marginLeft: 18, fontSize: 21, color: FAINT }}>
          {siteConfig.domain}
        </span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Inter", data: inter as unknown as ArrayBuffer, weight: 400 },
        {
          name: "Fraunces",
          data: fraunces as unknown as ArrayBuffer,
          weight: 600,
        },
      ],
    },
  );
}
