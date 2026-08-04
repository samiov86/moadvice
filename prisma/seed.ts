/**
 * Seeds the message bank.
 *
 * Idempotent: templates are keyed by `slug`, so editing copy in
 * `src/data/message-bank.ts` and re-running updates rows in place. Templates
 * that have been removed from the bank are deactivated rather than deleted,
 * because `MessageSent` rows point at them.
 *
 *   npm run db:seed
 */
import { PrismaClient } from "@prisma/client";

import { MESSAGE_BANK } from "../src/data/message-bank";

const prisma = new PrismaClient();

/**
 * The bank in this file is English. A second language gets its own data file
 * and its own seed run — the slug+locale key means both can coexist, and the
 * messages are written fresh rather than translated.
 */
const LOCALE = "en";

async function main() {
  const slugs = MESSAGE_BANK.map((m) => m.slug);

  const duplicates = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (duplicates.length > 0) {
    throw new Error(`Duplicate slugs in message bank: ${duplicates.join(", ")}`);
  }

  for (const message of MESSAGE_BANK) {
    await prisma.messageTemplate.upsert({
      where: { slug_locale: { slug: message.slug, locale: LOCALE } },
      create: {
        slug: message.slug,
        locale: LOCALE,
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
    where: { slug: { notIn: slugs }, locale: LOCALE, active: true },
    data: { active: false },
  });

  const [personal, professional] = await Promise.all([
    prisma.messageTemplate.count({
      where: { category: "PERSONAL", locale: LOCALE, active: true },
    }),
    prisma.messageTemplate.count({
      where: { category: "PROFESSIONAL", locale: LOCALE, active: true },
    }),
  ]);

  console.log(
    [
      `Seeded ${MESSAGE_BANK.length} messages.`,
      `  Personal:     ${personal}`,
      `  Professional: ${professional}`,
      retired.count > 0 ? `  Deactivated:  ${retired.count}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
