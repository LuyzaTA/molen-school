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

const PANEL_BG = [
  "from-sky-50 to-blue-100 dark:from-sky-950/40 dark:to-blue-900/30",
  "from-amber-50 to-yellow-100 dark:from-amber-950/40 dark:to-yellow-900/30",
  "from-emerald-50 to-green-100 dark:from-emerald-950/40 dark:to-green-900/30",
  "from-violet-50 to-purple-100 dark:from-violet-950/40 dark:to-purple-900/30",
  "from-rose-50 to-pink-100 dark:from-rose-950/40 dark:to-pink-900/30",
  "from-teal-50 to-cyan-100 dark:from-teal-950/40 dark:to-cyan-900/30",
];

// 1 — Story (comic panels) ------------------------------------
export function StoryStepView({ klass }: { klass: GeneratedClass }) {
  const [idx, setIdx] = useState(0);
  const story = klass.story;

  if (!story || story.panels.length === 0) {
    return (
      <StepShell stepNumber={1} totalSteps={TOTAL} title="Story" preview="Read today's illustrated story, then write it in your notebook.">
        <p className="py-6 text-center text-ink-muted">Story not available for this class.</p>
      </StepShell>
    );
  }

  const panels = story.panels;
  const isFinal = idx >= panels.length;
  const totalSlides = panels.length + 1; // panels + 1 full-text slide

  return (
    <StepShell
      stepNumber={1}
      totalSteps={TOTAL}
      title="Story"
      preview="Read each panel, then click Next. Vocabulary words are highlighted. Write the full story in your notebook at the end."
    >
      {/* Slide progress dots */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
          {isFinal ? "Full story" : `Panel ${idx + 1} of ${panels.length}`}
        </span>
        <div className="flex gap-1.5">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={i < panels.length ? `Panel ${i + 1}` : "Full story"}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === idx ? "w-6 bg-accent" : "w-1.5 bg-border hover:bg-accent/50",
              )}
            />
          ))}
        </div>
      </div>

      {/* Panel or full-story view */}
      {isFinal ? (
        <FullStoryPanel story={story} />
      ) : (
        <ComicPanel panel={panels[idx]} panelIndex={idx} />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={idx === 0}
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-ink-muted transition-colors hover:bg-accent-soft hover:text-ink disabled:pointer-events-none disabled:opacity-30"
        >
          ← Previous
        </button>

        <span className="truncate text-center text-sm font-semibold text-ink">
          {story.title}
        </span>

        <button
          type="button"
          disabled={isFinal}
          onClick={() => setIdx((i) => Math.min(panels.length, i + 1))}
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-ink transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-30"
        >
          {idx === panels.length - 1 ? "Full story →" : "Next →"}
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

function ComicPanel({ panel, panelIndex }: { panel: StoryPanel; panelIndex: number }) {
  return (
    <div className="overflow-hidden rounded-xl border-2 border-border shadow-sm">
      {/* Illustration area */}
      <div
        className={cn(
          "relative flex h-44 flex-col items-center justify-center bg-gradient-to-br px-4",
          PANEL_BG[panelIndex % PANEL_BG.length],
        )}
      >
        <span className="select-none text-6xl leading-none sm:text-7xl">{panel.emoji}</span>
        <p className="mt-2 text-center text-xs italic text-ink-subtle">{panel.scene}</p>
      </div>
      {/* Caption */}
      <div className="border-t-2 border-border bg-surface p-4">
        <p className="text-[15px] leading-relaxed text-ink">
          <HighlightedText text={panel.text} vocab={panel.vocab} />
        </p>
      </div>
    </div>
  );
}

function FullStoryPanel({ story }: { story: NonNullable<GeneratedClass["story"]> }) {
  return (
    <div className="space-y-4">
      {/* Notebook call-to-action */}
      <div className="flex items-start gap-3 rounded-xl border-2 border-gold/60 bg-gold/8 p-4">
        <span className="mt-0.5 text-2xl">✏️</span>
        <div>
          <p className="font-bold text-ink">Write this story in your notebook now</p>
          <p className="mt-0.5 text-sm text-ink-muted">
            Copy the full text below by hand. Handwriting the story — with its vocabulary in context — is one of the most effective ways to make new words stick.
          </p>
        </div>
      </div>
      {/* Full story text */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h3 className="mb-3 text-base font-bold text-ink">{story.title}</h3>
        <div className="space-y-3">
          {story.panels.map((panel, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-ink">
              <HighlightedText text={panel.text} vocab={panel.vocab} />
            </p>
          ))}
        </div>
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