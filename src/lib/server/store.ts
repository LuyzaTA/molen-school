import "server-only";
import { createHash } from "crypto";
import { kvGet, kvSet, kvExists } from "./blobKV";
import type { AccountSettings, PaymentMethod } from "../account";
import { digitsOnly, genUserId } from "../account";
import type {
  CEFRLevel,
  ProgressState,
  DailyHomework,
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

// ---- Per-user state ---------------------------------------

export async function getState(sub: string): Promise<AppState> {
  return (await kvGet<AppState>(stateKey(sub))) ?? defaultState();
}

export async function saveState(sub: string, state: AppState): Promise<void> {
  await kvSet(stateKey(sub), state);
}