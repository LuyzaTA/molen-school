"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";
import { useProgress } from "@/context/ProgressContext";
import { SaveProgressButton } from "./SaveProgress";
import { Toggle } from "@/components/ui/Toggle";
import { cn } from "@/lib/cn";

/**
 * Persistent quick-access control in the header. The Autistic Mode
 * toggle lives here (and in Settings) so it's always one tap away.
 */
export function QuickSettings() {
  const { profile, update, toggleAutistic, account } = useSettings();
  const { saveStatus } = useProgress();
  const isStudent = !account?.isAdmin;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn(
          "flex items-center gap-2 rounded-pill border px-3 py-1.5 text-sm font-medium transition-colors",
          profile.autisticMode
            ? "border-accent bg-accent-soft text-ink"
            : "border-border bg-surface text-ink-muted hover:text-ink",
        )}
      >
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            profile.autisticMode ? "bg-accent" : "bg-ink-subtle",
          )}
        />
        Calm mode {profile.autisticMode ? "on" : "off"}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Quick settings"
          className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] animate-fade-in rounded-card border border-border bg-surface-raised p-4 shadow-xl"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">
            Quick settings
          </p>
          <div className="space-y-4">
            <Toggle
              label="Autistic / Calm mode"
              description="Single-task screens, no animation, literal language, predictable order, slower audio."
              checked={profile.autisticMode}
              onChange={toggleAutistic}
            />
            <Toggle
              label="Dyslexia-friendly font"
              checked={profile.font === "dyslexic"}
              onChange={(v) => update({ font: v ? "dyslexic" : "inter" })}
            />
            <Toggle
              label="Dark theme"
              checked={profile.theme === "dark"}
              onChange={(v) => update({ theme: v ? "dark" : "light" })}
            />
            {!profile.autisticMode && (
              <Toggle
                label="Animations"
                checked={profile.motion}
                onChange={(v) => update({ motion: v })}
              />
            )}
            {isStudent && (
              <>
                <hr className="border-border" />
                <Toggle
                  label="Auto-Save Progress"
                  description={
                    profile.autoSave
                      ? "Classes, homework, and streaks save automatically."
                      : "Nothing is saved until you press Save progress."
                  }
                  checked={profile.autoSave}
                  onChange={(v) => update({ autoSave: v })}
                />
                <SaveProgressButton status={saveStatus} block />
              </>
            )}
          </div>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="mt-4 block text-sm font-medium text-accent hover:underline"
          >
            All settings →
          </Link>
        </div>
      )}
    </div>
  );
}