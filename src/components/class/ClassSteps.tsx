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

interface VocabInfo {
  meaning: string;
  meaningPt?: string;
}

/** Map every vocab term (and each "a / b" variant) to its meaning. */
function buildVocabLookup(klass: GeneratedClass): Map<string, VocabInfo> {
  const map = new Map<string, VocabInfo>();
  for (const item of klass.targetLanguage.vocab) {
    for (const variant of item.term.split("/")) {
      const key = variant.trim().toLowerCase();
      if (key) map.set(key, { meaning: item.meaning, meaningPt: item.meaningPt });
    }
  }
  return map;
}

/**
 * Story text with tappable vocabulary: highlighted terms show their meaning
 * (and PT translation for A1 with the toggle on) in a small popover.
 */
function VocabText({
  text,
  vocab,
  lookup,
}: {
  text: string;
  vocab: string[];
  lookup: Map<string, VocabInfo>;
}) {
  const showPt = usePt();
  const [open, setOpen] = useState<number | null>(null);
  const clean = vocab.filter(Boolean);
  if (!clean.length) return <>{text}</>;
  const lower = new Set(clean.map((v) => v.toLowerCase()));
  const parts = text.split(new RegExp(`(${clean.map(escapeRegex).join("|")})`, "gi"));
  return (
    <>
      {parts.map((part, i) => {
        if (!lower.has(part.toLowerCase())) return <span key={i}>{part}</span>;
        const info = lookup.get(part.toLowerCase());
        const isOpen = open === i;
        return (
          <span key={i} className="relative inline-block">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              onMouseEnter={() => setOpen(i)}
              onMouseLeave={() => setOpen(null)}
              className="rounded bg-gold/25 px-0.5 font-semibold not-italic text-ink underline decoration-gold decoration-dotted underline-offset-2"
            >
              {part}
            </button>
            {isOpen && info && (
              <span className="pointer-events-none absolute -top-9 left-1/2 z-30 w-max max-w-[240px] -translate-x-1/2 rounded-md bg-ink px-2.5 py-1 text-center text-xs font-medium not-italic text-base shadow-lg">
                {info.meaning}
                {showPt && info.meaningPt ? ` · 🇧🇷 ${info.meaningPt}` : ""}
              </span>
            )}
          </span>
        );
      })}
    </>
  );
}

// Character colours, assigned by order of first appearance
const SPEAKER_STYLES = [
  { avatar: "bg-indigo-500", name: "text-indigo-600 dark:text-indigo-400" },
  { avatar: "bg-rose-500", name: "text-rose-600 dark:text-rose-400" },
  { avatar: "bg-emerald-600", name: "text-emerald-600 dark:text-emerald-400" },
  { avatar: "bg-amber-500", name: "text-amber-600 dark:text-amber-400" },
];

function sceneIsGated(panel: StoryPanel): boolean {
  return (panel.dialogue?.length ?? 0) > 0 || !!panel.check;
}

