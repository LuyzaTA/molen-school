"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Flag, langFlag } from "@/components/ui/Flag";
import { cn } from "@/lib/cn";
import {
  LANGUAGES,
  SUPPORT_LANGUAGES,
  TARGET_LANGUAGES,
  isSupportLanguage,
  isTargetLanguage,
  type SupportLanguage,
  type TargetLanguage,
} from "@/lib/language";

// Remembers the last choice on this device so returning students don't re-pick.
const PICK_KEY = "molen.loginLanguage";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const justRegistered = params.get("registered") === "1";
  const newUserId = params.get("uid");

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [language, setLanguage] = useState<TargetLanguage>("en");
  const [supportLang, setSupportLang] = useState<SupportLanguage>("pt");

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(PICK_KEY) ?? "{}");
      if (isTargetLanguage(saved.language)) setLanguage(saved.language);
      if (isSupportLanguage(saved.supportLang)) setSupportLang(saved.supportLang);
    } catch {
      /* private mode — keep defaults */
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!userId.trim()) {
      setError("Please enter your User ID.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password, language, supportLang }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not sign in.");
        setBusy(false);
        return;
      }
      try {
        window.localStorage.setItem(PICK_KEY, JSON.stringify({ language, supportLang }));
      } catch {
        /* ignore */
      }
      // Full navigation so the providers re-bootstrap from /api/me & /api/state.
      window.location.assign(next);
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-12">
      <div className="mb-8 flex justify-center">
        <Logo size={64} language={language} />
      </div>
      <Card className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-ink-muted">Sign in to continue your classes.</p>
        </div>

        {justRegistered && (
          <div className="rounded-xl border border-accent/40 bg-accent-soft p-4">
            <p className="text-sm font-semibold text-ink">Account created! 🎉</p>
            {newUserId && (
              <p className="mt-1 text-sm text-ink-muted">
                Your User ID is{" "}
                <span className="font-bold tracking-wide text-accent">{newUserId}</span>.
                Use it to sign in (with your password). Keep it safe.
              </p>
            )}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <fieldset>
            <legend className="mb-1.5 block text-sm font-medium text-ink">
              I want to learn
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {TARGET_LANGUAGES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLanguage(code)}
                  aria-pressed={language === code}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors",
                    language === code
                      ? "border-accent bg-accent-soft text-ink"
                      : "border-border bg-surface text-ink-muted hover:border-accent/60",
                  )}
                >
                  <Flag code={langFlag(code)} />
                  {LANGUAGES[code].nativeName}
                </button>
              ))}
            </div>
          </fieldset>

          {language === "nl" && (
            <fieldset>
              <legend className="mb-1.5 block text-sm font-medium text-ink">
                Explanations in
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {SUPPORT_LANGUAGES.map((s) => (
                  <button
                    key={s.code}
                    type="button"
                    onClick={() => setSupportLang(s.code)}
                    aria-pressed={supportLang === s.code}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
                      supportLang === s.code
                        ? "border-accent bg-accent-soft text-ink"
                        : "border-border bg-surface text-ink-muted hover:border-accent/60",
                    )}
                  >
                    <Flag code={langFlag(s.code)} width={18} />
                    {s.label}
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-ink-subtle">
                Word meanings, grammar notes, and translations use this language.
              </p>
            </fieldset>
          )}

          <Field label="User ID">
            <input
              className="input-field font-semibold tracking-wide"
              autoComplete="username"
              placeholder="M000000"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </Field>
          <Field label="Password">
            <div className="relative">
              <input
                className="input-field pr-10"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-ink-muted hover:text-ink"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </Field>

          {error && (
            <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
          )}

          <Button type="submit" size="lg" block disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-ink-muted">
          New student?{" "}
          <Link href="/register" className="font-semibold text-accent hover:underline">
            Create your account
          </Link>
        </p>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}

function Eye() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}