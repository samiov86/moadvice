import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteConfig } from "@/lib/site";
import {
  dictionaries,
  fill,
  localePath,
  type SiteLocale,
} from "@/lib/dictionary";
import { legalCopy, type LegalPage } from "@/lib/legal-copy";

/**
 * Renders a legal document from structured copy.
 *
 * Blocks carry inline HTML, which is deliberate: the content is entirely ours,
 * it never comes from a user, and the alternative — a markup mini-language for
 * two links and a <strong> — helps nobody. The prose styles live here as
 * descendant selectors rather than pulling in Tailwind Typography.
 */
export function LegalDocument({
  page,
  locale,
}: {
  page: LegalPage;
  locale: SiteLocale;
}) {
  const copy = legalCopy[locale];
  const dict = dictionaries[locale];

  const values: Record<string, string> = {
    support: siteConfig.supportEmail,
    name: siteConfig.legal.name,
    nif: siteConfig.legal.nif,
    address: `${siteConfig.legal.addressInlineNoCountry}, ${dict.countryName}`,
    domain: siteConfig.domain,
    termsHref: localePath(locale, "/terms"),
    privacyHref: localePath(locale, "/privacy"),
    // Not locale-prefixed: these live outside the localized tree.
    unsubscribeHref: "/unsubscribe",
    dashboardHref: "/dashboard",
  };

  const formattedDate = new Intl.DateTimeFormat(
    locale === "es" ? "es-ES" : "en-GB",
    { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" },
  ).format(new Date(siteConfig.legalUpdatedAt));

  return (
    <>
      <SiteHeader locale={locale} />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            {copy.legalEyebrow}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight">
            {page.title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {copy.lastUpdatedLabel}{" "}
            <time dateTime={siteConfig.legalUpdatedAt}>{formattedDate}</time>
          </p>

          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
            {fill(page.intro, values)}
          </p>

          <div
            className={[
              "mt-12 space-y-10",
              "[&_h2]:scroll-mt-24 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:leading-snug",
              "[&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-lg",
              "[&_p]:mt-3 [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-muted-foreground",
              "[&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:text-[15px] [&_ul]:leading-relaxed [&_ul]:text-muted-foreground [&_li]:list-disc [&_li]:pl-1",
              "[&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4",
              "[&_strong]:font-medium [&_strong]:text-foreground",
            ].join(" ")}
          >
            {page.sections.map((section) => (
              <section key={section.heading} id={section.id}>
                <h2>{section.heading}</h2>
                {section.blocks.map((block, index) => {
                  if (block.kind === "h3") {
                    return <h3 key={index}>{block.text}</h3>;
                  }
                  if (block.kind === "ul") {
                    return (
                      <ul key={index}>
                        {block.items.map((item) => (
                          <li
                            key={item}
                            dangerouslySetInnerHTML={{
                              __html: fill(item, values),
                            }}
                          />
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p
                      key={index}
                      dangerouslySetInnerHTML={{
                        __html: fill(block.html, values),
                      }}
                    />
                  );
                })}
              </section>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
