import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** `$1.00` from `100`. */
export function formatMoney(amountCents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: amountCents % 100 === 0 ? 0 : 2,
  }).format(amountCents / 100);
}

export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string | null | undefined) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(new Date(date));
}

/** Recipient addresses are the identity key, so normalise them everywhere. */
export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/** `sam@example.com` -> `s••@example.com`, for showing a sender their own list. */
export function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const shown = local.slice(0, 1);
  return `${shown}${"•".repeat(Math.max(local.length - 1, 1))}@${domain}`;
}

/**
 * Next UTC occurrence of `hour`, strictly after `from`.
 * Used to schedule the following day's message.
 */
export function nextUtcHour(hour: number, from: Date = new Date()): Date {
  const next = new Date(from);
  next.setUTCHours(hour, 0, 0, 0);
  if (next <= from) next.setUTCDate(next.getUTCDate() + 1);
  return next;
}
