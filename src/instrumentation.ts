/**
 * Server error reporting.
 *
 * Delivery failures already email the support address, but nothing else did —
 * a Stripe webhook returning 500 left no trace except Vercel logs nobody reads.
 * `onRequestError` is Next's built-in hook and fires for every server-side
 * error in the App Router, so this needs no third-party service.
 *
 * If you later want stack traces, search, and grouping, this is the function to
 * point at Sentry. The alerting below is the minimum that stops a failure going
 * unnoticed for days.
 */

/** Don't email the same failing route more than once per window. */
const THROTTLE_MS = 15 * 60 * 1000;

/**
 * Per-instance and therefore leaky in serverless — several instances can each
 * send one alert for the same fault. That's an acceptable trade for needing no
 * shared store: it turns a flood into a handful, which is the point.
 */
const lastAlertedAt = new Map<string, number>();

export function register() {
  // Nothing to initialise yet. Kept because Next expects this export to exist
  // alongside onRequestError, and it's where an APM SDK would be started.
}

export async function onRequestError(
  error: unknown,
  request: { path?: string; method?: string },
  context: { routePath?: string; routeType?: string },
) {
  try {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    const route = context.routePath ?? request.path ?? "unknown";
    const key = `${route}:${message.slice(0, 120)}`;

    const now = Date.now();
    const previous = lastAlertedAt.get(key);
    if (previous && now - previous < THROTTLE_MS) return;
    lastAlertedAt.set(key, now);

    // Keep the map from growing without bound on a long-lived instance.
    if (lastAlertedAt.size > 200) {
      for (const [k, t] of lastAlertedAt) {
        if (now - t > THROTTLE_MS) lastAlertedAt.delete(k);
      }
    }

    // Imported lazily: this file is loaded during startup, and pulling the
    // Resend client (and therefore env validation) in at module scope would
    // make a missing variable break boot rather than one request.
    const { sendEmail } = await import("@/lib/resend");
    const { siteConfig } = await import("@/lib/site");

    const lines = [
      `${request.method ?? "?"} ${request.path ?? "?"}`,
      `Route:   ${route} (${context.routeType ?? "unknown"})`,
      `Error:   ${message}`,
      ``,
      stack ?? "(no stack)",
      ``,
      `Further alerts for this route are suppressed for ${THROTTLE_MS / 60000} minutes.`,
    ];

    await sendEmail({
      to: siteConfig.supportEmail,
      subject: `[${siteConfig.name}] Server error — ${route}`,
      html: `<pre style="font-family:ui-monospace,Menlo,monospace;font-size:13px;line-height:1.5">${lines
        .join("\n")
        .replace(/</g, "&lt;")}</pre>`,
      text: lines.join("\n"),
    });
  } catch {
    // Never let the reporter throw — it runs inside Next's error path, and a
    // failure here would replace the real error with a confusing one.
  }
}
