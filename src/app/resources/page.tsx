"use client";

import { useEffect, useMemo, useState } from "react";
import type { ResourceCategory, ResourceItem } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";

const CATEGORIES: { key: ResourceCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "podcast", label: "Podcasts" },
  { key: "platform", label: "Platforms" },
  { key: "community", label: "Native practice" },
];

export default function ResourcesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ResourceCategory | "all">("all");
  const [resources, setResources] = useState<ResourceItem[]>([]);

  useEffect(() => {
    fetch("/api/resources", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { resources: [] }))
      .then((d) => setResources(d.resources ?? []));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resources.filter((r) => {
      const matchesCat = category === "all" || r.category === category;
      const matchesQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [query, category, resources]);

  return (
    <div className="mx-auto max-w-content space-y-6">
      <header className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Resources
        </h1>
        <p className="mt-2 text-[15px] text-ink-muted">
          Free podcasts, platforms, and communities to keep speaking between
          classes.
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

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-ink-subtle">
          No resources match &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((r) => (
            <a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="h-full transition-colors group-hover:border-accent">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-semibold text-ink group-hover:text-accent">
                    {r.name}
                  </h2>
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
          ))}
        </div>
      )}
    </div>
  );
}