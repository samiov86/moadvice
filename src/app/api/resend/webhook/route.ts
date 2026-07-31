import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { alertBounce } from "@/lib/alerts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Resend delivery events.
 *
 * Without this, `MessageSent.status = SENT` only means Resend accepted the
 * message — a mistyped address bounces minutes later and we'd still be telling
 * the sender it was delivered. These events are the only truthful source.
 *
 * Resend signs with Svix. Verified here with node:crypto rather than pulling in
 * the `svix` package: it's an HMAC over "id.timestamp.body" and the whole
 * check is a dozen lines.
 */

/** Reject anything older than this to blunt replay attempts. */
const TOLERANCE_SECONDS = 5 * 60;

type ResendEvent = {
  type: string;
  data?: { email_id?: string; to?: string[]; bounce?: { message?: string } };
};

export async function POST(request: Request) {
  const secret = env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    console.warn("[resend] RESEND_WEBHOOK_SECRET is unset — event ignored");
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const body = await request.text();
  const id = request.headers.get("svix-id");
  const timestamp = request.headers.get("svix-timestamp");
  const signature = request.headers.get("svix-signature");

  if (!id || !timestamp || !signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  if (!verify({ id, timestamp, signature, body, secret })) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: ResendEvent;
  try {
    event = JSON.parse(body) as ResendEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const emailId = event.data?.email_id;
  if (!emailId) return NextResponse.json({ received: true, ignored: "no id" });

  try {
    switch (event.type) {
      case "email.delivered":
        await prisma.messageSent.updateMany({
          // Never downgrade a bounce back to delivered if events arrive out of
          // order — only a row still sitting at SENT can move on.
          where: { providerMessageId: emailId, status: "SENT" },
          data: { status: "DELIVERED", deliveredAt: new Date() },
        });
        break;

      case "email.bounced":
        await handleFailure(
          emailId,
          "BOUNCED",
          event.data?.bounce?.message ?? "Bounced",
        );
        break;

      case "email.complained":
        await handleFailure(emailId, "COMPLAINED", "Marked as spam");
        break;

      default:
        return NextResponse.json({ received: true, ignored: event.type });
    }
  } catch (error) {
    console.error(`[resend] handler failed for ${event.type}`, error);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

/**
 * A bounce means the address is dead; a complaint means they don't want this.
 * Both suppress the recipient permanently, which is the same guarantee the
 * one-click opt-out gives — and stops us billing for mail nobody receives.
 */
async function handleFailure(
  emailId: string,
  status: "BOUNCED" | "COMPLAINED",
  reason: string,
) {
  const log = await prisma.messageSent.findFirst({
    where: { providerMessageId: emailId },
    include: { recipient: true },
  });

  if (!log) return;

  await prisma.messageSent.update({
    where: { id: log.id },
    data: { status, failedAt: new Date(), error: reason },
  });

  if (!log.recipient.unsubscribedAt) {
    await prisma.recipient.update({
      where: { id: log.recipientId },
      data: { unsubscribedAt: new Date() },
    });
  }

  await prisma.subscription.updateMany({
    where: { recipientId: log.recipientId, status: "ACTIVE" },
    data: { nextSendAt: null },
  });

  await alertBounce({
    recipientEmail: log.recipient.email,
    reason,
    kind: status === "BOUNCED" ? "bounced" : "complained",
  });
}

function verify({
  id,
  timestamp,
  signature,
  body,
  secret,
}: {
  id: string;
  timestamp: string;
  signature: string;
  body: string;
  secret: string;
}): boolean {
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > TOLERANCE_SECONDS) return false;

  // Secrets are handed out as "whsec_<base64>"; the prefix is not part of the key.
  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", key)
    .update(`${id}.${timestamp}.${body}`)
    .digest("base64");

  // The header carries a space-separated list, each "v1,<signature>", so that
  // a secret can be rotated without dropping events mid-flight.
  return signature.split(" ").some((part) => {
    const [version, value] = part.split(",");
    if (version !== "v1" || !value) return false;
    const a = Buffer.from(value);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  });
}
