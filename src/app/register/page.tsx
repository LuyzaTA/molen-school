"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";
import { CEFR_LEVELS } from "@/lib/cefr";
import type { CEFRLevel } from "@/lib/types";
import {
  PAYMENT_METHODS,
  DEFAULT_SETTINGS,
  formatCPF,
  formatRG,
  type PaymentMethod,
  type AccountSettings,
} from "@/lib/account";
import { cn } from "@/lib/cn";

interface FormState {
  userId: string;
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

const INITIAL: FormState = {
  userId: "",
  isAdmin: false,
  name: "",
  rg: "",
  cpf: "",
  address: "",
  city: "",
  state: "",
  country: "Brazil",
  paymentMethod: "pix",
  password: "",
  repeatPassword: "",
  level: "A1",
  settings: { ...DEFAULT_SETTINGS },
};

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Fetch a unique, read-only student ID for display.
  useEffect(() => {
    let active = true;
    fetch("/api/next-user-id")
      .then((r) => r.json())
      .then((d) => {
        if (active && d.userId) setForm((f) => ({ ...f, userId: d.userId }));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));
  const setSetting = <K extends keyof AccountSettings>(k: K, v: AccountSettings[K]) =>
    setForm((f) => ({ ...f, settings: { ...f.settings, [k]: v } }));

  function validate(): string | null {
    const req: [keyof FormState, string][] = [
      ["name", "Full name"],
      ["rg", "RG"],
      ["cpf", "CPF"],
      ["address", "Address"],
      ["city", "City"],
      ["state", "State / Province"],
      ["country", "Country"],
    ];
    for (const [k, label] of req) {
      if (!String(form[k]).trim()) return `${label} is required.`;
    }
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.repeatPassword) return "Passwords do not match.";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not create the account.");
        setBusy(false);
        return;
      }
      // Per spec: after registration, go to the login page. Pass the final
      // (server-assigned) student ID so the login page can show it once.
      const uid = data.userId || form.userId;
      window.location.assign(`/login?registered=1&uid=${encodeURIComponent(uid)}`);
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <div className="mb-8 flex items-center justify-between">
        <Logo size={56} />
        <Link href="/login" className="text-sm font-medium text-accent hover:underline">
          Sign in
        </Link>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-ink">Create your account</h1>
      <p className="mt-2 text-[15px] text-ink-muted">
        Register as a Molen English Classes student. Your details are stored securely;
        your password is never saved in plain text.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        {/* Personal data */}
        <Section title="Personal data">
          <Grid>
            <Field label="User ID" className="sm:col-span-2">
              <input
                className="input-field cursor-not-allowed bg-base/60 font-semibold tracking-wide text-ink-muted"
                value={form.userId || "Generating…"}
                readOnly
                aria-readonly
                tabIndex={-1}
              />
              <span className="mt-1 block text-xs text-ink-subtle">
                Your unique student ID. Generated automatically — you can&apos;t change it.
              </span>
            </Field>
            <Field label="Full name" className="sm:col-span-2">
              <input className="input-field" value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
            </Field>
            <Field label="RG">
              <input
                className="input-field"
                placeholder="00.000.000-0"
                maxLength={12}
                value={form.rg}
                onChange={(e) => set("rg", formatRG(e.target.value))}
              />
            </Field>
            <Field label="CPF">
              <input
                className="input-field"
                inputMode="numeric"
                placeholder="000.000.000-00"
                maxLength={14}
                value={form.cpf}
                onChange={(e) => set("cpf", formatCPF(e.target.value))}
              />
            </Field>
            <Field label="Address" className="sm:col-span-2">
              <input className="input-field" value={form.address} onChange={(e) => set("address", e.target.value)} autoComplete="street-address" />
            </Field>
            <Field label="City">
              <input className="input-field" value={form.city} onChange={(e) => set("city", e.target.value)} />
            </Field>
            <Field label="State / Province">
              <input className="input-field" value={form.state} onChange={(e) => set("state", e.target.value)} />
            </Field>
            <Field label="Country">
              <input className="input-field" value={form.country} onChange={(e) => set("country", e.target.value)} />
            </Field>
            <Field label="Payment method">
              <select className="input-field" value={form.paymentMethod} onChange={(e) => set("paymentMethod", e.target.value as PaymentMethod)}>
                {PAYMENT_METHODS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </Field>
          </Grid>
        </Section>

        {/* English level — or Platform Administrator */}
        <Section title="Your English level" hint="Pick the level that feels right — you can change it later.">
          <div className="grid gap-2 sm:grid-cols-2">
            {CEFR_LEVELS.map((l) => {
              const selected = !form.isAdmin && form.level === l.level;
              return (
                <button
                  type="button"
                  key={l.level}
                  onClick={() => setForm((f) => ({ ...f, level: l.level, isAdmin: false }))}
                  className={cn(
                    "rounded-xl border p-3 text-left transition-colors",
                    selected ? "border-accent bg-accent-soft" : "border-border hover:border-accent/60",
                  )}
                >
                  <span className="font-semibold text-ink">{l.level} · {l.name}</span>
                  <span className="mt-0.5 block text-sm text-ink-muted">{l.canDo}</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, isAdmin: true }))}
              className={cn(
                "rounded-xl border p-3 text-left transition-colors sm:col-span-2",
                form.isAdmin ? "border-accent bg-accent-soft" : "border-border hover:border-accent/60",
              )}
            >
              <span className="font-semibold text-ink">🛡️ Platform Administrator</span>
              <span className="mt-0.5 block text-sm text-ink-muted">
                Manage students, approvals, analytics, and class schedules. Only one
                administrator can exist.
              </span>
            </button>
          </div>
        </Section>

        {/* Comfort settings */}
        <Section title="Comfort" hint="These change how the app behaves, not just how it looks. You can switch them anytime.">
          <div className="space-y-5">
            <Toggle
              label="Autistic / Calm mode"
              description="Lower contrast, no animations, single-task screens, agenda shown up front, idioms explained literally, predictable speaking order."
              checked={form.settings.autisticMode}
              onChange={(v) => setSetting("autisticMode", v)}
            />
            <hr className="border-border" />
            <Toggle
              label="Dyslexia-friendly font"
              description="A rounded, well-spaced typeface that's easier to scan."
              checked={form.settings.font === "dyslexic"}
              onChange={(v) => setSetting("font", v ? "dyslexic" : "inter")}
            />
            {form.level === "A1" && (
              <>
                <hr className="border-border" />
                <Toggle
                  label="Portuguese translations (A1)"
                  description="Show Brazilian-Portuguese translations next to vocabulary and homework. A1 only."
                  checked={form.settings.translatePt}
                  onChange={(v) => setSetting("translatePt", v)}
                />
              </>
            )}
          </div>
        </Section>

        {/* Security */}
        <Section title="Security">
          <Grid>
            <Field label="Password">
              <input className="input-field" type="password" autoComplete="new-password" value={form.password} onChange={(e) => set("password", e.target.value)} />
            </Field>
            <Field label="Repeat password">
              <input className="input-field" type="password" autoComplete="new-password" value={form.repeatPassword} onChange={(e) => set("repeatPassword", e.target.value)} />
            </Field>
          </Grid>
        </Section>

        {error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
        )}

        <Button type="submit" size="lg" block disabled={busy}>
          {busy ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        {hint && <p className="mt-1 text-sm text-ink-muted">{hint}</p>}
      </div>
      {children}
    </Card>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}