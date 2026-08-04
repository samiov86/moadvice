import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, EyeOff, Mail, ShieldCheck } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import {
  alternatesFor,
  dictionaries,
  localePath,
  type SiteLocale,
} from "@/lib/dictionary";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const dict = dictionaries[locale as SiteLocale];
  return {
    title: dict.received.metaTitle,
    description: dict.received.metaDescription,
    alternates: alternatesFor(locale as SiteLocale, "/received"),
  };
}

/**
 * Where a recipient lands.
 *
 * People who receive one of these go looking — "who sent me this", "is this a
 * scam" — and until this page existed they landed nowhere. Its job is to be
 * reassuring and truthful first; the invitation to send one comes last and only
 * once, because someone who never asked to be here has earned that restraint.
 */
export default async function ReceivedPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = raw as SiteLocale;
  const dict = dictionaries[locale];
  const path = (p: string) => localePath(locale, p);

  const sections = [
    { icon: EyeOff, heading: dict.received.cantTellHeading, body: dict.received.cantTellBody },
    { icon: ShieldCheck, heading: dict.received.notScamHeading, body: dict.received.notScamBody },
  ];

  return (
    <>
      <SiteHeader locale={locale} />

      <main className="flex-1">
        <section className="bg-warm-wash">
          <div className="mx-auto w-full max-w-2xl px-5 py-16 sm:px-8 lg:py-20">
            <h1 className="font-display text-4xl leading-tight text-balance">
              {dict.received.heading}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {dict.received.intro}
            </p>
          </div>
        </section>

        <div className="mx-auto w-full max-w-2xl px-5 py-14 sm:px-8">
          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="flex items-center gap-3 font-display text-2xl">
                  <section.icon className="size-5 text-primary" />
                  {section.heading}
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {section.body}
                </p>
              </section>
            ))}

            <section>
              <h2 className="flex items-center gap-3 font-display text-2xl">
                <Mail className="size-5 text-primary" />
                {dict.received.stopHeading}
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {dict.received.stopBody}{" "}
                <Link href="/unsubscribe" className="underline underline-offset-4">
                  {dict.received.optOutLink}
                </Link>{" "}
                —{" "}
                <a
                  href={`mailto:${siteConfig.supportEmail}`}
                  className="underline underline-offset-4"
                >
                  {siteConfig.supportEmail}
                </a>
                .
              </p>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {dict.received.stopBody2}
              </p>
            </section>
          </div>

          <div className="mt-14 rounded-2xl border border-border bg-secondary/40 p-8 text-center">
            <h2 className="font-display text-2xl leading-snug text-balance">
              {dict.received.ctaHeading}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              {dict.received.ctaBody}
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={path("/send")}>
                  {dict.received.ctaSend} <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={path("/messages")}>{dict.received.ctaRead}</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
