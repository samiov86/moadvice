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
      `${escapeHtml(siteConfig.name)} delivers anonymous compliments by email. You don't have an account and we never sell or share your address. <a href="${absoluteUrl("/received")}" style="color:#94897C;">What is this?</a>`,
      // One line, once, at the very bottom. Someone who has just been moved by
      // a message is the likeliest person to send one — but they never asked to
      // be here, so it stays an aside rather than a pitch.
      `If it made you think of someone, you can <a href="${absoluteUrl("/send")}" style="color:#94897C;">send one too</a>.`,
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
    `What is this? ${absoluteUrl("/received")}`,
    `If it made you think of someone, you can send one too: ${absoluteUrl("/send")}`,
    `Stop receiving these: ${unsubscribeUrl}`,
  ]);

  return { html, text };
}
