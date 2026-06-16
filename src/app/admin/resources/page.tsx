"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { ResourceItem, ResourceCategory } from "@/lib/types";

const CATEGORY_OPTIONS: { value: ResourceCategory; label: string }[] = [
  { value: "podcast", label: "Podcasts" },
  { value: "platform", label: "Platforms" },
  { value: "community", label: "Native practice" },
];

const BLANK: ResourceItem = {
  name: "",
  category: "podcast",
  free: true,
  description: "",
  url: "",
};

export default function AdminResourcesPage() {
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/resources", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { resources: [] }))
      .then((d) => setItems(d.resources ?? []))
      .finally(() => setLoaded(true));
  }, []);

  function update(i: number, patch: Partial<ResourceItem>) {
    setSaved(false);
    setItems((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  function remove(i: number) {
    setSaved(false);
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }
  function add() {
    setSaved(false);
    setItems((prev) => [{ ...BLANK }, ...prev]);
  }

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/resources", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resources: items }),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.resources) setItems(d.resources);
        setSaved(true);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-wide space-y-6">
      <header className="pt-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Administration</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Resources</h1>
        <p className="mt-2 text-[15px] text-ink-muted">
          Manage the resource library students see — Podcasts, Platforms, and Native
          practice communities.
        </p>
      </header>

      <div className="sticky top-20 z-30 flex flex-wrap items-center gap-3">
        <Button variant="secondary" onClick={add} disabled={!loaded}>
          + Add resource
        </Button>
        <Button onClick={save} disabled={!loaded || saving}>
          {saving ? "Publishing…" : "Publish changes"}
        </Button>
        {saved && <span className="text-sm font-medium text-success">Published ✓</span>}
      </div>

      {!loaded ? (
        <p className="py-8 text-center text-ink-subtle">Loading resources…</p>
      ) : items.length === 0 ? (
        <Card className="text-center text-ink-muted">No resources yet — add one.</Card>
      ) : (
        <div className="space-y-3">
          {items.map((r, i) => (
            <Card key={i} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Name">
                  <input className="input-field" value={r.name} onChange={(e) => update(i, { name: e.target.value })} />
                </Field>
                <Field label="Type">
                  <select
                    className="input-field"
                    value={r.category}
                    onChange={(e) => update(i, { category: e.target.value as ResourceCategory })}
                  >
                    {CATEGORY_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="URL">
                  <input className="input-field" value={r.url} placeholder="https://…" onChange={(e) => update(i, { url: e.target.value })} />
                </Field>
                <Field label="Pricing">
                  <select
                    className="input-field"
                    value={r.free ? "free" : "paid"}
                    onChange={(e) => update(i, { free: e.target.value === "free" })}
                  >
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                  </select>
                </Field>
                <Field label="Description" full>
                  <input className="input-field" value={r.description} onChange={(e) => update(i, { description: e.target.value })} />
                </Field>
              </div>
              <div className="flex justify-end">
                <Button size="sm" variant="danger" onClick={() => remove(i)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={full ? "block sm:col-span-2" : "block"}>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
