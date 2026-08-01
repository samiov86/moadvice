import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { ConsentBanner } from "@/components/analytics/consent-banner";

import { siteConfig } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.strapline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "anonymous compliments",
    "send a compliment",
    "workplace recognition",
    "encouragement email",
    "kind words",
  ],
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.strapline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.strapline}`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

/** Unset locally, so development never reports into the live property. */
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
        {/*
          Vercel Web Analytics: cookieless, no cross-site tracking, and no
          personal data leaves the page. Custom events elsewhere deliberately
          carry only plan/theme/step — never an email address, since half the
          addresses here belong to people who never agreed to anything.

          It runs for everyone, including people who decline below: no cookies
          means no consent required, so declining costs us depth rather than
          all measurement.
        */}
        <Analytics />

        {gaMeasurementId && (
          <>
            <GoogleAnalytics measurementId={gaMeasurementId} />
            <ConsentBanner />
          </>
        )}
      </body>
    </html>
  );
}
