"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export function Chip({ selected, className, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "rounded-pill border px-4 py-2 text-sm font-medium transition-colors",
        selected
          ? "border-accent bg-accent text-accent-ink"
          : "border-border bg-surface text-ink-muted hover:border-accent hover:text-ink",
        className,
      )}
      {...rest}
    />
  );
}