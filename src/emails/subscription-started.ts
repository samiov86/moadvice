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

export interface SubscriptionStartedEmailParams {
  recipientEmail: string;
  recipientName?: string | null;
  theme: "PERSONAL" | "PROFESSIONAL";
  amountCents: number;
  currency: string;
  /** Already rendered, e.g. "8:00 AM Europe/London". */
  sendTimeLabel: string;
  nextSendAt: Date;
  subscriptionId: string;
}

/** Confirmation for the $5/month daily plan. */
export function subscriptionStartedEmail({
  recipientEmail,
  recipientName,
  theme,
  amountCents,
  currency,
  sendTimeLabel,
  nextSendAt,
  subscriptionId,
}: SubscriptionStartedEmailParams) {
  const who = recipientName?.trim() || recipientEmail;
  const subject = `Daily words for ${who} — starting now`;
  const hourLabel = sendTimeLabel;

  const html = emailShell({
    preheader: `The first message is on its way. The next one arrives at ${hourLabel}.`,
    body: [
      accentBar(),
      eyebrow("Daily plan started"),
      heading(`A message a morning for ${who}`),
      paragraph(
        `The first one has already gone out. After that, a new message arrives every day at <strong style="color:#2A2723;">${hourLabel}</strong> — a different one each time, and never repeated until the whole bank has been used.`,
      ),
      divider(),
      detailRows([
        ["Recipient", who],
        ["Tone", theme === "PERSONAL" ? "Personal" : "Professional"],
        ["Delivery", `Daily at ${hourLabel}`],
        ["Next message", nextSendAt.toISOString().slice(0, 16).replace("T", " ") + " UTC"],
        ["Billing", `${formatMoney(amountCents, currency)} / month`],
        ["Subscription", subscriptionId],
      ]),
      note(
        "They still have no idea it's you. Every message goes out anonymously, and nothing in it links back to your account.",
      ),
      button("Manage this plan", absoluteUrl("/dashboard")),
      paragraph(
        `You can cancel any time from your dashboard. Cancelling stops future charges and the messages stop at the end of the period you've already paid for.`,
        { size: 14 },
      ),
      spacer(32),
    ].join(""),
    footerHtml: [
      `Your card statement will show <strong>${siteConfig.domain}</strong>. Stripe emails a receipt for every monthly charge.`,
      `Questions: ${siteConfig.supportEmail} &nbsp;·&nbsp; <a href="${absoluteUrl("/terms")}" style="color:#94897C;">Terms</a>`,
    ].join("<br /><br />"),
  });

  const text = toPlainText([
    `A message a morning for ${who}.`,
    `The first one has already gone out. After that, a new message arrives every day at ${hourLabel}.`,
    `Tone: ${theme === "PERSONAL" ? "Personal" : "Professional"}`,
    `Billing: ${formatMoney(amountCents, currency)} / month`,
    `Subscription: ${subscriptionId}`,
    `Manage this plan: ${absoluteUrl("/dashboard")}`,
    "Cancel any time. Messages continue until the end of the period you've paid for.",
  ]);

  return { subject, html, text };
}
