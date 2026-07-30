import type { DeliveryStatus, MessageCategory } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import { absoluteUrl } from "@/lib/site";
import { pickTemplateForRecipient, subjectForDelivery } from "@/lib/messages";
import { recipientMessageEmail } from "@/emails/recipient-message";

export interface DeliverMessageParams {
  recipientId: string;
  theme: MessageCategory;
  /** Set for a one-off. */
  orderId?: string | null;
  /** Set for a daily plan. */
  subscriptionId?: string | null;
  /** Controls one line of copy in the email. */
  isDaily: boolean;
  /**
   * Stable per-delivery key. Prevents a retried webhook or a cron run that
   * overlaps itself from sending the same message twice.
   */
  idempotencyKey: string;
}

export interface DeliverMessageResult {
  status: DeliveryStatus;
  messageSentId?: string;
  error?: string;
}

/**
 * Pick a message, send it, log it. The single path every recipient email goes
 * through — one-offs, the first day of a subscription, and the daily cron all
 * call this.
 *
 * Never throws: a failure is written to `MessageSent` with status FAILED so a
 * batch keeps going and support can see what happened.
 */
export async function deliverMessage({
  recipientId,
  theme,
  orderId = null,
  subscriptionId = null,
  isDaily,
  idempotencyKey,
}: DeliverMessageParams): Promise<DeliverMessageResult> {
  const recipient = await prisma.recipient.findUnique({
    where: { id: recipientId },
  });

  if (!recipient) {
    return { status: "FAILED", error: "Recipient not found" };
  }

  if (recipient.unsubscribedAt) {
    // They opted out. Log it so the sender's dashboard can explain the gap,
    // and so we never quietly keep charging for nothing.
    const skipped = await prisma.messageSent.create({
      data: {
        recipientId,
        templateId: await anyTemplateId(theme),
        orderId,
        subscriptionId,
        theme,
        subject: "(skipped — recipient opted out)",
        status: "SKIPPED",
        error: "Recipient has unsubscribed",
      },
    });
    return { status: "SKIPPED", messageSentId: skipped.id };
  }

  const template = await pickTemplateForRecipient(recipientId, theme);
  if (!template) {
    return {
      status: "FAILED",
      error: `No active templates for category ${theme}. Run \`npm run db:seed\`.`,
    };
  }

  const deliveredCount = await prisma.messageSent.count({
    where: { recipientId, status: "SENT" },
  });

  const subject = subjectForDelivery(deliveredCount);

  // Two URLs for the same thing: the visible footer link opens a page with a
  // confirmation, while the List-Unsubscribe header needs an endpoint that
  // accepts a one-click POST from the mail client.
  const unsubscribePageUrl = absoluteUrl(
    `/unsubscribe?token=${recipient.unsubscribeToken}`,
  );
  const unsubscribePostUrl = absoluteUrl(
    `/api/unsubscribe?token=${recipient.unsubscribeToken}`,
  );

  const { html, text } = recipientMessageEmail({
    recipientName: recipient.name,
    headline: template.headline,
    body: template.body,
    unsubscribeUrl: unsubscribePageUrl,
    isDaily,
  });

  const result = await sendEmail({
    to: recipient.email,
    subject,
    html,
    text,
    unsubscribeUrl: unsubscribePostUrl,
    idempotencyKey,
  });

  const log = await prisma.messageSent.create({
    data: {
      recipientId,
      templateId: template.id,
      orderId,
      subscriptionId,
      theme,
      subject,
      status: result.ok ? "SENT" : "FAILED",
      providerMessageId: result.id ?? null,
      error: result.ok ? null : (result.error ?? "Unknown error"),
    },
  });

  return {
    status: result.ok ? "SENT" : "FAILED",
    messageSentId: log.id,
    error: result.error,
  };
}

/**
 * The SKIPPED log row still needs a templateId (the column is required so the
 * happy path can't lose it). Any template of the right category will do.
 */
async function anyTemplateId(theme: MessageCategory): Promise<string> {
  const template = await prisma.messageTemplate.findFirst({
    where: { category: theme },
    select: { id: true },
  });
  if (!template) {
    throw new Error(
      `Message bank is empty for ${theme}. Run \`npm run db:seed\`.`,
    );
  }
  return template.id;
}
