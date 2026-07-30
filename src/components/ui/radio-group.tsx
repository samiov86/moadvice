"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { cn } from "@/lib/utils";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "aspect-square size-5 shrink-0 rounded-full border border-input text-primary shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
        "data-[state=checked]:border-primary disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="size-2.5 fill-primary text-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

/**
 * A whole selectable panel — used for the theme and frequency steps, where the
 * option needs room for a title, a blurb and a price.
 */
function RadioCard({
  value,
  id,
  className,
  children,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & { value: string }) {
  return (
    <div className="relative">
      <RadioGroupPrimitive.Item
        value={value}
        id={id}
        className="peer sr-only"
        {...props}
      />
      <label
        htmlFor={id}
        className={cn(
          "block cursor-pointer rounded-2xl border border-border bg-card p-5 transition-all",
          "hover:border-primary/40 hover:shadow-warm",
          "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent/40 peer-data-[state=checked]:shadow-warm",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-ring/40",
          className,
        )}
      >
        {children}
      </label>
    </div>
  );
}

export { RadioGroup, RadioGroupItem, RadioCard };
