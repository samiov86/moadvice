import Link from "next/link";

import { Logo } from "@/components/site-header";
import { ConsentReopenButton } from "@/components/analytics/consent-banner";
import { siteConfig } from "@/lib/site";
import {
  dictionaries,
  fill,
  localePath,
  type SiteLocale,
} from "@/lib/dictionary";

export function SiteFooter({ locale = "en" }: { locale?: SiteLocale }) {
  const dict = dictionaries[locale];
  const path = (p: string) => localePath(locale, p);

  const columns = [
    {
      title: dict.footer.product,
      links: [
        { label: dict.footer.sendKindWords, href: path("/send") },
        { label: dict.nav.howItWorks, href: path("/#how") },
        { label: dict.footer.readMessages, href: path("/messages") },
        { label: dict.nav.pricing, href: path("/#pricing") },
        { label: dict.nav.dashboard, href: "/dashboard" },
      ],
    },
    {
      title: dict.footer.legal,
      links: [
        { label: dict.footer.terms, href: path("/terms") },
        { label: dict.footer.privacy, href: path("/privacy") },
        { label: dict.footer.refunds, href: `${path("/terms")}#refunds` },
      ],
    },
    {
      title: dict.footer.company,
      links: [
        { label: dict.footer.contact, href: path("/contact") },
        { label: dict.footer.stopReceiving, href: "/unsubscribe" },
      ],
    },
  ];

  return (
    <footer className="mt-auto border-t border-border bg-secondary/40">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Logo locale={locale} />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {dict.footer.blurb}
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-foreground/80 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p>
              © {new Date().getFullYear()} {siteConfig.name}.{" "}
              {siteConfig.domain}
            </p>
            {/*
              Trader identity. Spain's LSSI-CE requires it to be permanently and
              directly accessible, and EU distance-selling rules require it
              before a contract is concluded — the footer is on every page, so
              it satisfies both without a separate notice page.
            */}
            <p>
              {fill(dict.footer.tradingAs, {
                name: siteConfig.legal.name,
                nif: siteConfig.legal.nif,
                address: `${siteConfig.legal.addressInlineNoCountry}, ${dict.countryName}`,
              })}
            </p>
          </div>
          <p>
            <ConsentReopenButton label={dict.footer.cookieChoices} /> ·{" "}
            {dict.footer.questions}{" "}
            <a
              href={`mailto:${siteConfig.supportEmail}`}
              className="underline underline-offset-4 hover:text-foreground"
            >
              {siteConfig.supportEmail}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
