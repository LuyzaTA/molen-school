"use client";

import { useState } from "react";
import Link from "next/link";

const P = {
  parchment: "#F4ECDA",
  cream:     "#FFFAEF",
  dark:      "#1C2218",
  green:     "#4C6A2E",
  gold:      "#C29A57",
  tan:       "#DCC8A0",
  ink:       "#2A2D28",
  inkMuted:  "#6A6253",
  inkSubtle: "#978B74",
  maroon:    "#6E1822",
  danger:    "#A33A33",
} as const;

const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setServerError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: P.parchment, color: P.ink, fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>

      {/* Header */}
      <header style={{
        backgroundColor: P.parchment,
        borderBottom: `1px solid ${P.tan}`,
        padding: "0 2rem",
      }}>
        <div style={{
          maxWidth: "72rem", margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 68,
        }}>
          <Link href="/" style={{ textDecoration: "none", lineHeight: 1 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "1.5rem", color: P.maroon, letterSpacing: "-0.01em" }}>
              Molen
            </div>
            <div style={{ fontSize: "0.52rem", letterSpacing: "0.28em", textTransform: "uppercase", color: P.dark, fontWeight: 700, marginTop: 3 }}>
              English Classes
            </div>
          </Link>
          <Link href="https://molen-school.vercel.app/login" style={{
            padding: "7px 20px", borderRadius: 999,
            fontSize: 14, fontWeight: 600,
            color: P.ink, textDecoration: "none",
            border: `1px solid ${P.tan}`,
          }}>
            Sign in
          </Link>
        </div>
      </header>

      {/* Content */}
      <main style={{ padding: "60px 2rem 80px", maxWidth: "36rem", margin: "0 auto" }}>

        {status === "sent" ? (
          /* ── Success state ── */
          <div style={{ textAlign: "center", paddingTop: 40 }}>
            <div style={{ fontSize: 52, marginBottom: 20 }}>🎉</div>
            <h1 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "2rem", color: P.ink, marginBottom: 16 }}>
              Message sent!
            </h1>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: P.inkMuted, marginBottom: 32 }}>
              Thank you for reaching out. I&rsquo;ll get back to you as soon as possible —
              usually within 24 hours.
            </p>
            <Link href="/" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "11px 26px", borderRadius: 999,
              backgroundColor: P.green, color: P.cream,
              fontSize: 14, fontWeight: 700, textDecoration: "none",
            }}>
              ← Back to home
            </Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 40 }}>
              <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.22em",
                textTransform: "uppercase", color: P.green, marginBottom: 10,
              }}>
                Get in touch
              </p>
              <h1 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", color: P.ink, lineHeight: 1.15, marginBottom: 12 }}>
                Ready to find your English voice?
              </h1>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: P.inkMuted }}>
                Have a question before starting? Fill in the form and I&rsquo;ll get back to you within 24 hours.
              </p>
            </div>

            <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Name */}
              <Field label="Your name *">
                <input
                  type="text"
                  required
                  placeholder="Maria Silva"
                  value={form.name}
                  onChange={set("name")}
                  style={inputStyle}
                />
              </Field>

              {/* Email */}
              <Field label="E-mail *">
                <input
                  type="email"
                  required
                  placeholder="maria@email.com"
                  value={form.email}
                  onChange={set("email")}
                  style={inputStyle}
                />
              </Field>

              {/* Phone */}
              <Field label="Phone / WhatsApp (optional)">
                <input
                  type="tel"
                  placeholder="+55 11 9 0000-0000"
                  value={form.phone}
                  onChange={set("phone")}
                  style={inputStyle}
                />
              </Field>

              {/* Message */}
              <Field label="Message *">
                <textarea
                  required
                  rows={5}
                  placeholder="Tell me a bit about yourself and what you're looking for..."
                  value={form.message}
                  onChange={set("message")}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
                />
              </Field>

              {serverError && (
                <p style={{ fontSize: 13, color: P.danger, padding: "10px 14px", backgroundColor: "#FDF0EF", borderRadius: 10, border: `1px solid ${P.danger}30` }}>
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                style={{
                  padding: "13px 0", borderRadius: 999,
                  backgroundColor: status === "sending" ? P.inkMuted : P.green,
                  color: P.cream, fontSize: 15, fontWeight: 700,
                  border: "none", cursor: status === "sending" ? "not-allowed" : "pointer",
                  transition: "opacity 150ms",
                }}
              >
                {status === "sending" ? "Sending…" : "Send message"}
              </button>

              <p style={{ textAlign: "center", fontSize: 13, color: P.inkSubtle }}>
                Or email directly:{" "}
                <a href="mailto:alexandre.t.luyza@gmail.com" style={{ color: P.green, fontWeight: 600, textDecoration: "none" }}>
                  alexandre.t.luyza@gmail.com
                </a>
              </p>
            </form>
          </>
        )}
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: P.ink }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 12,
  border: `1px solid ${P.tan}`,
  backgroundColor: P.cream,
  color: P.ink,
  fontSize: 15,
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 150ms",
};
