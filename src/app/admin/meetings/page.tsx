"use client";

import { useEffect, useState } from "react";
import { Card, SectionHeading } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type {
  ConversationCircle,
  BookingSlot,
  Speaker,
  SpeakerBadge,
} from "@/lib/types";

const BADGES: SpeakerBadge[] = ["Native (US)", "Native (UK)", "Fluent C2 (BR)"];

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "x";
}
function lines(s: string): string[] {
  return s.split("\n").map((l) => l.trim()).filter(Boolean);
}
function toISO(local: string): string {
  const d = new Date(local);
  return isNaN(+d) ? new Date().toISOString() : d.toISOString();
}
function fmt(iso: string): string {
  const d = new Date(iso);
  return isNaN(+d) ? "—" : d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminMeetingsPage() {
  const [circles, setCircles] = useState<ConversationCircle[]>([]);
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/meetings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { circles: [], slots: [] }))
      .then((d) => {
        setCircles(d.circles ?? []);
        setSlots(d.slots ?? []);
      })
      .finally(() => setLoaded(true));
  }, []);

  async function saveAll() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/meetings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ circles, slots }),
      });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-wide space-y-6">
      <header className="pt-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Administration</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Meetings</h1>
        <p className="mt-2 text-[15px] text-ink-muted">
          Register live practice — Conversation Circles and bookable sessions. Changes
          appear on every student&apos;s Meetings page.
        </p>
      </header>

      <div className="sticky top-20 z-30 flex items-center gap-3">
        <Button onClick={saveAll} disabled={!loaded || saving}>
          {saving ? "Publishing…" : "Publish changes"}
        </Button>
        {saved && <span className="text-sm font-medium text-success">Published ✓</span>}
      </div>

      {!loaded ? (
        <p className="py-8 text-center text-ink-subtle">Loading meetings…</p>
      ) : (
        <>
          <CirclesManager circles={circles} setCircles={setCircles} />
          <SlotsManager slots={slots} setSlots={setSlots} />
        </>
      )}
    </div>
  );
}

// ---- Conversation Circles ----------------------------------

