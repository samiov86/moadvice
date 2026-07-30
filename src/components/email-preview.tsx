import { cn } from "@/lib/utils";

export interface EmailPreviewProps {
  headline: string;
  body: string;
  recipientName?: string | null;
  recipientEmail?: string | null;
  isDaily?: boolean;
  className?: string;
}

/**
 * A faithful-enough mock of the email the recipient receives. Kept in sync with
 * `src/emails/recipient-message.ts` by hand — the real thing is table HTML with
 * inline styles, which is not worth rendering in the browser.
 */
export function EmailPreview({
  headline,
  body,
  recipientName,
  recipientEmail,
  isDaily = false,
  className,
}: EmailPreviewProps) {
  const greeting = recipientName?.trim() ? `${recipientName.trim()},` : "Hello,";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-[#F6EFE7] p-3 shadow-warm-lg sm:p-4",
        className,
      )}
    >
      {/* Inbox chrome — makes it read as an email, not a quote block. */}
      <div className="mb-3 flex items-center justify-between px-2 text-[11px] text-[#94897C]">
        <span className="truncate">
          To: {recipientEmail?.trim() || "them@example.com"}
        </span>
        <span className="shrink-0 pl-3">Someone wanted you to hear this</span>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#EADFD3] bg-white">
        <div className="h-1 w-full bg-[#D9644A]" />
        <div className="px-6 py-7 sm:px-8">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#94897C]">
            Someone wanted you to read this
          </p>
          <h3 className="mt-3 font-display text-[22px] leading-snug text-[#2A2723] sm:text-2xl">
            {headline}
          </h3>
          <p className="mt-4 text-[15px] text-[#6F675E]">{greeting}</p>
          <p className="mt-3 font-display text-[17px] leading-[1.7] text-[#2A2723]">
            {body}
          </p>
          <p className="mt-6 text-[13px] leading-relaxed text-[#94897C]">
            Sent anonymously. Someone who knows you chose these words for you
            {isDaily
              ? ", and picked out a new one for every morning this month"
              : ""}
            .
          </p>
        </div>
      </div>

      <p className="px-2 pt-3 text-[11px] leading-relaxed text-[#94897C]">
        No sender name. No account needed. One link to stop them at any time.
      </p>
    </div>
  );
}
