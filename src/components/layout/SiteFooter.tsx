"use client";

import type { ReactNode } from "react";
import { useSettings } from "@/context/SettingsContext";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";

/**
 * Site-wide footer with a prominent Accessibility & neurodivergent-needs
 * section. The first three cards are live controls wired to the global
 * settings; the rest describe behaviours the app guarantees.
 */
export function SiteFooter() {
  const { profile, update, toggleAutistic } = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-16 overflow-hidden border-t border-border">
      {/* Decorative colour wash (hidden in calm mode) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 surface-grad opacity-60" />
      <div
        aria-hidden
        className="decor animate-float-slow absolute -left-16 top-10 h-56 w-56 rounded-full bg-green/40"
      />
      <div
        aria-hidden
        className="decor animate-float absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-gold/30"
      />

      <div className="relative mx-auto max-w-wide px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-content text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Accessibility &amp; neurodivergent needs
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Built for <span className="text-grad">every mind</span>.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-ink-muted">
            Learning to speak shouldn&apos;t cost you comfort. These supports are
            first-class, not afterthoughts — turn them on any time, and the whole
            app adapts its behaviour, not just its looks.
          </p>
        </div>

        {/* Live controls */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <ControlCard
            active={profile.autisticMode}
            onToggle={toggleAutistic}
            title="Calm / Autistic mode"
            desc="Lower contrast, no animation, single-task screens, a fixed agenda before each lesson, and idioms explained literally."
            icon={
              <Glyph>
                <path d="M12 3a4 4 0 0 1 4 4c0 1.5-.8 2.4-1.5 3.2C13.9 11 13 12 13 14M12 17.5h.01" />
                <circle cx="12" cy="12" r="9.5" />
              </Glyph>
            }
          />
          <ControlCard
            active={profile.font === "dyslexic"}
            onToggle={() => update({ font: profile.font === "dyslexic" ? "inter" : "dyslexic" })}
            title="Dyslexia-friendly font"
            desc="A rounded, generously spaced typeface that's easier to track across a line of text."
            icon={
              <Glyph>
                <path d="M4 7V5h16v2M9 5v14M9 19H7M9 19h2" />
              </Glyph>
            }
          />
          <ControlCard
            active={!profile.motion || profile.autisticMode}
            disabled={profile.autisticMode}
            onToggle={() => update({ motion: !profile.motion })}
            title="Reduced motion"
            desc="Stops animations and movement. Always on in Calm mode and when your device prefers reduced motion."
            icon={
              <Glyph>
                <path d="M5 12h14M12 5v14" />
                <circle cx="12" cy="12" r="9.5" />
              </Glyph>
            }
          />
        </div>

        {/* Described guarantees */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard
            title="You may always pass"
            desc="No one is ever forced to perform. Every speaking prompt has a clear, judgement-free pass."
          />
          <InfoCard
            title="Predictable structure"
            desc="The full lesson agenda is previewed up front, and every step says exactly what you'll do."
          />
          <InfoCard
            title="Built-in thinking time"
            desc="Prompts come in writing as well as speech, with space to process before you respond."
          />
          <InfoCard
            title="Concrete feedback"
            desc="Specific, literal feedback — never a vague 'good job'. You always know what to repeat or fix."
          />
          <InfoCard
            title="Keyboard & screen-reader friendly"
            desc="Full keyboard navigation, visible focus rings, semantic markup, and labelled controls throughout."
          />
          <InfoCard
            title="WCAG AA+ contrast"
            desc="Colour and type meet or exceed AA contrast in every theme, including dark mode."
          />
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center gap-4 border-t border-border/70 pt-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <Logo size={40} />
          <p className="text-sm text-ink-subtle">
            Speak with confidence. © {year} Molen English Classes.
            <br className="sm:hidden" />{" "}
            <span className="text-ink-subtle/80">
              Your data stays on this device.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function ControlCard({
  active,
  disabled,
  onToggle,
  title,
  desc,
  icon,
}: {
  active: boolean;
  disabled?: boolean;
  onToggle: () => void;
  title: string;
  desc: string;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        "group flex flex-col rounded-card border p-5 text-left transition-colors",
        active
          ? "border-accent bg-accent-soft"
          : "border-border bg-surface hover:border-accent/60",
        disabled && "cursor-not-allowed opacity-70",
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl",
            active ? "bg-accent text-accent-ink" : "bg-accent-soft text-accent",
          )}
        >
          {icon}
        </span>
        <span
          className={cn(
            "relative h-7 w-12 shrink-0 rounded-pill border transition-colors",
            active ? "border-accent bg-accent" : "border-border bg-surface",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
              active ? "translate-x-[22px]" : "translate-x-0.5",
            )}
          />
        </span>
      </div>
      <h3 className="mt-4 font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-ink-muted">{desc}</p>
      <span className="mt-3 text-xs font-semibold uppercase tracking-wide text-accent">
        {active ? "On" : disabled ? "On (in Calm mode)" : "Tap to turn on"}
      </span>
    </button>
  );
}

function InfoCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-card border border-border bg-surface/80 p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-soft text-green">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3}>
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <h3 className="font-semibold text-ink">{title}</h3>
          <p className="mt-1 text-sm text-ink-muted">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      {children}
    </svg>
  );
}