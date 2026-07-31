import type { Metadata } from "next";

import { LegalShell } from "@/components/legal-shell";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} handles your data and the data of people you send to.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      updated={siteConfig.legalUpdatedAt}
      intro={`${siteConfig.name} handles two kinds of people's data: senders, who pay us, and recipients, who never asked for an account. Recipients get the stricter treatment.`}
    >
      <section>
        <h2>What we collect</h2>
        <h3>If you send messages</h3>
        <ul>
          <li>Your email address — for receipts, confirmations, and sign-in.</li>
          <li>
            Your orders and plans: which tone, which frequency, which recipient,
            and when.
          </li>
          <li>
            A Stripe customer ID and subscription IDs. We never see or store your
            card number, expiry, or CVC — those go directly to Stripe.
          </li>
        </ul>

        <h3>If you receive messages</h3>
        <ul>
          <li>Your email address.</li>
          <li>A first name, only if the sender supplied one.</li>
          <li>
            A log of which messages were sent to you and when, so we don't repeat
            one and so we can answer support questions.
          </li>
          <li>An opt-out token, so the unsubscribe link works.</li>
        </ul>
        <p>
          That's it. No tracking pixels in the messages, no open or click
          tracking, no profile building, no ad networks.
        </p>
        <p>
          We do record that a message was accepted, delivered, or bounced —
          reported to us by our email provider, not by anything embedded in the
          message you opened.
        </p>
      </section>

      <section>
        <h2>Anonymity works in one direction only</h2>
        <p>
          We know who sent what — we have to, in order to bill and to handle
          abuse reports. The <strong>recipient</strong> never learns the sender's
          identity from us. We do not reveal it on request, and the emails
          contain nothing that would identify the sender.
        </p>
        <p>
          The one exception is a valid legal order, or a credible report that the
          service is being used to harass someone. We will comply with the law.
        </p>
      </section>

      <section>
        <h2>What we don't do</h2>
        <ul>
          <li>We do not sell, rent, or share personal data with advertisers.</li>
          <li>
            We do not use recipient addresses for marketing. The only mail an
            address receives is the messages that were paid for.
          </li>
          <li>We do not add anyone to a mailing list.</li>
        </ul>
      </section>

      <section>
        <h2>Who processes data for us</h2>
        <ul>
          <li>
            <strong>Stripe</strong> — payments, subscriptions, and billing
            portal.
          </li>
          <li>
            <strong>Resend</strong> — email delivery.
          </li>
          <li>
            <strong>Vercel</strong> — hosting, scheduled jobs, and cookieless
            web analytics.
          </li>
          <li>
            <strong>Our database host</strong> — Postgres, storing everything
            described above.
          </li>
        </ul>
        <p>
          Each is bound by its own data processing terms. Data may be processed
          in the United States and the EU.
        </p>
      </section>

      <section>
        <h2>How long we keep things</h2>
        <ul>
          <li>
            Order and payment records: seven years, because tax law requires it.
          </li>
          <li>
            Delivery logs: two years, then deleted.
          </li>
          <li>
            Opted-out addresses: kept indefinitely in a suppression list. This is
            deliberate — it is the only way to guarantee we never send to that
            address again.
          </li>
        </ul>
      </section>

      <section>
        <h2>Your rights</h2>
        <p>
          Depending on where you live, you may have the right to access, correct,
          export, or delete your personal data, and to object to processing.
          Email{" "}
          <a href={`mailto:${siteConfig.supportEmail}`}>
            {siteConfig.supportEmail}
          </a>{" "}
          and we'll action it within 30 days.
        </p>
        <p>
          <strong>Recipients:</strong> the fastest route is the opt-out link at
          the bottom of any message. Emailing us works too, and we'll confirm
          when it's done.
        </p>
      </section>

      <section>
        <h2>Cookies and analytics</h2>
        <p>
          One cookie, used to keep you signed in to the sender dashboard. It's
          set only after you use a sign-in link, and it expires. There are no
          advertising cookies and nothing that follows you to other sites, so
          there's no consent banner to click through.
        </p>
        <p>
          We use <strong>Vercel Web Analytics</strong> to count page views and a
          few steps in the send form — which step people reach, whether checkout
          was started, whether it completed. It is cookieless, stores nothing on
          your device, and does not build a profile or track you across sites.
        </p>
        <p>
          Those events record only what was chosen: the plan, the tone, and which
          step of the form. <strong>No email address is ever included</strong> —
          not yours and certainly not the recipient's, who never agreed to
          anything.
        </p>
      </section>

      <section>
        <h2>Children</h2>
        <p>
          The service is not intended for anyone under 16. If we learn we hold
          data about a child, we delete it.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          <a href={`mailto:${siteConfig.supportEmail}`}>
            {siteConfig.supportEmail}
          </a>
        </p>
        <p>
          The data controller is <strong>{siteConfig.legal.name}</strong>,{" "}
          {siteConfig.legal.addressInline}. We process sender data to perform
          the contract you entered into, and recipient data on the basis of our
          legitimate interest in delivering the message a sender paid for —
          balanced against the recipient&apos;s interests by the one-click
          opt-out in every message and the permanent suppression that follows.
        </p>
        <p>
          If you are in the EU or UK and think we have handled your data badly,
          tell us first — but you also have the right to complain to your
          national data protection authority. In Spain that is the{" "}
          <a href="https://www.aepd.es">AEPD</a>.
        </p>
      </section>
    </LegalShell>
  );
}
