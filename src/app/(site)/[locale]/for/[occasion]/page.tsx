import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, CalendarDays } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MessageCard } from "@/components/message-card";
import { Button } from "@/components/ui/button";
import { OCCASIONS, getOccasion, occasionMessages } from "@/lib/occasions";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbSchema, jsonLd } from "@/lib/structured-data";

interface OccasionPageProps {
  params: Promise<{ locale: string; occasion: string }>;
}

export function generateStaticParams() {
  return OCCASIONS.map((occasion) => ({ occasion: occasion.slug }));
}

export async function generateMetadata({
  params,
}: OccasionPageProps): Promise<Metadata> {
  const { locale, occasion: slug } = await params;
  const occasion = getOccasion(slug);
  if (!occasion) return {};

  return {
    // Spanish renders English here until it's translated, so keep it out of
    // the index rather than let a Spanish URL rank on English text.
    ...(locale === "es" ? { robots: { index: false, follow: true } } : {}),
    title: { absolute: `${occasion.title} · Mo Advice` },
    description: occasion.metaDescription,
    alternates: { canonical: `/${locale}/for/${occasion.slug}` },
    openGraph: {
      type: "article",
      title: occasion.title,
      description: occasion.metaDescription,
      url: absoluteUrl(`/for/${occasion.slug}`),
    },
  };
}

export default async function OccasionPage({ params }: OccasionPageProps) {
  const { occasion: slug } = await params;
  const occasion = getOccasion(slug);
  if (!occasion) notFound();

  const messages = occasionMessages(occasion);
  const others = OCCASIONS.filter((entry) => entry.slug !== occasion.slug);

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": absoluteUrl(`/for/${occasion.slug}#article`),
      headline: occasion.heading,
      description: occasion.metaDescription,
      url: absoluteUrl(`/for/${occasion.slug}`),
      isPartOf: { "@id": absoluteUrl("/#website") },
      publisher: { "@id": absoluteUrl("/#organization") },
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Messages", path: "/messages" },
      { name: occasion.heading },
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

      <SiteHeader />

      <main className="flex-1">
        <section className="bg-warm-wash">
          <div className="mx-auto w-full max-w-2xl px-5 py-16 sm:px-8 lg:py-20">
            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="size-4 text-primary" />
              {occasion.when}
            </p>

            <h1 className="mt-5 font-display text-4xl leading-tight text-balance">
              {occasion.heading}
            </h1>

            <div className="mt-6 space-y-4">
              {occasion.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="text-lg leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <blockquote className="mt-8 border-l-2 border-primary pl-5 font-display text-lg leading-relaxed">
              {occasion.principle}
            </blockquote>
          </div>
        </section>

        <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8">
          <h2 className="font-display text-2xl leading-snug">
            Four that fit the occasion
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Taken from the bank we actually send. Use the words yourself, or
            have one delivered anonymously.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {messages.map((message) => (
              <MessageCard key={message.slug} message={message} showCategory />
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-border bg-secondary/40 p-8 text-center">
            <h2 className="font-display text-2xl leading-snug text-balance">
              Or let someone hear it without knowing it was you
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              A dollar sends one now. Five a month sends a different one every
              day, at a time you choose.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/send">
                  Send kind words <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/messages">Read all 64 messages</Link>
              </Button>
            </div>
          </div>

          <div className="mt-14 border-t border-border pt-8">
            <h2 className="font-display text-xl">Other occasions</h2>
            <ul className="mt-4 space-y-2">
              {others.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/for/${entry.slug}`}
                    className="text-foreground/80 underline underline-offset-4 transition-colors hover:text-primary"
                  >
                    {entry.heading}
                  </Link>{" "}
                  <span className="text-sm text-muted-foreground">
                    — {entry.when}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
