"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { WindmillMark } from "@/components/ui/WindmillMark";
import { CEFR_LEVELS } from "@/lib/cefr";
import type { CEFRLevel } from "@/lib/types";

const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
const SCRIPT = "'Snell Roundhand', 'Segoe Script', 'Brush Script MT', cursive";

const C = {
  parchment:  "#F5EDD0",
  parchment2: "#EDE0BA",
  gold:       "#BF9838",
  darkBorder: "#1C2218",
  green:      "#1E2A1E",
  greenMid:   "#3A5232",
  greenInk:   "#4A6840",
  maroon:     "#6E1822",
  ink:        "#252820",
};

type Pronoun = "her" | "his" | "their";

// All editable design tokens and their defaults.
interface Design {
  logoSize:        number;
  topMargin:       number;
  titleSize:       number;
  titleMargin:     number;
  dividerTopMargin:    number;
  dividerBottomMargin: number;
  nameSize:        number;
  nameMargin:      number;
  bodySize:        number;
  bodyMargin:      number;
  congratsSize:    number;
  congratsMargin:  number;
  cefrSize:        number;
  teacherSigSize:  number;
}

// Values from the saved admin configuration (image reference).
const DEFAULTS: Design = {
  logoSize:            68,
  topMargin:           30,
  titleSize:         2.25,
  titleMargin:         22,
  dividerTopMargin:    20,
  dividerBottomMargin:  4,
  nameSize:          2.15,
  nameMargin:          15,
  bodySize:          0.92,
  bodyMargin:          28,
  congratsSize:      1.28,
  congratsMargin:      12,
  cefrSize:          1.15,
  teacherSigSize:     1.3,
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function prettyDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(+d)) return "—";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

const CACHE_KEY = "molen-cert-design-cache";

