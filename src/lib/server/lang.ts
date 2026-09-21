import "server-only";
import { cookies } from "next/headers";
import { LANG_COOKIE, isTargetLanguage, type TargetLanguage } from "../language";

// ============================================================
// The language chosen at sign-in lives in its own cookie so every
// API route can scope data (state, pricing, meetings…) to it.
// It is not a security boundary: it only selects which of the
// signed-in user's own tracks is shown.
// ============================================================

const MAX_AGE = 60 * 60 * 24 * 30; // matches the session cookie

export async function getLang(): Promise<TargetLanguage> {
  const store = await cookies();
  const v = store.get(LANG_COOKIE)?.value;
  return isTargetLanguage(v) ? v : "en";
}

export async function setLangCookie(lang: TargetLanguage): Promise<void> {
  const store = await cookies();
  store.set(LANG_COOKIE, lang, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}
