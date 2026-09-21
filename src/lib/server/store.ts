import "server-only";
import { createHash } from "crypto";
import { kvGet, kvSet, kvExists, kvList, kvDelete } from "./blobKV";
import type {
  AccountSettings,
  PaymentMethod,
  ClassSchedule,
  PricingMap,
  LanguageTrackRecord,
} from "../account";
import type { TargetLanguage, SupportLanguage } from "../language";
import { digitsOnly, genUserId, DEFAULT_PRICING } from "../account";
import type {
  CEFRLevel,
  LearningTrack,
  ProgressState,
  DailyHomework,
  MeetingsConfig,
  ResourceItem,
} from "../types";

// ---- Records ----------------------------------------------

export interface AccountRecord {
  userId: string; // "M######" — unique, auto-generated
  isAdmin: boolean;
  name: string;
  rg: string;
  cpf: string; // digits only
  address: string;
  city: string;
  state: string;
  country: string;
  paymentMethod: PaymentMethod;
  passwordHash: string;
  level: CEFRLevel;
  registeredTrack?: LearningTrack; // set at registration; authoritative source of truth
  settings: AccountSettings;
  approved: boolean; // admin must approve before platform access
  active: boolean; // admin can deactivate a student
  schedule: ClassSchedule | null; // recurring weekly classes (admin-managed)
  createdAt: string;
  // Courses started. Absent on legacy accounts, which are English-only.
  languages?: TargetLanguage[];
  // Dutch course record (level/schedule/support language). English keeps
  // using the top-level `level` and `schedule` fields.
  dutch?: LanguageTrackRecord;
}

// ---- Per-language account helpers ---------------------------

export function accountLanguages(a: AccountRecord): TargetLanguage[] {
  return a.languages?.length ? a.languages : ["en"];
}

export function studiesLanguage(a: AccountRecord, lang: TargetLanguage): boolean {
  return accountLanguages(a).includes(lang);
}

export function levelFor(a: AccountRecord, lang: TargetLanguage): CEFRLevel {
  return lang === "nl" ? a.dutch?.level ?? "A1" : a.level;
}

export function scheduleFor(a: AccountRecord, lang: TargetLanguage): ClassSchedule | null {
  return lang === "nl" ? a.dutch?.schedule ?? null : a.schedule ?? null;
}

export function setLevelFor(a: AccountRecord, lang: TargetLanguage, level: CEFRLevel): void {
  if (lang === "nl") ensureDutch(a).level = level;
  else a.level = level;
}

export function setScheduleFor(
  a: AccountRecord,
  lang: TargetLanguage,
  schedule: ClassSchedule | null,
): void {
  if (lang === "nl") ensureDutch(a).schedule = schedule;
  else a.schedule = schedule;
}

/** Create the Dutch record on first use. Mutates and returns it. */
export function ensureDutch(
  a: AccountRecord,
  init?: { level?: CEFRLevel; supportLang?: SupportLanguage },
): LanguageTrackRecord {
  if (!a.dutch) {
    a.dutch = {
      level: init?.level ?? "A1",
      supportLang: init?.supportLang ?? "pt",
      schedule: null,
      startedAt: new Date().toISOString(),
    };
  }
  return a.dutch;
}

/**
 * Make `lang` an active course on the account (creating its record on first
 * use) and apply a new Dutch support language if given. Mutates the account;
 * returns true when it needs saving.
 */
export function startCourse(
  a: AccountRecord,
  lang: TargetLanguage,
  supportLang?: SupportLanguage,
): boolean {
  let changed = addLanguage(a, lang);
  if (lang === "nl") {
    const hadDutch = !!a.dutch;
    const dutch = ensureDutch(a, { supportLang });
    if (!hadDutch) changed = true;
    else if (supportLang && dutch.supportLang !== supportLang) {
      dutch.supportLang = supportLang;
      changed = true;
    }
  }
  return changed;
}

/** Record that the student has started a course. Returns true if it changed. */
export function addLanguage(a: AccountRecord, lang: TargetLanguage): boolean {
  const langs = accountLanguages(a);
  if (langs.includes(lang)) {
    if (!a.languages) a.languages = langs;
    return false;
  }
  a.languages = [...langs, lang];
  return true;
}

/** Per-user platform data (progress + homework). Persisted in Blob. */
export interface AppState {
  progress: ProgressState;
  homeworkByDay: Record<string, DailyHomework>;
  weeklyDone: Record<string, boolean>;
}

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

export function defaultState(): AppState {
  return { progress: { ...DEFAULT_PROGRESS }, homeworkByDay: {}, weeklyDone: {} };
}

// ---- Keys --------------------------------------------------

/** Stable, peppered hash of the CPF — used as the user id / blob key stem. */
export function cpfToSub(cpf: string): string {
  const pepper = process.env.AUTH_SECRET ?? "";
  return createHash("sha256")
    .update(digitsOnly(cpf) + ":" + pepper)
    .digest("hex")
    .slice(0, 32);
}

const userKey = (sub: string) => `users/${sub}`;
// English keeps the original prefixes so existing data is untouched.
const statePrefix = (lang: TargetLanguage) => (lang === "en" ? "state/" : `state-${lang}/`);
const stateKey = (sub: string, lang: TargetLanguage) => `${statePrefix(lang)}${sub}`;
const configKey = (name: string, lang: TargetLanguage) =>
  lang === "en" ? `config/${name}` : `config/${lang}/${name}`;
const userIdKey = (userId: string) => `userid/${userId}`;

// ---- User ID (M######) uniqueness --------------------------

export async function userIdExists(userId: string): Promise<boolean> {
  return kvExists(userIdKey(userId));
}

