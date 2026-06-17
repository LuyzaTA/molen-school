"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { WindmillMark } from "@/components/ui/WindmillMark";
import { CEFR_LEVELS } from "@/lib/cefr";
import type { CEFRLevel } from "@/lib/types";

const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
const SCRIPT = "'Snell Roundhand', 'Segoe Script', 'Brush Script MT', cursive";

const C = {
  parchment:   "#F5EDD0",
  parchment2:  "#EDE0BA",
  gold:        "#BF9838",
  darkBorder:  "#1C2218",
  green:       "#1E2A1E",
  greenMid:    "#3A5232",
  greenInk:    "#4A6840",
  maroon:      "#6E1822",
  ink:         "#252820",
};

type Pronoun = "her" | "his" | "their";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function prettyDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(+d)) return "—";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function AdminCertificatesPage() {
  const [name, setName]       = useState("");
  const [level, setLevel]     = useState<CEFRLevel>("A1");
  const [date, setDate]       = useState(todayISO());
  const [teacher, setTeacher] = useState("Luyza Alexandre");
  const [pronoun, setPronoun] = useState<Pronoun>("her");

  const levelName = CEFR_LEVELS.find((l) => l.level === level)?.name ?? "";

  return (
    <>
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 0; }
          body * { visibility: hidden; }
          #certificate, #certificate * { visibility: visible; }
          #certificate {
            position: fixed !important;
            inset: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            margin: 0 !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-wide space-y-6">
        <header className="pt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Administration</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Certificates</h1>
          <p className="mt-2 text-[15px] text-ink-muted">
            Fill in the details, then download the certificate as a PDF.
          </p>
        </header>

        <Card className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-ink">Student name</span>
            <input
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Maria Eduarda Silva"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">CEFR level</span>
            <select
              className="input-field"
              value={level}
              onChange={(e) => setLevel(e.target.value as CEFRLevel)}
            >
              {CEFR_LEVELS.map((l) => (
                <option key={l.level} value={l.level}>
                  {l.level} · {l.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Date</span>
            <input
              type="date"
              className="input-field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Teacher</span>
            <input
              className="input-field"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Pronoun</span>
            <select
              className="input-field"
              value={pronoun}
              onChange={(e) => setPronoun(e.target.value as Pronoun)}
            >
              <option value="her">her</option>
              <option value="his">his</option>
              <option value="their">their</option>
            </select>
          </label>
          <div className="sm:col-span-2">
            <Button onClick={() => window.print()} disabled={!name.trim()}>
              Download PDF
            </Button>
            <p className="mt-2 text-xs text-ink-subtle">
              Opens the print dialog — choose &ldquo;Save as PDF&rdquo;, landscape, no margins.
            </p>
          </div>
        </Card>

        <div className="overflow-x-auto">
          <Certificate
            name={name}
            level={level}
            levelName={levelName}
            date={date}
            teacher={teacher}
            pronoun={pronoun}
          />
        </div>
      </div>
    </>
  );
}

interface CertProps {
  name: string;
  level: string;
  levelName: string;
  date: string;
  teacher: string;
  pronoun: Pronoun;
}

function Certificate({ name, level, levelName, date, teacher, pronoun }: CertProps) {
  return (
    <div
      id="certificate"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 1000,
        margin: "0 auto",
        aspectRatio: "1.414 / 1",
        background: `linear-gradient(150deg, ${C.parchment} 0%, ${C.parchment2} 55%, ${C.parchment} 100%)`,
        color: C.ink,
        fontFamily: SERIF,
        boxSizing: "border-box",
        border: `10px solid ${C.darkBorder}`,
      }}
    >
      {/* Gold outer frame */}
      <div style={{ position: "absolute", inset: "2%", border: `4px solid ${C.gold}` }} />
      {/* Thin dark-green inner line */}
      <div style={{ position: "absolute", inset: "4%", border: `1.5px solid ${C.green}` }} />

      <Flourishes />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: "5.5%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.5%" }}>
          <WindmillMark size={64} />
          <div style={{ lineHeight: 1, textAlign: "left" }}>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "2.7rem", color: C.maroon }}>
              Molen
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                letterSpacing: "0.32em",
                color: C.greenInk,
                fontWeight: 700,
                marginTop: 4,
              }}
            >
              ENGLISH SCHOOL
            </div>
          </div>
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            color: C.maroon,
            fontSize: "2.8rem",
            margin: "2% 0 0",
          }}
        >
          Certificate of Achievement
        </h2>

        <Divider />

        <p style={{ letterSpacing: "0.24em", fontSize: "0.75rem", color: C.ink, margin: 0, fontWeight: 500 }}>
          THIS CERTIFICATE IS PROUDLY PRESENTED TO
        </p>

        {/* Student name */}
        <div
          style={{
            fontFamily: SCRIPT,
            fontSize: "3.6rem",
            color: C.green,
            lineHeight: 1.15,
            margin: "1.2% 0 0",
            padding: "0 4% 0.8%",
            borderBottom: `1px solid ${C.gold}`,
            minWidth: "56%",
          }}
        >
          {name.trim() || "Student Name"}
        </div>

        {/* Body text */}
        <p style={{ maxWidth: "72%", fontSize: "1rem", color: C.ink, margin: "2% 0 0", lineHeight: 1.65 }}>
          for {pronoun} outstanding dedication, active participation and excellent performance
          {"\n"}in English studies.
        </p>

        {/* Congrats */}
        <p style={{ fontFamily: SCRIPT, fontSize: "1.65rem", color: C.greenInk, margin: "1.2% 0 0" }}>
          Congratulations on your achievement!
        </p>

        {/* Footer */}
        <div
          style={{
            marginTop: "auto",
            width: "100%",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingBottom: "0.5%",
          }}
        >
          {/* Level + Date */}
          <div style={{ textAlign: "center", minWidth: "28%" }}>
            <DashLabel>CEFR LEVEL</DashLabel>
            <div
              style={{
                fontFamily: SERIF,
                fontWeight: 700,
                fontSize: "2.8rem",
                color: C.greenInk,
                lineHeight: 1,
                margin: "4% 0 3%",
              }}
            >
              {level}
            </div>
            <div style={{ borderBottom: `1px solid ${C.gold}`, paddingBottom: "8%", marginBottom: "8%" }}>
              <DashLabel>{levelName.toUpperCase()}</DashLabel>
            </div>
            <div style={{ fontFamily: SCRIPT, fontSize: "1.35rem", color: C.ink }}>
              {prettyDate(date)}
            </div>
            <div
              style={{
                letterSpacing: "0.2em",
                fontSize: "0.68rem",
                color: C.ink,
                borderTop: `1px solid ${C.gold}`,
                paddingTop: "4%",
                marginTop: "3%",
                fontWeight: 500,
              }}
            >
              DATE
            </div>
          </div>

          <Seal />

          {/* Teacher signature */}
          <div style={{ textAlign: "center", minWidth: "28%" }}>
            <div style={{ fontFamily: SCRIPT, fontSize: "1.9rem", color: C.ink, lineHeight: 1.2 }}>
              {teacher || " "}
            </div>
            <div
              style={{
                borderTop: `1px solid ${C.gold}`,
                marginTop: "4%",
                paddingTop: "4%",
                letterSpacing: "0.2em",
                fontSize: "0.68rem",
                color: C.ink,
                fontWeight: 600,
              }}
            >
              TEACHER
            </div>
            <div style={{ fontSize: "0.88rem", color: C.ink, marginTop: "2%" }}>{teacher}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
      <span style={{ height: 1, width: 20, background: C.gold, display: "inline-block" }} />
      <span style={{ letterSpacing: "0.16em", fontSize: "0.66rem", color: C.green, fontWeight: 700 }}>
        {children}
      </span>
      <span style={{ height: 1, width: 20, background: C.gold, display: "inline-block" }} />
    </div>
  );
}

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "1.6% 0 2.2%" }}>
      <span style={{ width: 100, height: 1.5, background: C.gold, display: "inline-block" }} />
      <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden>
        <circle cx="11" cy="7" r="3.5" fill={C.gold} />
        <circle cx="3.5" cy="7" r="2" fill={C.gold} />
        <circle cx="18.5" cy="7" r="2" fill={C.gold} />
        <line x1="5.5" y1="7" x2="7.5" y2="7" stroke={C.gold} strokeWidth="1" />
        <line x1="14.5" y1="7" x2="16.5" y2="7" stroke={C.gold} strokeWidth="1" />
      </svg>
      <span style={{ width: 100, height: 1.5, background: C.gold, display: "inline-block" }} />
    </div>
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
  const base: React.CSSProperties = { position: "absolute", width: 90, height: 90 };
  const place: React.CSSProperties =
    pos === "tl"
      ? { top: "2.8%", left: "3.2%" }
      : pos === "tr"
      ? { top: "2.8%", right: "3.2%", transform: "scaleX(-1)" }
      : pos === "bl"
      ? { bottom: "2.8%", left: "3.2%", transform: "scaleY(-1)" }
      : { bottom: "2.8%", right: "3.2%", transform: "scale(-1,-1)" };

  const g = C.gold;

  return (
    <svg viewBox="0 0 90 90" fill="none" style={{ ...base, ...place }} aria-hidden>
      {/* Two nested arcs forming the ornamental frame corner */}
      <path d="M 6 82 C 6 40 40 6 82 6" stroke={g} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path
        d="M 14 82 C 14 50 50 14 82 14"
        stroke={g}
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Scroll flourish at the top-right end */}
      <path
        d="M 82 6 C 75 3 67 9 70 18 C 72 24 81 21 79 15 C 78 10 73 11 74 16 C 74 19 77 20 78 18"
        stroke={g}
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      {/* Scroll flourish at the bottom-left end */}
      <path
        d="M 6 82 C 3 75 9 67 18 70 C 24 72 21 81 15 79 C 10 78 11 73 16 74 C 19 74 20 77 18 78"
        stroke={g}
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Inner diagonal accent line */}
      <path d="M 26 66 C 38 54 54 38 66 26" stroke={g} strokeWidth="0.9" fill="none" opacity="0.5" />

      {/* Apex dot */}
      <circle cx="22" cy="22" r="3" fill={g} />
      {/* End-cap dots */}
      <circle cx="82" cy="6" r="3.5" fill={g} />
      <circle cx="6" cy="82" r="3.5" fill={g} />
    </svg>
  );
}