export default function AdminCertificatesPage() {
  const [name, setName]       = useState("");
  const [level, setLevel]     = useState<CEFRLevel>("A1");
  const [date, setDate]       = useState(todayISO());
  const [teacher, setTeacher] = useState("Luyza Alexandre");
  const [pronoun, setPronoun] = useState<Pronoun>("her");
  const [design, setDesign]   = useState<Design>(() => {
    // Use localStorage cache for instant paint, then sync from server below.
    try {
      const cached = typeof window !== "undefined" && localStorage.getItem(CACHE_KEY);
      return cached ? { ...DEFAULTS, ...JSON.parse(cached) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });
  const [logoImg,  setLogoImg]  = useState<string | null>(null);
  const [sealImg,  setSealImg]  = useState<string | null>(null);
  const [cefrImg,  setCefrImg]  = useState<string | null>(null);
  const [showLayout, setShowLayout] = useState(false);
  const [saved, setSaved]     = useState(false);
  const [saving, setSaving]   = useState(false);

  function onImgUpload(setter: (v: string) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setter(reader.result as string);
      reader.readAsDataURL(file);
      e.target.value = "";
    };
  }

  const levelName = CEFR_LEVELS.find((l) => l.level === level)?.name ?? "";

  // On mount: pull the authoritative config from the server.
  useEffect(() => {
    fetch("/api/admin/cert-design")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.design) {
          const merged = { ...DEFAULTS, ...data.design };
          setDesign(merged);
          try { localStorage.setItem(CACHE_KEY, JSON.stringify(merged)); } catch {}
        }
      })
      .catch(() => {});
  }, []);

  async function saveConfig() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/cert-design", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ design }),
      });
      if (res.ok) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(design));
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch {}
    setSaving(false);
  }

  function setD<K extends keyof Design>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setDesign((d) => ({ ...d, [key]: Number(e.target.value) }));
  }

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
            Fill in the details, adjust the layout, then download as PDF.
          </p>
        </header>

        {/* ── Content fields ── */}
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
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Teacher</span>
            <input className="input-field" value={teacher} onChange={(e) => setTeacher(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Pronoun</span>
            <select className="input-field" value={pronoun} onChange={(e) => setPronoun(e.target.value as Pronoun)}>
              <option value="her">her</option>
              <option value="his">his</option>
              <option value="their">their</option>
            </select>
          </label>
          {/* Image uploads */}
          <div className="sm:col-span-2 space-y-2">
            <p className="text-sm font-semibold text-ink">Images (optional)</p>
            <div className="flex flex-wrap gap-6">
              <ImgUpload label="School logo" value={logoImg} onChange={onImgUpload(setLogoImg)} onClear={() => setLogoImg(null)} />
              <ImgUpload label="Seal / medallion" value={sealImg} onChange={onImgUpload(setSealImg)} onClear={() => setSealImg(null)} />
              <ImgUpload label="CEFR badge" value={cefrImg} onChange={onImgUpload(setCefrImg)} onClear={() => setCefrImg(null)} />
            </div>
          </div>

          <div className="sm:col-span-2 flex flex-wrap gap-3 items-center">
            <Button onClick={() => window.print()} disabled={!name.trim()}>Download PDF</Button>
            <button
              type="button"
              onClick={() => setShowLayout((v) => !v)}
              className="text-sm font-medium text-accent underline underline-offset-2"
            >
              {showLayout ? "Hide layout editor" : "Edit layout & sizes"}
            </button>
            {showLayout && (
              <>
                <button
                  type="button"
                  onClick={saveConfig}
                  disabled={saving}
                  className="text-sm font-medium text-accent underline underline-offset-2 disabled:opacity-50"
                >
                  {saved ? "Saved ✓" : saving ? "Saving…" : "Save configuration"}
                </button>
                <button
                  type="button"
                  onClick={() => setDesign(DEFAULTS)}
                  className="text-sm text-ink-muted underline underline-offset-2"
                >
                  Reset to defaults
                </button>
              </>
            )}
          </div>
          <p className="sm:col-span-2 text-xs text-ink-subtle -mt-1">
            Opens the print dialog — choose &ldquo;Save as PDF&rdquo;, landscape, no margins.
          </p>
        </Card>

        {/* ── Layout editor ── */}
        {showLayout && (
          <Card className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">Layout editor</p>

            <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              <p className="sm:col-span-2 text-xs font-semibold text-ink-muted uppercase tracking-wider">Font sizes</p>

              <SliderRow label="Logo size" value={design.logoSize} min={36} max={100} step={2} unit="px" onChange={setD("logoSize")} />
              <SliderRow label="Title" value={design.titleSize} min={1.4} max={3.5} step={0.05} unit="rem" onChange={setD("titleSize")} />
              <SliderRow label="Student name" value={design.nameSize} min={1.6} max={4.5} step={0.05} unit="rem" onChange={setD("nameSize")} />
              <SliderRow label="Body text" value={design.bodySize} min={0.6} max={1.3} step={0.02} unit="rem" onChange={setD("bodySize")} />
              <SliderRow label="Congratulations" value={design.congratsSize} min={0.8} max={2} step={0.02} unit="rem" onChange={setD("congratsSize")} />
              <SliderRow label="CEFR level (A1…)" value={design.cefrSize} min={0.9} max={2.5} step={0.05} unit="rem" onChange={setD("cefrSize")} />
              <SliderRow label="Teacher signature" value={design.teacherSigSize} min={1} max={2.5} step={0.05} unit="rem" onChange={setD("teacherSigSize")} />

              <p className="sm:col-span-2 text-xs font-semibold text-ink-muted uppercase tracking-wider pt-2">Spacing (px)</p>

              <SliderRow label="Top margin (logo)" value={design.topMargin} min={4} max={80} step={1} unit="px" onChange={setD("topMargin")} />
              <SliderRow label="Logo → Title" value={design.titleMargin} min={4} max={80} step={1} unit="px" onChange={setD("titleMargin")} />
              <SliderRow label="Divider top" value={design.dividerTopMargin} min={4} max={60} step={1} unit="px" onChange={setD("dividerTopMargin")} />
              <SliderRow label="Divider bottom" value={design.dividerBottomMargin} min={4} max={60} step={1} unit="px" onChange={setD("dividerBottomMargin")} />
              <SliderRow label="Label → Name" value={design.nameMargin} min={4} max={60} step={1} unit="px" onChange={setD("nameMargin")} />
              <SliderRow label="Name → Body" value={design.bodyMargin} min={4} max={60} step={1} unit="px" onChange={setD("bodyMargin")} />
              <SliderRow label="Body → Congratulations" value={design.congratsMargin} min={4} max={60} step={1} unit="px" onChange={setD("congratsMargin")} />
            </div>
          </Card>
        )}

        {/* ── Live preview ── */}
        <div className="overflow-x-auto">
          <Certificate
            name={name}
            level={level}
            levelName={levelName}
            date={date}
            teacher={teacher}
            pronoun={pronoun}
            design={design}
            logoImg={logoImg}
            sealImg={sealImg}
            cefrImg={cefrImg}
          />
        </div>
      </div>
    </>
  );
}

