import { sendEmail } from "@/lib/resend";
import { absoluteUrl, siteConfig } from "@/lib/site";

/**
 * Operator alerts.
 *
 * A delivery failure used to be written to the database and discovered by
 * nobody — the first live order took a payment and sent nothing, and the only
 * trace was a row in `MessageSent`. These go to the support address so a human
 * finds out the same day.
 *
 * Best-effort by design: every function here swallows its own errors. An alert
 * that fails must never take down the delivery path it is reporting on — and
 * when the cause is a bad Resend key, the alert cannot get out either. Treat
 * these as a convenience on top of the database, not as the record itself.
 */

export interface DeliveryFailureAlert {
  recipientEmail: string;
  error: string;
  /** "one-off order abc123" or "subscription xyz789" — whatever aids a lookup. */
  context: string;
  /** Set when the sender's money was automatically returned. */
  refunded?: boolean;
}

export async function alertDeliveryFailure({
  recipientEmail,
  error,
  context,
  refunded = false,
}: DeliveryFailureAlert): Promise<void> {
  try {
    const lines = [
      `A message could not be delivered.`,
      ``,
      `Recipient: ${recipientEmail}`,
      `Context:   ${context}`,
      `Error:     ${error}`,
      `Refunded:  ${refunded ? "yes, automatically" : "no — check whether one is owed"}`,
      ``,
      `Dashboard: ${absoluteUrl("/dashboard")}`,
    ];

    await sendEmail({
      to: siteConfig.supportEmail,
      subject: `[${siteConfig.name}] Delivery failed — ${recipientEmail}`,
      html: `<pre style="font-family:ui-monospace,Menlo,monospace;font-size:14px;line-height:1.6">${lines
        .join("\n")
        .replace(/</g, "&lt;")}</pre>`,
      text: lines.join("\n"),
    });
  } catch {
    // Deliberately silent — see the note above.
  }
}

export async function alertBounce({
  recipientEmail,
  reason,
  kind,
}: {
  recipientEmail: string;
  reason: string;
  kind: "bounced" | "complained";
}): Promise<void> {
  try {
    const lines = [
      kind === "bounced"
        ? `A message bounced. The address has been suppressed.`
        : `A recipient marked a message as spam. The address has been suppressed.`,
      ``,
      `Recipient: ${recipientEmail}`,
      `Reason:    ${reason}`,
      ``,
      `Any active plan for this address will stop sending. The sender is shown`,
      `the opt-out in their dashboard so they can cancel.`,
    ];

    await sendEmail({
      to: siteConfig.supportEmail,
      subject: `[${siteConfig.name}] ${kind === "bounced" ? "Bounce" : "Spam complaint"} — ${recipientEmail}`,
      html: `<pre style="font-family:ui-monospace,Menlo,monospace;font-size:14px;line-height:1.6">${lines
        .join("\n")
        .replace(/</g, "&lt;")}</pre>`,
      text: lines.join("\n"),
    });
  } catch {
    // Deliberately silent.
  }
}
