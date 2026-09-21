// ============================================================
// Target languages the school teaches, and the support languages
// a Dutch learner can be taught from. Shared by client and server.
//
// Each target language is its own track: a student chosen at login
// sees that language's level, progress, homework, meetings, and
// resources. The admin works the same way (one language at a time).
// ============================================================

export type TargetLanguage = "en" | "nl";

/** Language used for explanations/translations in the Dutch course. */
export type SupportLanguage = "en" | "pt";

export const TARGET_LANGUAGES: TargetLanguage[] = ["en", "nl"];

/** Cookie holding the language chosen at sign-in (read by API routes). */
export const LANG_COOKIE = "mes_lang";

export interface LanguageInfo {
  code: TargetLanguage;
  name: string; // English name, used in UI copy ("Speak Dutch")
  nativeName: string; // shown on the language picker
  brand: string; // wordmark subtitle ("Dutch Classes")
  namePt: string; // Portuguese name, for PT-language pages ("holandês")
}

export const LANGUAGES: Record<TargetLanguage, LanguageInfo> = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    brand: "English Classes",
    namePt: "inglês",
  },
  nl: {
    code: "nl",
    name: "Dutch",
    nativeName: "Nederlands",
    brand: "Dutch Classes",
    namePt: "holandês",
  },
};

export const SUPPORT_LANGUAGES: { code: SupportLanguage; label: string }[] = [
  { code: "en", label: "English" },
  { code: "pt", label: "Português" },
];

export function isTargetLanguage(v: unknown): v is TargetLanguage {
  return v === "en" || v === "nl";
}

export function isSupportLanguage(v: unknown): v is SupportLanguage {
  return v === "en" || v === "pt";
}

export function brandName(lang: TargetLanguage): string {
  return `Molen ${LANGUAGES[lang].brand}`;
}
