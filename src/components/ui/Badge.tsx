import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "accent" | "success" | "warning";

const TONES: Record<Tone, string> = {
  neutral: "bg-accent-soft text-ink-muted",
  accent: "bg-accent text-accent-ink",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-2.5 py-1 text-xs font-semibold",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}