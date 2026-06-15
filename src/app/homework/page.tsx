"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type {
  DailyHomework,
  HomeworkTask,
  HomeworkSkill,
  WeeklyTask,
} from "@/lib/types";
import { dayKey, weekKey } from "@/lib/storage";
import { getWeeklyPlan } from "@/lib/weeklyHomework";
import { useProgress } from "@/context/ProgressContext";
import { useSettings } from "@/context/SettingsContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PtToggle } from "@/components/ui/PtToggle";
import { VoiceRecorder } from "@/components/homework/VoiceRecorder";
import { cn } from "@/lib/cn";

const SKILL_LABEL: Record<HomeworkSkill, string> = {
  speaking: "Speaking",
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
};

type Tab = "today" | "week";

export default function HomeworkPage() {
  const { profile } = useSettings();
  const [tab, setTab] = useState<Tab>("today");

  return (
    <div className="mx-auto max-w-content space-y-6">
      <header className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Homework
        </h1>
        <p className="mt-2 text-[15px] text-ink-muted">
          Today&apos;s class homework, plus a weekly plan tailored to your level.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 rounded-pill bg-accent-soft p-1">
            <TabBtn active={tab === "today"} onClick={() => setTab("today")}>
              Today
            </TabBtn>
            <TabBtn active={tab === "week"} onClick={() => setTab("week")}>
              This week
            </TabBtn>
          </div>
          {profile.level === "A1" && <PtToggle />}
        </div>
      </header>

      {tab === "today" ? <TodayHomework /> : <WeeklyHomework />}
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-pill px-4 py-1.5 text-sm font-medium transition-colors",
        active ? "bg-surface text-ink shadow-sm" : "text-ink-muted hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

// ============================================================
// Today — homework generated from the daily class
// ============================================================

function TodayHomework() {
  const {
    ready,
    getHomeworkForDay,
    saveHomeworkForDay,
    incrementHomework,
    decrementHomework,
  } = useProgress();
  const [homework, setHomework] = useState<DailyHomework | null | undefined>(
    undefined,
  );

  // Hydrate from server-backed state once it has loaded.
  useEffect(() => {
    if (ready) setHomework(getHomeworkForDay(dayKey()));
  }, [ready, getHomeworkForDay]);

  function persist(next: DailyHomework) {
    const allDone = next.tasks.every((t) => t.done);
    if (allDone && !next.countedComplete) {
      next.countedComplete = true;
      incrementHomework();
    } else if (!allDone && next.countedComplete) {
      next.countedComplete = false;
      decrementHomework();
    }
    saveHomeworkForDay(next);
    setHomework({ ...next });
  }

  function toggleTask(index: number) {
    if (!homework) return;
    const tasks = homework.tasks.map((t, i) =>
      i === index ? { ...t, done: !t.done } : t,
    );
    persist({ ...homework, tasks });
  }

  if (homework === undefined) {
    return <p className="py-12 text-center text-ink-subtle">Loading…</p>;
  }

  if (homework === null) {
    return (
      <Card className="space-y-4 text-center">
        <h2 className="text-lg font-semibold text-ink">No homework yet today</h2>
        <p className="text-[15px] text-ink-muted">
          Today&apos;s homework is generated from your daily class and recycles the
          words you learned. Take today&apos;s class first — or try the weekly plan.
        </p>
        <Link href="/class" className="inline-block">
          <Button size="lg">Start today&apos;s class</Button>
        </Link>
      </Card>
    );
  }

  const doneCount = homework.tasks.filter((t) => t.done).length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-ink-subtle">
          From today&apos;s class · {homework.topic}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <ProgressBar value={doneCount} max={homework.tasks.length} label="Homework progress" />
          <span className="shrink-0 text-sm font-medium text-ink-muted">
            {doneCount}/{homework.tasks.length}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {homework.tasks.map((task, i) => (
          <TaskCard
            key={task.skill}
            task={task}
            label={SKILL_LABEL[task.skill]}
            onToggle={() => toggleTask(i)}
          />
        ))}
      </div>

      {doneCount === homework.tasks.length && (
        <Card className="border-success/40 bg-success/5 text-center">
          <p className="font-semibold text-ink">All done for today. 🎯</p>
          <p className="mt-1 text-sm text-ink-muted">
            That&apos;s a full speak-listen-read-write loop. See you tomorrow.
          </p>
        </Card>
      )}
    </div>
  );
}

function TaskCard({
  task,
  label,
  onToggle,
}: {
  task: HomeworkTask;
  label: string;
  onToggle: () => void;
}) {
  return (
    <Card className={cn(task.done && "border-success/40")}>
      <div className="flex items-start gap-3">
        <Check done={task.done} onToggle={onToggle} label={label} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">{label}</Badge>
            <h3 className={cn("font-semibold text-ink", task.done && "line-through opacity-60")}>
              {task.title}
            </h3>
          </div>
          <p className="mt-1.5 text-sm text-ink-muted">{task.instructions}</p>

          {task.skill === "speaking" && (
            <div className="mt-3">
              <VoiceRecorder targetSeconds={task.recordingSeconds ?? 75} />
            </div>
          )}
          {task.skill === "listening" && task.questions && (
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-ink-muted">
              {task.questions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ol>
          )}
          {task.skill === "reading" && task.text && (
            <p className="mt-3 rounded-lg bg-base/60 px-3 py-2 text-sm text-ink-muted">
              {task.text}
            </p>
          )}
          {task.skill === "writing" && task.targetWords && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="text-xs font-medium text-ink-subtle">Reuse:</span>
              {task.targetWords.map((w) => (
                <Badge key={w} tone="accent">
                  {w}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

// ============================================================
// This week — curated plan per CEFR level
// ============================================================

function WeeklyHomework() {
  const { profile } = useSettings();
  const { weeklyDone: done, setWeeklyDone } = useProgress();
  const showPt = profile.level === "A1" && profile.translatePt;
  const plan = getWeeklyPlan(profile.level);
  const wk = weekKey();

  const keyFor = (dayIdx: number, taskIdx: number) =>
    `${profile.level}:${wk}:${dayIdx}:${taskIdx}`;

  function toggle(dayIdx: number, taskIdx: number) {
    const k = keyFor(dayIdx, taskIdx);
    setWeeklyDone(k, !done[k]);
  }

  const total = plan.days.reduce((n, d) => n + d.tasks.length, 0);
  const completed = plan.days.reduce(
    (n, d, di) => n + d.tasks.filter((_, ti) => done[keyFor(di, ti)]).length,
    0,
  );

  return (
    <div className="space-y-6">
      <Card className="surface-grad">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          {profile.level} · weekly focus
        </p>
        <p className="mt-1.5 text-[15px] font-medium text-ink">{plan.focus}</p>
        {showPt && plan.focusPt && (
          <p className="mt-1 text-sm italic text-accent">🇧🇷 {plan.focusPt}</p>
        )}
        <div className="mt-4 flex items-center gap-3">
          <ProgressBar value={completed} max={total} label="Weekly progress" />
          <span className="shrink-0 text-sm font-medium text-ink-muted">
            {completed}/{total}
          </span>
        </div>
      </Card>

      <div className="space-y-4">
        {plan.days.map((day, di) => (
          <Card key={day.day}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold text-ink">{day.day}</h3>
              <Badge tone="neutral">{day.theme}</Badge>
            </div>
            <div className="space-y-3">
              {day.tasks.map((task, ti) => (
                <WeeklyTaskRow
                  key={ti}
                  task={task}
                  done={!!done[keyFor(di, ti)]}
                  showPt={showPt}
                  onToggle={() => toggle(di, ti)}
                />
              ))}
            </div>
          </Card>
        ))}
      </div>

      {completed === total && total > 0 && (
        <Card className="border-success/40 bg-success/5 text-center">
          <p className="font-semibold text-ink">Weekly plan complete. 🌟</p>
          <p className="mt-1 text-sm text-ink-muted">
            Five days of focused practice — that&apos;s how speaking gets automatic.
          </p>
        </Card>
      )}
    </div>
  );
}

function WeeklyTaskRow({
  task,
  done,
  showPt,
  onToggle,
}: {
  task: WeeklyTask;
  done: boolean;
  showPt: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-3">
      <Check done={done} onToggle={onToggle} label={task.title} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="neutral">{SKILL_LABEL[task.skill]}</Badge>
          <span className={cn("font-medium text-ink", done && "line-through opacity-60")}>
            {task.title}
          </span>
        </div>
        <p className="mt-1 text-sm text-ink-muted">{task.detail}</p>
        {showPt && task.detailPt && (
          <p className="mt-1 text-sm italic text-accent">🇧🇷 {task.detailPt}</p>
        )}
      </div>
    </div>
  );
}

// Shared checkbox
function Check({
  done,
  onToggle,
  label,
}: {
  done: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={done}
      aria-label={`Mark "${label}" ${done ? "incomplete" : "complete"}`}
      className={cn(
        "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
        done ? "border-success bg-success text-white" : "border-border hover:border-accent",
      )}
    >
      {done && (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={3}>
          <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
