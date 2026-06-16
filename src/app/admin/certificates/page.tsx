"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { WindmillMark } from "@/components/ui/WindmillMark";
import { CEFR_LEVELS } from "@/lib/cefr";
import type { CEFRLevel } from "@/lib/types";

const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
const SCRIPT = "'Snell Roundhand', 'Segoe Script', 'Brush Script MT', cursive";

// Certificate colours (fixed — a print artifact, independent of app theme).
const C = {
  parchment: "#F4EBCE",
  parchment2: "#EFE3C2",
  gold: "#C29A4E",
  green: "#2E3A30",
  greenInk: "#5C6B3A",
  maroon: "#6E2230",
  ink: "#2A2D28",
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function prettyDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(+d)) return "—";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function AdminCertificatesPage() {
  const [name, setName] = useState("");
  const [level, setLevel] = useState<CEFRLevel>("A1");
  const [date, setDate] = useState(todayISO());
  const [teacher, setTeacher] = useState("Luyza Alexandre");

  const levelName = CEFR_LEVELS.find((l) => l.level === level)?.name ?? "";

  return (
    <div className="mx-auto max-w-wide space-y-6">
      <header className="pt-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Administration</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Certificates</h1>
        <p className="mt-2 text-[15px] text-ink-muted">
          Fill in the details, then download the certificate as a PDF.
        </p>
      </header>

      {/* Form (hidden when printing) */}
      <Card className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-ink">Student name</span>
          <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Maria Eduarda Silva" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">CEFR level</span>
          <select className="input-field" value={level} onChange={(e) => setLevel(e.target.value as CEFRLevel)}>
            {CEFR_LEVELS.map((l) => (
              <option key={l.level} value={l.level}>{l.level} · {l.name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Date</span>
          <input type="date" className="input-field" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-ink">Teacher</span>
          <input className="input-field" value={teacher} onChange={(e) => setTeacher(e.target.value)} />
        </label>
        <div className="sm:col-span-2">
          <Button onClick={() => window.print()} disabled={!name.trim()}>
            Download PDF
          </Button>
          <p className="mt-2 text-xs text-ink-subtle">
            Opens the print dialog — choose &ldquo;Save as PDF&rdquo;, landscape.
          </p>
        </div>
      </Card>

      {/* Live preview / printable certificate */}
      <div className="overflow-x-auto">
        <div
          id="certificate"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 1000,
            margin: "0 auto",
            aspectRatio: "1.414 / 1",
            background: `linear-gradient(135deg, ${C.parchment} 0%, ${C.parchment2} 100%)`,
            color: C.ink,
            fontFamily: SERIF,
            padding: "3.2% 4%",
            boxSizing: "border-box",
          }}
        >
          {/* Frame: gold outer + green inner */}
          <div style={{ position: "absolute", inset: "1.4%", border: `6px solid ${C.gold}`, borderRadius: 4 }} />
          <div style={{ position: "absolute", inset: "2.6%", border: `1.5px solid ${C.green}` }} />
          <Flourishes />

          <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            {/* Brand */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.2%", marginTop: "1%" }}>
              <WindmillMark size={66} />
              <div style={{ lineHeight: 1, textAlign: "left" }}>
                <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "2.6rem", color: C.maroon }}>Molen</div>
                <div style={{ fontSize: "0.86rem", letterSpacing: "0.32em", color: C.greenInk, fontWeight: 600, marginTop: 2 }}>
                  ENGLISH SCHOOL
                </div>
              </div>
            </div>

            <h2 style={{ fontFamily: SERIF, fontWeight: 700, color: C.maroon, fontSize: "2.9rem", margin: "2.2% 0 0" }}>
              Certificate of Achievement
            </h2>
            <Divider />

            <p style={{ letterSpacing: "0.22em", fontSize: "0.8rem", color: C.ink, margin: 0 }}>
              THIS CERTIFICATE IS PROUDLY PRESENTED TO
            </p>

            <div style={{ fontFamily: SCRIPT, fontSize: "3.4rem", color: C.green, lineHeight: 1.1, margin: "1.4% 0 0", padding: "0 6%", borderBottom: `1px solid ${C.gold}`, minWidth: "55%" }}>
              {name.trim() || "Student Name"}
            </div>

            <p style={{ maxWidth: "74%", fontSize: "1.02rem", color: C.ink, margin: "2.4% 0 0", lineHeight: 1.5 }}>
              for outstanding dedication, active participation and excellent performance in English studies.
            </p>
            <p style={{ fontFamily: SCRIPT, fontSize: "1.7rem", color: C.greenInk, margin: "1.4% 0 0" }}>
              Congratulations on your achievement!
            </p>

            {/* Footer row */}
            <div style={{ marginTop: "auto", width: "100%", display: "flex", alignItems: "flex-end", justifyContent: "space-between", paddingBottom: "1%" }}>
              {/* Level + date */}
              <div style={{ textAlign: "center", minWidth: "26%" }}>
                <div style={{ letterSpacing: "0.18em", fontSize: "0.72rem", color: C.green, fontWeight: 600 }}>CEFR LEVEL</div>
                <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "2.6rem", color: C.greenInk, lineHeight: 1 }}>{level}</div>
                <div style={{ letterSpacing: "0.18em", fontSize: "0.72rem", color: C.green, fontWeight: 600, borderBottom: `1px solid ${C.gold}`, paddingBottom: "6%" }}>
                  {levelName.toUpperCase()}
                </div>
                <div style={{ fontFamily: SCRIPT, fontSize: "1.4rem", color: C.ink, marginTop: "8%" }}>{prettyDate(date)}</div>
                <div style={{ letterSpacing: "0.18em", fontSize: "0.68rem", color: C.ink, borderTop: `1px solid ${C.gold}`, paddingTop: "3%", marginTop: "2%" }}>
                  DATE
                </div>
              </div>

              <Seal />

              {/* Signature */}
              <div style={{ textAlign: "center", minWidth: "26%" }}>
                <div style={{ fontFamily: SCRIPT, fontSize: "1.9rem", color: C.ink, lineHeight: 1 }}>{teacher || " "}</div>
                <div style={{ borderTop: `1px solid ${C.gold}`, marginTop: "3%", paddingTop: "3%", letterSpacing: "0.18em", fontSize: "0.72rem", color: C.ink, fontWeight: 600 }}>
                  TEACHER
                </div>
                <div style={{ fontSize: "0.86rem", color: C.ink, marginTop: "2%" }}>{teacher}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "1.4% 0 2.2%" }}>
      <span style={{ width: 90, height: 2, background: C.gold }} />
      <span style={{ color: C.gold, fontSize: "0.9rem" }}>❖</span>
      <span style={{ width: 90, height: 2, background: C.gold }} />
    </div>
  );
}

