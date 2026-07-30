import {
  accentBar,
  button,
  detailRows,
  divider,
  emailShell,
  eyebrow,
  heading,
  paragraph,
  spacer,
  toPlainText,
} from "@/emails/layout";
import { absoluteUrl, siteConfig } from "@/lib/site";

export interface SubscriptionCancelledEmailParams {
  recipientEmail: string;
  recipientName?: string | null;
  /** Null when the cancellation took effect immediately. */
  endsAt: Date | null;
  messagesSent: number;
}

export function subscriptionCancelledEmail({
  recipientEmail,
  recipientName,
  endsAt,
  messagesSent,
}: SubscriptionCancelledEmailParams) {
  const who = recipientName?.trim() || recipientEmail;
  const stillRunning = endsAt !== null && endsAt > new Date();
  const subject = stillRunning
    ? `Daily words for ${who} will stop on ${endsAt.toISOString().slice(0, 10)}`
    : `Daily words for ${who} have stopped`;

  const html = emailShell({
    preheader: stillRunning
      ? "No further charges. Messages continue until the end of the period you've paid for."
      : "No further charges, and no further messages.",
    body: [
      accentBar(),
      eyebrow("Plan cancelled"),
      heading(stillRunning ? "That's cancelled" : "That's stopped"),
      paragraph(
        stillRunning
          ? `You won't be charged again. ${who} will keep receiving a message each morning until <strong style="color:#2A2723;">${endsAt.toISOString().slice(0, 10)}</strong>, which is the end of the month you've already paid for.`
          : `You won't be charged again, and no further messages will go out to ${who}.`,
      ),
      divider(),
      detailRows([
        ["Recipient", who],
        ["Messages delivered", String(messagesSent)],
        [
          "Status",
          stillRunning
            ? `Ends ${endsAt.toISOString().slice(0, 10)}`
            : "Ended",
        ],
      ]),
      paragraph(
        `Whatever the reason — thank you for the ${messagesSent} ${messagesSent === 1 ? "morning" : "mornings"} you gave someone. They never found out it was you, which is rather the point.`,
      ),
      button("Start another plan", absoluteUrl("/send")),
      spacer(32),
    ].join(""),
    footerHtml: `Questions: ${siteConfig.supportEmail} &nbsp;·&nbsp; <a href="${absoluteUrl("/terms")}" style="color:#94897C;">Terms</a> &nbsp;·&nbsp; <a href="${absoluteUrl("/privacy")}" style="color:#94897C;">Privacy</a>`,
  });

  const text = toPlainText([
    stillRunning ? "That's cancelled." : "That's stopped.",
    stillRunning
      ? `You won't be charged again. ${who} keeps receiving a message each morning until ${endsAt.toISOString().slice(0, 10)}.`
      : `You won't be charged again, and no further messages will go out to ${who}.`,
    `Messages delivered: ${messagesSent}`,
    `Start another plan: ${absoluteUrl("/send")}`,
  ]);

  return { subject, html, text };
}
