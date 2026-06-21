"use client";

import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";
import { useProgress } from "@/context/ProgressContext";
import { useIsClient } from "@/hooks/useIsClient";
import { Card } from "@/components/ui/Card";
import { WindmillMark } from "@/components/ui/WindmillMark";
import { getCEFRInfo } from "@/lib/cefr";
import { CONVERSATION_CIRCLES } from "@/lib/mockData";
import { cn } from "@/lib/cn";

export default function DashboardPage() {
  const { profile } = useSettings();
  const { progress } = useProgress();
  const isClient = useIsClient();

  const business = profile.track === "business";
  const info = getCEFRInfo(profile.level);
  const nextCircle = [...CONVERSATION_CIRCLES].sort(
    (a, b) => +new Date(a.dateTime) - +new Date(b.dateTime),
  )[0];

  return (
    <div className="mx-auto max-w-content space-y-8">
      {/* ---- Inspiring hero ---- */}
      <section className="hero-grad relative overflow-hidden rounded-[28px] px-6 py-10 text-accent-ink sm:px-10 sm:py-12">
        <div
          aria-hidden
          className="decor animate-float absolute -right-12 -top-12 h-52 w-52 rounded-full bg-gold/50"
        />
        <div
          aria-hidden
          className="decor animate-float-slow absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-green/40"
        />
        <div className="relative">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <WindmillMark size={64} className="drop-shadow-md" />
            <span className="rounded-pill bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur">
              {business ? "Business Vocabulary" : `${profile.level} · ${info.name}`}
            </span>
          </div>

          <p className="text-sm font-medium text-accent-ink/80">
            {greeting()}, {profile.name || "there"}.
          </p>
          <h1 className="mt-1 text-3xl font-extrabold leading-tight tracking-tight sm:text-[2.6rem]">
            {business ? (
              <>
                Today is a great day
                <br />
                to speak Business English.
              </>
            ) : (
              <>
                Today is a great day
                <br />
                to speak English.
              </>
            )}
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-accent-ink/90">
            {business
              ? "Build confidence for meetings, emails, and negotiations. Pick a work situation and we'll turn it into a speaking class."
              : "You already understand it. Pick something you love, and we'll build a class that gets the words out of your head and into the air."}
          </p>

          <Link href="/class" className="mt-7 inline-block">
            {/* Light: dark mill-tile button with cream text. Dark mode: invert
                to a cream button with dark text (better contrast on the dark hero). */}
            <span className="inline-flex items-center gap-2 rounded-xl bg-mark px-7 py-3.5 text-base font-bold text-[#FBF4E6] shadow-lg transition-transform hover:-translate-y-0.5 dark:bg-[#F4ECDA] dark:text-mark">
              Start today&apos;s class
              <span aria-hidden>→</span>
            </span>
          </Link>
        </div>
      </section>

      {/* ---- Stats ---- */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Stat
          tone="gold"
          label="Day streak"
          value={isClient ? progress.streak : 0}
          icon="🔥"
        />
        <Stat
          tone="teal"
          label="Classes"
          value={isClient ? progress.classesCompleted : 0}
          icon="🎓"
        />
        <Stat
          tone="green"
          label="Words"
          value={isClient ? progress.learnedVocab.length : 0}
          icon="💬"
        />
      </div>

      {/* ---- Pathways ---- */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-ink">Your day, step by step</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FeatureCard
            href="/homework"
            accent="green"
            emoji="📝"
            title="Homework"
            desc="Four short skills that recycle today's vocabulary — speak, listen, read, write."
            cta="Open homework"
          />
          <FeatureCard
            href="/meetings"
            accent="gold"
            emoji="🎙️"
            title={nextCircle ? nextCircle.title.replace(/^Monthly Conversation Circle — /, "Circle: ") : "Live practice"}
            desc={
              nextCircle
                ? `Next up with ${nextCircle.speaker.name} · ${nextCircle.levelRange}`
                : "Join a Conversation Circle or book a 1:1 with a coach."
            }
            cta="See meetings"
          />
          <FeatureCard
            href="/resources"
            accent="teal"
            emoji="🎧"
            title="Resources"
            desc="Free podcasts, platforms, and communities to keep speaking between classes."
            cta="Browse library"
          />
          <FeatureCard
            href="/progress"
            accent="green"
            emoji="📈"
            title="Progress"
            desc="Your streak, words learned, and class history — calm signals, no pressure."
            cta="View progress"
          />
        </div>
      </section>

      {/* ---- Grammar reference ---- */}
      <Link href="/sos-gramatica" className="group block">
        <Card className="flex items-center gap-4 transition-all group-hover:-translate-y-0.5 group-hover:border-accent/60">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-2xl">
            📖
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-ink">SOS Gramática</h3>
            <p className="mt-0.5 text-sm text-ink-muted">
              Referência rápida: as 10 classes gramaticais em Português → Inglês. Sempre à mão.
            </p>
          </div>
          <span className="shrink-0 text-sm font-semibold text-accent">Ver guia →</span>
        </Card>
      </Link>

    </div>
  );
}

function Stat({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: string;
  tone: "teal" | "green" | "gold";
}) {
  const ring = {
    teal: "bg-accent-soft text-accent",
    green: "bg-green-soft text-green",
    gold: "bg-gold-soft text-gold",
  }[tone];
  return (
    <Card padded={false} className="flex flex-col items-center justify-center p-4 text-center">
      <span className={cn("mb-2 flex h-10 w-10 items-center justify-center rounded-xl text-lg", ring)}>
        {icon}
      </span>
      <span className="text-2xl font-extrabold text-ink">{value}</span>
      <span className="mt-0.5 text-xs text-ink-subtle">{label}</span>
    </Card>
  );
}

function FeatureCard({
  href,
  emoji,
  title,
  desc,
  cta,
  accent,
}: {
  href: string;
  emoji: string;
  title: string;
  desc: string;
  cta: string;
  accent: "teal" | "green" | "gold";
}) {
  const badge = {
    teal: "bg-accent-soft text-accent",
    green: "bg-green-soft text-green",
    gold: "bg-gold-soft text-gold",
  }[accent];
  return (
    <Link href={href} className="group">
      <Card className="flex h-full flex-col transition-all group-hover:-translate-y-0.5 group-hover:border-accent/60">
        <span className={cn("flex h-12 w-12 items-center justify-center rounded-xl text-2xl", badge)}>
          {emoji}
        </span>
        <h3 className="mt-4 font-bold text-ink">{title}</h3>
        <p className="mt-1 flex-1 text-sm text-ink-muted">{desc}</p>
        <span className="mt-4 text-sm font-semibold text-accent">{cta} →</span>
      </Card>
    </Link>
  );
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}