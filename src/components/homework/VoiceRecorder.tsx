"use client";

import { useMediaRecorder } from "@/hooks/useMediaRecorder";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Browser MediaRecorder voice note. Records, shows elapsed time, and
 * plays back. v1 keeps the audio in-memory (object URL) only.
 */
export function VoiceRecorder({ targetSeconds = 75 }: { targetSeconds?: number }) {
  const { status, seconds, audioUrl, start, stop, reset, supported } =
    useMediaRecorder();

  if (!supported) {
    return (
      <p className="rounded-lg bg-warning/10 px-3 py-2 text-sm text-ink-muted">
        Recording isn&apos;t supported in this browser. You can still practise
        out loud and tick the task when done.
      </p>
    );
  }

  if (status === "denied") {
    return (
      <div className="space-y-2">
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-ink-muted">
          Microphone access was blocked. Allow it in your browser, or just
          practise out loud and tick the task.
        </p>
        <Button variant="secondary" size="sm" onClick={reset}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-3 w-3 rounded-full",
              status === "recording" ? "animate-pulse bg-danger" : "bg-ink-subtle",
            )}
          />
          <span className="font-mono text-lg tabular-nums text-ink">
            {fmt(seconds)}
          </span>
          <span className="text-xs text-ink-subtle">target ~{fmt(targetSeconds)}</span>
        </div>

        {status === "idle" && (
          <Button size="sm" onClick={start}>
            Record
          </Button>
        )}
        {status === "recording" && (
          <Button size="sm" variant="danger" onClick={stop}>
            Stop
          </Button>
        )}
        {status === "stopped" && (
          <Button size="sm" variant="secondary" onClick={reset}>
            Re-record
          </Button>
        )}
      </div>

      {audioUrl && status === "stopped" && (
        <audio controls src={audioUrl} className="mt-3 w-full">
          <track kind="captions" />
        </audio>
      )}
    </div>
  );
}