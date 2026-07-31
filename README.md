# Mo Advice

**Anonymous compliments that feel like good advice.** — [moadvice.com](https://moadvice.com)

Someone pays $1 to send a stranger-proof compliment to a person they know, or $5/month
to send a different one every morning. The recipient gets a warm, anonymous email. They
never find out who it was from, and they never need an account.

---

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) + TypeScript, strict |
| Styling | Tailwind CSS v4 + shadcn/ui conventions (`components.json` included) |
| Database | PostgreSQL via Prisma 6 |
| Payments | Stripe Checkout + Customer Portal + webhooks |
| Email | Resend |
| Auth | NextAuth v5 (Auth.js) — magic link, sender dashboard only |
| Scheduling | Vercel Cron → `/api/cron/daily` |
| Hosting | Vercel |

---

## Quick start

```bash
git clone <your-repo> moadvice && cd moadvice
npm install
cp .env.example .env      # then fill it in — see "Environment" below
npm run db:migrate        # creates the schema
npm run db:seed           # loads the 64-message bank
npm run dev
```

Open <http://localhost:3000>.

To take a real test payment you also need the Stripe CLI forwarding webhooks — see
[Stripe setup](#3-stripe) below. Without it, checkout completes but nothing is
delivered, because **the webhook is the only thing that fulfils an order**.

---

## Setup, in order

### 1. Database

Any Postgres works — Supabase, Neon, Railway, RDS, or local.

```bash
# Supabase: Project Settings → Database → Connection string (URI)
DATABASE_URL="postgresql://..."

# Pooled hosts (Supabase pgBouncer, Neon) also need a direct connection for
# migrations. Leave DIRECT_URL unset if DATABASE_URL is already direct.
DIRECT_URL="postgresql://..."
```

Then:

```bash
npm run db:migrate    # dev: creates + applies a migration
npm run db:seed       # loads message templates (idempotent, safe to re-run)
npm run db:studio     # optional: browse the data
```

In CI/production use `npm run db:deploy` (`prisma migrate deploy`) instead of
`db:migrate`. An initial migration is checked in at
`prisma/migrations/20260729000000_init/`.

### 2. Resend (email)

1. Add and verify your sending domain at [resend.com/domains](https://resend.com/domains).
2. Create an API key → `RESEND_API_KEY`.
3. Set `EMAIL_FROM` to an address **on the verified domain**, e.g.
   `Mo Advice <words@moadvice.com>`. Anything else will fail to send.
4. `EMAIL_REPLY_TO` is optional. Leaving it blank is defensible — replies to an
   anonymous message have nowhere good to go.
5. **Add the delivery webhook.** Resend → Webhooks → new endpoint at
   `https://moadvice.com/api/resend/webhook`, subscribed to `email.delivered`,
   `email.bounced` and `email.complained`. Put its signing secret in
   `RESEND_WEBHOOK_SECRET`.

   Without it, `MessageSent.status` stops at `SENT` — meaning *Resend accepted
   it*, not that it arrived. A mistyped address bounces minutes later and the
   sender is still told it was delivered. The webhook is what promotes `SENT` to
   `DELIVERED`, marks bounces, and suppresses dead addresses.

### 3. Stripe

**Create two prices** (Products → Add product). Copy the **price** IDs, which start
with `price_`, not the product IDs:

| Product | Type | Amount | Env var |
| --- | --- | --- | --- |
| One message | One-time | $1.00 | `STRIPE_PRICE_ONE_OFF` |
| Daily words | Recurring, monthly | $5.00 | `STRIPE_PRICE_DAILY` |

**Enable the Customer Portal** at
[dashboard.stripe.com/settings/billing/portal](https://dashboard.stripe.com/settings/billing/portal),
otherwise the "Manage billing" button in the dashboard returns an error.

**Local webhooks:**

```bash
stripe login
npm run stripe:listen
```

That prints a `whsec_…` — put it in `STRIPE_WEBHOOK_SECRET`. Leave it running while
you test; the checkout redirect will beat the webhook otherwise and nothing sends.

**Production webhook:** add an endpoint at `https://moadvice.com/api/stripe/webhook`
subscribed to:

- `checkout.session.completed`
- `checkout.session.async_payment_failed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Copy that endpoint's signing secret into `STRIPE_WEBHOOK_SECRET` in production.

Test cards: `4242 4242 4242 4242`, any future expiry, any CVC.

### 4. Auth

```bash
openssl rand -base64 32   # → AUTH_SECRET
```

Sign-in is a magic link sent through Resend, so no extra provider setup. Senders never
have to create an account — one is made silently at checkout, and signing in later with
the same address reveals their history.

### 5. Cron

`vercel.json` schedules `/api/cron/daily` **hourly**:

```json
{ "crons": [{ "path": "/api/cron/daily", "schedule": "0 * * * *" }] }
```

Hourly rather than daily on purpose: work is claimed by `nextSendAt <= now()`, so a
missed or slow run self-heals within the hour instead of skipping someone's day. Runs
outside the send window find nothing due and exit immediately.

Set `CRON_SECRET` (`openssl rand -hex 32`) as a Vercel environment variable — Vercel
then sends it automatically as `Authorization: Bearer …`, and the route rejects
anything else.

> **Vercel Hobby plan** only permits one cron invocation per day. Either upgrade, or
> change the schedule to `0 6 * * *` and accept that a failed run skips a day.

Trigger it by hand:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/daily
```

---

## Environment

Every variable is documented in [`.env.example`](.env.example). Validation is lazy and
happens on first use, so you get a readable list of what's missing rather than a stack
trace. `SKIP_ENV_VALIDATION=1` bypasses it for image builds.

---

## How it fits together

```
/                     Marketing homepage
/send                 Four-step send flow with live email preview
/send/success         Post-checkout confirmation + receipt
/dashboard            Sender's plans and history (magic-link auth)
/signin               Request a sign-in link
/unsubscribe          Recipient opt-out (also POST /api/unsubscribe, one-click)
/terms /privacy /contact

api/checkout          Creates a PENDING order + Stripe Checkout Session
api/stripe/webhook    The only place an order is fulfilled
api/cron/daily        Sends the day's messages
api/portal            Opens the Stripe Customer Portal
api/auth/[...nextauth]
```

### The delivery path

Everything a recipient ever receives goes through `src/lib/delivery.ts`:

1. Refuse to send to an address that has opted out (logged as `SKIPPED`).
2. Pick a template the recipient hasn't seen — at random among unseen ones, so two
   people on daily plans don't get the bank in the same order. Once it's exhausted,
   recycle oldest-first.
3. Send via Resend with an idempotency key.
4. Write a `MessageSent` row either way. It never throws, so one bad address can't
   take down a cron batch.

### Why fulfilment lives in the webhook

`/api/checkout` only creates a `PENDING` order. A closed tab, a declined card, or a
replayed success URL therefore can't produce a free message. Every webhook handler is
safe to run twice: orders short-circuit once `PAID`, subscriptions upsert on
`stripeSubscriptionId`, and the daily cron advances `nextSendAt` as it goes.

---

## Data model

| Table | Holds |
| --- | --- |
| `User` | Senders. Created silently at checkout; `stripeCustomerId` is reused for every purchase. |
| `Account` / `Session` / `VerificationToken` | NextAuth. |
| `Recipient` | Email, optional name, opt-out token and timestamp. No account, ever. |
| `Order` | One purchase — a one-off, or the checkout that began a daily plan. |
| `Subscription` | An active daily plan. A sender may hold many at once. |
| `MessageTemplate` | The bank, keyed by `slug` so re-seeding updates in place. |
| `MessageSent` | Delivery log. Also what stops a message repeating. |

Full schema with comments: [`prisma/schema.prisma`](prisma/schema.prisma).

---

## The message bank

64 messages live in [`src/data/message-bank.ts`](src/data/message-bank.ts) — 32
professional, 32 personal. House style is documented at the top of that file; the short
version is *specific recognition, not flattery*.

To change copy: edit the file, then `npm run db:seed`. Templates are keyed by `slug`,
so edits update in place and removed entries are deactivated rather than deleted
(delivery logs point at them).

---

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | `prisma generate` + production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Create + apply a migration (dev) |
| `npm run db:deploy` | Apply migrations (CI/prod) |
| `npm run db:push` | Push schema without a migration (prototyping) |
| `npm run db:seed` | Load the message bank |
| `npm run db:studio` | Prisma Studio |
| `npm run stripe:listen` | Forward Stripe webhooks to localhost |

---

## Deploying to Vercel

1. Push to GitHub and import the repo.
2. Add every variable from `.env.example` in Project Settings → Environment Variables.
   Set `NEXT_PUBLIC_APP_URL` to `https://moadvice.com`.
3. Deploy. `postinstall` runs `prisma generate`; apply migrations with
   `npm run db:deploy` from your machine or a release step.
4. Add the production Stripe webhook endpoint and paste its signing secret back in.
5. Confirm the cron appears under Project → Cron Jobs.

### Pre-launch checklist

- [ ] Sending domain verified in Resend, SPF/DKIM green
- [ ] Stripe in live mode, live price IDs, live webhook secret
- [ ] Customer Portal enabled in Stripe
- [ ] `AUTH_SECRET` and `CRON_SECRET` are fresh random values, not the examples
- [ ] `npm run db:seed` has run against production
- [ ] Send yourself a $1 message end to end
- [ ] Legal pages reviewed by a lawyer (see note at the bottom of each)

---

## Built to extend

- **AI-generated messages** — swap `pickTemplateForRecipient` in `src/lib/messages.ts`
  for a generator. `deliverMessage` only needs a `headline` and `body`.
- **Per-recipient send time** — `Subscription.sendHourUtc` is already a column; expose
  it in the send flow and the hourly cron does the rest.
- **Corporate plans** — add a quantity to the daily price and fan out over a recipient
  list; the delivery path is per-recipient already.
- **Admin panel** — `MessageSent` carries status, error, and Resend message ID for
  every send.

---

## Notes and known limits

- **Legal pages are a strong starting point, not legal advice.** Add your entity,
  address, and governing law, and have them reviewed.
- **Testimonials on the homepage are placeholder copy.** Replace them before launch.
- The recipient email deliberately contains no tracking pixel, so there is no open or
  click reporting. That is a product decision, not an oversight.
- Message selection is per-recipient, not per-sender: if two people run daily plans for
  the same recipient, the bank is shared and won't repeat across both.
