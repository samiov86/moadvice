import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MessageCard } from "@/components/message-card";
import { Button } from "@/components/ui/button";
import { localeContent } from "@/lib/locales";
import { categoryPages } from "@/lib/message-categories";
import { OCCASIONS } from "@/lib/occasions";
import { absoluteUrl } from "@/lib/site";
import {
  alternatesFor,
  dictionaries,
  fill,
  localePath,
  type SiteLocale,
} from "@/lib/dictionary";
import { breadcrumbSchema, jsonLd } from "@/lib/structured-data";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const dict = dictionaries[locale as SiteLocale];
  const count = String(localeContent(locale).messages.length);
  return {
    title: dict.messages.metaTitle,
    description: fill(dict.messages.metaDescription, { count }),
    alternates: alternatesFor(locale as SiteLocale, "/messages"),
  };
}

export default async function MessagesIndexPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = raw as SiteLocale;
  const dict = dictionaries[locale];
  const path = (p: string) => localePath(locale, p);
  const count = String(localeContent(locale).messages.length);
  const pages = categoryPages(locale);

  // A few from each bank as a taste; the category pages carry the full set.
  const preview = pages.map((page) => ({
    page,
    sample: page.messages.slice(0, 3),
  }));

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": absoluteUrl(`/${locale}/messages#collection`),
      name: dict.messages.metaTitle,
      description: fill(dict.messages.metaDescription, { count }),
      url: absoluteUrl(`/${locale}/messages`),
      isPartOf: { "@id": absoluteUrl("/#website") },
      hasPart: pages.map((page) => ({
        "@type": "CollectionPage",
        name: page.title,
        url: absoluteUrl(`/${locale}/messages/${page.slug}`),
      })),
    },
    breadcrumbSchema([
      { name: "Home", path: `/${locale}` },
      { name: dict.nav.messages },
    ]),
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
        <section className="bg-warm-wash">
          <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {dict.messages.eyebrow}
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-balance">
              {dict.messages.heading}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {fill(dict.messages.intro, { count })}
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              {dict.messages.freeToUse}
            </p>
          </div>
        </section>

        <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 lg:py-20">
          {preview.map(({ page, sample }) => (
            <section key={page.slug} className="mb-16 last:mb-0">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl leading-tight">
                    {page.name}
                  </h2>
                  <p className="mt-2 max-w-xl text-muted-foreground">
                    {fill(dict.messages.countLabel, {
                      count: String(page.messages.length),
                    })}{" "}
                    ·{" "}
                    {page.slug === "personal"
                      ? dict.messages.forLifeBlurb
                      : dict.messages.forWorkBlurb}
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link href={path(`/messages/${page.slug}`)}>
                    {fill(dict.messages.readAll, {
                      count: String(page.messages.length),
                    })}{" "}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {sample.map((message) => (
                  <MessageCard key={message.slug} message={message} />
                ))}
              </div>
            </section>
          ))}

          {/*
            Occasion guides are English-only — they target US observances, and a
            Spanish edition needs its own dates rather than a translation of
            these. Shown only in the tree they belong to.
          */}
          {locale === "en" && (
            <section className="mb-16 border-t border-border pt-12">
              <h2 className="font-display text-2xl leading-tight">
                {dict.messages.occasionsHeading}
              </h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                {dict.messages.occasionsBody}
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {OCCASIONS.map((occasion) => (
                  <li key={occasion.slug}>
                    <Link
                      href={path(`/for/${occasion.slug}`)}
                      className="block rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
                    >
                      <span className="font-display text-lg leading-snug">
                        {occasion.heading}
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {occasion.when}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-4 rounded-2xl border border-border bg-secondary/40 p-8 text-center">
            <h2 className="font-display text-2xl leading-snug text-balance">
              {dict.messages.ctaHeading}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              {dict.messages.ctaBody}
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href={path("/send")}>
                {dict.nav.sendCta} <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