// ── Slider row component ──────────────────────────────────────────────────────
function SliderRow({
  label, value, min, max, step, unit, onChange,
}: {
  label: string; value: number; min: number; max: number;
  step: number; unit: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="text-sm tabular-nums text-ink-muted">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full accent-accent"
      />
    </label>
  );
}

// ── Certificate component ─────────────────────────────────────────────────────
interface CertProps {
  name: string; level: string; levelName: string;
  date: string; teacher: string; pronoun: Pronoun;
  design: Design;
  logoImg: string | null;
  sealImg: string | null;
  cefrImg: string | null;
}

function Certificate({ name, level, levelName, date, teacher, pronoun, design: d, logoImg, sealImg, cefrImg }: CertProps) {
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
      <div style={{ position: "absolute", inset: "2%", border: `4px solid ${C.gold}` }} />
      <div style={{ position: "absolute", inset: "4%", border: `1.5px solid ${C.green}` }} />
      <Flourishes />

      <div
        style={{
          position: "absolute",
          inset: "5.5%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: d.topMargin }}>
          {logoImg
            ? <img src={logoImg} alt="Logo" style={{ height: d.logoSize, maxWidth: d.logoSize * 2, objectFit: "contain", flexShrink: 0 }} />
            : <WindmillMark size={d.logoSize} />
          }
          <div style={{ lineHeight: 1, textAlign: "left" }}>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "2.1rem", color: C.maroon }}>Molen</div>
            <div style={{ fontSize: "0.72rem", letterSpacing: "0.32em", color: C.greenInk, fontWeight: 700, marginTop: 4 }}>
              ENGLISH SCHOOL
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 style={{ fontFamily: SERIF, fontWeight: 700, color: C.maroon, fontSize: `${d.titleSize}rem`, margin: `${d.titleMargin}px 0 0` }}>
          Certificate of Achievement
        </h2>

        <Divider topMargin={d.dividerTopMargin} bottomMargin={d.dividerBottomMargin} />

        <p style={{ letterSpacing: "0.22em", fontSize: "0.7rem", color: C.ink, margin: 0, fontWeight: 500 }}>
          THIS CERTIFICATE IS PROUDLY PRESENTED TO
        </p>

        {/* Student name */}
        <div style={{ fontFamily: SCRIPT, fontSize: `${d.nameSize}rem`, color: C.green, lineHeight: 1.15, marginTop: d.nameMargin, padding: "0 32px 6px", borderBottom: `1px solid ${C.gold}`, minWidth: "55%" }}>
          {name.trim() || "Student Name"}
        </div>

        {/* Body */}
        <p style={{ maxWidth: "72%", fontSize: `${d.bodySize}rem`, color: C.ink, margin: `${d.bodyMargin}px 0 0`, lineHeight: 1.6 }}>
          for {pronoun} outstanding dedication, active participation and excellent performance in English studies.
        </p>

        {/* Congratulations */}
        <p style={{ fontFamily: SCRIPT, fontSize: `${d.congratsSize}rem`, color: C.greenInk, margin: `${d.congratsMargin}px 0 0` }}>
          Congratulations on your achievement!
        </p>

        {/* Footer */}
        <div style={{ marginTop: "auto", width: "100%", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          {/* CEFR + Date */}
          <div style={{ textAlign: "center", minWidth: "28%" }}>
            <DashLabel>CEFR LEVEL</DashLabel>
            {cefrImg
              ? <img src={cefrImg} alt="CEFR" style={{ height: d.cefrSize * 28, maxWidth: 80, objectFit: "contain", margin: "3px auto", display: "block" }} />
              : <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: `${d.cefrSize}rem`, color: C.greenInk, lineHeight: 1, margin: "3px 0" }}>{level}</div>
            }
            <div style={{ borderBottom: `1px solid ${C.gold}`, paddingBottom: 5, marginBottom: 6 }}>
              <DashLabel>{levelName.toUpperCase()}</DashLabel>
            </div>
            <div style={{ fontFamily: SCRIPT, fontSize: "0.95rem", color: C.ink }}>{prettyDate(date)}</div>
            <div style={{ letterSpacing: "0.2em", fontSize: "0.62rem", color: C.ink, borderTop: `1px solid ${C.gold}`, paddingTop: 4, marginTop: 3, fontWeight: 500 }}>DATE</div>
          </div>

          {sealImg
            ? <img src={sealImg} alt="Seal" style={{ width: 100, height: 120, objectFit: "contain", flexShrink: 0 }} />
            : <Seal />
          }

          {/* Teacher */}
          <div style={{ textAlign: "center", minWidth: "28%" }}>
            <div style={{ fontFamily: SCRIPT, fontSize: `${d.teacherSigSize}rem`, color: C.ink, lineHeight: 1.2 }}>{teacher || " "}</div>
            <div style={{ borderTop: `1px solid ${C.gold}`, marginTop: 8, paddingTop: 6, letterSpacing: "0.2em", fontSize: "0.62rem", color: C.ink, fontWeight: 600 }}>TEACHER</div>
            <div style={{ fontSize: "0.82rem", color: C.ink, marginTop: 3 }}>{teacher}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function DashLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "center" }}>
      <span style={{ height: 1, width: 18, background: C.gold, display: "inline-block" }} />
      <span style={{ letterSpacing: "0.15em", fontSize: "0.6rem", color: C.green, fontWeight: 700 }}>{children}</span>
      <span style={{ height: 1, width: 18, background: C.gold, display: "inline-block" }} />
    </div>
  );
}

