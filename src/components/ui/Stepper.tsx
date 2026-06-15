"use client";

import { cn } from "@/lib/cn";

export interface StepMeta {
  label: string;
}

/**
 * Horizontal progress stepper. Shows the current position in the
 * class. In autistic mode the labels are always visible (the caller
 * passes showLabels), reinforcing the predictable agenda.
 */
export function Stepper({
  steps,
  current,
  onStepClick,
  showLabels = true,
}: {
  steps: StepMeta[];
  current: number;
  onStepClick?: (index: number) => void;
  showLabels?: boolean;
}) {
  return (
    <ol className="flex items-center gap-1.5">
      {steps.map((step, i) => {
        const state =
          i < current ? "done" : i === current ? "current" : "upcoming";
        const clickable = onStepClick && i <= current;
        return (
          <li key={step.label} className="flex-1">
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onStepClick(i)}
              className={cn(
                "group flex w-full flex-col gap-1.5 text-left",
                clickable ? "cursor-pointer" : "cursor-default",
              )}
              aria-current={state === "current" ? "step" : undefined}
            >
              <span
                className={cn(
                  "h-1.5 w-full rounded-pill transition-colors",
                  state === "done" && "bg-accent",
                  state === "current" && "bg-accent",
                  state === "upcoming" && "bg-accent-soft",
                )}
              />
              {showLabels && (
                <span
                  className={cn(
                    "hidden text-xs font-medium sm:block",
                    state === "upcoming" ? "text-ink-subtle" : "text-ink-muted",
                    state === "current" && "text-ink",
                  )}
                >
                  {step.label}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );
}