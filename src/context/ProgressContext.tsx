"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type {
  ProgressState,
  GeneratedClass,
  VocabItem,
  DailyHomework,
} from "@/lib/types";
import { dayKey } from "@/lib/storage";

// ============================================================
// Server-backed app state: progress + homework + weekly completion.
// Loads once from /api/state and write-through saves (debounced) so
// everything lives in Vercel Blob, not the browser.
// ============================================================

interface AppState {
  progress: ProgressState;
  homeworkByDay: Record<string, DailyHomework>;
  weeklyDone: Record<string, boolean>;
}

const DEFAULT_PROGRESS: ProgressState = {
  streak: 0,
  lastActiveDay: null,
  classesCompleted: 0,
  homeworkCompleted: 0,
  meetingsAttended: 0,
  learnedVocab: [],
  history: [],
};

const DEFAULT_STATE: AppState = {
  progress: { ...DEFAULT_PROGRESS },
  homeworkByDay: {},
  weeklyDone: {},
};

interface ProgressContextValue {
  progress: ProgressState;
  ready: boolean;
  completeClass: (klass: GeneratedClass) => void;
  incrementHomework: () => void;
  decrementHomework: () => void;
  attendMeeting: () => void;
  getHomeworkForDay: (day: string) => DailyHomework | null;
  saveHomeworkForDay: (hw: DailyHomework) => void;
  weeklyDone: Record<string, boolean>;
  setWeeklyDone: (key: string, done: boolean) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

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
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);
  const authedRef = useRef(false);
  const stateRef = useRef<AppState>(state);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  stateRef.current = state;

  // Load once from the server.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/state", { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as Partial<AppState>;
          authedRef.current = true;
          setState({
            progress: { ...DEFAULT_PROGRESS, ...(data.progress ?? {}) },
            homeworkByDay: data.homeworkByDay ?? {},
            weeklyDone: data.weeklyDone ?? {},
          });
        }
      } catch {
        /* not authenticated / offline — leave defaults */
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const scheduleSave = useCallback(() => {
    if (!authedRef.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void fetch("/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stateRef.current),
      });
    }, 600);
  }, []);

  const mutate = useCallback(
    (fn: (s: AppState) => AppState) => {
      setState((s) => {
        const next = fn(s);
        stateRef.current = next;
        return next;
      });
      scheduleSave();
    },
    [scheduleSave],
  );

  const bumpStreak = (p: ProgressState): ProgressState => {
    const today = dayKey();
    if (p.lastActiveDay === today) return p;
    let streak = p.streak;
    if (p.lastActiveDay && dayDiff(p.lastActiveDay, today) === 1) streak += 1;
    else streak = 1;
    return { ...p, streak, lastActiveDay: today };
  };

  const completeClass = useCallback(
    (klass: GeneratedClass) =>
      mutate((s) => {
        const p = bumpStreak(s.progress);
        return {
          ...s,
          progress: {
            ...p,
            classesCompleted: p.classesCompleted + 1,
            learnedVocab: mergeVocab(p.learnedVocab, klass.targetLanguage.vocab),
            history: [
              { date: dayKey(), topic: klass.topic, level: klass.level },
              ...p.history,
            ].slice(0, 60),
          },
        };
      }),
    [mutate],
  );

  const incrementHomework = useCallback(
    () =>
      mutate((s) => ({
        ...s,
        progress: { ...s.progress, homeworkCompleted: s.progress.homeworkCompleted + 1 },
      })),
    [mutate],
  );

  const decrementHomework = useCallback(
    () =>
      mutate((s) => ({
        ...s,
        progress: {
          ...s.progress,
          homeworkCompleted: Math.max(0, s.progress.homeworkCompleted - 1),
        },
      })),
    [mutate],
  );

  const attendMeeting = useCallback(
    () =>
      mutate((s) => ({
        ...s,
        progress: { ...s.progress, meetingsAttended: s.progress.meetingsAttended + 1 },
      })),
    [mutate],
  );

  const getHomeworkForDay = useCallback(
    (day: string): DailyHomework | null => stateRef.current.homeworkByDay[day] ?? null,
    [],
  );

  const saveHomeworkForDay = useCallback(
    (hw: DailyHomework) =>
      mutate((s) => ({
        ...s,
        homeworkByDay: { ...s.homeworkByDay, [hw.date]: hw },
      })),
    [mutate],
  );

  const setWeeklyDone = useCallback(
    (key: string, done: boolean) =>
      mutate((s) => {
        const weeklyDone = { ...s.weeklyDone };
        if (done) weeklyDone[key] = true;
        else delete weeklyDone[key];
        return { ...s, weeklyDone };
      }),
    [mutate],
  );

  return (
    <ProgressContext.Provider
      value={{
        progress: state.progress,
        ready,
        completeClass,
        incrementHomework,
        decrementHomework,
        attendMeeting,
        getHomeworkForDay,
        saveHomeworkForDay,
        weeklyDone: state.weeklyDone,
        setWeeklyDone,
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