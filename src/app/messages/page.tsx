import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MessageCard } from "@/components/message-card";
import { Button } from "@/components/ui/button";
import { MESSAGE_BANK } from "@/data/message-bank";
import { CATEGORY_PAGES } from "@/lib/message-categories";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { breadcrumbSchema, jsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: `Every message we send`,
  description: `All ${MESSAGE_BANK.length} messages in the ${siteConfig.name} bank, free to read — hand-written words of encouragement and recognition for the people in your life and at work.`,
  alternates: { canonical: "/messages" },
};

export default function MessagesIndexPage() {
  // A few from each bank as a taste; the category pages carry the full set.
  const preview = CATEGORY_PAGES.map((page) => ({
    page,
    sample: page.messages.slice(0, 3),
  }));

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": absoluteUrl("/messages#collection"),
      name: "Every message we send",
      description: metadata.description,
      url: absoluteUrl("/messages"),
      isPartOf: { "@id": absoluteUrl("/#website") },
      hasPart: CATEGORY_PAGES.map((page) => ({
        "@type": "CollectionPage",
        name: page.title,
        url: absoluteUrl(`/messages/${page.slug}`),
      })),
    },
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Messages" }]),
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
          <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              The message bank
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-balance">
              Every message we send, free to read
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              All {MESSAGE_BANK.length} of them. Nothing is held back, nothing
              is generated on the fly, and no message has a name slotted into a
              template — each one is written and edited by hand to be true of
              someone you have never met.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              You are welcome to read them and say the words yourself. What we
              sell is the harder part: sending them anonymously, to someone
              else, every morning, without you having to find the nerve.
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
                    {page.messages.length} messages ·{" "}
                    {page.slug === "personal"
                      ? "for the people in your life"
                      : "for the people you work with"}
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link href={`/messages/${page.slug}`}>
                    Read all {page.messages.length}{" "}
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

          <div className="mt-4 rounded-2xl border border-border bg-secondary/40 p-8 text-center">
            <h2 className="font-display text-2xl leading-snug text-balance">
              Or have one sent for you, without your name on it
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              A dollar sends one now. Five a month sends a different one every
              day, at a time you choose, for as long as you like.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/send">
                Send kind words <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
