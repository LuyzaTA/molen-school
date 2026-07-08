"use client";

import { useState } from "react";
import type { GeneratedClass, StoryPanel } from "@/lib/types";
import { StepShell } from "./StepShell";
import { SpeakPrompt } from "./SpeakPrompt";
import { Badge } from "@/components/ui/Badge";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/cn";

const TOTAL = 6;

/** A1 learners with translation on see Portuguese support. */
function usePt(): boolean {
  const { profile } = useSettings();
  return profile.level === "A1" && profile.translatePt;
}

// ---- Story helpers ------------------------------------------

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightedText({ text, vocab }: { text: string; vocab: string[] }) {
  if (!vocab.length) return <>{text}</>;
  const lower = new Set(vocab.map((v) => v.toLowerCase()));
  const parts = text.split(new RegExp(`(${vocab.map(escapeRegex).join("|")})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        lower.has(part.toLowerCase()) ? (
          <mark key={i} className="rounded bg-gold/30 px-0.5 font-semibold not-italic text-ink">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

// Graphic-novel panel themes — cinematic, dark, atmospheric
const PANEL_THEMES = [
  { bg: "#0f0c1a", glow: "#7c4dff" },
  { bg: "#1a0f08", glow: "#ff6b35" },
  { bg: "#081828", glow: "#29b6f6" },
  { bg: "#091a09", glow: "#57cc04" },
  { bg: "#1e0808", glow: "#ef5350" },
  { bg: "#1a1508", glow: "#ffc107" },
];

// 1 — Story (graphic novel panels) ----------------------------
export function StoryStepView({ klass }: { klass: GeneratedClass }) {
  const [idx, setIdx] = useState(0);
  const [animDir, setAnimDir] = useState<"fwd" | "back">("fwd");
  const story = klass.story;

  if (!story || story.panels.length === 0) {
    return (
      <StepShell stepNumber={1} totalSteps={TOTAL} title="Story" preview="Read today's story, then write it in your notebook.">
        <p className="py-6 text-center text-ink-muted">Story not available for this class.</p>
      </StepShell>
    );
  }

  const panels = story.panels;
  const isFinal = idx >= panels.length;
  const totalSlides = panels.length + 1;

  function goTo(newIdx: number) {
    setAnimDir(newIdx > idx ? "fwd" : "back");
    setIdx(newIdx);
  }

  return (
    <StepShell
      stepNumber={1}
      totalSteps={TOTAL}
      title="Story"
      preview="Each click reveals the next scene. Read it like a graphic novel — let the story unfold. Write the full text in your notebook at the end."
    >
      {/* Slide animation keyframes */}
      <style>{`
        @keyframes gn-fwd  { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes gn-back { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        .gn-slide-fwd  { animation: gn-fwd  0.26s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
        .gn-slide-back { animation: gn-back 0.26s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
      `}</style>

      {/* Progress indicator */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
          {isFinal ? "Full story" : `Panel ${idx + 1} of ${panels.length}`}
        </span>
        <div className="flex gap-1.5">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={i < panels.length ? `Panel ${i + 1}` : "Full story"}
              className={cn(
                "h-2 rounded-full transition-all",
                i === idx ? "w-6 bg-ink" : "w-2 bg-border hover:bg-ink/40",
              )}
            />
          ))}
        </div>
      </div>

      {/* Panel — key forces remount so animation replays on every change */}
      <div key={`gn-${idx}`} className={animDir === "fwd" ? "gn-slide-fwd" : "gn-slide-back"}>
        {isFinal ? (
          <FullStoryPanel story={story} />
        ) : (
          <NovelPanel panel={panels[idx]} panelIndex={idx} />
        )}
      </div>

      {/* Navigation — comic-book button style */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={idx === 0}
          onClick={() => goTo(idx - 1)}
          className="flex items-center gap-1.5 rounded-xl border-2 border-black/20 px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:border-black hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-25 dark:border-border dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-white"
        >
          ← Prev
        </button>

        <span className="truncate text-center text-sm font-semibold text-ink-subtle">
          {story.title}
        </span>

        <button
          type="button"
          disabled={isFinal}
          onClick={() => goTo(idx + 1)}
          className="flex shrink-0 items-center gap-1.5 rounded-xl border-2 border-black bg-black px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-zinc-800 disabled:pointer-events-none disabled:opacity-25 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700"
        >
          {idx === panels.length - 1 ? "Read all →" : "Next →"}
        </button>
      </div>

      {/* Persistent notebook reminder */}
      <div className="flex items-center gap-2.5 rounded-xl border border-gold/40 bg-gold/5 px-4 py-3 text-sm text-ink-muted">
        <span className="shrink-0 text-base">✏️</span>
        <span>Always copy this story into your <strong className="text-ink">notebook by hand</strong> — handwriting locks vocabulary into memory.</span>
      </div>
    </StepShell>
  );
}

function NovelPanel({ panel, panelIndex }: { panel: StoryPanel; panelIndex: number }) {
  const theme = PANEL_THEMES[panelIndex % PANEL_THEMES.length];
  return (
    <div className="overflow-hidden rounded-xl border-[3px] border-black shadow-[5px_5px_0_rgba(0,0,0,0.85)] dark:border-zinc-700 dark:shadow-[5px_5px_0_rgba(0,0,0,0.5)]">
      {/* Illustration — dark atmospheric panel */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ background: theme.bg, minHeight: "230px" }}
      >
        {/* Atmospheric glow around emoji */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 55% 55% at 50% 55%, ${theme.glow}22 0%, transparent 70%)`,
          }}
        />
        {/* Main visual — large emoji with colour-matched glow */}
        <span
          className="relative z-10 select-none leading-none"
          style={{
            fontSize: "clamp(90px, 18vw, 124px)",
            filter: `drop-shadow(0 0 32px ${theme.glow}77)`,
          }}
        >
          {panel.emoji}
        </span>
        {/* Scene narration box — top-left, graphic-novel caption style */}
        <div className="absolute top-3 left-3 z-20 max-w-[calc(100%-3rem)]">
          <div className="rounded bg-black/72 px-2.5 py-1.5 backdrop-blur-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/85 leading-snug">
              {panel.scene}
            </p>
          </div>
        </div>
        {/* Panel counter — top-right */}
        <span className="absolute top-3 right-3.5 z-20 text-xs font-black tabular-nums text-white/20">
          #{panelIndex + 1}
        </span>
        {/* Soft bottom vignette merging into caption */}
        <div
          className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, transparent, ${theme.bg}bb)` }}
        />
      </div>
      {/* Caption strip — classic comic-book cream */}
      <div className="border-t-[3px] border-black bg-[#FFFDE7] px-5 py-4 dark:border-zinc-700 dark:bg-[#1c1a00]">
        <p className="text-[15px] leading-relaxed text-gray-900 dark:text-[#f0e0a0]">
          <HighlightedText text={panel.text} vocab={panel.vocab} />
        </p>
      </div>
    </div>
  );
}

function FullStoryPanel({ story }: { story: NonNullable<GeneratedClass["story"]> }) {
  return (
    <div className="overflow-hidden rounded-xl border-[3px] border-black shadow-[5px_5px_0_rgba(0,0,0,0.85)] dark:border-zinc-700 dark:shadow-[5px_5px_0_rgba(0,0,0,0.5)]">
      {/* Title bar */}
      <div className="bg-black px-5 py-4 dark:bg-zinc-900">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
          Complete Story
        </p>
        <p className="mt-1 text-center text-base font-black text-white">{story.title}</p>
      </div>
      {/* Notebook CTA */}
      <div className="flex items-start gap-3 border-b-[3px] border-black bg-[#FFFDE7] px-5 py-4 dark:border-zinc-700 dark:bg-[#1c1a00]">
        <span className="mt-0.5 shrink-0 text-xl">✏️</span>
        <div>
          <p className="font-bold text-gray-900 dark:text-[#f0e0a0]">Copy this into your notebook by hand</p>
          <p className="mt-0.5 text-sm text-gray-600 dark:text-[#a09050]">
            Handwriting vocabulary in context is one of the most effective ways to make new words stick.
          </p>
        </div>
      </div>
      {/* Full story text */}
      <div className="space-y-3.5 bg-white px-5 py-5 dark:bg-zinc-900/80">
        {story.panels.map((panel, i) => (
          <p key={i} className="text-[15px] leading-relaxed text-gray-900 dark:text-zinc-200">
            <HighlightedText text={panel.text} vocab={panel.vocab} />
          </p>
        ))}
      </div>
    </div>
  );
}

// 2 — Warm-up -------------------------------------------------
export function WarmUpStepView({ klass }: { klass: GeneratedClass }) {
  const showPt = usePt();
  const [grammarOpen, setGrammarOpen] = useState(false);
  const { grammarNote } = klass.warmUp;
  const grammarPoints = klass.grammar;

  return (
    <StepShell
      stepNumber={2}
      totalSteps={TOTAL}
      title="Warm-up"
      preview="Answer five easy personal questions out loud. No pressure — just get talking."
      speakingHeavy
    >
      {klass.warmUp.questions.map((q, i) => (
        <SpeakPrompt
          key={i}
          text={q}
          index={i}
          translation={showPt ? klass.warmUp.questionsPt?.[i] : undefined}
        />
      ))}

      {/* Grammar guide button */}
      {(grammarNote || grammarPoints.length > 0) && (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setGrammarOpen((o) => !o)}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent/60 hover:bg-accent-soft"
          >
            <span aria-hidden>📖</span>
            Grammar guide
            <span aria-hidden className="ml-auto text-ink-subtle">{grammarOpen ? "▲" : "▼"}</span>
          </button>

          {grammarOpen && (
            <div className="mt-3 rounded-xl border border-gold/40 bg-gold/5 p-4 space-y-3 animate-fade-in">
              {grammarPoints.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {grammarPoints.map((g, i) => (
                    <span key={i} className="rounded-pill bg-gold/15 px-3 py-1 text-xs font-semibold text-ink border border-gold/30">
                      {g}
                    </span>
                  ))}
                </div>
              )}
              {grammarNote && (
                <p
                  className="text-sm leading-relaxed text-ink-muted [&_strong]:font-semibold [&_strong]:text-ink"
                  dangerouslySetInnerHTML={{ __html: grammarNote.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }}
                />
              )}
            </div>
          )}
        </div>
      )}
    </StepShell>
  );
}

// 3 — Target language ----------------------------------------
export function TargetLanguageStepView({ klass }: { klass: GeneratedClass }) {
  const showPt = usePt();
  const { vocab, structures } = klass.targetLanguage;
  return (
    <StepShell
      stepNumber={3}
      totalSteps={TOTAL}
      title="Target language"
      preview="Learn today's key words and two sentence patterns. Say each one aloud once."
    >
      <div className="space-y-2.5">
        {vocab.map((v, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-ink">{v.term}</span>
              {v.isIdiom && <Badge tone="warning">idiom</Badge>}
            </div>
            <p className="mt-1 text-sm text-ink-muted">{v.meaning}</p>
            {showPt && v.meaningPt && (
              <p className="mt-0.5 text-sm italic text-accent">🇧🇷 {v.meaningPt}</p>
            )}
            <p className="mt-1.5 text-sm italic text-ink">&ldquo;{v.example}&rdquo;</p>
            {v.isIdiom && v.literalMeaning && (
              <p className="mt-2 rounded-lg bg-warning/10 px-3 py-2 text-xs text-ink-muted">
                <span className="font-semibold">Literal meaning: </span>
                {v.literalMeaning}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="pt-2">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-subtle">
          Two structures to reuse
        </h3>
        <div className="space-y-2.5">
          {structures.map((s, i) => (
            <div key={i} className="rounded-xl border border-accent/30 bg-accent-soft p-4">
              <p className="font-semibold text-ink">{s.pattern}</p>
              <p className="mt-1 text-sm italic text-ink-muted">&ldquo;{s.example}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </StepShell>
  );
}

// 4 — Guided production --------------------------------------
export function GuidedProductionStepView({ klass }: { klass: GeneratedClass }) {
  const g = klass.guidedProduction;
  return (
    <StepShell
      stepNumber={4}
      totalSteps={TOTAL}
      title="Guided production"
      preview="Complete sentence frames aloud, then try a short role-play. Structure first, freedom next."
      speakingHeavy
    >
      <p className="text-[15px] text-ink-muted">{g.intro}</p>

      <div className="space-y-2.5">
        {g.sentenceFrames.map((f, i) => (
          <SpeakPrompt key={i} text={f} index={i} />
        ))}
      </div>

      {g.rolePlay && (
        <div className="rounded-xl border border-accent/30 bg-accent-soft p-4">
          <h3 className="font-semibold text-ink">Role-play</h3>
          <p className="mt-1 text-sm text-ink-muted">{g.rolePlay.scenario}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {g.rolePlay.roles.map((r, i) => (
              <Badge key={i}>{r}</Badge>
            ))}
          </div>
        </div>
      )}

      {g.picturePrompts && g.picturePrompts.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-subtle">
            Picture / visualisation prompts
          </h3>
          {g.picturePrompts.map((p, i) => (
            <SpeakPrompt key={i} text={p} />
          ))}
        </div>
      )}
    </StepShell>
  );
}

// 5 — Free production (A2+) / Vocabulary practice (A1) ------
const A1_PRACTICE_FORMATS = ["vocabulary_practice", "sentence_building", "picture_description"];

const PRACTICE_FORMAT_LABELS: Record<string, string> = {
  vocabulary_practice: "vocabulary practice",
  sentence_building: "sentence building",
  picture_description: "picture description",
};

export function FreeProductionStepView({ klass }: { klass: GeneratedClass }) {
  const f = klass.freeProduction;
  const isA1Practice = A1_PRACTICE_FORMATS.includes(f.format);
  const formatLabel = PRACTICE_FORMAT_LABELS[f.format] ?? f.format;
  return (
    <StepShell
      stepNumber={5}
      totalSteps={TOTAL}
      title={isA1Practice ? "Vocabulary practice" : "Free production"}
      preview={
        isA1Practice
          ? `Put today's words into action. Say each answer out loud — short, simple sentences are perfect.`
          : `Speak freely using a ${f.format} format. Aim for longer turns — keep going past the first sentence.`
      }
      speakingHeavy
    >
      <div className="flex items-center gap-2">
        <Badge tone="accent">{formatLabel}</Badge>
      </div>
      <p className="text-[15px] text-ink-muted">{f.intro}</p>
      <div className="space-y-2.5">
        {f.prompts.map((p, i) => (
          <SpeakPrompt key={i} text={p} index={i} />
        ))}
      </div>
    </StepShell>
  );
}

// 6 — Delayed feedback ---------------------------------------
export function FeedbackStepView({ klass }: { klass: GeneratedClass }) {
  const f = klass.feedback;
  return (
    <StepShell
      stepNumber={6}
      totalSteps={TOTAL}
      title="Delayed feedback"
      preview="Now check your own speaking against a concrete list. This is where the learning sticks."
    >
      <p className="text-[15px] text-ink-muted">{f.intro}</p>

      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-subtle">
          Self-correction checklist
        </h3>
        <ul className="space-y-2">
          {f.checklist.map((c, i) => (
            <li key={i} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-3">
              <span className="mt-0.5 text-accent">✓</span>
              <span className="text-sm text-ink">{c}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-subtle">
          Listen out for these common slips
        </h3>
        <ul className="space-y-2">
          {f.commonErrors.map((c, i) => (
            <li key={i} className="rounded-xl bg-warning/10 px-3 py-2 text-sm text-ink-muted">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </StepShell>
  );
}