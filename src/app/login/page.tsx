"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { isValidCPF } from "@/lib/account";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const justRegistered = params.get("registered") === "1";
  const newUserId = params.get("uid");

  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isValidCPF(cpf)) {
      setError("Please enter a valid CPF.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not sign in.");
        setBusy(false);
        return;
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
        <Logo size={64} />
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
                Your student ID is{" "}
                <span className="font-bold tracking-wide text-accent">{newUserId}</span>.
                Keep it safe. Now sign in with your CPF and password.
              </p>
            )}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="CPF">
            <input
              className="input-field"
              inputMode="numeric"
              autoComplete="username"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
          </Field>
          <Field label="Password">
            <input
              className="input-field"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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