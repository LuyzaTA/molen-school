"use client";

import { useEffect, useMemo, useState } from "react";
import type { ResourceCategory, ResourceItem } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";

const CATEGORIES: { key: ResourceCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "podcast", label: "Podcasts" },
  { key: "platform", label: "Platforms" },
  { key: "community", label: "Native practice" },
];

function ResourceCard({ r, starred }: { r: ResourceItem; starred?: boolean }) {
  return (
    <a
      href={r.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group"
    >
      <Card
        className={cn(
          "h-full transition-colors group-hover:border-accent",
          starred && "border-gold/50 bg-gold-soft/30",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-1.5 min-w-0">
            {starred && (
              <span className="shrink-0 text-gold text-sm" aria-label="Favourite">★</span>
            )}
            <h2 className="font-semibold text-ink group-hover:text-accent truncate">
              {r.name}
            </h2>
          </div>
          <Badge tone={r.free ? "success" : "warning"}>
            {r.free ? "Free" : "Paid"}
          </Badge>
        </div>
        <p className="mt-1.5 text-sm text-ink-muted">{r.description}</p>
        <span className="mt-3 inline-block text-xs font-medium text-accent">
          Visit →
        </span>
      </Card>
    </a>
  );
}

function SectionHeader({
  label,
  tone,
  count,
}: {
  label: string;
  tone: "free" | "paid";
  count: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-sm font-bold uppercase tracking-wider",
          tone === "free"
            ? "bg-green-soft text-green"
            : "bg-gold-soft text-gold",
        )}
      >
        {tone === "free" ? "✓ Free" : "★ Paid"}
      </span>
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs text-ink-subtle">{count} resources</span>
    </div>
  );
}

export default function ResourcesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ResourceCategory | "all">("all");
  const [resources, setResources] = useState<ResourceItem[]>([]);

  useEffect(() => {
    fetch("/api/resources", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { resources: [] }))
      .then((d) => setResources(d.resources ?? []));
  }, []);

  const { featured, free, paid } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = resources.filter((r) => {
      const matchesCat = category === "all" || r.category === category;
      const matchesQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });

    const isSearching = q.length > 0 || category !== "all";
    return {
      featured: isSearching ? [] : filtered.filter((r) => r.featured),
      free: filtered.filter((r) => r.free && (isSearching || !r.featured)),
      paid: filtered.filter((r) => !r.free),
    };
  }, [query, category, resources]);

  const totalFiltered = featured.length + free.length + paid.length;

  return (
    <div className="mx-auto max-w-content space-y-8">
      <header className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Resources
        </h1>
        <p className="mt-2 text-[15px] text-ink-muted">
          Podcasts, platforms, and communities to keep speaking between classes.
        </p>
      </header>

      <div className="space-y-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search resources…"
          className="input-field"
          aria-label="Search resources"
        />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Chip
              key={c.key}
              selected={category === c.key}
              onClick={() => setCategory(c.key)}
            >
              {c.label}
            </Chip>
          ))}
        </div>
      </div>

      {totalFiltered === 0 ? (
        <p className="py-8 text-center text-ink-subtle">
          No resources match &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <div className="space-y-10">
          {/* ---- Favourites ---- */}
          {featured.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-accent-soft px-3 py-1 text-sm font-bold uppercase tracking-wider text-accent">
                  ★ Favourites
                </span>
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs text-ink-subtle">{featured.length} picks</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((r) => (
                  <ResourceCard key={r.name} r={r} starred />
                ))}
              </div>
            </section>
          )}

          {/* ---- Free ---- */}
          {free.length > 0 && (
            <section className="space-y-4">
              <SectionHeader label="Free" tone="free" count={free.length} />
              <div className="grid gap-3 sm:grid-cols-2">
                {free.map((r) => (
                  <ResourceCard key={r.name} r={r} />
                ))}
              </div>
            </section>
          )}

          {/* ---- Paid ---- */}
          {paid.length > 0 && (
            <section className="space-y-4">
              <SectionHeader label="Paid" tone="paid" count={paid.length} />
              <div className="grid gap-3 sm:grid-cols-2">
                {paid.map((r) => (
                  <ResourceCard key={r.name} r={r} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