function Seal() {
  return (
    <svg width="118" height="148" viewBox="0 0 118 148" fill="none" aria-hidden style={{ flexShrink: 0 }}>
      {/* ribbons */}
      <path d="M44 96 L40 140 L54 128 L59 138 L59 96 Z" fill={C.green} />
      <path d="M74 96 L78 140 L64 128 L59 138 L59 96 Z" fill={C.greenInk} />
      {/* scalloped gold edge */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return <circle key={i} cx={59 + Math.cos(a) * 46} cy={56 + Math.sin(a) * 46} r="7" fill={C.gold} />;
      })}
      <circle cx="59" cy="56" r="46" fill={C.gold} />
      <circle cx="59" cy="56" r="40" fill={C.green} />
      <circle cx="59" cy="56" r="40" fill="none" stroke={C.gold} strokeWidth="1.5" />
      {/* laurels */}
      <path d="M30 56 q6 -18 22 -24" stroke={C.gold} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M88 56 q-6 -18 -22 -24" stroke={C.gold} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* mortarboard */}
      <path d="M59 42 L78 50 L59 58 L40 50 Z" fill={C.gold} />
      <path d="M59 58 L59 66 M67 53 L67 63 q-8 5 -16 0 L51 53" stroke={C.gold} strokeWidth="2.4" fill="none" />
    </svg>
  );
}

function Flourishes() {
  return (
    <>
      <Corner pos="tl" />
      <Corner pos="tr" />
      <Corner pos="bl" />
      <Corner pos="br" />
    </>
  );
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const base: React.CSSProperties = { position: "absolute", width: 70, height: 70 };
  const place: React.CSSProperties =
    pos === "tl"
      ? { top: "3.4%", left: "4%" }
      : pos === "tr"
        ? { top: "3.4%", right: "4%", transform: "scaleX(-1)" }
        : pos === "bl"
          ? { bottom: "3.4%", left: "4%", transform: "scaleY(-1)" }
          : { bottom: "3.4%", right: "4%", transform: "scale(-1,-1)" };
  return (
    <svg viewBox="0 0 74 74" fill="none" style={{ ...base, ...place }} aria-hidden>
      <path d="M6 64 C6 28 28 6 64 6" stroke={C.gold} strokeWidth="1.5" fill="none" />
      <path d="M12 64 C12 34 34 12 64 12" stroke={C.gold} strokeWidth="1" fill="none" opacity="0.8" />
      <circle cx="18" cy="58" r="2.5" fill={C.gold} />
    </svg>
  );
}
