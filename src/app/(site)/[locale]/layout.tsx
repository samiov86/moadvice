import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RootShell } from "@/components/root-shell";
import { fontClassNames } from "@/lib/fonts";
import { siteConfig } from "@/lib/site";
import { dictionaries, type SiteLocale } from "@/lib/dictionary";
import "@/app/globals.css";

/**
 * Root layout for the localized site.
 *
 * It lives inside [locale] rather than in the group above it because <html lang>
 * has to match the page, and this is the shallowest place that knows which
 * language it is. Next allows one root layout per route group, which is why the
 * app-level layout.tsx is gone.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(dictionaries).map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = dictionaries[locale as SiteLocale];
  if (!dict) return {};

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: dict.home.metaTitle,
      template: `%s · ${siteConfig.name}`,
    },
    description: dict.home.metaDescription,
    applicationName: siteConfig.name,
    openGraph: {
      type: "website",
      url: `${siteConfig.url}/${locale}`,
      siteName: siteConfig.name,
      title: dict.home.metaTitle,
      description: dict.home.metaDescription,
      locale: locale === "es" ? "es_ES" : "en_GB",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.home.metaTitle,
      description: dict.home.metaDescription,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(locale in dictionaries)) notFound();

  return (
    <html lang={locale} className={`${fontClassNames} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
