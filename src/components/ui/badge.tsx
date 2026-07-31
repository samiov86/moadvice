import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-foreground",
        outline: "border border-border text-muted-foreground",
        solid: "bg-primary text-primary-foreground",
        muted: "bg-secondary text-secondary-foreground",
        // Token-driven rather than fixed Tailwind shades: emerald-100 on a
        // dark background is a glaring block with unreadable text on it.
        success: "bg-[var(--success-bg)] text-[var(--success-fg)]",
        warning: "bg-[var(--warning-bg)] text-[var(--warning-fg)]",
        destructive: "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
