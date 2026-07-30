import Link from "next/link";
import Image from "next/image";

import quokkaMark from "../../public/quokka.png";
import { Button } from "@/components/ui/button";
import { MobileNav, type NavLink } from "@/components/mobile-nav";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Single source for the header links, shared by both breakpoints. */
const NAV_LINKS: NavLink[] = [
  { href: "/#how", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/signin", label: "Sign in" },
];

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
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

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {NAV_LINKS.filter((link) => link.href !== "/signin").map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden md:inline-flex"
          >
            <Link href="/signin">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/send">Send kind words</Link>
          </Button>
          <MobileNav links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}
