import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { deliverMessage } from "@/lib/delivery";
import { nextUtcHour } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Generous ceiling — a batch of a few hundred emails takes well under this. */
export const maxDuration = 300;

/** Ceiling per invocation so one run can't hang. Cron reruns pick up the rest. */
const BATCH_SIZE = 250;

/**
 * Daily send. Wired to Vercel Cron in `vercel.json`, which fires hourly so that
 * a missed or slow run self-heals within the hour rather than skipping a day.
 *
 * Work is claimed by `nextSendAt <= now`, and each delivery advances that
 * timestamp — so a duplicate invocation finds nothing to do.
 */
export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  if (authorization !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();
  const now = new Date();

  const due = await prisma.subscription.findMany({
    where: {
      status: "ACTIVE",
      nextSendAt: { lte: now },
      recipient: { unsubscribedAt: null },
    },
    orderBy: { nextSendAt: "asc" },
    take: BATCH_SIZE,
    select: {
      id: true,
      recipientId: true,
      theme: true,
      sendHourUtc: true,
      currentPeriodEnd: true,
      cancelAtPeriodEnd: true,
    },
  });

  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const subscription of due) {
    // A cancelled-at-period-end plan keeps running until the paid period ends.
    if (
      subscription.cancelAtPeriodEnd &&
      subscription.currentPeriodEnd &&
      subscription.currentPeriodEnd <= now
    ) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: "CANCELED", nextSendAt: null, canceledAt: now },
      });
      skipped += 1;
      continue;
    }

    const dayKey = now.toISOString().slice(0, 10);

    const result = await deliverMessage({
      recipientId: subscription.recipientId,
      theme: subscription.theme,
      subscriptionId: subscription.id,
      isDaily: true,
      idempotencyKey: `sub_${subscription.id}_${dayKey}`,
    });

    if (result.status === "SENT") sent += 1;
    else if (result.status === "SKIPPED") skipped += 1;
    else failed += 1;

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        // Always advance, even on failure — a broken address must not cause
        // the same subscription to be retried in a tight loop all day.
        nextSendAt: nextUtcHour(subscription.sendHourUtc, now),
        ...(result.status === "SENT"
          ? { lastSentAt: now, sentCount: { increment: 1 } }
          : {}),
      },
    });
  }

  const summary = {
    ok: true,
    due: due.length,
    sent,
    failed,
    skipped,
    durationMs: Date.now() - startedAt,
  };

  console.log("[cron/daily]", JSON.stringify(summary));
  return NextResponse.json(summary);
}
