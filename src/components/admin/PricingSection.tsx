"use client";

import { useEffect, useState } from "react";
import { Card, SectionHeading } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CEFR_LEVELS } from "@/lib/cefr";
import { DEFAULT_PRICING, type PricingMap } from "@/lib/account";

/** Admin-only: set the class price per CEFR level (platform-wide, in BRL). */
export function PricingSection() {
  const [pricing, setPricing] = useState<PricingMap>(DEFAULT_PRICING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/pricing", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.pricing && setPricing(d.pricing))
      .finally(() => setLoading(false));
  }, []);

  function setLevel(level: string, value: string) {
    const n = value === "" ? 0 : Number(value);
    if (!isFinite(n) || n < 0) return;
    setSaved(false);
    setPricing((p) => ({ ...p, [level]: n }));
  }

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pricing }),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.pricing) setPricing(d.pricing);
        setSaved(true);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <SectionHeading
        title="Class pricing"
        description="Price per class for each CEFR level (BRL). Used to project expected income from scheduled classes."
      />
      {loading ? (
        <p className="py-4 text-sm text-ink-subtle">Loading prices…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {CEFR_LEVELS.map((l) => (
              <label key={l.level} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3 py-2.5">
                <span className="text-sm">
                  <span className="font-semibold text-ink">{l.level}</span>{" "}
                  <span className="text-ink-subtle">· {l.name}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-sm text-ink-subtle">R$</span>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    inputMode="decimal"
                    className="w-24 rounded-lg border border-border bg-base px-2 py-1.5 text-right text-sm font-semibold text-ink"
                    value={pricing[l.level] ?? 0}
                    onChange={(e) => setLevel(l.level, e.target.value)}
                  />
                </span>
              </label>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save prices"}
            </Button>
            {saved && <span className="text-sm font-medium text-success">Saved ✓</span>}
          </div>
        </>
      )}
    </Card>
  );
}
