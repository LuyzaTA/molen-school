"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { useSettings } from "@/context/SettingsContext";
import { tokenize } from "@/lib/posTagger";

/**
 * A single speaking prompt. The written prompt is ALWAYS shown (a calm-mode
 * requirement, but good for everyone). "Speak now" reveals built-in thinking
 * time; "You may pass" is always available so no one is forced to perform.
 */
export function SpeakPrompt({
  text,
  index,
  translation,
}: {
  text: string;
  index?: number;
  translation?: string;
}) {
  const { profile } = useSettings();
  const [state, setState] = useState<"idle" | "speaking" | "done" | "passed">("idle");
  const [activeWord, setActiveWord] = useState<number | null>(null);
  const tokens = tokenize(text);

  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-colors",
        state === "done" && "border-success/50 bg-success/5",
        state === "passed" && "border-border bg-base/50 opacity-70",
        state !== "done" && state !== "passed" && "border-border bg-surface",
      )}
    >
      <div className="flex items-start gap-3">
        {typeof index === "number" && (
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">
            {index + 1}
          </span>
        )}
        <div className="flex-1">
          <p className="text-[15px] leading-relaxed text-ink">
            {tokens.map((tok, i) => {
              if (tok.kind !== "word") return <span key={i}>{tok.text}</span>;
              const open = activeWord === i;
              return (
                <span
                  key={i}
                  className="relative inline-block cursor-pointer"
                  onMouseEnter={() => setActiveWord(i)}
                  onMouseLeave={() => setActiveWord(null)}
                  onClick={() => setActiveWord(open ? null : i)}
                >
                  <span className={cn(
                    "border-b border-dashed transition-colors",
                    open ? "border-accent text-accent" : "border-transparent",
                  )}>
                    {tok.text}
                  </span>
                  {open && (
                    <span className="pointer-events-none absolute -top-7 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-0.5 text-[11px] font-semibold text-base shadow-md">
                      {tok.tag}
                    </span>
                  )}
                </span>
              );
            })}
          </p>
          {translation && (
            <p className="mt-1 text-sm italic text-ink-subtle">{translation}</p>
          )}
        </div>
      </div>

      {profile.autisticMode && state === "speaking" && (
        <p className="mt-3 pl-9 text-sm text-ink-muted">
          Take your time. There&apos;s no rush — speak when you&apos;re ready.
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2 pl-9">
        {state === "idle" && (
          <>
            <button
              type="button"
              onClick={() => setState("speaking")}
              className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-ink hover:opacity-90"
            >
              Speak now
            </button>
            <PassButton onPass={() => setState("passed")} />
          </>
        )}
        {state === "speaking" && (
          <>
            <button
              type="button"
              onClick={() => setState("done")}
              className="rounded-lg bg-success px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
            >
              I said it ✓
            </button>
            <PassButton onPass={() => setState("passed")} />
          </>
        )}
        {state === "done" && (
          <span className="text-sm font-medium text-success">Nice — said it.</span>
        )}
        {state === "passed" && (
          <button
            type="button"
            onClick={() => setState("idle")}
            className="text-sm font-medium text-ink-subtle hover:text-ink"
          >
            Passed · try again
          </button>
        )}
      </div>
    </div>
  );
}

function PassButton({ onPass }: { onPass: () => void }) {
  return (
    <button
      type="button"
      onClick={onPass}
      className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-ink-muted hover:text-ink"
    >
      You may pass
    </button>
  );
}