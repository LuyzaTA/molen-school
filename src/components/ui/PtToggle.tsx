"use client";

import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/cn";

/**
 * Compact "show Portuguese" switch. Renders ONLY for A1 learners — every
 * other level works in English only, so the control is hidden entirely.
 */
export function PtToggle({ className }: { className?: string }) {
  const { profile, update } = useSettings();
  if (profile.level !== "A1") return null;

  const on = profile.translatePt;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => update({ translatePt: !on })}
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border px-3 py-1.5 text-sm font-medium transition-colors",
        on
          ? "border-accent bg-accent-soft text-ink"
          : "border-border bg-surface text-ink-muted hover:text-ink",
        className,
      )}
    >
      <span aria-hidden>🇧🇷</span>
      Português {on ? "on" : "off"}
    </button>
  );
}
