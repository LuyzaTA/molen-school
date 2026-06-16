"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { WEEKDAYS, type AdminUserRow, type ClassSchedule } from "@/lib/account";
import { cn } from "@/lib/cn";

export default function AdminSchedulePage() {
  const [users, setUsers] = useState<AdminUserRow[] | null>(null);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null); // userId
  const [days, setDays] = useState<number[]>([]);
  const [time, setTime] = useState("18:00");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/users", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { users: [] }))
      .then((d) => setUsers((d.users ?? []).filter((u: AdminUserRow) => !u.isAdmin)));
  }, []);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = query.trim().toLowerCase();
    return users.filter((u) => !q || u.name.toLowerCase().includes(q) || u.userId.toLowerCase().includes(q));
  }, [users, query]);

  function startEdit(u: AdminUserRow) {
    setEditing(u.userId);
    setDays(u.schedule?.days ?? []);
    setTime(u.schedule?.time ?? "18:00");
  }

  function toggleDay(d: number) {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort()));
  }

  async function save() {
    if (!editing) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: editing, days, time }),
      });
      if (res.ok) {
        const d = await res.json();
        const schedule: ClassSchedule | null = d.schedule;
        setUsers((prev) => (prev ?? []).map((u) => (u.userId === editing ? { ...u, schedule } : u)));
        setEditing(null);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-wide space-y-6">
      <header className="pt-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Administration</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Scheduled classes</h1>
        <p className="mt-2 text-[15px] text-ink-muted">
          Set recurring weekly class days and times per student.
        </p>
      </header>

      <input
        className="input-field max-w-sm"
        placeholder="Search student by name or ID…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {users === null ? (
        <p className="py-8 text-center text-ink-subtle">Loading students…</p>
      ) : filtered.length === 0 ? (
        <Card className="text-center text-ink-muted">No students match.</Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((u) => (
            <Card key={u.userId} className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-ink">{u.name}</span>
                    <span className="font-mono text-xs text-ink-subtle">{u.userId}</span>
                    <Badge tone="neutral">{u.level}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-ink-muted">{scheduleSummary(u.schedule)}</p>
                </div>
                {editing !== u.userId && (
                  <Button size="sm" variant="secondary" onClick={() => startEdit(u)}>
                    {u.schedule ? "Edit schedule" : "Set schedule"}
                  </Button>
                )}
              </div>

              {editing === u.userId && (
                <div className="space-y-4 rounded-xl border border-border bg-base/50 p-4">
                  <div>
                    <p className="mb-2 text-sm font-medium text-ink">Days of the week</p>
                    <div className="flex flex-wrap gap-2">
                      {WEEKDAYS.map((label, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => toggleDay(i)}
                          aria-pressed={days.includes(i)}
                          className={cn(
                            "h-10 w-12 rounded-lg border text-sm font-medium transition-colors",
                            days.includes(i)
                              ? "border-accent bg-accent text-accent-ink"
                              : "border-border bg-surface text-ink-muted hover:border-accent",
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-end gap-4">
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-ink">Time</span>
                      <input
                        type="time"
                        className="input-field w-36"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      />
                    </label>
                    <div className="flex gap-2">
                      <Button size="md" disabled={busy} onClick={save}>
                        {busy ? "Saving…" : "Save schedule"}
                      </Button>
                      <Button size="md" variant="ghost" onClick={() => setEditing(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                  {days.length === 0 && (
                    <p className="text-xs text-ink-subtle">
                      No days selected — saving will clear this student&apos;s schedule.
                    </p>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function scheduleSummary(s: ClassSchedule | null): string {
  if (!s || !s.days.length) return "No classes scheduled.";
  const days = s.days.map((d) => WEEKDAYS[d]).join(", ");
  return `${days} at ${s.time}`;
}
