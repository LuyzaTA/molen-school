import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";

/**
 * Consistent wrapper for every class step: a numbered eyebrow, title,
 * a short "what you'll do" preview (shown to everyone — in calm mode it
 * doubles as the per-step preview requirement), and the body.
 */
export function StepShell({
  stepNumber,
  totalSteps,
  title,
  preview,
  speakingHeavy,
  children,
}: {
  stepNumber: number;
  totalSteps: number;
  title: string;
  preview: string;
  speakingHeavy?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="animate-fade-in">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          Step {stepNumber} of {totalSteps}
        </span>
        {speakingHeavy && <Badge tone="accent">Speaking</Badge>}
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-ink">{title}</h2>
      <p className="mt-2 rounded-xl bg-accent-soft px-4 py-3 text-sm text-ink-muted">
        <span className="font-semibold text-ink">What you&apos;ll do: </span>
        {preview}
      </p>
      <div className="mt-6 space-y-3">{children}</div>
    </div>
  );
}