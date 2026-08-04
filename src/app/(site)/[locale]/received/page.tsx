import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, EyeOff, Mail, ShieldCheck } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Someone sent you an anonymous message",
    description:
      "You received a message from Mo Advice and don't know who sent it. Here's what happened, why we can't tell you, and how to stop them if you'd rather not receive any more.",
    alternates: { canonical: `/${locale}/received` },
  };
}

/**
 * Where a recipient lands.
 *
 * People who receive one of these go looking — "who sent me this", "is this a
 * scam" — and until now they landed nowhere. The job of this page is to be
 * reassuring and truthful first; the invitation to send one comes last and
 * only once, because someone who never asked to be here has earned that
 * restraint.
 */
export default function ReceivedPage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <section className="bg-warm-wash">
          <div className="mx-auto w-full max-w-2xl px-5 py-16 sm:px-8 lg:py-20">
            <h1 className="font-display text-4xl leading-tight text-balance">
              Someone wanted you to hear something good
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              If you&apos;ve landed here, you probably received an email with
              some kind words in it and no name attached. Nothing is wrong.
              Someone who knows you paid to have it sent, and chose to stay
              anonymous.
            </p>
          </div>
        </section>

        <div className="mx-auto w-full max-w-2xl px-5 py-14 sm:px-8">
          <div className="space-y-10">
            <section>
              <h2 className="flex items-center gap-3 font-display text-2xl">
                <EyeOff className="size-5 text-primary" />
                We can&apos;t tell you who it was
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Not won&apos;t — can&apos;t, as far as you&apos;re concerned.
                Anonymity is the entire product, and we don&apos;t reveal a
                sender on request, ever. If they want you to know, they&apos;ll
                tell you themselves.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-3 font-display text-2xl">
                <ShieldCheck className="size-5 text-primary" />
                It isn&apos;t a scam, and there&apos;s nothing to click
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                There&apos;s no account to make, no password, nothing to pay,
                and no link you need to press. We never ask you for anything.
                The only thing we hold is your email address — kept so we
                don&apos;t repeat a message you&apos;ve already had, and never
                sold or shared.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-3 font-display text-2xl">
                <Mail className="size-5 text-primary" />
                If you&apos;d rather not receive any more
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Every message has a link at the bottom that stops them
                permanently — from this sender and from anyone else who tries.
                It takes one press and no explanation. You can also{" "}
                <Link
                  href="/unsubscribe"
                  className="underline underline-offset-4"
                >
                  use the opt-out page
                </Link>{" "}
                or email{" "}
                <a
                  href={`mailto:${siteConfig.supportEmail}`}
                  className="underline underline-offset-4"
                >
                  {siteConfig.supportEmail}
                </a>
                .
              </p>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                If a message ever felt like anything other than kindness, tell
                us and we will stop it and look into who sent it. Anonymity here
                exists for kind words, and we remove people who abuse it.
              </p>
            </section>
          </div>

          <div className="mt-14 rounded-2xl border border-border bg-secondary/40 p-8 text-center">
            <h2 className="font-display text-2xl leading-snug text-balance">
              Someone thought of you. You might think of someone.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              No obligation whatsoever — you can close this tab and nothing
              happens. But if reading it made you think of a person who could
              use the same thing, that&apos;s how most of these get sent.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/send">
                  Send one to someone <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/messages">Read the other messages</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
