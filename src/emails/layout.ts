/**
 * Email shell.
 *
 * Hand-written table HTML with inline styles, because that is still the only
 * thing every mail client agrees on. Web fonts are not used — Outlook ignores
 * them and the fallback would look worse than a good system stack.
 */

import { siteConfig } from "@/lib/site";

export const emailPalette = {
  page: "#F6EFE7",
  card: "#FFFFFF",
  ink: "#2A2723",
  muted: "#6F675E",
  faint: "#94897C",
  coral: "#D9644A",
  peach: "#FBE3D6",
  border: "#EADFD3",
} as const;

const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
const SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

export interface EmailShellOptions {
  /** Hidden line shown in the inbox preview next to the subject. */
  preheader: string;
  /** Inner HTML — usually a stack of <tr> rows built by the helpers below. */
  body: string;
  /** Small print under the card. Plain text or simple links only. */
  footerHtml?: string;
  /** Set to false for the recipient email, which must never look like an ad. */
  showBranding?: boolean;
}

export function emailShell({
  preheader,
  body,
  footerHtml,
  showBranding = true,
}: EmailShellOptions): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>${escapeHtml(preheader)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${emailPalette.page};">
    <div style="display:none;font-size:1px;color:${emailPalette.page};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
      ${escapeHtml(preheader)}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${emailPalette.page};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
            ${
              showBranding
                ? `<tr>
                     <td style="padding:0 0 20px 4px;font-family:${SANS};font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:${emailPalette.faint};">
                       ${siteConfig.name}
                     </td>
                   </tr>`
                : ""
            }
            <tr>
              <td style="background-color:${emailPalette.card};border:1px solid ${emailPalette.border};border-radius:16px;overflow:hidden;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  ${body}
                </table>
              </td>
            </tr>
            ${
              footerHtml
                ? `<tr>
                     <td style="padding:20px 8px 0;font-family:${SANS};font-size:12px;line-height:20px;color:${emailPalette.faint};">
                       ${footerHtml}
                     </td>
                   </tr>`
                : ""
            }
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Coral rule at the top of the card. */
export function accentBar(): string {
  return `<tr><td style="height:4px;background-color:${emailPalette.coral};line-height:4px;font-size:0;">&nbsp;</td></tr>`;
}

export function eyebrow(text: string): string {
  return `<tr>
    <td style="padding:32px 32px 0;font-family:${SANS};font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:${emailPalette.faint};">
      ${escapeHtml(text)}
    </td>
  </tr>`;
}

export function heading(text: string): string {
  return `<tr>
    <td style="padding:12px 32px 0;font-family:${SERIF};font-size:26px;line-height:34px;font-weight:normal;color:${emailPalette.ink};">
      ${escapeHtml(text)}
    </td>
  </tr>`;
}

export function paragraph(
  text: string,
  opts: { size?: number; color?: string; serif?: boolean } = {},
): string {
  const size = opts.size ?? 16;
  return `<tr>
    <td style="padding:16px 32px 0;font-family:${opts.serif ? SERIF : SANS};font-size:${size}px;line-height:${Math.round(size * 1.65)}px;color:${opts.color ?? emailPalette.muted};">
      ${text}
    </td>
  </tr>`;
}

/** The message itself — larger, serif, given room to breathe. */
export function messageBody(text: string): string {
  return `<tr>
    <td style="padding:20px 32px 0;font-family:${SERIF};font-size:18px;line-height:31px;color:${emailPalette.ink};">
      ${escapeHtml(text)}
    </td>
  </tr>`;
}

export function button(label: string, href: string): string {
  return `<tr>
    <td style="padding:28px 32px 0;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:${emailPalette.coral};border-radius:999px;">
            <a href="${href}" style="display:inline-block;padding:12px 26px;font-family:${SANS};font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;">
              ${escapeHtml(label)}
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

export function divider(): string {
  return `<tr>
    <td style="padding:28px 32px 0;">
      <div style="height:1px;background-color:${emailPalette.border};line-height:1px;font-size:0;">&nbsp;</div>
    </td>
  </tr>`;
}

/** Label/value rows, used for receipts. */
export function detailRows(rows: Array<[string, string]>): string {
  const cells = rows
    .map(
      ([label, value]) => `<tr>
        <td style="padding:8px 0;font-family:${SANS};font-size:14px;color:${emailPalette.faint};">${escapeHtml(label)}</td>
        <td align="right" style="padding:8px 0;font-family:${SANS};font-size:14px;font-weight:600;color:${emailPalette.ink};">${escapeHtml(value)}</td>
      </tr>`,
    )
    .join("");

  return `<tr>
    <td style="padding:20px 32px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${cells}</table>
    </td>
  </tr>`;
}

/** Soft peach callout box. */
export function note(text: string): string {
  return `<tr>
    <td style="padding:24px 32px 0;">
      <div style="background-color:${emailPalette.peach};border-radius:12px;padding:16px 18px;font-family:${SANS};font-size:14px;line-height:22px;color:${emailPalette.ink};">
        ${text}
      </div>
    </td>
  </tr>`;
}

export function spacer(height = 32): string {
  return `<tr><td style="height:${height}px;line-height:${height}px;font-size:0;">&nbsp;</td></tr>`;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Turns rendered copy into a readable text/plain alternative. */
export function toPlainText(lines: Array<string | null | undefined>): string {
  return lines.filter(Boolean).join("\n\n").trim();
}
