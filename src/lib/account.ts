import type { CEFRLevel, FontPreference, ThemePreference } from "./types";

// ============================================================
// Account / registration types shared between client and server.
// No server-only imports here so the client can use the types.
// ============================================================

export type PaymentMethod = "pix" | "credit_card" | "boleto";

/** Recurring weekly class schedule for a student (set by an admin). */
export interface ClassSchedule {
  days: number[]; // 0=Sun … 6=Sat
  time: string; // "HH:MM"
}

/** Class price per CEFR level (in BRL). Admin-configurable, platform-wide. */
export type PricingMap = Record<CEFRLevel, number>;

export const DEFAULT_PRICING: PricingMap = {
  A1: 50,
  A2: 55,
  B1: 65,
  B2: 75,
  C1: 90,
  C2: 110,
};

/** Average weeks per month — used to project weekly schedules to monthly income. */
export const WEEKS_PER_MONTH = 52 / 12;

export function formatBRL(n: number): string {
  return "R$ " + (n || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const WEEKDAYS_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "pix", label: "Pix" },
  { value: "credit_card", label: "Credit card" },
  { value: "boleto", label: "Boleto" },
];

/** The comfort/accessibility settings chosen at registration. */
export interface AccountSettings {
  autisticMode: boolean;
  font: FontPreference;
  theme: ThemePreference;
  motion: boolean;
  translatePt: boolean;
}

/** Personal data collected at registration (sent to the server). */
export interface RegistrationInput {
  userId: string; // auto-generated "M######" (read-only on the form)
  isAdmin: boolean;
  name: string;
  rg: string;
  cpf: string;
  address: string;
  city: string;
  state: string;
  country: string;
  paymentMethod: PaymentMethod;
  password: string;
  repeatPassword: string;
  level: CEFRLevel;
  settings: AccountSettings;
}

/** Auto-generated student ID: "M" followed by 6 digits. */
export function genUserId(): string {
  return "M" + String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
}

export function isValidUserId(s: string | undefined): boolean {
  return !!s && /^M\d{6}$/.test(s);
}

/** Non-sensitive account fields safe to return to the browser. */
export interface AccountPublic {
  userId: string;
  isAdmin: boolean;
  approved: boolean;
  active: boolean;
  name: string;
  cpfMasked: string; // e.g. "***.***.**9-10"
  city: string;
  state: string;
  country: string;
  paymentMethod: PaymentMethod;
  level: CEFRLevel;
  settings: AccountSettings;
  schedule: ClassSchedule | null;
  createdAt: string;
}

/** Row returned by the admin user list (non-sensitive). */
export interface AdminUserRow {
  userId: string;
  name: string;
  cpfMasked: string;
  level: CEFRLevel;
  isAdmin: boolean;
  approved: boolean;
  active: boolean;
  city: string;
  state: string;
  country: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
  schedule: ClassSchedule | null;
}

export const DEFAULT_SETTINGS: AccountSettings = {
  autisticMode: false,
  font: "inter",
  theme: "system",
  motion: true,
  translatePt: false,
};

// ---- Validation helpers (shared) ---------------------------

/** Strip non-digits. */
export function digitsOnly(s: string): string {
  return (s || "").replace(/\D/g, "");
}

/** Validate a Brazilian CPF (format + check digits). */
export function isValidCPF(raw: string): boolean {
  const cpf = digitsOnly(raw);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false; // all same digit
  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += parseInt(cpf[i]) * (len + 1 - i);
    const d = (sum * 10) % 11;
    return d === 10 ? 0 : d;
  };
  return calc(9) === parseInt(cpf[9]) && calc(10) === parseInt(cpf[10]);
}

/** Live input mask for CPF: 000.000.000-00 */
export function formatCPF(v: string): string {
  const d = digitsOnly(v).slice(0, 11);
  if (d.length > 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  if (d.length > 6) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  if (d.length > 3) return `${d.slice(0, 3)}.${d.slice(3)}`;
  return d;
}

/** Live input mask for RG: 00.000.000-0 (last position may be a digit or X). */
export function formatRG(v: string): string {
  const chars = v.toUpperCase().replace(/[^0-9X]/g, "");
  let out = "";
  for (const c of chars) {
    if (out.length < 8) {
      if (c >= "0" && c <= "9") out += c;
    } else if (out.length === 8) {
      if ((c >= "0" && c <= "9") || c === "X") out += c;
    }
    if (out.length >= 9) break;
  }
  if (out.length > 8) return `${out.slice(0, 2)}.${out.slice(2, 5)}.${out.slice(5, 8)}-${out.slice(8)}`;
  if (out.length > 5) return `${out.slice(0, 2)}.${out.slice(2, 5)}.${out.slice(5)}`;
  if (out.length > 2) return `${out.slice(0, 2)}.${out.slice(2)}`;
  return out;
}

export function maskCPF(raw: string): string {
  const cpf = digitsOnly(raw);
  if (cpf.length !== 11) return "***";
  return `***.***.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
}