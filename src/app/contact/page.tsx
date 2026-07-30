import Link from "next/link";
import type { Metadata } from "next";

import { LegalShell } from "@/components/legal-shell";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <LegalShell
      title="Contact"
      updated={siteConfig.legalUpdatedAt}
      intro="One inbox, read by a person, usually answered within a day."
    >
      <section>
        <h2>Email us</h2>
        <p>
          <a href={`mailto:${siteConfig.supportEmail}`}>
            {siteConfig.supportEmail}
          </a>
        </p>
      </section>

      <section>
        <h2>Common things</h2>

        <h3>I want to stop receiving messages</h3>
        <p>
          Use the opt-out link at the bottom of any message you've received —
          it's instant and permanent. If you can't find it, email us from the
          address that's receiving them and we'll take care of it. You can also{" "}
          <Link href="/unsubscribe">open the opt-out page</Link>.
        </p>

        <h3>I want to cancel a daily plan</h3>
        <p>
          Sign in at <Link href="/dashboard">your dashboard</Link> with the email
          address you paid with, and cancel there in one click. No password
          needed — we email you a link.
        </p>

        <h3>Something was charged twice</h3>
        <p>
          Send us the last four digits of the card and the date. We'll find it
          and refund it.
        </p>

        <h3>A message never arrived</h3>
        <p>
          Check the recipient's spam folder first — that's usually it. If it's
          genuinely missing, tell us the recipient address and roughly when you
          ordered, and we'll either resend or refund.
        </p>

        <h3>Someone is using this to bother me</h3>
        <p>
          Tell us and we will stop it immediately and permanently. Please include
          the full email you received, headers if you can get them. We take this
          seriously — anonymity here exists for kindness, and we remove people
          who abuse it.
        </p>
      </section>

      <section>
        <h2>Press and partnerships</h2>
        <p>
          Same address. Mention what you're working on and we'll get back to you.
        </p>
      </section>
    </LegalShell>
  );
}
