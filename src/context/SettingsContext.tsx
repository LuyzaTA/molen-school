"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { UserProfile } from "@/lib/types";
import { loadProfile, saveProfile, DEFAULT_PROFILE } from "@/lib/storage";

interface SettingsContextValue {
  profile: UserProfile;
  ready: boolean; // hydrated from localStorage
  update: (patch: Partial<UserProfile>) => void;
  toggleAutistic: () => void;
  reset: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

/**
 * Applies the runtime theme attributes to <html> so the CSS-variable
 * design system swaps instantly, with no React re-render of the tree.
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
  // Autistic mode forces motion off regardless of the motion preference.
  root.setAttribute(
    "data-motion",
    profile.motion && !profile.autisticMode ? "on" : "off",
  );
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [ready, setReady] = useState(false);

  // Hydrate once on mount.
  useEffect(() => {
    const loaded = loadProfile();
    setProfile(loaded);
    applyDocumentAttributes(loaded);
    setReady(true);
  }, []);

  // Re-apply attributes + persist whenever the profile changes.
  useEffect(() => {
    if (!ready) return;
    applyDocumentAttributes(profile);
    saveProfile(profile);
  }, [profile, ready]);

  // Track system theme changes when set to "system".
  useEffect(() => {
    if (profile.theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyDocumentAttributes(profile);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [profile]);

  const update = useCallback((patch: Partial<UserProfile>) => {
    setProfile((p) => ({ ...p, ...patch }));
  }, []);

  const toggleAutistic = useCallback(() => {
    setProfile((p) => ({ ...p, autisticMode: !p.autisticMode }));
  }, []);

  const reset = useCallback(() => {
    setProfile({ ...DEFAULT_PROFILE, createdAt: new Date().toISOString() });
  }, []);

  return (
    <SettingsContext.Provider
      value={{ profile, ready, update, toggleAutistic, reset }}
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