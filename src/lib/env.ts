import { z } from "zod";

/**
 * Server-side environment validation.
 *
 * Parsing is lazy: the schema runs the first time something reads `env.X`, so
 * `next build` doesn't fall over on a machine that only has build-time
 * variables. Set `SKIP_ENV_VALIDATION=1` to bypass entirely (useful in CI and
 * Docker image builds).
 */
const serverSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  /** Direct (non-pooled) connection, needed by Prisma Migrate on Supabase/Neon. */
  DIRECT_URL: z.string().min(1).optional(),

  NEXT_PUBLIC_APP_URL: z.string().min(1).default("http://localhost:3000"),

  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  /** Price id for the $1 one-off (mode: payment). */
  STRIPE_PRICE_ONE_OFF: z.string().min(1),
  /** Price id for the $5/month plan (mode: subscription). */
  STRIPE_PRICE_DAILY: z.string().min(1),

  // Email
  RESEND_API_KEY: z.string().min(1),
  /** e.g. `Mo Advice <words@moadvice.com>` — must be a verified Resend domain. */
  EMAIL_FROM: z.string().min(1),
  EMAIL_REPLY_TO: z.string().min(1).optional(),
  /**
   * Signing secret for the Resend webhook (`whsec_…`). Optional so an existing
   * deployment keeps working before the endpoint is created — without it,
   * /api/resend/webhook rejects everything and SENT never becomes DELIVERED.
   */
  RESEND_WEBHOOK_SECRET: z.string().min(1).optional(),

  // Auth (NextAuth v5 / Auth.js)
  AUTH_SECRET: z.string().min(1),

  // Scheduling
  /** Shared secret checked by /api/cron/daily. */
  CRON_SECRET: z.string().min(1),
  /** Hour of day, UTC, that daily messages go out. */
  DAILY_SEND_HOUR_UTC: z.coerce.number().int().min(0).max(23).default(6),

  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

export type ServerEnv = z.infer<typeof serverSchema>;

let cached: ServerEnv | null = null;

function parseEnv(): ServerEnv {
  if (process.env.SKIP_ENV_VALIDATION) {
    return process.env as unknown as ServerEnv;
  }

  const parsed = serverSchema.safeParse(process.env);

  if (!parsed.success) {
    const missing = parsed.error.issues
      .map((issue) => `  • ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Invalid environment variables:\n${missing}\n\nCopy .env.example to .env and fill in the blanks.`,
    );
  }

  return parsed.data;
}

/**
 * Lazily-validated server environment. Reading any property triggers
 * validation once; every read after that is free.
 */
export const env = new Proxy({} as ServerEnv, {
  get(_target, prop: string) {
    cached ??= parseEnv();
    return cached[prop as keyof ServerEnv];
  },
});

/** True when we're running against Stripe test keys. */
export function isStripeTestMode() {
  return env.STRIPE_SECRET_KEY.startsWith("sk_test_");
}
