import type { Metadata } from "next";

import { RootShell } from "@/components/root-shell";
import { fontClassNames } from "@/lib/fonts";
import { siteConfig } from "@/lib/site";
import "@/app/globals.css";

/**
 * Root layout for the pages that are not locale-prefixed: sign-in, the
 * dashboard, the opt-out page and shared message links.
 *
 * The opt-out URL in particular is inside every email ever delivered, so it
 * cannot move behind a locale segment. These stay in English for now; the
 * opt-out page could later read the recipient's language from their token.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
};

export default function UtilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fontClassNames} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
