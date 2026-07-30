import {
  accentBar,
  button,
  emailShell,
  eyebrow,
  heading,
  paragraph,
  spacer,
  toPlainText,
} from "@/emails/layout";
import { siteConfig } from "@/lib/site";

/** Sign-in link for the sender dashboard. */
export function magicLinkEmail({ url }: { url: string }) {
  const subject = `Your ${siteConfig.name} sign-in link`;

  const html = emailShell({
    preheader: "One click and you're in. The link works once, for 24 hours.",
    body: [
      accentBar(),
      eyebrow("Sign in"),
      heading("Here's your way in"),
      paragraph(
        "Click below to open your dashboard, where you can see the plans you're running and cancel any of them.",
      ),
      button("Open my dashboard", url),
      paragraph(
        `<span style="color:#94897C;">The link works once and expires in 24 hours. If you didn't ask for it, you can ignore this email — nothing happens until someone clicks.</span>`,
        { size: 13 },
      ),
      spacer(32),
    ].join(""),
    footerHtml: `${siteConfig.name} · ${siteConfig.domain}`,
  });

  const text = toPlainText([
    "Here's your way in.",
    `Open your dashboard: ${url}`,
    "The link works once and expires in 24 hours. If you didn't ask for it, ignore this email.",
  ]);

  return { subject, html, text };
}
