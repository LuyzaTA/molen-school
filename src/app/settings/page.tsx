"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSettings } from "@/context/SettingsContext";
import { useProgress } from "@/context/ProgressContext";
import { CEFR_LEVELS } from "@/lib/cefr";
import type { CEFRLevel, ThemePreference } from "@/lib/types";
import { clearAll } from "@/lib/storage";
import { Card, SectionHeading } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export default function SettingsPage() {
  const router = useRouter();
  const { profile, update, reset } = useSettings();
  const { reset: resetProgress } = useProgress();
  const [confirmClear, setConfirmClear] = useState(false);

  function clearEverything() {
    clearAll();
    resetProgress();
    reset();
    router.replace("/onboarding");
  }

  return (
    <div className="mx-auto max-w-content space-y-6">
      <header className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Settings
        </h1>
      </header>

      {/* Profile */}
      <Card>
        <SectionHeading title="Profile" />
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink">
          Name
        </label>
        <input
          id="name"
          value={profile.name}
          onChange={(e) => update({ name: e.target.value })}
          className="input-field"
        />

        <p className="mb-2 mt-5 block text-sm font-medium text-ink">CEFR level</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {CEFR_LEVELS.map((l) => (
            <button
              key={l.level}
              type="button"
              onClick={() => update({ level: l.level as CEFRLevel })}
              aria-pressed={profile.level === l.level}
              className={cn(
                "rounded-lg border py-2.5 text-sm font-semibold transition-colors",
                profile.level === l.level
                  ? "border-accent bg-accent text-accent-ink"
                  : "border-border bg-surface text-ink-muted hover:border-accent",
              )}
            >
              {l.level}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-ink-subtle">
          {CEFR_LEVELS.find((l) => l.level === profile.level)?.canDo}
        </p>
      </Card>

      {/* Experience */}
      <Card>
        <SectionHeading title="Experience" />
        <div className="space-y-5">
          <Toggle
            label="Autistic / Calm mode"
            description="Lower-contrast palette, no animations, single-task screens, agenda shown up front, idioms explained literally, predictable speaking order, and 'you may pass' always available."
            checked={profile.autisticMode}
            onChange={(v) => update({ autisticMode: v })}
          />
          <hr className="border-border" />
          <Toggle
            label="Dyslexia-friendly font"
            description="A rounded, well-spaced typeface that's easier to scan."
            checked={profile.font === "dyslexic"}
            onChange={(v) => update({ font: v ? "dyslexic" : "inter" })}
          />
          <hr className="border-border" />
          {profile.level === "A1" && (
            <>
              <Toggle
                label="Portuguese translations (A1)"
                description="Show Brazilian-Portuguese translations next to vocabulary, warm-up questions, and weekly homework. Available at A1 only — higher levels work in English."
                checked={profile.translatePt}
                onChange={(v) => update({ translatePt: v })}
              />
              <hr className="border-border" />
            </>
          )}
          {!profile.autisticMode && (
            <>
              <Toggle
                label="Animations"
                description="Subtle motion. Always off in Calm mode and when your system prefers reduced motion."
                checked={profile.motion}
                onChange={(v) => update({ motion: v })}
              />
              <hr className="border-border" />
            </>
          )}
          <div>
            <p className="mb-2 text-[15px] font-medium text-ink">Theme</p>
            <div className="flex gap-2">
              {(["light", "dark", "system"] as ThemePreference[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => update({ theme: t })}
                  aria-pressed={profile.theme === t}
                  className={cn(
                    "flex-1 rounded-lg border py-2.5 text-sm font-medium capitalize transition-colors",
                    profile.theme === t
                      ? "border-accent bg-accent-soft text-ink"
                      : "border-border bg-surface text-ink-muted hover:border-accent",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Data */}
      <Card className="border-danger/30">
        <SectionHeading
          title="Data"
          description="Everything is stored locally in your browser. Nothing leaves this device in this version."
        />
        {!confirmClear ? (
          <Button variant="danger" onClick={() => setConfirmClear(true)}>
            Reset all data
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-ink-muted">
              This deletes your profile, progress, vocabulary, and homework, and
              restarts onboarding. This can&apos;t be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="danger" onClick={clearEverything}>
                Yes, delete everything
              </Button>
              <Button variant="ghost" onClick={() => setConfirmClear(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}