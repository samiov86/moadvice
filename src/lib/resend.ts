import { Resend } from "resend";
import { env } from "@/lib/env";

/**
 * Deferred for the same reason as the Stripe client: `next build` loads route
 * modules, and a missing RESEND_API_KEY should fail the request that sends mail,
 * not the entire build. See `src/lib/stripe.ts`.
 */
const globalForResend = globalThis as unknown as { resend: Resend | undefined };

function createClient(): Resend {
  const client = globalForResend.resend ?? new Resend(env.RESEND_API_KEY);

  if (process.env.NODE_ENV !== "production") {
    globalForResend.resend = client;
  }

  return client;
}

let instance: Resend | null = null;

export const resend = new Proxy({} as Resend, {
  get(_target, property, receiver) {
    instance ??= createClient();
    return Reflect.get(instance, property, receiver);
  },
});

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Set on recipient messages so opt-out works from any mail client. */
  unsubscribeUrl?: string;
  /** Stops Resend re-sending the same message if a cron run is retried. */
  idempotencyKey?: string;
}

export interface SendEmailResult {
  ok: boolean;
  id?: string;
  error?: string;
}

/**
 * Thin wrapper over Resend that never throws — callers log the failure to
 * `MessageSent` and move on rather than failing a whole cron batch.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  unsubscribeUrl,
  idempotencyKey,
}: SendEmailParams): Promise<SendEmailResult> {
  try {
    const { data, error } = await resend.emails.send(
      {
        from: env.EMAIL_FROM,
        to,
        subject,
        html,
        text,
        replyTo: env.EMAIL_REPLY_TO,
        headers: unsubscribeUrl
          ? {
              "List-Unsubscribe": `<${unsubscribeUrl}>`,
              "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            }
          : undefined,
      },
      idempotencyKey ? { idempotencyKey } : undefined,
    );

    if (error) {
      return { ok: false, error: error.message ?? "Unknown Resend error" };
    }
    return { ok: true, id: data?.id };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
