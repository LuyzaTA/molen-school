"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { HBarChart, ColumnChart } from "@/components/admin/Charts";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/cn";

interface Stats {
  userCount: number;
  adminCount: number;
  pendingCount: number;
  activeCount: number;
  inactiveCount: number;
  firstUser: { userId: string; name: string; createdAt: string } | null;
  lastUser: { userId: string; name: string; createdAt: string } | null;
  perLevel: Record<string, number>;
  registrationsByDay: { date: string; count: number }[];
  classesByDay: { date: string; count: number }[];
  classesTotal: number;
  classesThisWeek: number;
}

export default function AdminDashboard() {
  const { account } = useSettings();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setStats(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="py-12 text-center text-ink-subtle">Loading analytics…</p>;
  if (!stats) return <p className="py-12 text-center text-ink-subtle">Could not load analytics.</p>;

  const levelData = Object.entries(stats.perLevel).map(([label, value]) => ({ label, value }));

  return (
    <div className="mx-auto max-w-wide space-y-8">
      <header className="pt-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Analytics</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Overview</h1>
        <p className="mt-2 text-[15px] text-ink-muted">Platform statistics across all students.</p>
        {account && (
          <p className="mt-2 text-sm text-ink-subtle">
            Signed in as <span className="font-semibold text-ink">{account.userId}</span>
            {" "}· administrator
          </p>
        )}
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Students" value={stats.userCount} tone="accent" />
        <Stat label="Pending" value={stats.pendingCount} tone="gold" highlight={stats.pendingCount > 0} />
        <Stat label="Active" value={stats.activeCount} tone="green" />
        <Stat label="Inactive" value={stats.inactiveCount} tone="accent" />
        <Stat label="Classes (total)" value={stats.classesTotal} tone="green" />
        <Stat label="Classes (this week)" value={stats.classesThisWeek} tone="gold" />
      </div>

      {stats.pendingCount > 0 && (
        <Card className="flex flex-wrap items-center justify-between gap-3 border-gold/40 bg-gold-soft">
          <p className="text-sm font-medium text-ink">
            {stats.pendingCount} student{stats.pendingCount > 1 ? "s are" : " is"} waiting for approval.
          </p>
          <Link href="/admin/users" className="text-sm font-semibold text-accent hover:underline">
            Review now →
          </Link>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold text-ink">Students per level</h2>
          <HBarChart data={levelData} tone="accent" />
        </Card>
        <Card>
          <h2 className="mb-1 font-semibold text-ink">First &amp; latest student</h2>
          <dl className="mt-3 space-y-3 text-sm">
            <Meta label="First" v={stats.firstUser} />
            <Meta label="Latest" v={stats.lastUser} />
          </dl>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold text-ink">Registrations · last 14 days</h2>
          <ColumnChart data={stats.registrationsByDay} tone="accent" />
        </Card>
        <Card>
          <h2 className="mb-4 font-semibold text-ink">Classes completed · last 14 days</h2>
          <ColumnChart data={stats.classesByDay} tone="green" />
        </Card>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
  highlight,
}: {
  label: string;
  value: number;
  tone: "accent" | "green" | "gold";
  highlight?: boolean;
}) {
  const ring = { accent: "text-accent", green: "text-green", gold: "text-gold" }[tone];
  return (
    <Card padded={false} className={cn("p-4", highlight && "border-gold/50 bg-gold-soft")}>
      <div className={cn("text-2xl font-extrabold", ring)}>{value}</div>
      <div className="mt-0.5 text-xs text-ink-subtle">{label}</div>
    </Card>
  );
}

function Meta({ label, v }: { label: string; v: { userId: string; name: string; createdAt: string } | null }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-ink-subtle">{label}</dt>
      <dd className="text-right">
        {v ? (
          <>
            <span className="font-semibold text-ink">{v.name}</span>{" "}
            <span className="text-ink-subtle">({v.userId})</span>
            <span className="block text-xs text-ink-subtle">{v.createdAt.slice(0, 10)}</span>
          </>
        ) : (
          <span className="text-ink-subtle">—</span>
        )}
      </dd>
    </div>
  );
}
