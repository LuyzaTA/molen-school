import type { CEFRLevel, FontPreference, ThemePreference } from "./types";

// ============================================================
// Account / registration types shared between client and server.
// No server-only imports here so the client can use the types.
// ============================================================

export type PaymentMethod = "pix" | "credit_card" | "boleto";

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

/** Non-sensitive account fields safe to return to the browser. */
export interface AccountPublic {
  name: string;
  cpfMasked: string; // e.g. "***.***.**9-10"
  city: string;
  state: string;
  country: string;
  paymentMethod: PaymentMethod;
  level: CEFRLevel;
  settings: AccountSettings;
  createdAt: string;
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

export function maskCPF(raw: string): string {
  const cpf = digitsOnly(raw);
  if (cpf.length !== 11) return "***";
  return `***.***.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
}