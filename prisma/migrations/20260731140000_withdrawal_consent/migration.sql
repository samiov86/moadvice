-- Records consent to immediate performance, without which UK/EU buyers keep
-- their statutory 14-day right to withdraw regardless of what the Terms say.
--
-- Purely additive and nullable: code deployed before this migration ignores
-- both columns, so it is safe to apply ahead of the deploy. (A migration that
-- DROPS something is the opposite — deploy first, then drop.)

-- AlterTable
ALTER TABLE "Order" ADD COLUMN "withdrawalConsentAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN "withdrawalConsentText" TEXT;
