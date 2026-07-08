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
  review,
  children,
}: {
  stepNumber: number;
  totalSteps: number;
  title: string;
  preview: string;
  speakingHeavy?: boolean;
  /** Marks this as the post-lesson self-check review, not a lesson step. */
  review?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="animate-fade-in">
      <div className="mb-1 flex items-center gap-2">
        {review ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-amber-500/60 text-[10px] leading-none">
              ✓
            </span>
            Self-check · after the lesson
          </span>
        ) : (
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            Step {stepNumber} of {totalSteps}
          </span>
        )}
        {speakingHeavy && <Badge tone="accent">Speaking</Badge>}
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-ink">{title}</h2>
      <p
        className={
          review
            ? "mt-2 rounded-xl bg-amber-100/70 px-4 py-3 text-sm text-ink-muted dark:bg-amber-900/25"
            : "mt-2 rounded-xl bg-accent-soft px-4 py-3 text-sm text-ink-muted"
        }
      >
        <span className="font-semibold text-ink">
          {review ? "What this is: " : "What you'll do: "}
        </span>
        {preview}
      </p>
      <div className="mt-6 space-y-3">{children}</div>
    </div>
  );
}