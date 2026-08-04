/**
 * Seeds the message bank, one language at a time.
 *
 * Idempotent: templates are keyed by slug + locale, so editing copy in
 * `src/data/message-bank*.ts` and re-running updates rows in place. Messages
 * removed from a bank are deactivated rather than deleted, because
 * `MessageSent` rows point at them.
 *
 *   npm run db:seed
 */
import { PrismaClient } from "@prisma/client";

import { LOCALES } from "../src/lib/locales";

const prisma = new PrismaClient();

async function seedLocale(locale: string) {
  const bank = LOCALES[locale].messages;
  const slugs = bank.map((m) => m.slug);

  const duplicates = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (duplicates.length > 0) {
    throw new Error(
      `Duplicate slugs in the ${locale} bank: ${duplicates.join(", ")}`,
    );
  }

  for (const message of bank) {
    await prisma.messageTemplate.upsert({
      where: { slug_locale: { slug: message.slug, locale } },
      create: {
        slug: message.slug,
        locale,
        category: message.category,
        headline: message.headline,
        body: message.body,
        active: true,
      },
      update: {
        category: message.category,
        headline: message.headline,
        body: message.body,
        active: true,
      },
    });
  }

  const retired = await prisma.messageTemplate.updateMany({
    where: { slug: { notIn: slugs }, locale, active: true },
    data: { active: false },
  });

  const [personal, professional] = await Promise.all([
    prisma.messageTemplate.count({
      where: { category: "PERSONAL", locale, active: true },
    }),
    prisma.messageTemplate.count({
      where: { category: "PROFESSIONAL", locale, active: true },
    }),
  ]);

  console.log(
    [
      `  ${locale}: ${bank.length} messages`,
      `    Personal:     ${personal}`,
      `    Professional: ${professional}`,
      retired.count > 0 ? `    Deactivated:  ${retired.count}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
  );
}

async function main() {
  console.log("Seeding message banks:");
  for (const locale of Object.keys(LOCALES)) {
    await seedLocale(locale);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
