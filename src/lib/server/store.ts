import "server-only";
import { createHash } from "crypto";
import { kvGet, kvSet, kvExists, kvList, kvDelete } from "./blobKV";
import type {
  AccountSettings,
  PaymentMethod,
  ClassSchedule,
  PricingMap,
} from "../account";
import { digitsOnly, genUserId, DEFAULT_PRICING } from "../account";
import type {
  CEFRLevel,
  ProgressState,
  DailyHomework,
  MeetingsConfig,
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
  settings: AccountSettings;
  approved: boolean; // admin must approve before platform access
  active: boolean; // admin can deactivate a student
  schedule: ClassSchedule | null; // recurring weekly classes (admin-managed)
  createdAt: string;
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
const stateKey = (sub: string) => `state/${sub}`;
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

async function getSubByUserId(userId: string): Promise<string | null> {
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
  await kvDelete(stateKey(sub));
  await kvDelete(userIdKey(userId));
  return true;
}

// ---- Per-user state ---------------------------------------

export async function getState(sub: string): Promise<AppState> {
  return (await kvGet<AppState>(stateKey(sub))) ?? defaultState();
}

export async function saveState(sub: string, state: AppState): Promise<void> {
  await kvSet(stateKey(sub), state);
}

/** Every user's state (admin analytics only). */
export async function listAllStates(): Promise<AppState[]> {
  return kvList<AppState>("state/");
}

// ---- Class pricing (platform-wide config) ------------------

const PRICING_KEY = "config/pricing";

export async function getPricing(): Promise<PricingMap> {
  const stored = await kvGet<Partial<PricingMap>>(PRICING_KEY);
  return { ...DEFAULT_PRICING, ...(stored ?? {}) };
}

export async function savePricing(pricing: PricingMap): Promise<void> {
  await kvSet(PRICING_KEY, pricing);
}

// ---- Meetings (admin-managed; shown to students) -----------

const MEETINGS_KEY = "config/meetings";

export async function getMeetings(): Promise<MeetingsConfig | null> {
  return kvGet<MeetingsConfig>(MEETINGS_KEY);
}

export async function saveMeetings(meetings: MeetingsConfig): Promise<void> {
  await kvSet(MEETINGS_KEY, meetings);
}