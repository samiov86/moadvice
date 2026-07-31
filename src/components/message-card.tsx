import type { MessageTemplateSeed } from "@/data/message-bank";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * One message, rendered for the public browsing pages.
 *
 * The slug becomes the element id so any single message is linkable —
 * /messages/personal#per-resilience — without giving each one its own page.
 * Sixty-four pages of three sentences each would be thin content, and search
 * engines treat a pile of near-identical thin pages as a doorway.
 */
export function MessageCard({
  message,
  showCategory = false,
  className,
}: {
  message: MessageTemplateSeed;
  showCategory?: boolean;
  className?: string;
}) {
  return (
    <figure
      id={message.slug}
      className={cn(
        "scroll-mt-24 rounded-2xl border border-border bg-card p-6 sm:p-7",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-xl leading-snug">
          {message.headline}
        </h3>
        {showCategory && (
          <Badge variant="muted" className="shrink-0">
            {message.category === "PERSONAL" ? "Personal" : "Professional"}
          </Badge>
        )}
      </div>

      <blockquote className="mt-4 font-display text-[17px] leading-[1.7] text-muted-foreground">
        {message.body}
      </blockquote>
    </figure>
  );
}
