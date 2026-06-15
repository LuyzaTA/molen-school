"use client";

import { cn } from "@/lib/cn";

interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
  id?: string;
}

/** Accessible switch. Label + description are clickable. */
export function Toggle({
  checked,
  onChange,
  label,
  description,
  id,
}: ToggleProps) {
  const switchId = id ?? label.replace(/\s+/g, "-").toLowerCase();
  return (
    <div className="flex items-start justify-between gap-4">
      <label htmlFor={switchId} className="flex-1 cursor-pointer select-none">
        <span className="block text-[15px] font-medium text-ink">{label}</span>
        {description && (
          <span className="mt-0.5 block text-sm text-ink-muted">
            {description}
          </span>
        )}
      </label>
      <button
        id={switchId}
        role="switch"
        type="button"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 h-7 w-12 shrink-0 rounded-pill border transition-colors",
          checked ? "bg-accent border-accent" : "bg-surface border-border",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}