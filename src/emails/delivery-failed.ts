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
import { formatMoney } from "@/lib/utils";

export interface DeliveryFailedEmailParams {
  recipientEmail: string;
  amountCents: number;
  currency: string;
  orderId: string;
  /** False when the refund itself failed and a human needs to finish it. */
  refunded: boolean;
}

/**
 * Sent when we took the money and the message never reached anyone.
 *
 * The sender has already had a receipt saying it was on its way, so this has to
 * correct that plainly rather than bury it. No apology theatre, no upsell.
 */
export function deliveryFailedEmail({
  recipientEmail,
  amountCents,
  currency,
  orderId,
  refunded,
}: DeliveryFailedEmailParams) {
  const subject = refunded
    ? `We couldn't deliver that message — you've been refunded`
    : `We couldn't deliver that message`;

  const html = emailShell({
    preheader: refunded
      ? `${formatMoney(amountCents, currency)} is on its way back to your card.`
      : `We're sorting out a refund for ${formatMoney(amountCents, currency)}.`,
    body: [
      accentBar(),
      eyebrow("Not delivered"),
      heading("That message didn't get through"),
      paragraph(
        `We told you it was on its way, and it wasn't — the email to <strong style="color:#2A2723;">${escapeAttr(recipientEmail)}</strong> failed to send. That's our fault, not a problem with anything you did.`,
      ),
      paragraph(
        refunded
          ? `We've refunded ${formatMoney(amountCents, currency)} to your card. It usually appears within five to ten business days, depending on your bank.`
          : `We're refunding ${formatMoney(amountCents, currency)}. If it hasn't appeared within a few days, reply to this note and we'll chase it.`,
      ),
      divider(),
      detailRows([
        ["Recipient", recipientEmail],
        ["Amount", formatMoney(amountCents, currency)],
        ["Order", orderId],
      ]),
      paragraph(
        `If the address had a typo in it, sending again with the correct one is the quickest fix. If it looked right to you, tell us — that means the fault is ours to find.`,
        { size: 14 },
      ),
      button("Try again", absoluteUrl("/send")),
      spacer(32),
    ].join(""),
    footerHtml: `Questions: ${siteConfig.supportEmail}`,
  });

  const text = toPlainText([
    "That message didn't get through.",
    `The email to ${recipientEmail} failed to send. That's our fault.`,
    refunded
      ? `We've refunded ${formatMoney(amountCents, currency)} to your card, usually visible within five to ten business days.`
      : `We're refunding ${formatMoney(amountCents, currency)}.`,
    `Order: ${orderId}`,
    `Try again: ${absoluteUrl("/send")}`,
  ]);

  return { subject, html, text };
}

function escapeAttr(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
