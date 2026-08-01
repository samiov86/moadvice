/**
 * Tells you what your local environment is actually pointed at.
 *
 *   npm run env:check
 *
 * Exists because it is genuinely easy to have DATABASE_URL aimed at production
 * and STRIPE_SECRET_KEY on live keys without noticing — at which point a local
 * experiment writes real rows and opens real Checkout sessions. That has
 * already happened on this project more than once.
 *
 * Prints, never fixes: the point is that you see it before you run anything.
 */
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

function hostOf(url: string | undefined): string {
  if (!url) return "(unset)";
  try {
    const parsed = new URL(url);
    return `${parsed.hostname}${parsed.pathname}`;
  } catch {
    return "(unparseable)";
  }
}

const nodeEnv = process.env.NODE_ENV ?? "development";
const isProdRun = nodeEnv === "production";

const stripeKey = process.env.STRIPE_SECRET_KEY ?? "";
const stripeMode = stripeKey.startsWith("sk_live_")
  ? "LIVE"
  : stripeKey.startsWith("sk_test_")
    ? "test"
    : "(unset)";

const dbHost = hostOf(process.env.DATABASE_URL);
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "(unset)";
const emailFrom = process.env.EMAIL_FROM ?? "(unset)";
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const warnings: string[] = [];

if (stripeMode === "LIVE" && !isProdRun) {
  warnings.push(
    "Stripe is in LIVE mode outside production. Anything you run can create real\n" +
      "  Checkout sessions and take real money. Use sk_test_… locally.",
  );
}

if (!isProdRun && !/localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL ?? "")) {
  warnings.push(
    `DATABASE_URL points at a remote host (${dbHost}).\n` +
      "  If that is production, every local test writes real rows. Use a branch\n" +
      "  or a separate database for development.",
  );
}

if (appUrl.includes("localhost") && stripeMode === "LIVE") {
  warnings.push(
    "NEXT_PUBLIC_APP_URL is localhost while Stripe is live — Stripe would redirect\n" +
      "  paying customers to a machine only you can reach.",
  );
}

console.log(`\n${BOLD}Environment${RESET}`);
console.log(`  NODE_ENV        ${nodeEnv}`);
console.log(`  App URL         ${appUrl}`);
console.log(
  `  Stripe          ${stripeMode === "LIVE" ? `${RED}${BOLD}LIVE${RESET}` : `${GREEN}${stripeMode}${RESET}`}`,
);
console.log(`  Database        ${dbHost}`);
console.log(`  Email from      ${emailFrom}`);
console.log(
  `  Google Analytics ${gaId ? gaId : `${DIM}(unset — no GA locally, which is right)${RESET}`}`,
);

if (warnings.length === 0) {
  console.log(`\n${GREEN}Nothing alarming.${RESET}\n`);
} else {
  console.log(`\n${YELLOW}${BOLD}${warnings.length} thing(s) to know:${RESET}`);
  for (const warning of warnings) {
    console.log(`\n${YELLOW}!${RESET} ${warning}`);
  }
  console.log(
    `\n${DIM}See the "Local development" section of the README for how to separate these.${RESET}\n`,
  );
}
