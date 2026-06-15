"use client";

import type { GeneratedClass } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

/**
 * Shown before the lesson starts. In calm mode this is a required,
 * predictable preview of the whole agenda. For everyone else it's a
 * reassuring "here's the plan" screen.
 */
export function AgendaPreview({
  klass,
  onStart,
  autistic,
  onRegenerate,
  onChangeTopic,
}: {
  klass: GeneratedClass;
  onStart: () => void;
  autistic: boolean;
  onRegenerate?: () => void;
  onChangeTopic?: () => void;
}) {
  return (
    <div className="mx-auto max-w-content space-y-6">
      <header className="pt-2">
        <Badge tone="accent">
          {klass.level} · ~{klass.estimatedMinutes} min · {Math.round(klass.speakingRatio * 100)}% speaking
        </Badge>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Your class: {klass.topic}
        </h1>
        <p className="mt-2 text-[15px] text-ink-muted">
          {autistic
            ? "Here is the full plan for today. Every step is listed in order so you know exactly what's coming. You can pass on any speaking prompt."
            : "Here's the plan. Five steps, all built to get you talking."}
        </p>
      </header>

      <Card>
        <ol className="space-y-3">
          {klass.agenda.map((label, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent">
                {i + 1}
              </span>
              <span className="pt-1 text-[15px] text-ink">{label}</span>
            </li>
          ))}
        </ol>
      </Card>

      {klass.generatedBy === "mock" && (
        <p className="text-center text-xs text-ink-subtle">
          Showing an offline sample class (AI generation unavailable). The
          structure is identical to a live class.
        </p>
      )}

      <Button size="lg" block onClick={onStart}>
        Start step 1 →
      </Button>

      {(onRegenerate || onChangeTopic) && (
        <div className="flex flex-wrap justify-center gap-4 pt-1 text-sm">
          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              className="font-medium text-ink-muted underline-offset-2 hover:text-ink hover:underline"
            >
              Regenerate this class
            </button>
          )}
          {onChangeTopic && (
            <button
              type="button"
              onClick={onChangeTopic}
              className="font-medium text-ink-muted underline-offset-2 hover:text-ink hover:underline"
            >
              Pick a different topic
            </button>
          )}
        </div>
      )}
    </div>
  );
}