# Mo Advice — working notes

Anonymous compliments sent by email. Next.js 15 App Router, Prisma + Postgres, Stripe,
Resend. Read [README.md](README.md) for setup; this file is the short list of things
that will bite you.

## Invariants

1. **The recipient never learns who sent anything.** No sender name, no reply-to that
   maps back, nothing in the footer. `src/emails/recipient-message.ts` is the only file
   that renders that email — keep it that way.
2. **Only the Stripe webhook fulfils an order.** `/api/checkout` creates a `PENDING`
   order and nothing else. Never send from the success page or the checkout route.
3. **Every webhook handler must be safe to run twice.** Stripe retries. Orders
   short-circuit once `PAID`; subscriptions upsert on `stripeSubscriptionId`.
4. **All recipient email goes through `src/lib/delivery.ts`.** It enforces the opt-out
   check, picks a non-repeating template, and writes the log. It never throws.
5. **An opted-out address is never sent to again** — not by the original sender, not by
   anyone. Checked at checkout and again at delivery.

## Conventions

- Brand copy and prices live in `src/lib/site.ts`. Don't hardcode "$1" in a component.
- Env is read through `src/lib/env.ts` (lazy, validated), never `process.env` directly
  in app code.
- Recipient emails are lowercased with `normalizeEmail()` before any lookup — the
  address is the identity key.
- UI primitives in `src/components/ui/` follow shadcn/ui structure, so
  `npx shadcn@latest add <component>` drops in cleanly. Tailwind v4, tokens in
  `src/app/globals.css`.
- Email templates are hand-written table HTML with inline styles. No web fonts, no
  flexbox, no external CSS — mail clients won't have it.

## Message bank

`src/data/message-bank.ts`, keyed by `slug`. Edit copy there and run `npm run db:seed`;
it updates in place and deactivates anything removed. House style is documented at the
top of the file — read it before adding messages.

## Before committing

```bash
npm run typecheck && npm run lint && npm run build
```
