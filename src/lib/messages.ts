import type { MessageCategory, MessageTemplate } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { DEFAULT_LOCALE } from "@/lib/site";
import { localeContent } from "@/lib/locales";

/**
 * Choose the next message for a recipient.
 *
 * Rules:
 *  1. Prefer a template of the right category that this recipient has never
 *     been sent. Pick at random among those so two people on daily plans don't
 *     receive the bank in the same order.
 *  2. Once the bank is exhausted, recycle — oldest first, so the gap between
 *     repeats is as long as the bank allows.
 */
export async function pickTemplateForRecipient(
  recipientId: string,
  category: MessageCategory,
  locale: string = DEFAULT_LOCALE,
): Promise<MessageTemplate | null> {
  const [candidates, history] = await Promise.all([
    prisma.messageTemplate.findMany({
      where: { category, locale, active: true },
    }),
    prisma.messageSent.findMany({
      where: { recipientId, status: "SENT" },
      select: { templateId: true, sentAt: true },
      orderBy: { sentAt: "desc" },
    }),
  ]);

  if (candidates.length === 0) return null;

  /** templateId -> most recent send to this recipient */
  const lastSent = new Map<string, Date>();
  for (const row of history) {
    if (!lastSent.has(row.templateId)) lastSent.set(row.templateId, row.sentAt);
  }

  const unseen = candidates.filter((t) => !lastSent.has(t.id));
  if (unseen.length > 0) {
    return unseen[Math.floor(Math.random() * unseen.length)];
  }

  // Everything has been used at least once — send the one they saw longest ago.
  return candidates.reduce((oldest, current) => {
    const a = lastSent.get(oldest.id)?.getTime() ?? 0;
    const b = lastSent.get(current.id)?.getTime() ?? 0;
    return b < a ? current : oldest;
  });
}

/**
 * Rotate subject lines so a daily recipient doesn't get the same one every
 * morning. Seeded by how many messages they've had, not at random, so a retried
 * send produces the same subject.
 */
export function subjectForDelivery(
  sequence: number,
  locale: string = DEFAULT_LOCALE,
): string {
  const lines = localeContent(locale).subjectLines;
  return lines[Math.abs(sequence) % lines.length];
}