function CirclesManager({
  circles,
  setCircles,
}: {
  circles: ConversationCircle[];
  setCircles: React.Dispatch<React.SetStateAction<ConversationCircle[]>>;
}) {
  const [f, setF] = useState({
    title: "",
    speakerName: "",
    badge: BADGES[0] as SpeakerBadge,
    dateTime: "",
    format: "Small group · video",
    theme: "",
    levelRange: "B1–B2",
    phrases: "",
    warmUps: "",
  });

  function add() {
    if (!f.title.trim() || !f.speakerName.trim() || !f.dateTime) return;
    const iso = toISO(f.dateTime);
    const speaker: Speaker = {
      id: "sp-" + slug(f.speakerName),
      name: f.speakerName.trim(),
      badge: f.badge,
      bio: "",
    };
    const circle: ConversationCircle = {
      id: "cc-" + Date.now(),
      title: f.title.trim(),
      speaker,
      dateTime: iso,
      format: f.format.trim(),
      theme: f.theme.trim(),
      levelRange: f.levelRange.trim(),
      prepPackReleasesAt: new Date(+new Date(iso) - 48 * 3600 * 1000).toISOString(),
      prepPack: { phrases: lines(f.phrases), warmUpQuestions: lines(f.warmUps) },
    };
    setCircles((prev) => [...prev, circle]);
    setF({ ...f, title: "", speakerName: "", dateTime: "", theme: "", phrases: "", warmUps: "" });
  }

  return (
    <Card>
      <SectionHeading title="Conversation Circles" description="Monthly group sessions with a prep pack." />

      <div className="space-y-3">
        {circles.length === 0 && <p className="text-sm text-ink-subtle">No circles yet.</p>}
        {circles.map((c) => (
          <div key={c.id} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-surface p-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-ink">{c.title}</span>
                <Badge tone="accent">{c.levelRange}</Badge>
                <Badge>{c.speaker.badge}</Badge>
              </div>
              <p className="mt-1 text-sm text-ink-muted">
                {c.speaker.name} · {fmt(c.dateTime)} · {c.theme}
              </p>
            </div>
            <Button size="sm" variant="danger" onClick={() => setCircles((prev) => prev.filter((x) => x.id !== c.id))}>
              Remove
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 rounded-xl border border-border bg-base/50 p-4 sm:grid-cols-2">
        <L label="Title"><input className="input-field" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></L>
        <L label="Theme"><input className="input-field" value={f.theme} onChange={(e) => setF({ ...f, theme: e.target.value })} /></L>
        <L label="Host / speaker"><input className="input-field" value={f.speakerName} onChange={(e) => setF({ ...f, speakerName: e.target.value })} /></L>
        <L label="Speaker badge">
          <select className="input-field" value={f.badge} onChange={(e) => setF({ ...f, badge: e.target.value as SpeakerBadge })}>
            {BADGES.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </L>
        <L label="Date & time"><input type="datetime-local" className="input-field" value={f.dateTime} onChange={(e) => setF({ ...f, dateTime: e.target.value })} /></L>
        <L label="Level range"><input className="input-field" value={f.levelRange} onChange={(e) => setF({ ...f, levelRange: e.target.value })} /></L>
        <L label="Format"><input className="input-field" value={f.format} onChange={(e) => setF({ ...f, format: e.target.value })} /></L>
        <div className="hidden sm:block" />
        <L label="Prep phrases (one per line)"><textarea className="input-field min-h-20" value={f.phrases} onChange={(e) => setF({ ...f, phrases: e.target.value })} /></L>
        <L label="Warm-up questions (one per line)"><textarea className="input-field min-h-20" value={f.warmUps} onChange={(e) => setF({ ...f, warmUps: e.target.value })} /></L>
        <div className="sm:col-span-2">
          <Button size="sm" onClick={add}>Add circle</Button>
        </div>
      </div>
    </Card>
  );
}

// ---- Bookable session slots --------------------------------

function SlotsManager({
  slots,
  setSlots,
}: {
  slots: BookingSlot[];
  setSlots: React.Dispatch<React.SetStateAction<BookingSlot[]>>;
}) {
  const [f, setF] = useState({
    speakerName: "",
    badge: BADGES[0] as SpeakerBadge,
    dateTime: "",
    durationMin: 30,
    kind: "1:1" as "1:1" | "small-group",
    capacity: 1,
  });

  function add() {
    if (!f.speakerName.trim() || !f.dateTime) return;
    const speaker: Speaker = {
      id: "sp-" + slug(f.speakerName),
      name: f.speakerName.trim(),
      badge: f.badge,
      bio: "",
    };
    const slot: BookingSlot = {
      id: "bs-" + Date.now(),
      speakerId: speaker.id,
      speaker,
      dateTime: toISO(f.dateTime),
      durationMin: Number(f.durationMin) || 30,
      kind: f.kind,
      capacity: Math.max(1, Number(f.capacity) || 1),
      booked: 0,
    };
    setSlots((prev) => [...prev, slot]);
    setF({ ...f, speakerName: "", dateTime: "" });
  }

  return (
    <Card>
      <SectionHeading title="Bookable sessions" description="1:1 or small-group slots students can book." />

      <div className="space-y-3">
        {slots.length === 0 && <p className="text-sm text-ink-subtle">No slots yet.</p>}
        {slots.map((s) => (
          <div key={s.id} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-surface p-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-ink">{s.speaker?.name ?? s.speakerId}</span>
                {s.speaker && <Badge>{s.speaker.badge}</Badge>}
                <Badge tone="neutral">{s.kind}</Badge>
              </div>
              <p className="mt-1 text-sm text-ink-muted">
                {fmt(s.dateTime)} · {s.durationMin} min · capacity {s.capacity}
              </p>
            </div>
            <Button size="sm" variant="danger" onClick={() => setSlots((prev) => prev.filter((x) => x.id !== s.id))}>
              Remove
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 rounded-xl border border-border bg-base/50 p-4 sm:grid-cols-2">
        <L label="Speaker"><input className="input-field" value={f.speakerName} onChange={(e) => setF({ ...f, speakerName: e.target.value })} /></L>
        <L label="Speaker badge">
          <select className="input-field" value={f.badge} onChange={(e) => setF({ ...f, badge: e.target.value as SpeakerBadge })}>
            {BADGES.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </L>
        <L label="Date & time"><input type="datetime-local" className="input-field" value={f.dateTime} onChange={(e) => setF({ ...f, dateTime: e.target.value })} /></L>
        <L label="Duration (min)"><input type="number" min={15} step={15} className="input-field" value={f.durationMin} onChange={(e) => setF({ ...f, durationMin: Number(e.target.value) })} /></L>
        <L label="Kind">
          <select className="input-field" value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value as "1:1" | "small-group" })}>
            <option value="1:1">1:1</option>
            <option value="small-group">Small group</option>
          </select>
        </L>
        <L label="Capacity"><input type="number" min={1} className="input-field" value={f.capacity} onChange={(e) => setF({ ...f, capacity: Number(e.target.value) })} /></L>
        <div className="sm:col-span-2">
          <Button size="sm" onClick={add}>Add slot</Button>
        </div>
      </div>
    </Card>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