function Divider({ topMargin, bottomMargin }: { topMargin: number; bottomMargin: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: `${topMargin}px 0 ${bottomMargin}px` }}>
      <span style={{ width: 90, height: 1.5, background: C.gold, display: "inline-block" }} />
      <svg width="20" height="12" viewBox="0 0 22 14" aria-hidden>
        <circle cx="11" cy="7" r="3.5" fill={C.gold} />
        <circle cx="3.5" cy="7" r="2" fill={C.gold} />
        <circle cx="18.5" cy="7" r="2" fill={C.gold} />
        <line x1="5.5" y1="7" x2="7.5" y2="7" stroke={C.gold} strokeWidth="1" />
        <line x1="14.5" y1="7" x2="16.5" y2="7" stroke={C.gold} strokeWidth="1" />
      </svg>
      <span style={{ width: 90, height: 1.5, background: C.gold, display: "inline-block" }} />
    </div>
  );
}

function Flourishes() {
  return (<><Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" /></>);
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const base: React.CSSProperties = { position: "absolute", width: 90, height: 90 };
  const place: React.CSSProperties =
    pos === "tl" ? { top: "2.8%", left: "3.2%" }
    : pos === "tr" ? { top: "2.8%", right: "3.2%", transform: "scaleX(-1)" }
    : pos === "bl" ? { bottom: "2.8%", left: "3.2%", transform: "scaleY(-1)" }
    : { bottom: "2.8%", right: "3.2%", transform: "scale(-1,-1)" };
  const g = C.gold;
  return (
    <svg viewBox="0 0 90 90" fill="none" style={{ ...base, ...place }} aria-hidden>
      <path d="M 6 82 C 6 40 40 6 82 6" stroke={g} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 14 82 C 14 50 50 14 82 14" stroke={g} strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M 82 6 C 75 3 67 9 70 18 C 72 24 81 21 79 15 C 78 10 73 11 74 16 C 74 19 77 20 78 18" stroke={g} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M 6 82 C 3 75 9 67 18 70 C 24 72 21 81 15 79 C 10 78 11 73 16 74 C 19 74 20 77 18 78" stroke={g} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M 26 66 C 38 54 54 38 66 26" stroke={g} strokeWidth="0.9" fill="none" opacity="0.5" />
      <circle cx="22" cy="22" r="3" fill={g} />
      <circle cx="82" cy="6" r="3.5" fill={g} />
      <circle cx="6" cy="82" r="3.5" fill={g} />
    </svg>
  );
}

function ImgUpload({ label, value, onChange, onClear }: {
  label: string;
  value: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-ink-muted">{label}</span>
      {value ? (
        <div className="flex items-center gap-2">
          <img src={value} alt={label} className="h-10 max-w-[90px] object-contain rounded border border-border" />
          <button type="button" onClick={onClear} className="text-xs text-ink-muted underline hover:text-ink">Remove</button>
        </div>
      ) : (
        <label className="cursor-pointer inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M7 1v8M4 4l3-3 3 3M2 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Upload
          <input type="file" accept="image/*" className="sr-only" onChange={onChange} />
        </label>
      )}
    </div>
  );
}

// Rendered 100×120; viewBox 140×168 (same ratio = 0.714 scale).
function Seal() {
  const cx = 70, cy = 66;
  const GOLD = "#C8A020";
  const DG   = "#182816";
  const MG   = "#263828";

  const scR = 52, scr = 7, numSc = 20; // scallop params
  const grR = 45;                        // green circle radius
  const wR  = 33, nLv = 10;             // wreath leaf radius + count

  // Generate leaf positions: angles go from startDeg to endDeg inclusive.
  // Rotation = tangential (deg + 90) so the long axis follows the wreath arc.
  const mkLeaves = (startDeg: number, endDeg: number) =>
    Array.from({ length: nLv }).map((_, i) => {
      const deg = startDeg + (i / (nLv - 1)) * (endDeg - startDeg);
      const rad = deg * Math.PI / 180;
      return { x: cx + Math.cos(rad) * wR, y: cy + Math.sin(rad) * wR, rot: deg + 90 };
    });

  // Left branch: 95° (just right of bottom, SVG y-down) → 235° (upper-left)
  const leftLeaves  = mkLeaves(95, 235);
  // Right branch: 85° (just left of bottom) → −55° = 305° (upper-right)
  const rightLeaves = mkLeaves(85, -55);

  return (
    <svg width="100" height="120" viewBox="0 0 140 168" fill="none" aria-hidden style={{ flexShrink: 0 }}>

      {/* ── Ribbons (behind medal) ── */}
      <path d="M 48 114 L 70 114 L 70 162 L 57 145 L 44 162 Z" fill={DG}/>
      <path d="M 70 114 L 92 114 L 96 162 L 83 145 L 70 162 Z" fill={MG}/>

      {/* ── Scalloped gold outer ring ── */}
      {Array.from({ length: numSc }).map((_, i) => {
        const a = (i / numSc) * Math.PI * 2 - Math.PI / 2;
        return <circle key={i} cx={cx + Math.cos(a) * scR} cy={cy + Math.sin(a) * scR} r={scr} fill={GOLD}/>;
      })}
      <circle cx={cx} cy={cy} r={scR} fill={GOLD}/>

      {/* ── Dark green inner circle ── */}
      <circle cx={cx} cy={cy} r={grR} fill={DG}/>
      <circle cx={cx} cy={cy} r={grR} fill="none" stroke={GOLD} strokeWidth="2.5"/>

      {/* ── Laurel wreath — left branch ── */}
      {leftLeaves.map((lf, i) => (
        <ellipse key={`l${i}`}
          cx={lf.x} cy={lf.y} rx="2.8" ry="7.5"
          fill={GOLD}
          transform={`rotate(${lf.rot},${lf.x},${lf.y})`}
        />
      ))}

      {/* ── Laurel wreath — right branch ── */}
      {rightLeaves.map((lf, i) => (
        <ellipse key={`r${i}`}
          cx={lf.x} cy={lf.y} rx="2.8" ry="7.5"
          fill={GOLD}
          transform={`rotate(${lf.rot},${lf.x},${lf.y})`}
        />
      ))}

      {/* ── Mortarboard ── */}
      {/* Top board (diamond) */}
      <polygon
        points={`${cx},${cy-24} ${cx+21},${cy-14} ${cx},${cy-4} ${cx-21},${cy-14}`}
        fill={GOLD}
      />
      {/* Cap crown below board */}
      <path
        d={`M ${cx-17} ${cy-14} Q ${cx-17} ${cy-4} ${cx} ${cy-2} Q ${cx+17} ${cy-4} ${cx+17} ${cy-14}`}
        fill={GOLD}
      />
      {/* Button on top */}
      <circle cx={cx} cy={cy-24} r="2.2" fill={GOLD}/>
      {/* Tassel cord */}
      <line x1={cx+21} y1={cy-14} x2={cx+21} y2={cy-5} stroke={GOLD} strokeWidth="2.2" strokeLinecap="round"/>
      <line x1={cx+21} y1={cy-5}  x2={cx+26} y2={cy+5}  stroke={GOLD} strokeWidth="2"   strokeLinecap="round"/>
      {/* Tassel end */}
      <circle cx={cx+26} cy={cy+7} r="2.5" fill={GOLD}/>
    </svg>
  );
}
