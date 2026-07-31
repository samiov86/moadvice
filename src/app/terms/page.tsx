import type { Metadata } from "next";

import { LegalShell } from "@/components/legal-shell";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that apply when you use ${siteConfig.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalShell
      title="Terms of Service"
      updated={siteConfig.legalUpdatedAt}
      intro={`These terms cover your use of ${siteConfig.name} (${siteConfig.domain}). They're written to be read, not to be impressive. If anything here is unclear, email ${siteConfig.supportEmail} and we'll explain it.`}
    >
      <section>
        <h2>Who you are contracting with</h2>
        <p>
          {siteConfig.name} is a trading name of{" "}
          <strong>{siteConfig.legal.name}</strong>, an individual trader based
          at:
        </p>
        <p>
          {siteConfig.legal.addressLines.map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </p>
        <p>
          Contact:{" "}
          <a href={`mailto:${siteConfig.supportEmail}`}>
            {siteConfig.supportEmail}
          </a>
        </p>
      </section>

      <section>
        <h2>1. What the service does</h2>
        <p>
          {siteConfig.name} sends anonymous, pre-written messages of
          encouragement and recognition by email, on your instruction, to an
          email address you provide. You choose the tone and the frequency. We
          choose the specific words from a bank we write and maintain.
        </p>
        <p>
          The person receiving the message does not need an account and is never
          told who paid for it. We do not disclose your identity to them under
          any circumstances short of a valid legal order.
        </p>
      </section>

      <section>
        <h2>2. Who can use it</h2>
        <p>
          You must be at least 16 years old and legally able to enter into a
          contract. By placing an order you confirm that you are.
        </p>
      </section>

      <section>
        <h2>3. Your responsibilities</h2>
        <p>
          You are responsible for the address you enter and for the effect of
          sending mail to it. Specifically, you agree that:
        </p>
        <ul>
          <li>
            You have a genuine, good-faith reason to believe the recipient would
            not object to receiving kind words.
          </li>
          <li>
            You will not use the service to contact anyone who has asked you not
            to contact them, including anyone subject to a restraining or
            no-contact order.
          </li>
          <li>
            You will not use the service to harass, intimidate, stalk, or
            circumvent a block, even with material that appears positive.
          </li>
          <li>You will not enter an address you have obtained unlawfully.</li>
        </ul>
        <p>
          <strong>
            Anonymity is a feature for kindness, not a shield for harassment.
          </strong>{" "}
          We terminate accounts used this way without refund, and we will
          cooperate with law enforcement where required.
        </p>
      </section>

      <section>
        <h2>4. Recipients can always opt out</h2>
        <p>
          Every message contains a one-click opt-out. When someone uses it we
          stop sending to that address permanently — from you and from anybody
          else — and we tell you so that you can cancel your plan. We will not
          re-enable an address that has opted out, and no refund is owed for
          messages that could not be sent for this reason.
        </p>
      </section>

      <section>
        <h2>5. Prices and payment</h2>
        <p>
          A single message costs $1 (one-time). A daily plan costs $5 per month
          and renews automatically until cancelled. Prices are in US dollars and
          exclude any taxes we're required to collect.
        </p>
        <p>
          Payments are processed by Stripe. We never receive or store your full
          card details. Your statement will show{" "}
          <strong>{siteConfig.domain}</strong>.
        </p>
      </section>

      <section id="refunds">
        <h2>6. Refunds</h2>
        <h3>One-off messages</h3>
        <p>
          <strong>
            One-off messages are non-refundable once the message has been sent.
          </strong>{" "}
          Delivery normally happens within a minute of payment, so in practice a
          one-off order becomes non-refundable almost immediately. If a message
          was never delivered because of a fault on our side, we will refund it
          in full.
        </p>
        <h3>Daily plans</h3>
        <p>
          You can cancel a daily plan at any time from your dashboard or through
          the Stripe billing portal. Cancellation stops all future charges.
          Messages continue until the end of the period you have already paid
          for, and that period is not refunded on a pro-rata basis.
        </p>
        <h3>Everything else</h3>
        <p>
          If something has genuinely gone wrong — a duplicate charge, a plan that
          kept billing after you cancelled, a delivery failure — email{" "}
          <a href={`mailto:${siteConfig.supportEmail}`}>
            {siteConfig.supportEmail}
          </a>{" "}
          and we will put it right. We would rather refund you than argue.
        </p>
        <h3>Your statutory cancellation right</h3>
        <p>
          If you are a consumer in the UK or EU, you normally have 14 days to
          withdraw from a contract made online. Because a message is sent
          immediately, we ask you to confirm at checkout that you want it sent
          straight away and that you understand you lose that right once it has
          been sent. You tick that box yourself, we record the exact wording
          with your order, and we repeat it back to you in your receipt.
        </p>
        <p>
          <strong>If you do not tick it, we cannot take the order</strong> —
          rather than take your money and rely on a clause you never agreed to.
          Until a message has actually been sent, the withdrawal right still
          applies and you can ask us to cancel for a full refund.
        </p>
        <p>
          Nothing here limits any other statutory right you may have under
          consumer law in your country. Where such a right applies, it takes
          precedence over this section.
        </p>
      </section>

      <section>
        <h2>7. Message content</h2>
        <p>
          Messages are chosen from our bank at the time of sending. You do not
          choose the specific message, and the same message may be sent to
          different people. We may add to, edit, or retire messages at any time.
        </p>
        <p>
          Messages are general encouragement. They are not advice of any
          professional kind — not medical, psychological, legal, or financial —
          and should not be relied on as such.
        </p>
      </section>

      <section>
        <h2>8. Availability</h2>
        <p>
          We aim to deliver each daily message at approximately the time chosen when the plan was set up, in the timezone chosen with it.
          Email delivery depends on providers we don't control, and we can't
          guarantee that a given message reaches an inbox rather than a spam
          folder. Occasional delay or non-delivery does not entitle you to a
          refund, though repeated failure does — see section 6.
        </p>
      </section>

      <section>
        <h2>9. Liability</h2>
        <p>
          To the fullest extent the law allows, our total liability to you for
          any claim connected with the service is limited to the amount you paid
          us in the twelve months before the claim arose. We are not liable for
          indirect or consequential loss.
        </p>
        <p>
          Nothing in these terms excludes liability for death or personal injury
          caused by negligence, for fraud, or for anything else that cannot
          lawfully be excluded.
        </p>
      </section>

      <section>
        <h2>10. Ending the arrangement</h2>
        <p>
          You may stop using the service at any time; cancel any daily plans
          first so you aren't billed again. We may suspend or close an account
          that breaches these terms, and we'll tell you why unless we're legally
          prevented from doing so.
        </p>
      </section>

      <section>
        <h2>11. Changes</h2>
        <p>
          We may update these terms. If a change materially affects you and you
          hold an active plan, we'll email you before it takes effect. Continuing
          to use the service after that means you accept the new terms.
        </p>
      </section>

      <section>
        <h2>12. Contact</h2>
        <p>
          <a href={`mailto:${siteConfig.supportEmail}`}>
            {siteConfig.supportEmail}
          </a>
        </p>
      </section>

      <section>
        <h2>13. Governing law</h2>
        <p>
          These terms are governed by {siteConfig.legal.governingLaw}. If you
          are a consumer, this does not deprive you of the protection of any
          mandatory consumer rules of the country where you live — you keep
          those rights, and you may bring proceedings in your own country&apos;s
          courts.
        </p>
      </section>
    </LegalShell>
  );
}
