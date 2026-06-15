"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { ProgressState, GeneratedClass, VocabItem } from "@/lib/types";
import {
  loadProgress,
  saveProgress,
  DEFAULT_PROGRESS,
  dayKey,
} from "@/lib/storage";

interface ProgressContextValue {
  progress: ProgressState;
  ready: boolean;
  completeClass: (klass: GeneratedClass) => void;
  incrementHomework: () => void;
  decrementHomework: () => void;
  attendMeeting: () => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

/** Returns the difference in whole days between two ISO day keys. */
function dayDiff(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / 86_400_000);
}

function mergeVocab(existing: VocabItem[], incoming: VocabItem[]): VocabItem[] {
  const seen = new Set(existing.map((v) => v.term.toLowerCase()));
  const merged = [...existing];
  for (const v of incoming) {
    if (!seen.has(v.term.toLowerCase())) {
      merged.push(v);
      seen.add(v.term.toLowerCase());
    }
  }
  return merged;
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(DEFAULT_PROGRESS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveProgress(progress);
  }, [progress, ready]);

  const bumpStreak = useCallback((p: ProgressState): ProgressState => {
    const today = dayKey();
    if (p.lastActiveDay === today) return p; // already counted today
    let streak = p.streak;
    if (p.lastActiveDay && dayDiff(p.lastActiveDay, today) === 1) {
      streak += 1; // consecutive day
    } else {
      streak = 1; // reset or first day
    }
    return { ...p, streak, lastActiveDay: today };
  }, []);

  const completeClass = useCallback(
    (klass: GeneratedClass) => {
      setProgress((p) => {
        const withStreak = bumpStreak(p);
        return {
          ...withStreak,
          classesCompleted: withStreak.classesCompleted + 1,
          learnedVocab: mergeVocab(
            withStreak.learnedVocab,
            klass.targetLanguage.vocab,
          ),
          history: [
            { date: dayKey(), topic: klass.topic, level: klass.level },
            ...withStreak.history,
          ].slice(0, 60),
        };
      });
    },
    [bumpStreak],
  );

  const incrementHomework = useCallback(() => {
    setProgress((p) => ({ ...p, homeworkCompleted: p.homeworkCompleted + 1 }));
  }, []);

  const decrementHomework = useCallback(() => {
    setProgress((p) => ({
      ...p,
      homeworkCompleted: Math.max(0, p.homeworkCompleted - 1),
    }));
  }, []);

  const attendMeeting = useCallback(() => {
    setProgress((p) => ({ ...p, meetingsAttended: p.meetingsAttended + 1 }));
  }, []);

  const reset = useCallback(() => setProgress(DEFAULT_PROGRESS), []);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        ready,
        completeClass,
        incrementHomework,
        decrementHomework,
        attendMeeting,
        reset,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}