function Seal() {
  const cx = 61, cy = 56;
  return (
    <svg width="124" height="156" viewBox="0 0 124 156" fill="none" aria-hidden style={{ flexShrink: 0 }}>
      {/* Ribbons */}
      <path d="M 46 96 L 41 152 L 56 136 L 62 150 L 62 96 Z" fill={C.green} />
      <path d="M 78 96 L 83 152 L 68 136 L 62 150 L 62 96 Z" fill={C.greenMid} />

      {/* Scalloped gold border */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
        return (
          <circle
            key={i}
            cx={cx + Math.cos(a) * 46}
            cy={cy + Math.sin(a) * 46}
            r="7.5"
            fill={C.gold}
          />
        );
      })}

      <circle cx={cx} cy={cy} r="46" fill={C.gold} />
      <circle cx={cx} cy={cy} r="40" fill={C.green} />
      <circle cx={cx} cy={cy} r="38" fill="none" stroke={C.gold} strokeWidth="2" />

      {/* Laurel wreath — left */}
      <path d="M 30 58 Q 33 48 40 44" stroke={C.gold} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M 34 63 Q 37 54 45 49" stroke={C.gold} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M 38 68 Q 42 60 50 56" stroke={C.gold} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.65" />
      {/* Laurel wreath — right */}
      <path d="M 92 58 Q 89 48 82 44" stroke={C.gold} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M 88 63 Q 85 54 77 49" stroke={C.gold} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M 84 68 Q 80 60 72 56" stroke={C.gold} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.65" />

      {/* Mortarboard */}
      <polygon
        points={`${cx},${cy - 18} ${cx + 22},${cy - 8} ${cx},${cy + 2} ${cx - 22},${cy - 8}`}
        fill={C.gold}
      />
      <path
        d={`M ${cx + 22} ${cy - 8} L ${cx + 22} ${cy + 6} Q ${cx} ${cy + 17} ${cx - 22} ${cy + 6} L ${cx - 22} ${cy - 8}`}
        stroke={C.gold}
        strokeWidth="2"
        fill={C.gold}
        opacity="0.35"
      />
      {/* Tassel */}
      <line x1={cx + 22} y1={cy - 8} x2={cx + 22} y2={cy + 6} stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" />
      <line x1={cx + 22} y1={cy + 6} x2={cx + 27} y2={cy + 15} stroke={C.gold} strokeWidth="2" strokeLinecap="round" />
      <circle cx={cx + 27} cy={cy + 17} r="2.2" fill={C.gold} />
    </svg>
  );
}
