"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { SiteLocale } from "@/lib/dictionary";
import { cn } from "@/lib/utils";

export interface NavLink {
  href: string;
  label: string;
}

/**
 * Header navigation for small screens.
 *
 * Deliberately not a Radix Dialog: this is a disclosure, not a modal, and
 * pulling in another dependency for a panel with four links isn't worth it.
 * It still does the things a modal would — Escape closes, the trigger reports
 * its state, focus moves into the panel, and the page behind it can't scroll.
 */
export function MobileNav({
  locale,
  links,
  sendHref,
  sendLabel,
  openLabel,
  closeLabel,
}: {
  locale: SiteLocale;
  links: NavLink[];
  sendHref: string;
  sendLabel: string;
  openLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const panelRef = React.useRef<HTMLDivElement>(null);

  // Close on navigation — otherwise the panel stays open over the new page.
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    // Move focus into the panel so keyboard and screen-reader users land there.
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? closeLabel : openLabel}
        className="grid size-10 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {/* Scrim. Sits below the panel but above the page. */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden
        className={cn(
          "fixed inset-x-0 bottom-0 top-16 z-30 bg-charcoal/20 backdrop-blur-[2px] transition-opacity duration-200",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <div
        id="mobile-nav-panel"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-x-0 top-16 z-40 border-b border-border bg-background shadow-warm-lg"
      >
        <nav className="mx-auto w-full max-w-6xl px-5 py-4">
          <ul className="divide-y divide-border">
            {links.map((link) => (
              <li key={link.href + link.label}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-4 text-lg text-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Button asChild size="lg" className="mt-5 w-full">
            <Link href={sendHref} onClick={() => setOpen(false)}>
              {sendLabel}
            </Link>
          </Button>

          <div className="mt-5 border-t border-border pt-4">
            <LanguageSwitcher locale={locale} />
          </div>
        </nav>
      </div>
    </div>
  );
}
