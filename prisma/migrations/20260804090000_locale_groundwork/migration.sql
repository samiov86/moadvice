-- Groundwork for a second language.
--
-- Nothing changes behaviourally: every existing row becomes 'en', which is what
-- it already was implicitly. The point is that adding Spanish later is a seed
-- and a deploy, rather than a migration run against live subscriptions that are
-- mid-month and sending daily.
--
-- Additive apart from the unique index swap on MessageTemplate, which widens
-- rather than narrows: slug alone was unique, slug+locale now is, so the same
-- message can exist once per language.

-- AlterTable
ALTER TABLE "MessageTemplate" ADD COLUMN "locale" TEXT NOT NULL DEFAULT 'en';
ALTER TABLE "Order" ADD COLUMN "locale" TEXT NOT NULL DEFAULT 'en';
ALTER TABLE "Subscription" ADD COLUMN "locale" TEXT NOT NULL DEFAULT 'en';

-- Widen the uniqueness constraint before dropping the narrower one, so the
-- table is never briefly unprotected against duplicate slugs.
CREATE UNIQUE INDEX "MessageTemplate_slug_locale_key" ON "MessageTemplate"("slug", "locale");
DROP INDEX "MessageTemplate_slug_key";

-- The bank is now queried by category *and* locale.
DROP INDEX "MessageTemplate_category_active_idx";
CREATE INDEX "MessageTemplate_category_locale_active_idx" ON "MessageTemplate"("category", "locale", "active");
