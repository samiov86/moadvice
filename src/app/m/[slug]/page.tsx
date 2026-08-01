import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShareMessage } from "@/components/share-message";
import { MESSAGE_BANK } from "@/data/message-bank";
import { absoluteUrl } from "@/lib/site";

interface MessagePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return MESSAGE_BANK.map((message) => ({ slug: message.slug }));
}

export async function generateMetadata({
  params,
}: MessagePageProps): Promise<Metadata> {
  const { slug } = await params;
  const message = MESSAGE_BANK.find((entry) => entry.slug === slug);
  if (!message) return {};

  return {
    title: { absolute: `“${message.headline}” · Mo Advice` },
    description: message.body.slice(0, 160),
    /**
     * Deliberately noindex, follow.
     *
     * These exist so a single message can be shared with a preview image of
     * its own — an Open Graph image belongs to a URL, and anchors on the
     * category page all share one. But sixty-four pages of three sentences
     * each is textbook thin content, and a pile of near-identical thin pages
     * reads as a doorway. So: shareable, crawlable for its links, never
     * indexed. The category pages remain the canonical place to read them.
     */
    robots: { index: false, follow: true },
    openGraph: {
      type: "article",
      title: message.headline,
      description: message.body,
      url: absoluteUrl(`/m/${message.slug}`),
    },
  };
}

export default async function SingleMessagePage({ params }: MessagePageProps) {
  const { slug } = await params;
  const message = MESSAGE_BANK.find((entry) => entry.slug === slug);
  if (!message) notFound();

  const categorySlug =
    message.category === "PERSONAL" ? "personal" : "professional";
  const siblings =
    MESSAGE_BANK.filter((entry) => entry.category === message.category).length -
    1;

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-warm-wash">
        <div className="mx-auto w-full max-w-2xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-warm sm:p-12">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Someone wanted you to read this
              </p>
              <Badge variant="muted">
                {message.category === "PERSONAL" ? "Personal" : "Professional"}
              </Badge>
            </div>

            <h1 className="mt-5 font-display text-3xl leading-snug text-balance sm:text-4xl">
              {message.headline}
            </h1>

            <p className="mt-6 font-display text-lg leading-[1.75] text-muted-foreground sm:text-xl">
              {message.body}
            </p>

            <div className="mt-9 border-t border-border pt-6">
              <ShareMessage
                url={absoluteUrl(`/m/${message.slug}`)}
                headline={message.headline}
              />
            </div>
          </div>

          <div className="mt-10 text-center">
            <h2 className="font-display text-2xl leading-snug text-balance">
              Have it sent to someone, without your name on it
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
                <Link href={`/messages/${categorySlug}`}>
                  Read the other {siblings}
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
