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
import { localeContent } from "@/lib/locales";

export interface RecipientMessageEmailParams {
  /** Optional first name — used only in the greeting, never elsewhere. */
  recipientName?: string | null;
  headline: string;
  body: string;
  /** One-click opt-out, unique per recipient. */
  unsubscribeUrl: string;
  /** Daily recipients get a light "this arrives each morning" line. */
  isDaily: boolean;
  /** Language every fixed string in the email is rendered in. */
  locale?: string;
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
  locale = "en",
}: RecipientMessageEmailParams) {
  const copy = localeContent(locale).email;
  const greeting = recipientName?.trim()
    ? copy.greeting(escapeHtml(recipientName.trim()))
    : copy.greetingFallback;
  const anonymousNote = isDaily ? copy.anonymousNoteDaily : copy.anonymousNote;

  const html = emailShell({
    preheader: headline,
    showBranding: false,
    body: [
      accentBar(),
      eyebrow(copy.eyebrow),
      heading(headline),
      paragraph(greeting, { size: 16 }),
      messageBody(body),
      spacer(8),
      paragraph(`<span style="color:#94897C;">${anonymousNote}</span>`, {
        size: 14,
      }),
      spacer(32),
    ].join(""),
    footerHtml: [
      `${escapeHtml(siteConfig.name)} ${copy.brandFooter} <a href="${absoluteUrl("/received")}" style="color:#94897C;">${copy.whatIsThis}</a>`,
      // One line, once, at the very bottom. Someone who has just been moved by
      // a message is the likeliest person to send one — but they never asked to
      // be here, so it stays an aside rather than a pitch.
      copy.passItOn(
        `<a href="${absoluteUrl("/send")}" style="color:#94897C;">`,
        "</a>",
      ),
      `<a href="${unsubscribeUrl}" style="color:#94897C;">${copy.stopReceiving}</a> &nbsp;·&nbsp; <a href="${absoluteUrl("/privacy")}" style="color:#94897C;">${copy.privacy}</a>`,
    ].join("<br /><br />"),
  });

  const text = toPlainText([
    copy.eyebrow.toUpperCase(),
    headline,
    recipientName?.trim()
      ? copy.greeting(recipientName.trim())
      : copy.greetingFallback,
    body,
    anonymousNote,
    `${copy.whatIsThis} ${absoluteUrl("/received")}`,
    `${copy.passItOn("", "")} ${absoluteUrl("/send")}`,
    `${copy.stopReceiving}: ${unsubscribeUrl}`,
  ]);

  return { html, text };
}