// 1 — Story (interactive scenes) ------------------------------
export function StoryStepView({ klass }: { klass: GeneratedClass }) {
  const [idx, setIdx] = useState(0);
  const [animDir, setAnimDir] = useState<"fwd" | "back">("fwd");
  const [done, setDone] = useState<Record<number, boolean>>({});
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
  const lookup = buildVocabLookup(klass);

  // Consistent colour per character across the whole story
  const speakerIdx = new Map<string, number>();
  for (const p of panels) {
    for (const d of p.dialogue ?? []) {
      if (!speakerIdx.has(d.speaker)) speakerIdx.set(d.speaker, speakerIdx.size);
    }
  }

  const sceneDone = (i: number) => !!done[i] || !sceneIsGated(panels[i]);
  // First scene that is not finished — everything up to it is reachable
  let unlocked = 0;
  while (unlocked < panels.length && sceneDone(unlocked)) unlocked++;

  const canAdvance = !isFinal && sceneDone(idx);

  function goTo(newIdx: number) {
    setAnimDir(newIdx > idx ? "fwd" : "back");
    setIdx(newIdx);
  }

  return (
    <StepShell
      stepNumber={1}
      totalSteps={TOTAL}
      title="Story"
      preview="Read each scene, reveal the conversation line by line, and answer a quick question to unlock the next scene. Tap highlighted words to see their meaning."
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
          {isFinal ? "Full story" : `Scene ${idx + 1} of ${panels.length}`}
        </span>
        <div className="flex gap-1.5">
          {Array.from({ length: totalSlides }).map((_, i) => {
            const reachable = i <= unlocked;
            return (
              <button
                key={i}
                type="button"
                disabled={!reachable}
                onClick={() => goTo(i)}
                aria-label={i < panels.length ? `Scene ${i + 1}` : "Full story"}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === idx ? "w-6 bg-accent" : reachable ? "w-2 bg-ink/30 hover:bg-accent/60" : "w-2 bg-border",
                )}
              />
            );
          })}
        </div>
      </div>

      {/* Scene — key forces remount so reveal state resets per scene */}
      <div key={`gn-${idx}`} className={animDir === "fwd" ? "gn-slide-fwd" : "gn-slide-back"}>
        {isFinal ? (
          <FullStoryPanel story={story} lookup={lookup} />
        ) : (
          <ScenePanel
            panel={panels[idx]}
            index={idx}
            total={panels.length}
            lookup={lookup}
            speakerIdx={speakerIdx}
            initiallyDone={sceneDone(idx)}
            onComplete={() => setDone((d) => ({ ...d, [idx]: true }))}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={idx === 0}
          onClick={() => goTo(idx - 1)}
          className="rounded-xl px-4 py-2.5 text-sm font-semibold text-ink-muted transition-colors hover:bg-accent-soft hover:text-ink disabled:pointer-events-none disabled:opacity-30"
        >
          ← Back
        </button>

        <span className="truncate text-center text-sm font-semibold text-ink-subtle">
          {story.title}
        </span>

        <button
          type="button"
          disabled={isFinal || !canAdvance}
          onClick={() => goTo(idx + 1)}
          className="shrink-0 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-30"
        >
          {idx === panels.length - 1 ? "Full story →" : "Next scene →"}
        </button>
      </div>
      {!isFinal && !canAdvance && (
        <p className="text-center text-xs text-ink-subtle">
          Reveal the whole conversation and answer the quick check to unlock the next scene.
        </p>
      )}

      {/* Persistent notebook reminder */}
      <div className="flex items-center gap-2.5 rounded-xl border border-gold/40 bg-gold/5 px-4 py-3 text-sm text-ink-muted">
        <span className="shrink-0 font-serif text-base font-bold text-gold" aria-hidden>✎</span>
        <span>Always copy this story into your <strong className="text-ink">notebook by hand</strong> — handwriting locks vocabulary into memory.</span>
      </div>
    </StepShell>
  );
}

