"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { GeneratedClass } from "@/lib/types";
import { generateClass } from "@/lib/classGenerator";
import { buildHomework } from "@/lib/homework";
import {
  loadCurrentClass,
  saveCurrentClass,
  loadCurrentStep,
  saveCurrentStep,
} from "@/lib/storage";
import { PtToggle } from "@/components/ui/PtToggle";
import { useSettings } from "@/context/SettingsContext";
import { useProgress } from "@/context/ProgressContext";
import { TopicPicker } from "@/components/class/TopicPicker";
import { AgendaPreview } from "@/components/class/AgendaPreview";
import {
  StoryStepView,
  WarmUpStepView,
  TargetLanguageStepView,
  GuidedProductionStepView,
  FreeProductionStepView,
  FeedbackStepView,
} from "@/components/class/ClassSteps";
import { Stepper } from "@/components/ui/Stepper";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";
import { LANGUAGES } from "@/lib/language";

type Phase = "pick" | "loading" | "agenda" | "running" | "done";

const STEP_LABELS = [
  { label: "Story" },
  { label: "Warm-up" },
  { label: "Target language" },
  { label: "Guided" },
  { label: "Free" },
  { label: "✓ Self-check" },
];

export default function ClassPage() {
  const { profile } = useSettings();
  const { progress, completeClass, saveHomeworkForDay } = useProgress();

  const [phase, setPhase] = useState<Phase>("pick");
  const [klass, setKlass] = useState<GeneratedClass | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [lastTopic, setLastTopic] = useState<string | null>(null);

  // Restore an in-progress class after a refresh so work isn't lost —
  // unless we were sent here with a topic (e.g. from the Inburgeren page).
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("topic");
    if (requested?.trim()) {
      window.history.replaceState(null, "", "/class");
      void runGeneration(requested.trim().slice(0, 200));
      return;
    }
    const saved = loadCurrentClass(profile.language);
    if (saved) {
      setKlass(saved);
      setLastTopic(saved.topic);
      setStepIndex(Math.min(loadCurrentStep(profile.language), STEP_LABELS.length - 1));
      setPhase("agenda");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Remember the current step so a refresh or return resumes the class there.
  useEffect(() => {
    if (klass && phase === "running") saveCurrentStep(stepIndex, profile.language);
  }, [klass, phase, stepIndex, profile.language]);

  async function runGeneration(topic: string) {
    setLastTopic(topic);
    setPhase("loading");

    const topicLower = topic.toLowerCase().trim();
    const topicRepeatCount = progress.history.filter(
      (h) => h.topic.toLowerCase().trim() === topicLower,
    ).length;
    const allLearnedTerms = progress.learnedVocab.map((v) => v.term);

    const generated = await generateClass({
      topic,
      level: profile.level,
      autisticMode: profile.autisticMode,
      track: profile.track,
      language: profile.language,
      supportLang: profile.supportLang,
      knownVocab: allLearnedTerms,
      topicRepeatCount,
      priorTopicVocab: topicRepeatCount > 0 ? allLearnedTerms : undefined,
    });
    setKlass(generated);
    saveCurrentClass(generated, profile.language); // survive a refresh
    setStepIndex(0);
    setPhase("agenda");
  }

  function handleFinish() {
    if (klass) {
      completeClass(klass);
      // Auto-generate today's homework from this class.
      saveHomeworkForDay(buildHomework(klass, profile.supportLang));
    }
    saveCurrentClass(null, profile.language); // class is finished — clear the resume slot
    setPhase("done");
  }

  function changeTopic() {
    saveCurrentClass(null, profile.language);
    setKlass(null);
    setLastTopic(null);
    setPhase("pick");
  }

  // ---- Phase: topic picker ----
  if (phase === "pick") return <TopicPicker onPick={runGeneration} />;

  // ---- Phase: loading ----
  if (phase === "loading") {
    return (
      <div className="mx-auto flex max-w-content flex-col items-center justify-center gap-4 py-24 text-center">
        <Logo withWordmark={false} size={56} />
        <p className="animate-pulse text-ink-muted">
          Building your {LANGUAGES[profile.language].name} speaking class…
        </p>
        <p className="text-sm text-ink-subtle">
          Tailoring vocabulary and prompts to {profile.level}.
        </p>
      </div>
    );
  }

  // ---- Phase: agenda preview ----
  if (phase === "agenda" && klass) {
    return (
      <AgendaPreview
        klass={klass}
        autistic={profile.autisticMode}
        onStart={() => setPhase("running")}
        resumeStep={stepIndex}
        onRegenerate={lastTopic ? () => runGeneration(lastTopic) : undefined}
        onChangeTopic={changeTopic}
      />
    );
  }

  // ---- Phase: completion ----
  if (phase === "done" && klass) {
    return (
      <div className="mx-auto max-w-content space-y-6 py-6 text-center">
        <div className="text-5xl">🎉</div>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Class complete
        </h1>
        <p className="text-[15px] text-ink-muted">
          You worked through {klass.topic}. {klass.targetLanguage.vocab.length}{" "}
          new words are saved to your vocabulary and will come back in later
          lessons.
        </p>
        <Card className="text-left">
          <h2 className="font-semibold text-ink">Next up</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Your homework for today is ready — four short skills that reuse these
            words.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/homework">
              <Button>Do today&apos;s homework</Button>
            </Link>
            <Link href="/">
              <Button variant="secondary">Back to Today</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // ---- Phase: running the stepper ----
  if (phase === "running" && klass) {
    const steps = [
      <StoryStepView key="story" klass={klass} />,
      <WarmUpStepView key="warmup" klass={klass} />,
      <TargetLanguageStepView key="target" klass={klass} />,
      <GuidedProductionStepView key="guided" klass={klass} />,
      <FreeProductionStepView key="free" klass={klass} />,
      <FeedbackStepView key="feedback" klass={klass} />,
    ];
    const isLast = stepIndex === steps.length - 1;

    return (
      <div className="mx-auto max-w-content">
        {/* Sticky stepper. In calm mode labels are always visible. */}
        <div className="sticky top-20 z-30 -mx-4 mb-6 space-y-3 border-b border-border bg-base/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
          <Stepper
            steps={STEP_LABELS}
            current={stepIndex}
            showLabels
            onStepClick={(i) => setStepIndex(i)}
          />
          {profile.level === "A1" && profile.language === "en" && (
            <div className="flex justify-end">
              <PtToggle />
            </div>
          )}
        </div>

        {steps[stepIndex]}

        <div className="mt-10 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            disabled={stepIndex === 0}
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          >
            Back
          </Button>
          {isLast ? (
            <Button size="lg" onClick={handleFinish}>
              Finish class ✓
            </Button>
          ) : (
            <Button size="lg" onClick={() => setStepIndex((i) => i + 1)}>
              Next step →
            </Button>
          )}
        </div>
      </div>
    );
  }

  return null;
}