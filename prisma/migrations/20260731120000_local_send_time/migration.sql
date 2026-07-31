-- Per-recipient delivery time, expressed in local time rather than UTC.
--
-- `sendHourUtc` is replaced by `sendHour` + `sendTimezone`. Storing a UTC hour
-- meant "8am" drifted to 7am (or 9am) at every daylight-saving boundary; the
-- pair is recomputed per send, so local time stays put.
--
-- Existing rows are migrated exactly: sendHourUtc = 6 becomes 6 o'clock in the
-- UTC zone, which is the same instant they were already getting.

-- AlterTable: Subscription
ALTER TABLE "Subscription" ADD COLUMN "sendHour" INTEGER NOT NULL DEFAULT 6;
ALTER TABLE "Subscription" ADD COLUMN "sendTimezone" TEXT NOT NULL DEFAULT 'UTC';

-- Carry any non-default hour across before the old column goes.
UPDATE "Subscription" SET "sendHour" = "sendHourUtc";

ALTER TABLE "Subscription" DROP COLUMN "sendHourUtc";

-- AlterTable: Order — chosen at checkout, read by the webhook that creates the
-- subscription. Nullable because one-offs have no schedule.
ALTER TABLE "Order" ADD COLUMN "sendHour" INTEGER;
ALTER TABLE "Order" ADD COLUMN "sendTimezone" TEXT;
