import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal-page";
import { siteConfig } from "@/lib/site";
import { fill, type SiteLocale } from "@/lib/dictionary";
import { legalCopy } from "@/lib/legal-copy";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const page = legalCopy[locale as SiteLocale].contact;
  return {
    title: page.title,
    description: fill(page.metaDescription, { domain: siteConfig.domain }),
    alternates: { canonical: `/${locale}/contact` },
  };
}

export default async function Page({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = raw as SiteLocale;
  return <LegalDocument page={legalCopy[locale].contact} locale={locale} />;
}
