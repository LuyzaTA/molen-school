"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { UserProfile } from "@/lib/types";
import { DEFAULT_PROFILE } from "@/lib/storage";
import { brandName, type TargetLanguage, type SupportLanguage } from "@/lib/language";

export interface AccountMeta {
  userId: string;
  isAdmin: boolean;
  approved: boolean;
  active: boolean;
  languages: TargetLanguage[]; // courses this account has started
}

interface SettingsContextValue {
  profile: UserProfile;
  account: AccountMeta | null;
  ready: boolean; // finished loading from the server
  authenticated: boolean;
  update: (patch: Partial<UserProfile>) => void;
  toggleAutistic: () => void;
  refresh: () => Promise<void>;
  /** Switch course (and optionally the Dutch support language), then reload. */
  switchLanguage: (language: TargetLanguage, supportLang?: SupportLanguage) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

const SETTING_KEYS = [
  "autisticMode",
  "font",
  "theme",
  "motion",
  "translatePt",
  "track",
] as const;

/**
 * Applies runtime theme attributes to <html> so the CSS-variable design system
 * swaps instantly. Works with defaults even before the user is authenticated.
 */
function applyDocumentAttributes(profile: UserProfile) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const resolvedTheme =
    profile.theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : profile.theme;
  root.setAttribute("data-theme", resolvedTheme);
  root.setAttribute("data-autistic", profile.autisticMode ? "on" : "off");
  root.setAttribute("data-font", profile.font === "dyslexic" ? "dyslexic" : "inter");
  root.setAttribute(
    "data-motion",
    profile.motion && !profile.autisticMode ? "on" : "off",
  );
  root.setAttribute("data-lang", profile.language);
}

/**
 * Keep the tab title's brand in step with the chosen course. The static
 * metadata title is the English one, so only the Dutch course overrides it
 * (switching course reloads the page, restoring the English title).
 */
export function applyBrandTitle(language: TargetLanguage) {
  if (typeof document === "undefined" || language === "en") return;
  document.title = brandName(language);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [account, setAccount] = useState<AccountMeta | null>(null);
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const p = { ...DEFAULT_PROFILE, ...data.profile } as UserProfile;
        setProfile(p);
        applyDocumentAttributes(p);
        setAccount(
          data.account
            ? {
                userId: data.account.userId,
                isAdmin: !!data.account.isAdmin,
                approved: data.account.approved !== false,
                active: data.account.active !== false,
                languages: Array.isArray(data.account.languages)
                  ? data.account.languages
                  : ["en"],
              }
            : null,
        );
        setAuthenticated(true);
      } else {
        applyDocumentAttributes(DEFAULT_PROFILE);
        setAccount(null);
        setAuthenticated(false);
      }
    } catch {
      applyDocumentAttributes(DEFAULT_PROFILE);
      setAccount(null);
      setAuthenticated(false);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Track OS theme changes when on "system".
  useEffect(() => {
    if (profile.theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyDocumentAttributes(profile);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [profile]);

  const persist = useCallback(
    (next: UserProfile) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        const settings = Object.fromEntries(
          SETTING_KEYS.map((k) => [k, next[k]]),
        );
        void fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ level: next.level, supportLang: next.supportLang, settings }),
        });
      }, 500);
    },
    [],
  );

  const update = useCallback(
    (patch: Partial<UserProfile>) => {
      setProfile((p) => {
        const next = { ...p, ...patch };
        applyDocumentAttributes(next);
        if (authenticated) persist(next);
        return next;
      });
    },
    [authenticated, persist],
  );

  const switchLanguage = useCallback(
    async (language: TargetLanguage, supportLang?: SupportLanguage) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      await fetch("/api/language", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, supportLang }),
      });
      // Full reload so progress, homework, and meetings load for the new course.
      window.location.assign(window.location.pathname.startsWith("/admin") ? window.location.pathname : "/dashboard");
    },
    [],
  );

  const toggleAutistic = useCallback(
    () => update({ autisticMode: !profile.autisticMode }),
    [profile.autisticMode, update],
  );

  return (
    <SettingsContext.Provider
      value={{
        profile,
        account,
        ready,
        authenticated,
        update,
        toggleAutistic,
        refresh: load,
        switchLanguage,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}