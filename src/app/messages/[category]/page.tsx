import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MessageCard } from "@/components/message-card";
import { Button } from "@/components/ui/button";
import { CATEGORY_PAGES, getCategoryPage } from "@/lib/message-categories";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { breadcrumbSchema, jsonLd } from "@/lib/structured-data";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

/** Both categories are known at build time, so these render statically. */
export function generateStaticParams() {
  return CATEGORY_PAGES.map((page) => ({ category: page.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const page = getCategoryPage(category);
  if (!page) return {};

  return {
    // Absolute, so the "· Mo Advice" suffix doesn't push these past the ~60
    // characters Google shows. The phrasing is the part worth keeping whole.
    title: { absolute: page.title },
    description: page.metaDescription,
    alternates: { canonical: `/messages/${page.slug}` },
    openGraph: {
      title: `${page.title} · ${siteConfig.name}`,
      description: page.metaDescription,
      url: absoluteUrl(`/messages/${page.slug}`),
    },
  };
}

export default async function MessageCategoryPage({
  params,
}: CategoryPageProps) {
  const { category } = await params;
  const page = getCategoryPage(category);
  if (!page) notFound();

  const other = CATEGORY_PAGES.find((p) => p.slug !== page.slug)!;

  /**
   * ItemList describing exactly what's on the page and nothing more. Search
   * engines treat markup that overstates the page as spam, so this lists the
   * same messages, in the same order, as the reader sees.
   */
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl(`/messages/${page.slug}#collection`),
    name: page.title,
    description: page.metaDescription,
    url: absoluteUrl(`/messages/${page.slug}`),
    isPartOf: { "@id": absoluteUrl("/#website") },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: page.messages.length,
      itemListElement: page.messages.map((message, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: message.headline,
        url: absoluteUrl(`/messages/${page.slug}#${message.slug}`),
      })),
    },
  };

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Messages", path: "/messages" },
    { name: page.name },
  ]);

  return (
    <>
      {[schema, breadcrumbs].map((entry, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(entry) }}
        />
      ))}

      <SiteHeader />

      <main className="flex-1">
        <section className="bg-warm-wash">
          <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 lg:py-20">
            <Link
              href="/messages"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> All messages
            </Link>

            <h1 className="mt-6 font-display text-4xl leading-tight text-balance">
              {page.heading}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {page.intro}
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              {page.guidance}
            </p>
          </div>
        </section>

        <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="grid gap-5 sm:grid-cols-2">
            {page.messages.map((message) => (
              <MessageCard key={message.slug} message={message} />
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-border bg-secondary/40 p-8 text-center">
            <h2 className="font-display text-2xl leading-snug text-balance">
              Saying it yourself is hard. That&apos;s rather the point of us.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              We send one of these anonymously, so the person hears it without
              anyone having to be brave about it. A dollar for one, or five a
              month for one every day.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/send">
                  Send kind words <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={`/messages/${other.slug}`}>
                  Read the {other.name.toLowerCase()} ones
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
