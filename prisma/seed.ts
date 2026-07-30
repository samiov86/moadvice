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

async function main() {
  const slugs = MESSAGE_BANK.map((m) => m.slug);

  const duplicates = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (duplicates.length > 0) {
    throw new Error(`Duplicate slugs in message bank: ${duplicates.join(", ")}`);
  }

  for (const message of MESSAGE_BANK) {
    await prisma.messageTemplate.upsert({
      where: { slug: message.slug },
      create: {
        slug: message.slug,
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
    where: { slug: { notIn: slugs }, active: true },
    data: { active: false },
  });

  const [personal, professional] = await Promise.all([
    prisma.messageTemplate.count({ where: { category: "PERSONAL", active: true } }),
    prisma.messageTemplate.count({
      where: { category: "PROFESSIONAL", active: true },
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