/** Reserve a userId -> account-sub mapping so the ID stays unique. */
export async function reserveUserId(userId: string, sub: string): Promise<void> {
  await kvSet(userIdKey(userId), { sub });
}

/** Generate a unique "M######" id, retrying on the rare collision. */
export async function generateUniqueUserId(): Promise<string> {
  for (let i = 0; i < 20; i++) {
    const id = genUserId();
    if (!(await userIdExists(id))) return id;
  }
  // Extremely unlikely; fall back to a timestamp-based suffix.
  return "M" + String(Date.now() % 1_000_000).padStart(6, "0");
}

// ---- Account CRUD -----------------------------------------

export async function accountExists(cpf: string): Promise<boolean> {
  return kvExists(userKey(cpfToSub(cpf)));
}

export async function getAccount(sub: string): Promise<AccountRecord | null> {
  return kvGet<AccountRecord>(userKey(sub));
}

export async function saveAccount(sub: string, record: AccountRecord): Promise<void> {
  await kvSet(userKey(sub), record);
}

/** All accounts (admin only). Newest first. */
export async function listAccounts(): Promise<AccountRecord[]> {
  const rows = await kvList<AccountRecord>("users/");
  return rows.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function countAdmins(): Promise<number> {
  return (await listAccounts()).filter((a) => a.isAdmin).length;
}

export async function getSubByUserId(userId: string): Promise<string | null> {
  const idx = await kvGet<{ sub: string }>(userIdKey(userId));
  return idx?.sub ?? null;
}

export async function getAccountByUserId(userId: string): Promise<AccountRecord | null> {
  const sub = await getSubByUserId(userId);
  return sub ? getAccount(sub) : null;
}

/** Apply a mutation to an account looked up by userId. Returns the updated record. */
export async function updateAccountByUserId(
  userId: string,
  patch: (a: AccountRecord) => void,
): Promise<AccountRecord | null> {
  const sub = await getSubByUserId(userId);
  if (!sub) return null;
  const account = await getAccount(sub);
  if (!account) return null;
  patch(account);
  await saveAccount(sub, account);
  return account;
}

/** Permanently delete an account, its state, and its userId index. */
export async function deleteAccountByUserId(userId: string): Promise<boolean> {
  const sub = await getSubByUserId(userId);
  if (!sub) return false;
  await kvDelete(userKey(sub));
  await kvDelete(stateKey(sub, "en"));
  await kvDelete(stateKey(sub, "nl"));
  await kvDelete(userIdKey(userId));
  return true;
}

// ---- Per-user state ---------------------------------------

export async function getState(sub: string, lang: TargetLanguage = "en"): Promise<AppState> {
  return (await kvGet<AppState>(stateKey(sub, lang))) ?? defaultState();
}

export async function saveState(
  sub: string,
  state: AppState,
  lang: TargetLanguage = "en",
): Promise<void> {
  await kvSet(stateKey(sub, lang), state);
}

/** Every user's state for one language (admin analytics only). */
export async function listAllStates(lang: TargetLanguage = "en"): Promise<AppState[]> {
  return kvList<AppState>(statePrefix(lang));
}

// ---- Class pricing (platform-wide config) ------------------

export async function getPricing(lang: TargetLanguage = "en"): Promise<PricingMap> {
  const stored = await kvGet<Partial<PricingMap>>(configKey("pricing", lang));
  return { ...DEFAULT_PRICING, ...(stored ?? {}) };
}

export async function savePricing(pricing: PricingMap, lang: TargetLanguage = "en"): Promise<void> {
  await kvSet(configKey("pricing", lang), pricing);
}

// ---- Meetings (admin-managed; shown to students) -----------

export async function getMeetings(lang: TargetLanguage = "en"): Promise<MeetingsConfig | null> {
  return kvGet<MeetingsConfig>(configKey("meetings", lang));
}

export async function saveMeetings(
  meetings: MeetingsConfig,
  lang: TargetLanguage = "en",
): Promise<void> {
  await kvSet(configKey("meetings", lang), meetings);
}

// ---- Resources (admin-managed; shown to students) ----------

export async function getResources(lang: TargetLanguage = "en"): Promise<ResourceItem[] | null> {
  return kvGet<ResourceItem[]>(configKey("resources", lang));
}

export async function saveResources(
  resources: ResourceItem[],
  lang: TargetLanguage = "en",
): Promise<void> {
  await kvSet(configKey("resources", lang), resources);
}

// ---- Certificate design (admin-managed; platform-wide) -----

const CERT_DESIGN_KEY = "config/cert-design";

export interface CertDesign {
  logoSize: number;
  topMargin: number;
  titleSize: number;
  titleMargin: number;
  dividerTopMargin: number;
  dividerBottomMargin: number;
  nameSize: number;
  nameMargin: number;
  bodySize: number;
  bodyMargin: number;
  congratsSize: number;
  congratsMargin: number;
  cefrSize: number;
  teacherSigSize: number;
}

export const DEFAULT_CERT_DESIGN: CertDesign = {
  logoSize:            68,
  topMargin:           30,
  titleSize:         2.25,
  titleMargin:         22,
  dividerTopMargin:    20,
  dividerBottomMargin:  4,
  nameSize:          2.15,
  nameMargin:          15,
  bodySize:          0.92,
  bodyMargin:          28,
  congratsSize:      1.28,
  congratsMargin:      12,
  cefrSize:          1.15,
  teacherSigSize:     1.3,
};

export async function getCertDesign(): Promise<CertDesign> {
  const stored = await kvGet<Partial<CertDesign>>(CERT_DESIGN_KEY);
  return { ...DEFAULT_CERT_DESIGN, ...(stored ?? {}) };
}

export async function saveCertDesign(design: CertDesign): Promise<void> {
  await kvSet(CERT_DESIGN_KEY, design);
}