function ScenePanel({
  panel,
  index,
  total,
  lookup,
  speakerIdx,
  initiallyDone,
  onComplete,
}: {
  panel: StoryPanel;
  index: number;
  total: number;
  lookup: Map<string, VocabInfo>;
  speakerIdx: Map<string, number>;
  initiallyDone: boolean;
  onComplete: () => void;
}) {
  const dialogue = panel.dialogue ?? [];
  const check = panel.check;
  const [shown, setShown] = useState(initiallyDone ? dialogue.length : 0);
  const [wrong, setWrong] = useState<number[]>([]);
  const [solved, setSolved] = useState(initiallyDone);

  const allShown = shown >= dialogue.length;

  function revealNext() {
    const n = shown + 1;
    setShown(n);
    if (n >= dialogue.length && !check) {
      setSolved(true);
      onComplete();
    }
  }

  function pick(i: number) {
    if (solved || !check) return;
    if (i === check.answer) {
      setSolved(true);
      onComplete();
    } else {
      setWrong((w) => (w.includes(i) ? w : [...w, i]));
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      {/* Setting slug line — like a screenplay header */}
      <div className="flex items-center justify-between gap-3 bg-ink px-5 py-2.5">
        <span className="shrink-0 text-[11px] font-black uppercase tracking-[0.2em] text-base/70">
          Scene {index + 1}/{total}
        </span>
        <span className="truncate text-[11px] font-semibold uppercase tracking-wider text-base">
          {panel.scene}
        </span>
      </div>

      <div className="space-y-4 px-5 py-5">
        {/* Narration */}
        <p className="font-serif text-[16.5px] leading-relaxed text-ink">
          <VocabText text={panel.text} vocab={panel.vocab} lookup={lookup} />
        </p>

        {/* Dialogue — revealed line by line */}
        {dialogue.slice(0, shown).map((d, i) => {
          const s = SPEAKER_STYLES[(speakerIdx.get(d.speaker) ?? 0) % SPEAKER_STYLES.length];
          return (
            <div key={i} className="flex animate-fade-in items-start gap-2.5">
              <span
                className={cn(
                  "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                  s.avatar,
                )}
              >
                {d.speaker.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <span className={cn("text-[11px] font-bold uppercase tracking-wider", s.name)}>
                  {d.speaker}
                </span>
                <p className="mt-0.5 rounded-xl rounded-tl-sm border border-border bg-base/60 px-3.5 py-2 text-[15px] leading-relaxed text-ink">
                  <VocabText text={d.line} vocab={panel.vocab} lookup={lookup} />
                </p>
              </div>
            </div>
          );
        })}

        {/* Reveal button */}
        {!allShown && (
          <button
            type="button"
            onClick={revealNext}
            className="w-full rounded-xl border-2 border-dashed border-border py-2.5 text-sm font-semibold text-ink-muted transition-colors hover:border-accent hover:bg-accent-soft/50 hover:text-accent"
          >
            {shown === 0 ? "▾ Reveal the conversation" : "▾ Continue"}
          </button>
        )}

        {/* Comprehension check — gate to the next scene */}
        {allShown && check && (
          <div className="animate-fade-in rounded-xl border border-accent/40 bg-accent-soft p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-accent">Quick check</p>
            <p className="mt-1 font-semibold text-ink">{check.question}</p>
            <div className="mt-3 flex flex-col gap-2">
              {check.options.map((opt, i) => {
                const isWrong = wrong.includes(i);
                const isCorrect = solved && i === check.answer;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={isWrong || solved}
                    onClick={() => pick(i)}
                    className={cn(
                      "rounded-lg border px-3.5 py-2 text-left text-sm font-medium transition-colors",
                      isCorrect
                        ? "border-success bg-success/10 text-success"
                        : isWrong
                          ? "border-warning/60 bg-warning/10 text-ink-subtle line-through"
                          : "border-border bg-surface text-ink hover:border-accent",
                    )}
                  >
                    {opt}
                    {isCorrect ? "  ✓" : ""}
                  </button>
                );
              })}
            </div>
            {solved && (
              <p className="mt-2.5 text-sm font-semibold text-success">
                Correct — the next scene is unlocked.
              </p>
            )}
            {wrong.length > 0 && !solved && (
              <p className="mt-2.5 text-sm text-ink-muted">
                Not quite — read the scene again and try another answer.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FullStoryPanel({
  story,
  lookup,
}: {
  story: NonNullable<GeneratedClass["story"]>;
  lookup: Map<string, VocabInfo>;
}) {
  return (
    <div className="space-y-4">
      {/* Notebook call-to-action */}
      <div className="flex items-start gap-3 rounded-xl border-2 border-gold/60 bg-gold/8 p-4">
        <span className="mt-0.5 shrink-0 font-serif text-2xl font-bold text-gold" aria-hidden>✎</span>
        <div>
          <p className="font-bold text-ink">Write this story in your notebook now</p>
          <p className="mt-0.5 text-sm text-ink-muted">
            Copy the narration and the dialogue by hand. Handwriting the vocabulary in context is one of the most effective ways to make new words stick.
          </p>
        </div>
      </div>

      {/* Full story as a readable script */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="bg-ink px-5 py-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-base/60">The full story</p>
          <p className="mt-0.5 text-[16px] font-black text-base">{story.title}</p>
        </div>
        <div className="space-y-5 px-5 py-5">
          {story.panels.map((panel, i) => (
            <div key={i}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-subtle">
                Scene {i + 1} — {panel.scene}
              </p>
              <p className="mt-1.5 font-serif text-[15.5px] leading-relaxed text-ink">
                <VocabText text={panel.text} vocab={panel.vocab} lookup={lookup} />
              </p>
              {(panel.dialogue ?? []).map((d, j) => (
                <p key={j} className="mt-1 pl-4 text-[15px] leading-relaxed text-ink">
                  <span className="font-bold">{d.speaker}:</span>{" "}
                  <span className="italic">
                    <VocabText text={d.line} vocab={panel.vocab} lookup={lookup} />
                  </span>
                </p>
              ))}
            </div>
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
  const showPt = usePt();
  const g = klass.guidedProduction;
  return (
    <StepShell
      stepNumber={4}
      totalSteps={TOTAL}
      title="Guided production"
      preview="Complete sentence frames aloud, then try a short role-play. Structure first, freedom next."
      speakingHeavy
    >
      <p className="text-[15px] text-ink-muted">
        {showPt && g.introPt ? (
          <>
            <span className="block">{g.introPt}</span>
            <span className="mt-0.5 block text-sm text-ink-subtle">{g.intro}</span>
          </>
        ) : g.intro}
      </p>

      <div className="space-y-2.5">
        {g.sentenceFrames.map((f, i) => (
          <SpeakPrompt
            key={i}
            text={f}
            index={i}
            translation={showPt ? g.sentenceFramesPt?.[i] : undefined}
          />
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
  const showPt = usePt();
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
      <p className="text-[15px] text-ink-muted">
        {showPt && f.introPt ? (
          <>
            <span className="block">{f.introPt}</span>
            <span className="mt-0.5 block text-sm text-ink-subtle">{f.intro}</span>
          </>
        ) : f.intro}
      </p>
      <div className="space-y-2.5">
        {f.prompts.map((p, i) => (
          <SpeakPrompt
            key={i}
            text={p}
            index={i}
            translation={showPt ? f.promptsPt?.[i] : undefined}
          />
        ))}
      </div>
    </StepShell>
  );
}

// 6 — Delayed feedback (self-evaluation) ---------------------
export function FeedbackStepView({ klass }: { klass: GeneratedClass }) {
  const f = klass.feedback;
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const checkedCount = Object.values(checked).filter(Boolean).length;

  function toggle(i: number) {
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  return (
    <StepShell
      stepNumber={6}
      totalSteps={TOTAL}
      title="Delayed feedback"
      preview="Class finished. Now look back at your own speaking — this is self-evaluation, not a new exercise."
    >
      {/* Debrief banner — visually distinct from class exercises */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3.5 dark:border-amber-700/40 dark:bg-amber-950/25">
        <span className="mt-0.5 shrink-0 text-xl">🔁</span>
        <div>
          <p className="font-semibold text-amber-900 dark:text-amber-300">Self-evaluation — not a new task</p>
          <p className="mt-0.5 text-sm text-amber-800/80 dark:text-amber-400/70">
            Tick what you managed during the class. These are checkpoints to help you notice your progress — there are no wrong answers here.
          </p>
        </div>
      </div>

      <p className="text-[15px] text-ink-muted">{f.intro}</p>

      <div>
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-subtle">
            Self-correction checklist
          </h3>
          {checkedCount > 0 && (
            <span className="text-xs font-bold text-accent">
              {checkedCount} / {f.checklist.length}
            </span>
          )}
        </div>
        <ul className="space-y-2">
          {f.checklist.map((c, i) => (
            <li key={i}>
              <label className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors",
                checked[i]
                  ? "border-accent/40 bg-accent-soft"
                  : "border-border bg-surface hover:border-accent/30 hover:bg-accent-soft/40",
              )}>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={!!checked[i]}
                  onChange={() => toggle(i)}
                />
                <span className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                  checked[i]
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-border bg-surface",
                )}>
                  {checked[i] && <span className="text-[11px] font-black leading-none">✓</span>}
                </span>
                <span className={cn(
                  "text-sm leading-relaxed transition-colors",
                  checked[i] ? "font-medium text-ink" : "text-ink-muted",
                )}>
                  {c}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-subtle">
          Common slips to watch for next time
        </h3>
        <ul className="space-y-2">
          {f.commonErrors.map((c, i) => (
            <li key={i} className="flex items-start gap-2.5 rounded-xl bg-warning/10 px-3 py-2.5 text-sm text-ink-muted">
              <span className="mt-0.5 shrink-0 text-warning">!</span>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </StepShell>
  );
}