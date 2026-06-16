"use client";

import { cn } from "@/lib/cn";

type Tone = "accent" | "green" | "gold";

const BAR: Record<Tone, string> = {
  accent: "bg-accent",
  green: "bg-green",
  gold: "bg-gold",
};

/** Horizontal labelled bars — good for categorical counts (e.g. per level). */
export function HBarChart({
  data,
  tone = "accent",
}: {
  data: { label: string; value: number }[];
  tone?: Tone;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="space-y-2.5">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-16 shrink-0 text-sm font-medium text-ink-muted">{d.label}</span>
          <div className="h-5 flex-1 overflow-hidden rounded-md bg-base">
            <div
              className={cn("h-full rounded-md transition-[width]", BAR[tone])}
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
          <span className="w-7 shrink-0 text-right text-sm font-semibold text-ink">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

/** Vertical columns for a daily time series. */
export function ColumnChart({
  data,
  tone = "green",
}: {
  data: { date: string; count: number }[];
  tone?: Tone;
}) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="flex h-40 items-end gap-1">
      {data.map((d) => {
        const day = d.date.slice(8, 10);
        return (
          <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex h-32 w-full items-end">
              <div
                title={`${d.date}: ${d.count}`}
                className={cn("w-full rounded-t-sm", BAR[tone], d.count === 0 && "opacity-30")}
                style={{ height: `${Math.max(3, (d.count / max) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-ink-subtle">{day}</span>
          </div>
        );
      })}
    </div>
  );
}
