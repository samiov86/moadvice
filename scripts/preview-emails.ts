/**
 * Renders every email template to `.email-previews/` so you can open them in a
 * browser instead of guessing. No database, no network, no API keys needed.
 *
 *   npm run emails:preview
 *
 * Mail clients are not browsers — a preview that looks right here can still
 * break in Outlook. Send a real one through Resend before launch.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { recipientMessageEmail } from "../src/emails/recipient-message";
import { senderReceiptEmail } from "../src/emails/sender-receipt";
import { subscriptionStartedEmail } from "../src/emails/subscription-started";
import { subscriptionCancelledEmail } from "../src/emails/subscription-cancelled";
import { magicLinkEmail } from "../src/emails/magic-link";
import { MESSAGE_BANK } from "../src/data/message-bank";

const OUT_DIR = path.join(process.cwd(), ".email-previews");

const professional = MESSAGE_BANK.find((m) => m.category === "PROFESSIONAL")!;
const personal = MESSAGE_BANK.find((m) => m.category === "PERSONAL")!;

const unsubscribeUrl = "https://moadvice.com/unsubscribe?token=preview";

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const previews: Array<{ name: string; subject: string; html: string }> = [
    {
      name: "recipient-one-off",
      subject: "Someone wanted you to hear this",
      html: recipientMessageEmail({
        recipientName: "Alex",
        headline: personal.headline,
        body: personal.body,
        unsubscribeUrl,
        isDaily: false,
      }).html,
    },
    {
      name: "recipient-daily-no-name",
      subject: "Someone was thinking about you today",
      html: recipientMessageEmail({
        recipientName: null,
        headline: professional.headline,
        body: professional.body,
        unsubscribeUrl,
        isDaily: true,
      }).html,
    },
    render(
      "sender-receipt",
      senderReceiptEmail({
        recipientEmail: "alex@example.com",
        recipientName: "Alex",
        theme: "PERSONAL",
        amountCents: 100,
        currency: "usd",
        orderId: "ord_preview123",
        purchasedAt: new Date("2026-07-29T10:00:00Z"),
      }),
    ),
    render(
      "subscription-started",
      subscriptionStartedEmail({
        recipientEmail: "alex@example.com",
        recipientName: "Alex",
        theme: "PROFESSIONAL",
        amountCents: 500,
        currency: "usd",
        sendTimeLabel: "8:00 AM Europe/London",
        nextSendAt: new Date("2026-07-30T06:00:00Z"),
        subscriptionId: "sub_preview123",
      }),
    ),
    render(
      "subscription-cancelled",
      subscriptionCancelledEmail({
        recipientEmail: "alex@example.com",
        recipientName: "Alex",
        endsAt: new Date("2026-08-29T06:00:00Z"),
        messagesSent: 31,
      }),
    ),
    render(
      "magic-link",
      magicLinkEmail({ url: "https://moadvice.com/api/auth/callback/resend" }),
    ),
  ];

  for (const preview of previews) {
    await writeFile(
      path.join(OUT_DIR, `${preview.name}.html`),
      preview.html,
      "utf8",
    );
    console.log(`  ${preview.name}.html — "${preview.subject}"`);
  }

  await writeFile(
    path.join(OUT_DIR, "index.html"),
    indexPage(previews),
    "utf8",
  );

  console.log(`\nWrote ${previews.length + 1} files to .email-previews/`);
  console.log("Open .email-previews/index.html to see them all.");
}

function render(
  name: string,
  email: { subject: string; html: string },
): { name: string; subject: string; html: string } {
  return { name, subject: email.subject, html: email.html };
}

function indexPage(previews: Array<{ name: string; subject: string }>) {
  const items = previews
    .map(
      (p) =>
        `<li><a href="./${p.name}.html">${p.name}</a><span>${p.subject}</span></li>`,
    )
    .join("\n      ");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Mo Advice — email previews</title>
    <style>
      body { font: 16px/1.6 -apple-system, system-ui, sans-serif; background: #FDF8F3; color: #26221E; margin: 0; padding: 48px 24px; }
      main { max-width: 640px; margin: 0 auto; }
      h1 { font-family: Georgia, serif; font-weight: normal; }
      ul { list-style: none; padding: 0; margin-top: 32px; }
      li { display: flex; justify-content: space-between; gap: 24px; padding: 14px 0; border-bottom: 1px solid #EBDFD2; }
      a { color: #D9644A; }
      span { color: #6E6459; font-size: 14px; text-align: right; }
    </style>
  </head>
  <body>
    <main>
      <h1>Email previews</h1>
      <p style="color:#6E6459">Rendered from <code>src/emails/</code>. Regenerate with <code>npm run emails:preview</code>.</p>
      <ul>
      ${items}
      </ul>
    </main>
  </body>
</html>`;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
