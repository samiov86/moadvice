/**
 * Rate limiting for /api/checkout.
 *
 * Two layers, neither perfect on its own:
 *
 *  1. An in-memory sliding window keyed by client IP. Fast and free, but each
 *     serverless instance keeps its own counter, so a determined caller spread
 *     across instances gets a higher effective limit than the number below.
 *  2. A database check on how many orders that sender has opened recently.
 *     Survives across instances and cold starts, and is the one that actually
 *     binds — at the cost of a query.
 *
 * Together they stop someone hammering the endpoint and filling the orders
 * table with junk. They are NOT a defence against a distributed flood; that
 * needs a shared store (Upstash, Redis) or Vercel's WAF. Documented here so the
 * next person doesn't mistake this for more than it is.
 */

import { prisma } from "@/lib/prisma";

const IP_WINDOW_MS = 60_000;
const IP_MAX_REQUESTS = 10;

const SENDER_WINDOW_MS = 10 * 60_000;
const SENDER_MAX_ORDERS = 8;

const hits = new Map<string, number[]>();

/** Best-effort client IP. Vercel sets x-forwarded-for; the first entry is the client. */
export function clientIpFrom(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip")?.trim() || "unknown";
}

export function ipRateLimit(ip: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < IP_WINDOW_MS);

  if (recent.length >= IP_MAX_REQUESTS) {
    const oldest = recent[0]!;
    return {
      ok: false,
      retryAfter: Math.ceil((IP_WINDOW_MS - (now - oldest)) / 1000),
    };
  }

  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic cleanup so an instance that lives a long time doesn't grow
  // a map entry for every IP it has ever seen.
  if (hits.size > 5_000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= IP_WINDOW_MS)) hits.delete(key);
    }
  }

  return { ok: true, retryAfter: 0 };
}

/**
 * How many checkouts this sender has opened recently, paid or not. Abandoned
 * carts are normal, so the ceiling is generous — this is here to catch a script,
 * not to scold someone who changed their mind three times.
 */
export async function senderRateLimit(userId: string): Promise<boolean> {
  const since = new Date(Date.now() - SENDER_WINDOW_MS);
  const count = await prisma.order.count({
    where: { userId, createdAt: { gte: since } },
  });
  return count < SENDER_MAX_ORDERS;
}
