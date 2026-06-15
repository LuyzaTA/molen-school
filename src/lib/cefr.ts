import type { CEFRLevel } from "./types";

export interface CEFRInfo {
  level: CEFRLevel;
  name: string;
  canDo: string; // short can-do description for onboarding
  speakingRatio: number; // share of class spent speaking (A1 0.40 → C2 0.85)
}

export const CEFR_LEVELS: CEFRInfo[] = [
  {
    level: "A1",
    name: "Beginner",
    canDo: "Introduce yourself and ask simple, familiar questions.",
    speakingRatio: 0.4,
  },
  {
    level: "A2",
    name: "Elementary",
    canDo: "Handle short social exchanges about everyday topics.",
    speakingRatio: 0.49,
  },
  {
    level: "B1",
    name: "Intermediate",
    canDo: "Cope with most travel situations and explain opinions.",
    speakingRatio: 0.58,
  },
  {
    level: "B2",
    name: "Upper-Intermediate",
    canDo: "Discuss abstract topics and argue a viewpoint fluently.",
    speakingRatio: 0.67,
  },
  {
    level: "C1",
    name: "Advanced",
    canDo: "Express ideas spontaneously without obvious searching.",
    speakingRatio: 0.76,
  },
  {
    level: "C2",
    name: "Proficient",
    canDo: "Speak effortlessly with precise nuance and idiom.",
    speakingRatio: 0.85,
  },
];

export function getCEFRInfo(level: CEFRLevel): CEFRInfo {
  return CEFR_LEVELS.find((l) => l.level === level) ?? CEFR_LEVELS[2];
}

export function speakingRatioFor(level: CEFRLevel): number {
  return getCEFRInfo(level).speakingRatio;
}