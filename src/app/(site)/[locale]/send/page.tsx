import type { Metadata } from "next";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SendForm } from "@/components/send/send-form";
import { auth } from "@/lib/auth";
import type { PlanId } from "@/lib/site";
import {
  dictionaries,
  sendDictionary,
  type SiteLocale,
} from "@/lib/dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = dictionaries[locale as SiteLocale];
  return {
    title: { absolute: `${dict.send.metaTitle} · Mo Advice` },
    description: dict.send.metaDescription,
    alternates: { canonical: `/${locale}/send` },
  };
}

interface SendPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ plan?: string; canceled?: string }>;
}

export default async function SendPage({
  params,
  searchParams,
}: SendPageProps) {
  const [{ locale: raw }, query, session] = await Promise.all([
    params,
    searchParams,
    auth(),
  ]);
  const locale = raw as SiteLocale;
  const dict = dictionaries[locale];

  const initialPlan: PlanId = query.plan === "DAILY" ? "DAILY" : "ONE_OFF";

  return (
    <>
      <SiteHeader locale={locale} />

      <main className="flex-1 bg-warm-wash">
        <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {dict.send.eyebrow}
            </p>
            <h1 className="mt-4 font-display text-3xl leading-tight text-balance sm:text-4xl">
              {dict.send.heading}
            </h1>
          </div>

          <div className="mt-12 rounded-3xl border border-border bg-card p-6 shadow-warm sm:p-9 lg:p-11">
            <SendForm
              dict={sendDictionary(dict)}
              initialPlan={initialPlan}
              initialSenderEmail={session?.user?.email ?? ""}
              canceled={query.canceled === "1"}
            />
          </div>
        </div>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
