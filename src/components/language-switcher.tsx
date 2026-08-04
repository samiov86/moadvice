"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";

import {
  dictionaries,
  isTranslated,
  type SiteLocale,
} from "@/lib/dictionary";
import { cn } from "@/lib/utils";

/**
 * Switches between /en and /es.
 *
 * Client-side because it needs the current path to offer the equivalent page
 * rather than dumping everyone on the homepage. Where no real translation
 * exists yet — /es/messages and friends — it falls back to that language's
 * home, which is honest: sending someone to a Spanish URL rendering English
 * would look like a bug to them, and to a crawler like a duplicate.
 */
export function LanguageSwitcher({
  locale,
  className,
}: {
  locale: SiteLocale;
  className?: string;
}) {
  const pathname = usePathname() ?? "/";
  const target: SiteLocale = locale === "en" ? "es" : "en";

  // "/es/terms" -> "/terms"; "/es" -> "/"
  const withoutLocale = pathname.replace(/^\/(en|es)/, "") || "/";
  const href = isTranslated(withoutLocale)
    ? `${dictionaries[target].prefix}${withoutLocale === "/" ? "" : withoutLocale}` ||
      "/"
    : dictionaries[target].prefix;

  return (
    <Link
      href={href}
      hrefLang={target}
      // Tells assistive tech the destination is in another language.
      lang={target}
      className={cn(
        "inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      <Languages className="size-4" aria-hidden />
      {dictionaries[locale].nav.otherLanguage}
    </Link>
  );
}
