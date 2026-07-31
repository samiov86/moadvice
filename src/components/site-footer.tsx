import Link from "next/link";

import { Logo } from "@/components/site-header";
import { siteConfig } from "@/lib/site";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Send kind words", href: "/send" },
      { label: "How it works", href: "/#how" },
      { label: "Read the messages", href: "/messages" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Refunds", href: "/terms#refunds" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Stop receiving messages", href: "/unsubscribe" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-secondary/40">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {siteConfig.strapline}. Sent by email, delivered anonymously, and
              read by someone who probably needed it today.
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
              {siteConfig.name} is a trading name of {siteConfig.legal.name},{" "}
              {siteConfig.legal.addressInline}.
            </p>
          </div>
          <p>
            Questions?{" "}
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
