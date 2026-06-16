"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { HBarChart } from "@/components/admin/Charts";
import { WEEKDAYS, type ClassSchedule } from "@/lib/account";
import { CEFR_LEVELS } from "@/lib/cefr";
import { cn } from "@/lib/cn";

interface UserRow {
  userId: string;
  name: string;
  level: string;
  track: string;
  classesThisWeek: number;
  classesTotal: number;
  classDates: { date: string; topic: string; level: string }[];
  schedule: ClassSchedule | null;
  scheduledPerWeek: number;
  weeklyHomeworkDone: number;
  dailyHomeworkDays: number;
  meetingsAttended: number;
  streak: number;
  lastActiveDay: string | null;
  activeThisWeek: boolean;
  vocabTotal: number;
  grammarTotal: number;
}

interface Report {
  weekKey: string;
  weekStart: string;
  weekEnd: string;
  totals: { activeUsers: number; classesThisWeek: number; homeworkThisWeek: number; activeThisWeek: number };
  perLevel: Record<string, { activeUsers: number; classesThisWeek: number; homeworkThisWeek: number; scheduledPerWeek: number; avgClassesPerUser: number }>;
  users: UserRow[];
}

function scheduleText(s: ClassSchedule | null): string {
  if (!s || !s.days.length) return "Not scheduled";
  return `${s.days.map((d) => WEEKDAYS[d]).join(", ")} at ${s.time}`;
}

export default function AdminReportPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/report", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then(setReport)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="py-12 text-center text-ink-subtle">Building report…</p>;
  if (!report) return <p className="py-12 text-center text-ink-subtle">Could not load the report.</p>;

  const levelData = CEFR_LEVELS.map((l) => ({ label: l.level, value: report.perLevel[l.level]?.classesThisWeek ?? 0 }));

  return (
    <div className="mx-auto max-w-wide space-y-6">
      <header className="pt-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Weekly report</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Platform usage</h1>
        <p className="mt-2 text-[15px] text-ink-muted">
          Week {report.weekKey} · {report.weekStart} → {report.weekEnd} · active students only.
        </p>
      </header>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Active students" value={report.totals.activeUsers} />
        <Stat label="Active this week" value={report.totals.activeThisWeek} tone="green" />
        <Stat label="Classes this week" value={report.totals.classesThisWeek} tone="accent" />
        <Stat label="Homework this week" value={report.totals.homeworkThisWeek} tone="gold" />
      </div>

      {/* Per level */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold text-ink">Classes this week · by level</h2>
          <HBarChart data={levelData} tone="accent" />
        </Card>
        <Card>
          <h2 className="mb-3 font-semibold text-ink">Per level</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-subtle">
                  <th className="py-1.5 font-medium">Level</th>
                  <th className="py-1.5 font-medium">Active</th>
                  <th className="py-1.5 font-medium">Classes</th>
                  <th className="py-1.5 font-medium">Avg/user</th>
                  <th className="py-1.5 font-medium">Scheduled</th>
                </tr>
              </thead>
              <tbody>
                {CEFR_LEVELS.map((l) => {
                  const r = report.perLevel[l.level];
                  if (!r || r.activeUsers === 0) return null;
                  return (
                    <tr key={l.level} className="border-t border-border">
                      <td className="py-1.5 font-semibold text-ink">{l.level}</td>
                      <td className="py-1.5 text-ink-muted">{r.activeUsers}</td>
                      <td className="py-1.5 text-ink-muted">{r.classesThisWeek}</td>
                      <td className="py-1.5 text-ink-muted">{r.avgClassesPerUser}</td>
                      <td className="py-1.5 text-ink-muted">{r.scheduledPerWeek}/wk</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Per user */}
      <div>
        <h2 className="mb-3 font-semibold text-ink">Per student</h2>
        {report.users.length === 0 ? (
          <Card className="text-center text-ink-muted">No active students yet.</Card>
        ) : (
          <div className="space-y-3">
            {report.users.map((u) => (
              <Card key={u.userId} className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-ink">{u.name}</span>
                  <span className="font-mono text-xs text-ink-subtle">{u.userId}</span>
                  <Badge tone="neutral">{u.level}</Badge>
                  {u.track === "business" && <Badge tone="accent">Business</Badge>}
                  {u.activeThisWeek ? (
                    <Badge tone="success">Active this week</Badge>
                  ) : (
                    <Badge tone="warning">Idle this week</Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
                  <KPI label="Classes (week)" value={u.classesThisWeek} />
                  <KPI label="Classes (total)" value={u.classesTotal} />
                  <KPI label="Homework (week)" value={u.weeklyHomeworkDone + u.dailyHomeworkDays} />
                  <KPI label="Streak" value={`${u.streak}d`} />
                  <KPI label="Meetings" value={u.meetingsAttended} />
                  <KPI label="Words" value={u.vocabTotal} />
                  <KPI label="Grammar" value={u.grammarTotal} />
                  <KPI label="Last active" value={u.lastActiveDay ?? "—"} />
                </div>

                <div className="rounded-lg bg-base/60 px-3 py-2 text-sm">
                  <span className="font-medium text-ink">Scheduled timing: </span>
                  <span className="text-ink-muted">{scheduleText(u.schedule)}</span>
                </div>

                {u.classDates.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium text-ink">Classes taken this week:</span>
                    <ul className="mt-1 space-y-1">
                      {u.classDates.map((c, i) => (
                        <li key={i} className="text-ink-muted">
                          {c.date} · {c.topic} <span className="text-ink-subtle">({c.level})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "accent" | "green" | "gold" }) {
  const c = tone === "green" ? "text-green" : tone === "gold" ? "text-gold" : tone === "accent" ? "text-accent" : "text-ink";
  return (
    <Card padded={false} className="p-4">
      <div className={cn("text-2xl font-extrabold", c)}>{value}</div>
      <div className="mt-0.5 text-xs text-ink-subtle">{label}</div>
    </Card>
  );
}

function KPI({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div className="text-xs text-ink-subtle">{label}</div>
      <div className="font-semibold text-ink">{value}</div>
    </div>
  );
}
