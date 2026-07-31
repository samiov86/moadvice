import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Check,
  EyeOff,
  Mail,
  PenLine,
  Send,
  Sparkles,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EmailPreview } from "@/components/email-preview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PLANS, THEMES, siteConfig } from "@/lib/site";
import { MESSAGE_BANK } from "@/data/message-bank";
import {
  faqSchema,
  jsonLd,
  organizationSchema,
  productSchema,
  websiteSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = {
  // Without this, /?utm_source=… and any other parameterised variant can be
  // indexed as a separate page competing with the real one.
  alternates: { canonical: "/" },
};

const HOW_IT_WORKS = [
  {
    icon: PenLine,
    title: "Tell us who",
    body: "Their email address, and their first name if you'd like the message to open with it. That's the entire form.",
  },
  {
    icon: Sparkles,
    title: "Pick the tone",
    body: "Personal for a friend or family member, professional for someone at work. We write the words — you choose which kind land right.",
  },
  {
    icon: Send,
    title: "They hear something good",
    body: "One message now for $1, or a different one every morning for $5 a month. Your name is never attached to any of it.",
  },
];

/**
 * Four real messages, straight from the bank that gets sent.
 *
 * This section used to hold invented customer quotes. Showing the actual
 * product is both honest and better proof — the words are the thing people are
 * buying, so let them read some. Chosen by slug rather than at random so the
 * page is stable, and picked to avoid repeating the two shown in the hero and
 * the theme section above.
 */
const SHOWCASE = [
  "pro-mentorship",
  "per-resilience",
  "pro-unglamorous-work",
  "per-gentle-with-self",
].map((slug) => {
  const message = MESSAGE_BANK.find((entry) => entry.slug === slug);
  if (!message) throw new Error(`Showcase message "${slug}" is missing`);
  return message;
});

const FAQS = [
  {
    q: "Will they find out it was me?",
    a: "No. The email carries no name, no reply address that maps back to you, and nothing in the footer identifies the sender. If you want them to know, you have to tell them yourself.",
  },
  {
    q: "Does the recipient need an account?",
    a: "Never. They receive an email. There is nothing to sign up for, nothing to install, and one link at the bottom that stops the messages permanently.",
  },
  {
    q: "Who writes the messages?",
    a: "We do. Every message in the bank is written and edited by hand to be specific, warm, and true of a stranger — recognition rather than flattery. Nothing generic, nothing that reads like a fortune cookie.",
  },
  {
    q: "Can I send to more than one person?",
    a: "Yes. Run as many daily plans as you like, each with its own recipient and tone. They're listed separately in your dashboard and cancelled separately.",
  },
  {
    q: "How do I cancel a daily plan?",
    a: "One click in your dashboard, or through the Stripe billing portal. You keep the days you've already paid for, and you're never charged again.",
  },
  {
    q: "What if someone doesn't want these?",
    a: "Every message has a one-click opt-out. The moment someone uses it we stop sending to that address — from you or from anyone else — and we tell you so you can cancel.",
  },
];

export default function HomePage() {
  const schemas = [
    organizationSchema(),
    websiteSchema(),
    productSchema(),
    faqSchema(FAQS),
  ];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
        />
      ))}

      <SiteHeader />

      <main className="flex-1">
        {/* ---------------------------------------------------------- Hero */}
        <section className="bg-warm-wash">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 pb-16 pt-10 sm:gap-14 sm:pb-20 sm:pt-16 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:pb-28 lg:pt-24">
            <div>
              <Badge variant="outline" className="bg-card/70">
                <Sparkles className="size-3.5 text-primary" />
                {siteConfig.tagline}
              </Badge>

              <h1 className="mt-6 font-display text-4xl leading-[1.08] text-balance sm:text-5xl lg:text-[3.5rem]">
                Send anonymous compliments that feel like good advice
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Most people go years without hearing the specific, true thing
                someone thinks about them. {siteConfig.name} sends it — by email,
                without your name on it, to someone who could use it this week.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center">
                <Button asChild size="lg">
                  <Link href="/send">
                    Send kind words <ArrowRight className="size-4" />
                  </Link>
                </Button>
                {/*
                  Hidden on phones: it goes to the same place as the button
                  above, and a second full-width block pushed the email preview
                  — the most persuasive thing on the page — off the screen.
                */}
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="hidden sm:inline-flex"
                >
                  <Link href="/send">Try one for $1</Link>
                </Button>
              </div>

              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground sm:mt-8">
                {[
                  "No account for them",
                  "Anonymous by design",
                  "Cancel in one click",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="size-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <EmailPreview
              headline="You are the reason things don't fall through"
              body="There is a kind of work that only gets noticed when it stops, and you have been doing it for a long time without stopping. It is not glamorous and it is not accidental — it is a standard you hold when no one is checking."
              recipientEmail="them@example.com"
            />
          </div>
        </section>

        {/* ------------------------------------------------------- Value */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-3">
            {[
              {
                icon: EyeOff,
                title: "Anonymous, properly",
                body: "Not \"anonymous unless you look\". There is nothing in the email, the headers, or the footer that leads back to you.",
              },
              {
                icon: Mail,
                title: "Written to be believed",
                body: "Specific recognition beats generic praise every time. Our messages name a real quality and say why it matters.",
              },
              {
                icon: Sparkles,
                title: "Built for morale",
                body: "One message lifts a day. A month of them changes how someone talks about themselves at work and at home.",
              },
            ].map((item) => (
              <div key={item.title}>
                <span className="grid size-11 place-items-center rounded-full bg-accent text-accent-foreground">
                  <item.icon className="size-5" />
                </span>
                <h2 className="mt-5 font-display text-xl">{item.title}</h2>
                <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------ How it works */}
        <section id="how" className="scroll-mt-20">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                How it works
              </p>
              <h2 className="mt-4 font-display text-3xl leading-tight text-balance sm:text-4xl">
                Three steps, about ninety seconds
              </h2>
            </div>

            <ol className="mt-12 grid gap-6 md:grid-cols-3">
              {HOW_IT_WORKS.map((step, index) => (
                <li key={step.title}>
                  <Card className="h-full">
                    <CardContent className="p-7">
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                          {index + 1}
                        </span>
                        <step.icon className="size-5 text-muted-foreground" />
                      </div>
                      <h3 className="mt-5 font-display text-xl">{step.title}</h3>
                      <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
                        {step.body}
                      </p>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ----------------------------------------------------- Themes */}
        <section className="border-y border-border bg-secondary/40">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Two tones
              </p>
              <h2 className="mt-4 font-display text-3xl leading-tight text-balance sm:text-4xl">
                The same honesty, aimed differently
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Pick the one that fits your relationship with them. Here is a
                real message from each bank.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {THEMES.map((theme) => (
                <Card key={theme.id} className="flex flex-col">
                  <CardContent className="flex flex-1 flex-col p-7 sm:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-display text-2xl">{theme.name}</h3>
                      <Badge variant="muted">
                        {theme.id === "PERSONAL" ? "For life" : "For work"}
                      </Badge>
                    </div>
                    <p className="mt-2 text-[15px] text-muted-foreground">
                      {theme.blurb}
                    </p>

                    <figure className="mt-6 flex-1 rounded-xl border border-border bg-background p-6">
                      <p className="font-display text-lg leading-snug">
                        {theme.exampleHeadline}
                      </p>
                      <blockquote className="mt-3 font-display text-[17px] leading-[1.7] text-muted-foreground">
                        {theme.example}
                      </blockquote>
                    </figure>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- Pricing */}
        <section id="pricing" className="scroll-mt-20">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Pricing
              </p>
              <h2 className="mt-4 font-display text-3xl leading-tight text-balance sm:text-4xl">
                A dollar to try it. Five a month to keep it going.
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                No accounts to create, no minimums, no bundles. Cancel a daily
                plan whenever you like.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {Object.values(PLANS).map((plan) => {
                const featured = plan.id === "DAILY";
                return (
                  <Card
                    key={plan.id}
                    className={
                      featured
                        ? "relative border-primary/40 bg-accent/30 shadow-warm-lg"
                        : undefined
                    }
                  >
                    <CardContent className="p-7 sm:p-8">
                      {featured && (
                        <Badge variant="solid" className="absolute right-6 top-6">
                          Most sent
                        </Badge>
                      )}

                      <h3 className="font-display text-2xl">{plan.name}</h3>
                      <p className="mt-2 text-[15px] text-muted-foreground">
                        {plan.blurb}
                      </p>

                      <p className="mt-7 flex items-baseline gap-2">
                        <span className="font-display text-5xl">
                          {plan.price}
                        </span>
                        <span className="text-muted-foreground">
                          {plan.priceSuffix}
                        </span>
                      </p>

                      <ul className="mt-7 space-y-3 text-[15px]">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex gap-3">
                            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                            <span className="text-muted-foreground">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        asChild
                        size="lg"
                        variant={featured ? "default" : "outline"}
                        className="mt-8 w-full"
                      >
                        <Link href={`/send?plan=${plan.id}`}>
                          {featured ? "Start a daily plan" : "Send one message"}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Payments handled by Stripe. One-off messages are non-refundable
              once delivered — see the{" "}
              <Link href="/terms#refunds" className="underline underline-offset-4">
                refund policy
              </Link>
              .
            </p>
          </div>
        </section>

        {/* ------------------------------------------- Real messages */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                The actual words
              </p>
              <h2 className="mt-4 font-display text-3xl leading-tight text-balance sm:text-4xl">
                Four of the {MESSAGE_BANK.length}, exactly as they arrive
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Every message is written and edited by hand. No templates with a
                name slotted in, nothing generated on the fly — just specific
                things that are true of someone, said plainly.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {SHOWCASE.map((message) => (
                <figure
                  key={message.slug}
                  className="flex flex-col rounded-2xl border border-border bg-background p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-xl leading-snug">
                      {message.headline}
                    </h3>
                    <Badge variant="muted" className="shrink-0">
                      {message.category === "PERSONAL"
                        ? "Personal"
                        : "Professional"}
                    </Badge>
                  </div>
                  <blockquote className="mt-4 flex-1 font-display text-[17px] leading-[1.7] text-muted-foreground">
                    {message.body}
                  </blockquote>
                </figure>
              ))}
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
              A daily plan works through the bank without repeating, so nobody
              receives the same message twice until they&apos;ve seen them all.{" "}
              <Link
                href="/messages"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Read all {MESSAGE_BANK.length} of them
              </Link>
              .
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------------- FAQ */}
        <section>
          <div className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8 lg:py-24">
            <h2 className="font-display text-3xl leading-tight sm:text-4xl">
              Questions people ask
            </h2>

            <dl className="mt-10 divide-y divide-border border-y border-border">
              {FAQS.map((faq) => (
                <div key={faq.q} className="py-6">
                  <dt className="font-display text-lg leading-snug">{faq.q}</dt>
                  <dd className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
                    {faq.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* --------------------------------------------------- Final CTA */}
        {/*
          The one dark section on the page. Eight sections of cream-on-white
          read as evenly weighted, so nothing signalled which part mattered;
          inverting the close gives the page a spine and a definite ending.
          Colours come from tokens that flip in dark mode — charcoal on cream
          would vanish against a dark background.
        */}
        <section className="bg-[var(--contrast-bg)] text-[var(--contrast-fg)]">
          <div className="mx-auto w-full max-w-3xl px-5 py-20 text-center sm:px-8 lg:py-28">
            <h2 className="font-display text-3xl leading-tight text-balance sm:text-4xl">
              Someone you know is having a harder week than they've said
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-[var(--contrast-fg-muted)]">
              It costs a dollar to do something about it, and they will never
              know it was you.
            </p>
            <Button asChild size="lg" className="mt-9">
              <Link href="/send">
                Send kind words <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
