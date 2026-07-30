import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { siteConfig } from "@/lib/site";

/**
 * The social preview card.
 *
 * Generated rather than designed in a graphics tool so it can't drift from the
 * brand: colours, name and strapline all come from `siteConfig`.
 *
 * Written for Satori, which is not a browser — flexbox only, every element with
 * more than one child needs an explicit `display: flex`, no CSS grid, and no
 * radial gradients. Keep changes conservative.
 */
export const runtime = "nodejs";
export const alt = `${siteConfig.name} — ${siteConfig.strapline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CREAM = "#FDF8F3";
const SAND = "#F5ECE1";
const PEACH = "#FBE3D6";
const CORAL = "#D9644A";
const INK = "#26221E";
const MUTED = "#6E6459";
const FAINT = "#94897C";
const BORDER = "#EBDFD2";

export default async function Image() {
  const [fraunces, inter, quokka] = await Promise.all([
    readFile(path.join(process.cwd(), "src/app/_fonts/Fraunces-SemiBold.ttf")),
    readFile(path.join(process.cwd(), "src/app/_fonts/Inter-Regular.ttf")),
    readFile(path.join(process.cwd(), "src/app/icon.png")),
  ]);

  const quokkaSrc = `data:image/png;base64,${quokka.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: CREAM,
          backgroundImage: `linear-gradient(135deg, ${PEACH} 0%, ${CREAM} 42%, ${SAND} 100%)`,
          padding: 64,
          fontFamily: "Inter",
        }}
      >
        {/* Left column — the pitch */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 600,
            height: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={quokkaSrc}
              width={56}
              height={56}
              alt=""
              style={{ borderRadius: 28 }}
            />
            <span
              style={{
                marginLeft: 16,
                fontFamily: "Fraunces",
                fontSize: 30,
                color: INK,
              }}
            >
              {siteConfig.name}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontFamily: "Fraunces",
                fontSize: 62,
                lineHeight: 1.1,
                color: INK,
                letterSpacing: -1,
              }}
            >
              Send anonymous compliments that feel like good advice
            </span>
            <span
              style={{
                marginTop: 26,
                fontSize: 25,
                lineHeight: 1.45,
                color: MUTED,
              }}
            >
              Short, genuine words that land in someone&apos;s inbox without
              your name on them.
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                backgroundColor: CORAL,
                color: "#FFF8F5",
                fontSize: 22,
                borderRadius: 999,
                padding: "12px 26px",
              }}
            >
              $1 a message · $5 a month
            </div>
            <span style={{ marginLeft: 22, fontSize: 22, color: FAINT }}>
              {siteConfig.domain}
            </span>
          </div>
        </div>

        {/* Right column — the thing they actually receive */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            // Explicit width, not flexGrow: Satori sizes flex children from
            // their content, and an unconstrained card overflows the canvas.
            width: 424,
            marginLeft: 48,
            backgroundColor: "#FFFFFF",
            border: `1px solid ${BORDER}`,
            borderRadius: 24,
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", height: 8, backgroundColor: CORAL }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 40,
            }}
          >
            <span style={{ fontSize: 14, letterSpacing: 1.8, color: FAINT }}>
              SOMEONE WANTED YOU TO READ THIS
            </span>
            <span
              style={{
                marginTop: 20,
                fontFamily: "Fraunces",
                fontSize: 34,
                lineHeight: 1.25,
                color: INK,
              }}
            >
              You are the reason things don&apos;t fall through
            </span>
            <span
              style={{
                marginTop: 22,
                fontFamily: "Fraunces",
                fontSize: 22,
                lineHeight: 1.6,
                color: MUTED,
              }}
            >
              There is a kind of work that only gets noticed when it stops, and
              you have been doing it for a long time without stopping.
            </span>
            <span
              style={{
                marginTop: 26,
                fontSize: 17,
                lineHeight: 1.5,
                color: FAINT,
              }}
            >
              Sent anonymously. Someone who knows you chose these words for you.
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        // Inter first: Satori treats the first entry as the default, so body
        // copy stays sans and only elements that ask for Fraunces get the serif.
        {
          name: "Inter",
          data: inter as unknown as ArrayBuffer,
          style: "normal",
          weight: 400,
        },
        {
          name: "Fraunces",
          data: fraunces as unknown as ArrayBuffer,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
}
