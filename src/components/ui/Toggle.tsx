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
          // flex + items-center keeps the knob vertically centred; px-0.5 padding
          // bounds the knob so it can never slide past the track edge.
          "mt-0.5 inline-flex h-7 w-[52px] shrink-0 items-center rounded-full px-0.5 transition-colors",
          checked ? "bg-accent" : "bg-ink-subtle/35",
        )}
      >
        <span
          className={cn(
            "inline-block h-6 w-6 rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0",
          )}
        />
      </button>
    </div>
  );
}