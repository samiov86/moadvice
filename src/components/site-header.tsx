import Link from "next/link";
import Image from "next/image";

import quokkaMark from "../../public/quokka.png";
import { Button } from "@/components/ui/button";
import { MobileNav, type NavLink } from "@/components/mobile-nav";
import { LanguageSwitcher } from "@/components/language-switcher";
import { siteConfig } from "@/lib/site";
import { dictionaries, localePath, type SiteLocale } from "@/lib/dictionary";
import { cn } from "@/lib/utils";

/**
 * Header links for a locale.
 *
 * No separate "Sign in" entry: the header is static and rendered on cached
 * pages, so it can't know whether you're signed in — and showing "Sign in" to
 * someone who already is looked broken on the dashboard. "Dashboard" is the one
 * door instead, and it redirects to /signin without a session.
 */
function navLinks(locale: SiteLocale): NavLink[] {
  const dict = dictionaries[locale];
  return [
    { href: localePath(locale, "/#how"), label: dict.nav.howItWorks },
    { href: localePath(locale, "/messages"), label: dict.nav.messages },
    { href: localePath(locale, "/#pricing"), label: dict.nav.pricing },
    { href: "/dashboard", label: dict.nav.dashboard },
  ];
}

export function Logo({
  className,
  locale = "en",
}: {
  className?: string;
  locale?: SiteLocale;
}) {
  return (
    <Link
      href={localePath(locale, "/")}
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label={`${siteConfig.name} home`}
    >
      {/*
        Statically imported so Next can size and optimise it — the source is
        800x800 and gets served at the resolution actually needed. The artwork
        already carries its own round background, so no wrapper is required.
      */}
      <Image
        src={quokkaMark}
        alt=""
        width={32}
        height={32}
        priority
        className="size-8 rounded-full"
      />
      <span className="font-display text-lg tracking-tight">
        {siteConfig.name}
      </span>
    </Link>
  );
}

export function SiteHeader({ locale = "en" }: { locale?: SiteLocale }) {
  const dict = dictionaries[locale];
  const links = navLinks(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo locale={locale} />

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <LanguageSwitcher locale={locale} className="hidden md:inline-flex" />
          <Button asChild size="sm">
            <Link href={localePath(locale, "/send")}>{dict.nav.sendCta}</Link>
          </Button>
          <MobileNav
            locale={locale}
            links={links}
            sendHref={localePath(locale, "/send")}
            sendLabel={dict.nav.sendCta}
            openLabel={dict.nav.openMenu}
            closeLabel={dict.nav.closeMenu}
          />
        </div>
      </div>
    </header>
  );
}
