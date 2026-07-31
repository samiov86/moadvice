/**
 * Local-time scheduling.
 *
 * Storing a fixed UTC hour is the obvious approach and it's wrong: 8am in
 * Europe/London is 08:00 UTC in winter and 07:00 UTC in summer. A subscription
 * pinned to a UTC hour drifts an hour twice a year, so half the year "every
 * morning at eight" is a lie.
 *
 * So we store the *local* hour plus an IANA timezone, and recompute the UTC
 * instant for every send. No dependency — Intl already knows every zone and its
 * DST rules, and gets updates through the runtime rather than through a library
 * that needs bumping every time a government moves a clock.
 */

/** Offset, in ms, that `timeZone` was at the given instant. */
function offsetMsAt(instant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? "0");

  // Intl renders midnight as hour 24 in some engines; normalise it.
  const hour = get("hour") % 24;

  const asIfUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    hour,
    get("minute"),
    get("second"),
  );

  return asIfUtc - instant.getTime();
}

/**
 * The UTC instant at which the wall clock in `timeZone` reads the given
 * local date and hour.
 *
 * Resolved twice because the offset depends on the instant we're trying to
 * find: the first guess uses the wrong side of a DST boundary roughly twice a
 * year, and the second pass corrects it.
 */
function zonedToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  timeZone: string,
): Date {
  const naive = Date.UTC(year, month - 1, day, hour, 0, 0, 0);
  const firstPass = naive - offsetMsAt(new Date(naive), timeZone);
  const secondPass = naive - offsetMsAt(new Date(firstPass), timeZone);
  return new Date(secondPass);
}

/** Calendar date currently showing in `timeZone`. */
function localDateParts(instant: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? "0");
  return { year: get("year"), month: get("month"), day: get("day") };
}

/**
 * Next moment, strictly after `from`, when it is `hour` o'clock in `timeZone`.
 *
 * Falls back to a plain UTC calculation if the zone is unrecognised, so a bad
 * value in the database delays someone's message rather than throwing inside
 * the cron and stopping the whole batch.
 */
export function nextLocalHour(
  hour: number,
  timeZone: string,
  from: Date = new Date(),
): Date {
  if (!isValidTimeZone(timeZone)) {
    const fallback = new Date(from);
    fallback.setUTCHours(hour, 0, 0, 0);
    if (fallback <= from) fallback.setUTCDate(fallback.getUTCDate() + 1);
    return fallback;
  }

  const today = localDateParts(from, timeZone);
  let candidate = zonedToUtc(today.year, today.month, today.day, hour, timeZone);

  if (candidate <= from) {
    // Step a day forward in local terms, not by adding 24h — a DST day is 23
    // or 25 hours long and arithmetic on the instant would skip or repeat.
    const tomorrow = localDateParts(
      new Date(from.getTime() + 24 * 60 * 60 * 1000),
      timeZone,
    );
    candidate = zonedToUtc(
      tomorrow.year,
      tomorrow.month,
      tomorrow.day,
      hour,
      timeZone,
    );
  }

  return candidate;
}

export function isValidTimeZone(timeZone: string): boolean {
  if (!timeZone) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

/** "6:00 AM" from an hour number. */
export function formatLocalHour(hour: number): string {
  const suffix = hour < 12 ? "AM" : "PM";
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve}:00 ${suffix}`;
}

/** "6:00 AM Europe/London" for UI and email copy. */
export function describeSendTime(hour: number, timeZone: string): string {
  return `${formatLocalHour(hour)} ${timeZone.replace(/_/g, " ")}`;
}

/** Render an instant in a specific zone, e.g. for the dashboard. */
export function formatInZone(
  date: Date | null | undefined,
  timeZone: string,
): string {
  if (!date) return "—";
  const zone = isValidTimeZone(timeZone) ? timeZone : "UTC";
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: zone,
  }).format(date);
}

/** Hours offered in the send flow. Deliberately few — this is not a scheduler. */
export const SEND_HOURS = [
  { hour: 6, label: "6:00 AM" },
  { hour: 7, label: "7:00 AM" },
  { hour: 8, label: "8:00 AM" },
  { hour: 9, label: "9:00 AM" },
  { hour: 12, label: "Midday" },
  { hour: 18, label: "6:00 PM" },
  { hour: 21, label: "9:00 PM" },
] as const;
