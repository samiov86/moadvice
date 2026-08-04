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
import { MessageCard } from "@/components/message-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PLANS } from "@/lib/site";
import { localeContent } from "@/lib/locales";
import {
  dictionaries,
  fill,
  localePath,
  alternatesFor,
  type SiteLocale,
} from "@/lib/dictionary";
import {
  faqSchema,
  jsonLd,
  organizationSchema,
  serviceSchema,
  websiteSchema,
} from "@/lib/structured-data";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const dict = dictionaries[locale as SiteLocale];
  return {
    title: { absolute: dict.home.metaTitle },
    description: dict.home.metaDescription,
    alternates: alternatesFor(locale as SiteLocale, "/"),
  };
}

/** Icons, in the order the dictionary lists the copy they belong to. */
const VALUE_ICONS = [EyeOff, Mail, Sparkles];
const STEP_ICONS = [PenLine, Sparkles, Send];

/**
 * Four real messages from the bank that gets sent in this language.
 *
 * Picked by position rather than slug: the Spanish bank is written rather than
 * translated, so its slugs deliberately don't mirror the English ones. Two from
 * each category keeps the mix without hardcoding either language's naming.
 */
function showcaseFor(locale: SiteLocale) {
  const bank = localeContent(locale).messages;
  const professional = bank.filter((m) => m.category === "PROFESSIONAL");
  const personal = bank.filter((m) => m.category === "PERSONAL");
  return [professional[5], personal[2], professional[11], personal[4]].filter(
    Boolean,
  );
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: raw } = await params;
  const locale = raw as SiteLocale;
  const dict = dictionaries[locale];
  const path = (p: string) => localePath(locale, p);
  const bankSize = localeContent(locale).messages.length;
  const showcase = showcaseFor(locale);

  const schemas = [
    organizationSchema(),
    websiteSchema(),
    serviceSchema(),
    faqSchema(dict.home.faqs),
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

      <SiteHeader locale={locale} />

      <main className="flex-1">
        {/* ---------------------------------------------------------- Hero */}
        <section className="bg-warm-wash">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 pb-16 pt-10 sm:gap-14 sm:px-8 sm:pb-20 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:pb-28 lg:pt-24">
            <div>
              <Badge variant="outline" className="bg-card/70">
                <Sparkles className="size-3.5 text-primary" />
                {dict.home.heroBadge}
              </Badge>

              <h1 className="mt-6 font-display text-4xl leading-[1.08] text-balance sm:text-5xl lg:text-[3.5rem]">
                {dict.home.heroHeading}
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {dict.home.heroBody}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center">
                <Button asChild size="lg">
                  <Link href={path("/send")}>
                    {dict.home.heroPrimary} <ArrowRight className="size-4" />
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
                  <Link href={path("/send")}>{dict.home.heroSecondary}</Link>
                </Button>
              </div>

              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground sm:mt-8">
                {dict.home.heroPoints.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="size-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <EmailPreview
              headline={dict.themes[1].exampleHeadline}
              body={dict.themes[1].example}
              recipientEmail="them@example.com"
            />
          </div>
        </section>

        {/* ------------------------------------------------------- Value */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-3">
            {dict.home.valueTitle.map((title, index) => {
              const Icon = VALUE_ICONS[index];
              return (
                <div key={title}>
                  <span className="grid size-11 place-items-center rounded-full bg-accent text-accent-foreground">
                    <Icon className="size-5" />
                  </span>
                  <h2 className="mt-5 font-display text-xl">{title}</h2>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
                    {dict.home.valueBody[index]}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ------------------------------------------------ How it works */}
        <section id="how" className="scroll-mt-20">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                {dict.home.howEyebrow}
              </p>
              <h2 className="mt-4 font-display text-3xl leading-tight text-balance sm:text-4xl">
                {dict.home.howHeading}
              </h2>
            </div>

            <ol className="mt-12 grid gap-6 md:grid-cols-3">
              {dict.home.howSteps.map((step, index) => {
                const Icon = STEP_ICONS[index];
                return (
                  <li key={step.title}>
                    <Card className="h-full">
                      <CardContent className="p-7">
                        <div className="flex items-center gap-3">
                          <span className="grid size-9 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                            {index + 1}
                          </span>
                          <Icon className="size-5 text-muted-foreground" />
                        </div>
                        <h3 className="mt-5 font-display text-xl">
                          {step.title}
                        </h3>
                        <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
                          {step.body}
                        </p>
                      </CardContent>
                    </Card>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ----------------------------------------------------- Themes */}
        <section className="border-y border-border bg-secondary/40">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                {dict.home.tonesEyebrow}
              </p>
              <h2 className="mt-4 font-display text-3xl leading-tight text-balance sm:text-4xl">
                {dict.home.tonesHeading}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {dict.home.tonesBody}
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {dict.themes.map((theme) => (
                <Card key={theme.id} className="flex flex-col">
                  <CardContent className="flex flex-1 flex-col p-7 sm:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-display text-2xl">{theme.name}</h3>
                      <Badge variant="muted">
                        {theme.id === "PERSONAL"
                          ? dict.home.forLife
                          : dict.home.forWork}
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
                {dict.home.pricingEyebrow}
              </p>
              <h2 className="mt-4 font-display text-3xl leading-tight text-balance sm:text-4xl">
                {dict.home.pricingHeading}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {dict.home.pricingBody}
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {Object.values(PLANS).map((plan) => {
                const copy = dict.plans[plan.id];
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
                        <Badge
                          variant="solid"
                          className="absolute right-6 top-6"
                        >
                          {dict.home.mostSent}
                        </Badge>
                      )}

                      <h3 className="font-display text-2xl">{copy.name}</h3>
                      <p className="mt-2 text-[15px] text-muted-foreground">
                        {copy.blurb}
                      </p>

                      <p className="mt-7 flex items-baseline gap-2">
                        <span className="font-display text-5xl">
                          {copy.price}
                        </span>
                        <span className="text-muted-foreground">
                          {copy.priceSuffix}
                        </span>
                      </p>

                      <ul className="mt-7 space-y-3 text-[15px]">
                        {copy.features.map((feature) => (
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
                        <Link href={`${path("/send")}?plan=${plan.id}`}>
                          {featured ? dict.home.startDaily : dict.home.sendOne}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              {dict.home.pricingNote}
              <Link
                href={`${path("/terms")}#refunds`}
                className="underline underline-offset-4"
              >
                {dict.home.refundPolicy}
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
                {dict.home.showcaseEyebrow}
              </p>
              <h2 className="mt-4 font-display text-3xl leading-tight text-balance sm:text-4xl">
                {fill(dict.home.showcaseHeading, { count: String(bankSize) })}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {dict.home.showcaseBody}
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {showcase.map((message) => (
                <MessageCard
                  key={message.slug}
                  message={message}
                  showCategory
                />
              ))}
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
              {dict.home.showcaseNote}{" "}
              <Link
                href={path("/messages")}
                className="underline underline-offset-4 hover:text-foreground"
              >
                {fill(dict.home.readAll, { count: String(bankSize) })}
              </Link>
              .
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------------- FAQ */}
        <section>
          <div className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8 lg:py-24">
            <h2 className="font-display text-3xl leading-tight sm:text-4xl">
              {dict.home.faqHeading}
            </h2>

            <dl className="mt-10 divide-y divide-border border-y border-border">
              {dict.home.faqs.map((faq) => (
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
          The one dark section on the page. Colours come from tokens that flip
          in dark mode — charcoal on cream would vanish against a dark page.
        */}
        <section className="bg-[var(--contrast-bg)] text-[var(--contrast-fg)]">
          <div className="mx-auto w-full max-w-3xl px-5 py-20 text-center sm:px-8 lg:py-28">
            <h2 className="font-display text-3xl leading-tight text-balance sm:text-4xl">
              {dict.home.finalHeading}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-[var(--contrast-fg-muted)]">
              {dict.home.finalBody}
            </p>
            <Button asChild size="lg" className="mt-9">
              <Link href={path("/send")}>
                {dict.home.heroPrimary} <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
