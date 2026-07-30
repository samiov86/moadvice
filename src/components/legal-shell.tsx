import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export interface LegalShellProps {
  title: string;
  /** ISO date (YYYY-MM-DD) — formatted here so every page reads the same. */
  updated: string;
  intro?: string;
  children: React.ReactNode;
}

/**
 * Shared chrome + typography for the legal pages. Tailwind Typography isn't
 * installed, so the prose styles live here as descendant selectors — one place
 * to change them, and no extra dependency.
 */
export function LegalShell({
  title,
  updated,
  intro,
  children,
}: LegalShellProps) {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Legal
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight">{title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated{" "}
            <time dateTime={updated}>
              {new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              }).format(new Date(updated))}
            </time>
          </p>

          {intro && (
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
              {intro}
            </p>
          )}

          <div
            className={[
              "mt-12 space-y-10",
              "[&_h2]:font-display [&_h2]:text-2xl [&_h2]:leading-snug [&_h2]:scroll-mt-24",
              "[&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-lg",
              "[&_p]:mt-3 [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-muted-foreground",
              "[&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:text-[15px] [&_ul]:leading-relaxed [&_ul]:text-muted-foreground [&_li]:list-disc [&_li]:pl-1",
              "[&_a]:underline [&_a]:underline-offset-4 [&_a]:text-foreground",
              "[&_strong]:font-medium [&_strong]:text-foreground",
            ].join(" ")}
          >
            {children}
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
