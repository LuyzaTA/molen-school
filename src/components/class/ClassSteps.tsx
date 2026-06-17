"use client";

import { useState } from "react";
import type { GeneratedClass } from "@/lib/types";
import { StepShell } from "./StepShell";
import { SpeakPrompt } from "./SpeakPrompt";
import { Badge } from "@/components/ui/Badge";
import { useSettings } from "@/context/SettingsContext";

const TOTAL = 5;

/** A1 learners with translation on see Portuguese support. */
function usePt(): boolean {
  const { profile } = useSettings();
  return profile.level === "A1" && profile.translatePt;
}

// 1 — Warm-up -------------------------------------------------
export function WarmUpStepView({ klass }: { klass: GeneratedClass }) {
  const showPt = usePt();
  const [grammarOpen, setGrammarOpen] = useState(false);
  const { grammarNote } = klass.warmUp;
  const grammarPoints = klass.grammar;

  return (
    <StepShell
      stepNumber={1}
      totalSteps={TOTAL}
      title="Warm-up"
      preview="Answer three easy personal questions out loud. No pressure — just get talking."
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
            <div className="mt-3 rounded-xl border border-accent/30 bg-accent-soft p-4 space-y-3 animate-fade-in">
              {grammarPoints.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {grammarPoints.map((g, i) => (
                    <span key={i} className="rounded-pill bg-white/60 px-3 py-1 text-xs font-semibold text-ink">
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

// 2 — Target language ----------------------------------------
export function TargetLanguageStepView({ klass }: { klass: GeneratedClass }) {
  const showPt = usePt();
  const { vocab, structures } = klass.targetLanguage;
  return (
    <StepShell
      stepNumber={2}
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

// 3 — Guided production --------------------------------------
export function GuidedProductionStepView({ klass }: { klass: GeneratedClass }) {
  const g = klass.guidedProduction;
  return (
    <StepShell
      stepNumber={3}
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

// 4 — Free production ----------------------------------------
export function FreeProductionStepView({ klass }: { klass: GeneratedClass }) {
  const f = klass.freeProduction;
  return (
    <StepShell
      stepNumber={4}
      totalSteps={TOTAL}
      title="Free production"
      preview={`Speak freely using a ${f.format} format. Aim for longer turns — keep going past the first sentence.`}
      speakingHeavy
    >
      <div className="flex items-center gap-2">
        <Badge tone="accent">{f.format}</Badge>
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

// 5 — Delayed feedback ---------------------------------------
export function FeedbackStepView({ klass }: { klass: GeneratedClass }) {
  const f = klass.feedback;
  return (
    <StepShell
      stepNumber={5}
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