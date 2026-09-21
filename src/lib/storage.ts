import type {
  UserProfile,
  ProgressState,
  DailyHomework,
  GeneratedClass,
} from "./types";
import type { TargetLanguage } from "./language";

// ============================================================
// Typed localStorage helpers. All access goes through here so a
// real backend can be swapped in later by reimplementing these
// functions (e.g. with fetch) without touching the UI.
// ============================================================

const KEYS = {
  profile: "fluentbr.profile",
  progress: "fluentbr.progress",
  homework: "fluentbr.homework", // keyed map by day
  currentClass: "fluentbr.currentClass", // in-progress class (survives refresh)
  weeklyDone: "fluentbr.weeklyDone", // weekly-task completion map
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or privacy mode — fail silently */
  }
}

// ---- Profile ----------------------------------------------

export const DEFAULT_PROFILE: UserProfile = {
  name: "",
  level: "B1",
  autisticMode: false,
  font: "inter",
  theme: "system",
  motion: true,
  translatePt: false,
  track: "general",
  language: "en",
  supportLang: "pt",
  createdAt: new Date().toISOString(),
  onboarded: false,
};

export function loadProfile(): UserProfile {
  return { ...DEFAULT_PROFILE, ...read<Partial<UserProfile>>(KEYS.profile, {}) };
}

export function saveProfile(profile: UserProfile): void {
  write(KEYS.profile, profile);
}

// ---- Progress ---------------------------------------------

export const DEFAULT_PROGRESS: ProgressState = {
  streak: 0,
  lastActiveDay: null,
  classesCompleted: 0,
  homeworkCompleted: 0,
  meetingsAttended: 0,
  learnedVocab: [],
  learnedGrammar: [],
  history: [],
};

export function loadProgress(): ProgressState {
  return {
    ...DEFAULT_PROGRESS,
    ...read<Partial<ProgressState>>(KEYS.progress, {}),
  };
}

export function saveProgress(progress: ProgressState): void {
  write(KEYS.progress, progress);
}

// ---- Homework (map of day -> DailyHomework) ----------------

type HomeworkMap = Record<string, DailyHomework>;

export function loadHomeworkMap(): HomeworkMap {
  return read<HomeworkMap>(KEYS.homework, {});
}

export function loadHomeworkForDay(day: string): DailyHomework | null {
  return loadHomeworkMap()[day] ?? null;
}

export function saveHomeworkForDay(homework: DailyHomework): void {
  const map = loadHomeworkMap();
  map[homework.date] = homework;
  write(KEYS.homework, map);
}

// ---- In-progress class (survives a page refresh) -----------

// Bump this string whenever the class content schema or prompt changes
// significantly. Any saved class from a previous version is discarded so
// users get a fresh, curriculum-aligned class on their next visit.
const CLASS_CONTENT_VERSION = "5"; // bumped: story rebuilt as interactive scenes (dialogue + checks)
const CLASS_VERSION_KEY = "fluentbr.classContentVersion";

// Each course keeps its own in-progress class; English keeps the original key.
function currentClassKey(lang: TargetLanguage): string {
  return lang === "en" ? KEYS.currentClass : `${KEYS.currentClass}.${lang}`;
}

export function loadCurrentClass(lang: TargetLanguage = "en"): GeneratedClass | null {
  if (typeof window === "undefined") return null;
  const savedVersion = window.localStorage.getItem(CLASS_VERSION_KEY);
  if (savedVersion !== CLASS_CONTENT_VERSION) {
    window.localStorage.removeItem(currentClassKey("en"));
    window.localStorage.removeItem(currentClassKey("nl"));
    window.localStorage.setItem(CLASS_VERSION_KEY, CLASS_CONTENT_VERSION);
    return null;
  }
  return read<GeneratedClass | null>(currentClassKey(lang), null);
}

export function saveCurrentClass(
  klass: GeneratedClass | null,
  lang: TargetLanguage = "en",
): void {
  if (klass === null) {
    if (typeof window !== "undefined") window.localStorage.removeItem(currentClassKey(lang));
    return;
  }
  if (typeof window !== "undefined") {
    window.localStorage.setItem(CLASS_VERSION_KEY, CLASS_CONTENT_VERSION);
  }
  write(currentClassKey(lang), klass);
}

// ---- Weekly homework completion ----------------------------

type WeeklyDoneMap = Record<string, boolean>;

export function loadWeeklyDone(): WeeklyDoneMap {
  return read<WeeklyDoneMap>(KEYS.weeklyDone, {});
}

export function setWeeklyDone(key: string, done: boolean): WeeklyDoneMap {
  const map = loadWeeklyDone();
  if (done) map[key] = true;
  else delete map[key];
  write(KEYS.weeklyDone, map);
  return map;
}

// ---- Utilities --------------------------------------------

/** ISO day key, e.g. "2026-06-14". */
export function dayKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

/** ISO week key, e.g. "2026-W24" — used to scope weekly homework. */
export function weekKey(d: Date = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = (date.getUTCDay() + 6) % 7; // Mon=0
  date.setUTCDate(date.getUTCDate() - dayNum + 3); // nearest Thursday
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const week =
    1 +
    Math.round(
      ((date.getTime() - firstThursday.getTime()) / 86_400_000 -
        3 +
        ((firstThursday.getUTCDay() + 6) % 7)) /
        7,
    );
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function clearAll(): void {
  if (typeof window === "undefined") return;
  Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
}