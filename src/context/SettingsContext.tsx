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

interface SettingsContextValue {
  profile: UserProfile;
  ready: boolean; // finished loading from the server
  authenticated: boolean;
  update: (patch: Partial<UserProfile>) => void;
  toggleAutistic: () => void;
  refresh: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

const SETTING_KEYS = [
  "autisticMode",
  "font",
  "theme",
  "motion",
  "translatePt",
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
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
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
        setAuthenticated(true);
      } else {
        applyDocumentAttributes(DEFAULT_PROFILE);
        setAuthenticated(false);
      }
    } catch {
      applyDocumentAttributes(DEFAULT_PROFILE);
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
          body: JSON.stringify({ level: next.level, settings }),
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

  const toggleAutistic = useCallback(
    () => update({ autisticMode: !profile.autisticMode }),
    [profile.autisticMode, update],
  );

  return (
    <SettingsContext.Provider
      value={{ profile, ready, authenticated, update, toggleAutistic, refresh: load }}
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