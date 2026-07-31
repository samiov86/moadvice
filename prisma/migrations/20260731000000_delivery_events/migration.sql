-- Delivery events from Resend.
--
-- Additive and backward compatible: existing rows keep status SENT, the two new
-- columns are nullable, and code deployed before this migration is unaffected.
-- Apply it BEFORE deploying the code that writes the new values.
--
-- Note: `prisma migrate diff` also proposed `DROP TABLE "playing_with_neon"`.
-- That is Neon's sample table, not part of this application, and it still holds
-- rows — deliberately left alone rather than dropped by an app migration.

-- AlterEnum
-- Three values in one migration needs PostgreSQL 12+, which Neon is.
ALTER TYPE "DeliveryStatus" ADD VALUE 'DELIVERED';
ALTER TYPE "DeliveryStatus" ADD VALUE 'BOUNCED';
ALTER TYPE "DeliveryStatus" ADD VALUE 'COMPLAINED';

-- AlterTable
ALTER TABLE "MessageSent" ADD COLUMN "deliveredAt" TIMESTAMP(3),
ADD COLUMN "failedAt" TIMESTAMP(3);

-- CreateIndex
-- The Resend webhook looks rows up by provider id and nothing else.
CREATE INDEX "MessageSent_providerMessageId_idx" ON "MessageSent"("providerMessageId");
