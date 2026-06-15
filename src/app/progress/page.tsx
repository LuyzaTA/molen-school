"use client";

import Link from "next/link";
import { useProgress } from "@/context/ProgressContext";
import { useIsClient } from "@/hooks/useIsClient";
import { Card, SectionHeading } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function ProgressPage() {
  const { progress } = useProgress();
  const isClient = useIsClient();

  // Avoid SSR/hydration divergence by zeroing until mounted.
  const p = isClient
    ? progress
    : {
        ...progress,
        streak: 0,
        classesCompleted: 0,
        homeworkCompleted: 0,
        meetingsAttended: 0,
        learnedVocab: [],
        history: [],
      };

  return (
    <div className="mx-auto max-w-content space-y-6">
      <header className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Your progress
        </h1>
        <p className="mt-2 text-[15px] text-ink-muted">
          Gentle signals, not pressure. Every bit of speaking counts.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Metric label="Day streak" value={p.streak} hint="consecutive days" />
        <Metric label="Classes" value={p.classesCompleted} hint="completed" />
        <Metric label="Words learned" value={p.learnedVocab.length} hint="in your pool" />
        <Metric label="Homework" value={p.homeworkCompleted} hint="days finished" />
        <Metric label="Meetings" value={p.meetingsAttended} hint="attended" />
        <Metric
          label="Topics"
          value={new Set(p.history.map((h) => h.topic)).size}
          hint="explored"
        />
      </div>

      {/* Vocabulary pool (spiral review surface) */}
      <Card>
        <SectionHeading
          title="Your vocabulary"
          description="These words spiral back into future classes so they stick."
        />
        {p.learnedVocab.length === 0 ? (
          <EmptyHint
            text="No words yet — finish a class and your vocabulary starts filling up."
          />
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {p.learnedVocab
              .slice(-40)
              .reverse()
              .map((v) => (
                <Badge key={v.term} tone="neutral">
                  {v.term}
                </Badge>
              ))}
          </div>
        )}
      </Card>

      {/* Recent classes */}
      <Card>
        <SectionHeading title="Recent classes" />
        {p.history.length === 0 ? (
          <EmptyHint text="Your class history will appear here." />
        ) : (
          <ul className="divide-y divide-border">
            {p.history.slice(0, 12).map((h, i) => (
              <li key={i} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-ink">{h.topic}</p>
                  <p className="text-xs text-ink-subtle">
                    {new Date(h.date + "T00:00:00").toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <Badge>{h.level}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <Card className="text-center">
      <p className="text-3xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-sm font-medium text-ink">{label}</p>
      <p className="text-xs text-ink-subtle">{hint}</p>
    </Card>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <p className="text-sm text-ink-muted">{text}</p>
      <Link href="/class">
        <Button size="sm" variant="secondary">
          Start a class
        </Button>
      </Link>
    </div>
  );
}