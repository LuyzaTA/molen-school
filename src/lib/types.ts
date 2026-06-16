// ============================================================
// Shared types for Molen English School. These define the contract between
// the AI class generator, localStorage, and the UI.
// ============================================================

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type FontPreference = "inter" | "dyslexic";
export type ThemePreference = "light" | "dark" | "system";

export interface UserProfile {
  name: string;
  level: CEFRLevel;
  autisticMode: boolean;
  font: FontPreference;
  theme: ThemePreference;
  motion: boolean; // true = animations allowed
  // A1 learners only: show Brazilian-Portuguese translations alongside content.
  // Ignored (and hidden) at every other level — they work in English only.
  translatePt: boolean;
  // Active learning track: general CEFR English or Business Vocabulary.
  track: LearningTrack;
  createdAt: string; // ISO date
  onboarded: boolean;
}

// ---- Generated class content (returned by the AI) ----------

export interface WarmUpStep {
  questions: string[]; // 3 personal questions
  questionsPt?: string[]; // A1: PT translations, parallel to questions
}

export interface VocabItem {
  term: string;
  meaning: string; // plain explanation
  example: string; // example sentence
  isIdiom?: boolean; // flagged + explained literally in autistic mode
  literalMeaning?: string; // for idioms
  meaningPt?: string; // A1: Brazilian-Portuguese translation of the meaning
}

export interface TargetLanguageStep {
  vocab: VocabItem[]; // 8-12 words/phrases
  structures: { pattern: string; example: string }[]; // 2 structures
}

export interface GuidedProductionStep {
  intro: string;
  sentenceFrames: string[]; // fill-in frames
  rolePlay?: { scenario: string; roles: string[] };
  picturePrompts?: string[];
}

export interface FreeProductionStep {
  intro: string;
  prompts: string[]; // discussion / debate / storytelling prompts
  format: "discussion" | "debate" | "storytelling";
}

export interface FeedbackStep {
  intro: string;
  checklist: string[]; // self-correction checklist items
  commonErrors: string[]; // concrete things to listen for
}

export interface GeneratedClass {
  topic: string;
  level: CEFRLevel;
  autisticMode: boolean;
  speakingRatio: number; // 0-1, share of time spent speaking
  estimatedMinutes: number;
  agenda: string[]; // human-readable step labels (for autistic-mode preview)
  warmUp: WarmUpStep;
  targetLanguage: TargetLanguageStep;
  guidedProduction: GuidedProductionStep;
  freeProduction: FreeProductionStep;
  feedback: FeedbackStep;
  grammar: string[]; // named grammar points practised (e.g. "Possessive pronouns")
  track?: LearningTrack; // "general" (CEFR) or "business" vocabulary focus
  generatedBy: "ai" | "mock"; // provenance, so UI can flag offline fallback
}

export type LearningTrack = "general" | "business";

export interface ClassGenInput {
  topic: string;
  level: CEFRLevel;
  autisticMode: boolean;
  track?: LearningTrack;
  knownVocab?: string[]; // spiral review: surface earlier vocab
}

// ---- Homework ---------------------------------------------

export type HomeworkSkill = "speaking" | "listening" | "reading" | "writing";

export interface HomeworkTask {
  skill: HomeworkSkill;
  title: string;
  instructions: string;
  done: boolean;
  // skill-specific extras
  questions?: string[]; // listening
  text?: string; // reading passage
  targetWords?: string[]; // writing must reuse these
  minWords?: number;
  maxWords?: number;
  recordingSeconds?: number; // speaking target length
}

export interface DailyHomework {
  date: string; // ISO day key
  topic: string;
  tasks: HomeworkTask[];
  countedComplete?: boolean; // true once this day's full completion was scored
}

// ---- Weekly homework (curated per CEFR level) -------------

export interface WeeklyTask {
  skill: HomeworkSkill;
  title: string;
  detail: string;
  detailPt?: string; // A1 only
}

export interface WeeklyDay {
  day: string; // e.g. "Monday"
  theme: string;
  tasks: WeeklyTask[];
}

export interface WeeklyPlan {
  level: CEFRLevel;
  focus: string;
  focusPt?: string; // A1 only
  days: WeeklyDay[];
}

// ---- Progress ---------------------------------------------

export interface ProgressState {
  streak: number;
  lastActiveDay: string | null; // ISO day
  classesCompleted: number;
  homeworkCompleted: number;
  meetingsAttended: number;
  learnedVocab: VocabItem[]; // spiral review pool
  learnedGrammar: string[]; // grammar points covered across classes
  history: ClassHistoryEntry[];
}

export interface ClassHistoryEntry {
  date: string;
  topic: string;
  level: CEFRLevel;
}

// ---- Meetings (mock data in v1) ---------------------------

export type SpeakerBadge = "Native (US)" | "Native (UK)" | "Fluent C2 (BR)";

export interface Speaker {
  id: string;
  name: string;
  badge: SpeakerBadge;
  bio: string;
}

export interface ConversationCircle {
  id: string;
  title: string;
  speaker: Speaker;
  dateTime: string; // ISO
  format: string; // e.g. "Small group (6) · video"
  theme: string;
  levelRange: string; // e.g. "B1–B2"
  prepPackReleasesAt: string; // ISO, 48h before
  prepPack: { phrases: string[]; warmUpQuestions: string[] };
}

export interface BookingSlot {
  id: string;
  speakerId: string;
  speaker?: Speaker; // embedded so admin-created slots resolve without a table
  dateTime: string; // ISO
  durationMin: number;
  kind: "1:1" | "small-group";
  capacity: number;
  booked: number;
}

/** Admin-managed meetings shown to students on the Meetings page. */
export interface MeetingsConfig {
  circles: ConversationCircle[];
  slots: BookingSlot[];
}

// ---- Resources --------------------------------------------

export type ResourceCategory = "podcast" | "platform" | "community";

export interface ResourceItem {
  name: string;
  category: ResourceCategory;
  free: boolean;
  description: string;
  url: string;
}