import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/site";

export const runtime = "nodejs";

/**
 * RFC 8058 one-click unsubscribe. Mail clients POST here from the
 * `List-Unsubscribe` header with no confirmation step, so this must succeed
 * without a session and without a UI.
 */
export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  await optOut(token);

  // Always 200: telling an unauthenticated caller whether a token exists would
  // leak whether an address is on the list.
  return NextResponse.json({ ok: true });
}

/** Some clients follow the header with a GET instead. Handle both. */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (token) await optOut(token);
  return NextResponse.redirect(absoluteUrl("/unsubscribe?done=1"));
}

async function optOut(token: string) {
  await prisma.recipient.updateMany({
    where: { unsubscribeToken: token, unsubscribedAt: null },
    data: { unsubscribedAt: new Date() },
  });

  // Stop anything already queued for them. Billing is handled separately —
  // senders are told in the dashboard so they can cancel.
  const recipient = await prisma.recipient.findUnique({
    where: { unsubscribeToken: token },
    select: { id: true },
  });

  if (recipient) {
    await prisma.subscription.updateMany({
      where: { recipientId: recipient.id, status: "ACTIVE" },
      data: { nextSendAt: null },
    });
  }
}
