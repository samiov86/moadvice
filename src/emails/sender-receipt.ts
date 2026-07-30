import {
  accentBar,
  button,
  detailRows,
  divider,
  emailShell,
  eyebrow,
  heading,
  note,
  paragraph,
  spacer,
  toPlainText,
} from "@/emails/layout";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { formatMoney } from "@/lib/utils";

export interface SenderReceiptEmailParams {
  recipientEmail: string;
  recipientName?: string | null;
  theme: "PERSONAL" | "PROFESSIONAL";
  amountCents: number;
  currency: string;
  orderId: string;
  purchasedAt: Date;
}

/** Confirmation + receipt for a $1 one-off. */
export function senderReceiptEmail({
  recipientEmail,
  recipientName,
  theme,
  amountCents,
  currency,
  orderId,
  purchasedAt,
}: SenderReceiptEmailParams) {
  const subject = `Your words are on their way to ${recipientName?.trim() || recipientEmail}`;

  const html = emailShell({
    preheader: `Delivered anonymously — receipt for ${formatMoney(amountCents, currency)}.`,
    body: [
      accentBar(),
      eyebrow("Sent"),
      heading("That's on its way"),
      paragraph(
        `Your message has been delivered to <strong style="color:#2A2723;">${escapeAttr(recipientEmail)}</strong>. It arrives without your name on it — there is nothing in the email that points back to you.`,
      ),
      divider(),
      detailRows([
        ["Recipient", recipientName?.trim() || recipientEmail],
        ["Tone", theme === "PERSONAL" ? "Personal" : "Professional"],
        ["Plan", "One message"],
        ["Paid", formatMoney(amountCents, currency)],
        ["Date", purchasedAt.toISOString().slice(0, 10)],
        ["Order", orderId],
      ]),
      note(
        `Want to keep it going? A daily plan sends a different message every morning for ${formatMoney(500)} a month.`,
      ),
      button("Send to someone else", absoluteUrl("/send")),
      spacer(32),
    ].join(""),
    footerHtml: [
      `Your card statement will show <strong>${siteConfig.domain}</strong>. Stripe has also emailed you a formal receipt.`,
      `One-off messages are non-refundable once sent — see the <a href="${absoluteUrl("/terms")}" style="color:#94897C;">Terms</a>. Questions: ${siteConfig.supportEmail}`,
    ].join("<br /><br />"),
  });

  const text = toPlainText([
    "That's on its way.",
    `Your message has been delivered to ${recipientEmail}. It arrives without your name on it.`,
    `Tone: ${theme === "PERSONAL" ? "Personal" : "Professional"}`,
    `Paid: ${formatMoney(amountCents, currency)}`,
    `Order: ${orderId}`,
    `Send to someone else: ${absoluteUrl("/send")}`,
    "One-off messages are non-refundable once sent.",
  ]);

  return { subject, html, text };
}

function escapeAttr(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
