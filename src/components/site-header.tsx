import Link from "next/link";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label={`${siteConfig.name} home`}
    >
      <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">
        <span className="font-display text-lg leading-none">m</span>
      </span>
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
          <Link href="/#how" className="transition-colors hover:text-foreground">
            How it works
          </Link>
          <Link
            href="/#pricing"
            className="transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="/dashboard"
            className="transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/dashboard">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/send">Send kind words</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
