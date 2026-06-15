"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSettings } from "@/context/SettingsContext";
import { CEFR_LEVELS } from "@/lib/cefr";
import type { CEFRLevel } from "@/lib/types";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { cn } from "@/lib/cn";

type Step = 0 | 1 | 2 | 3;

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, update } = useSettings();

  const [step, setStep] = useState<Step>(0);
  const [name, setName] = useState(profile.name);
  const [level, setLevel] = useState<CEFRLevel>(profile.level);
  const [autistic, setAutistic] = useState(profile.autisticMode);
  const [font, setFont] = useState(profile.font);

  const finish = () => {
    update({
      name: name.trim() || "there",
      level,
      autisticMode: autistic,
      font,
      onboarded: true,
    });
    router.replace("/");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-content flex-col px-5 py-10">
      <div className="mb-10 flex items-center justify-between">
        <Logo size={56} />
        <span className="text-sm text-ink-subtle">
          Step {step + 1} of 4
        </span>
      </div>

      {/* progress dots */}
      <div className="mb-10 flex gap-2" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-pill transition-colors",
              i <= step ? "bg-accent" : "bg-accent-soft",
            )}
          />
        ))}
      </div>

      <div className="flex-1">
        {step === 0 && (
          <Section
            eyebrow="Welcome"
            title="Speaking, finally made the point."
            description="You already understand English. Molen English Classes flips the usual model: speaking is the spine of every lesson. Let's set you up — it takes a minute."
          >
            <div className="mt-8">
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink">
                What should we call you?
              </label>
              <input
                id="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setStep(1)}
                placeholder="Your first name"
                className="input-field"
              />
            </div>
          </Section>
        )}

        {step === 1 && (
          <Section
            eyebrow="Your level"
            title="Where are you right now?"
            description="Pick the level that feels closest. You can change it anytime in Settings. Your speaking time grows with your level."
          >
            <div className="mt-6 grid gap-2.5">
              {CEFR_LEVELS.map((l) => (
                <button
                  key={l.level}
                  type="button"
                  onClick={() => setLevel(l.level)}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border p-4 text-left transition-colors",
                    level === l.level
                      ? "border-accent bg-accent-soft"
                      : "border-border bg-surface hover:border-accent/50",
                  )}
                  aria-pressed={level === l.level}
                >
                  <span
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                      level === l.level
                        ? "bg-accent text-accent-ink"
                        : "bg-accent-soft text-accent",
                    )}
                  >
                    {l.level}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-ink">{l.name}</span>
                    <span className="block text-sm text-ink-muted">{l.canDo}</span>
                  </span>
                  <span className="ml-auto hidden shrink-0 text-xs font-medium text-ink-subtle sm:block">
                    {Math.round(l.speakingRatio * 100)}% speaking
                  </span>
                </button>
              ))}
            </div>
          </Section>
        )}

        {step === 2 && (
          <Section
            eyebrow="Comfort"
            title="How do you want this to feel?"
            description="These change how the app behaves, not just how it looks. You can switch them anytime."
          >
            <div className="mt-6 space-y-5">
              <div className="card p-5">
                <Toggle
                  label="Autistic / Calm mode"
                  description="Lower contrast, no animations, single-task screens, a fixed agenda before each lesson, literal explanations of idioms, built-in thinking time, and a predictable speaking order. You can always pass."
                  checked={autistic}
                  onChange={setAutistic}
                />
              </div>
              <div className="card p-5">
                <Toggle
                  label="Dyslexia-friendly font"
                  description="Switches to a rounded, well-spaced typeface that's easier to scan."
                  checked={font === "dyslexic"}
                  onChange={(v) => setFont(v ? "dyslexic" : "inter")}
                />
              </div>
            </div>
          </Section>
        )}

        {step === 3 && (
          <Section
            eyebrow="Ready"
            title={`You're set, ${name.trim() || "there"}.`}
            description="Here's how a day works. Each step is built to get you talking."
          >
            <ol className="mt-6 space-y-3">
              {[
                ["Pick a topic", "Anything — even a special interest. We build the class around it."],
                ["Take the class", "A 45–60 min speaking lesson in five clear steps."],
                ["Do the homework", "Four quick skills that recycle today's words."],
                ["Practise live", "Join a Conversation Circle or book a 1:1."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-ink">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block font-semibold text-ink">{t}</span>
                    <span className="block text-sm text-ink-muted">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Section>
        )}
      </div>

      {/* nav buttons */}
      <div className="mt-10 flex items-center justify-between gap-3">
        {step > 0 ? (
          <Button variant="ghost" onClick={() => setStep((s) => (s - 1) as Step)}>
            Back
          </Button>
        ) : (
          <span />
        )}
        {step < 3 ? (
          <Button
            size="lg"
            onClick={() => setStep((s) => (s + 1) as Step)}
            disabled={step === 0 && name.trim().length === 0}
          >
            Continue
          </Button>
        ) : (
          <Button size="lg" onClick={finish}>
            Start learning
          </Button>
        )}
      </div>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="animate-fade-in">
      <p className="text-xs font-semibold uppercase tracking-wider text-accent">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
        {description}
      </p>
      {children}
    </div>
  );
}