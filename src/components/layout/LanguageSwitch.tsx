"use client";

import { useEffect, useRef, useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import { Flag, langFlag } from "@/components/ui/Flag";
import { LANGUAGES, TARGET_LANGUAGES, type TargetLanguage } from "@/lib/language";
import { cn } from "@/lib/cn";

/**
 * Header control showing the current course. Switching reloads the app so
 * every page (progress, homework, meetings, admin data) reads the new course.
 */
export function LanguageSwitch() {
  const { profile, switchLanguage } = useSettings();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
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

  async function pick(lang: TargetLanguage) {
    setOpen(false);
    if (lang === profile.language) return;
    setBusy(true);
    await switchLanguage(lang);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Course: ${LANGUAGES[profile.language].name}. Change course`}
        disabled={busy}
        className="flex items-center gap-2 rounded-pill border border-border bg-surface px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink disabled:opacity-60"
      >
        <Flag code={langFlag(profile.language)} width={18} />
        <span className="hidden sm:inline">{LANGUAGES[profile.language].name}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-52 animate-fade-in rounded-card border border-border bg-surface-raised p-2 shadow-xl"
        >
          <p className="px-2 pb-1 pt-1 text-xs font-semibold uppercase tracking-wider text-accent">
            Course
          </p>
          {TARGET_LANGUAGES.map((code) => (
            <button
              key={code}
              type="button"
              role="menuitemradio"
              aria-checked={profile.language === code}
              onClick={() => pick(code)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm transition-colors",
                profile.language === code
                  ? "bg-accent-soft font-semibold text-ink"
                  : "text-ink-muted hover:bg-accent-soft/60 hover:text-ink",
              )}
            >
              <Flag code={langFlag(code)} width={18} />
              {LANGUAGES[code].brand}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
