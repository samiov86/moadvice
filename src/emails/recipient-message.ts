import {
  accentBar,
  emailShell,
  escapeHtml,
  eyebrow,
  heading,
  messageBody,
  paragraph,
  spacer,
  toPlainText,
} from "@/emails/layout";
import { siteConfig, absoluteUrl } from "@/lib/site";

export interface RecipientMessageEmailParams {
  /** Optional first name — used only in the greeting, never elsewhere. */
  recipientName?: string | null;
  headline: string;
  body: string;
  /** One-click opt-out, unique per recipient. */
  unsubscribeUrl: string;
  /** Daily recipients get a light "this arrives each morning" line. */
  isDaily: boolean;
}

/**
 * The email that matters most. Rules it has to obey:
 *  - No sender identity, ever. Not in the body, not in the footer, not in a
 *    reply-to hint. "Someone" is as specific as it gets.
 *  - No upsell aimed at the recipient beyond a single quiet line at the bottom.
 *  - Reads like a letter, not a notification.
 */
export function recipientMessageEmail({
  recipientName,
  headline,
  body,
  unsubscribeUrl,
  isDaily,
}: RecipientMessageEmailParams) {
  const greeting = recipientName?.trim()
    ? `${escapeHtml(recipientName.trim())},`
    : "Hello,";

  const html = emailShell({
    preheader: headline,
    showBranding: false,
    body: [
      accentBar(),
      eyebrow("Someone wanted you to read this"),
      heading(headline),
      paragraph(greeting, { size: 16 }),
      messageBody(body),
      spacer(8),
      paragraph(
        `<span style="color:#94897C;">Sent anonymously. Someone who knows you chose these words for you${
          isDaily ? ", and picked out a new one for every morning this month" : ""
        }.</span>`,
        { size: 14 },
      ),
      spacer(32),
    ].join(""),
    footerHtml: [
      `${escapeHtml(siteConfig.name)} delivers anonymous compliments by email. You don't have an account and we never sell or share your address.`,
      `<a href="${unsubscribeUrl}" style="color:#94897C;">Stop receiving these</a> &nbsp;·&nbsp; <a href="${absoluteUrl("/privacy")}" style="color:#94897C;">Privacy</a>`,
    ].join("<br /><br />"),
  });

  const text = toPlainText([
    "SOMEONE WANTED YOU TO READ THIS",
    headline,
    recipientName?.trim() ? `${recipientName.trim()},` : "Hello,",
    body,
    `Sent anonymously. Someone who knows you chose these words for you${
      isDaily ? ", and picked out a new one for every morning this month" : ""
    }.`,
    `Stop receiving these: ${unsubscribeUrl}`,
  ]);

  return { html, text };
}
