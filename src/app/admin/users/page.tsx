"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { AdminUserRow } from "@/lib/account";
import { cn } from "@/lib/cn";

type Action = "approve" | "revoke" | "activate" | "deactivate";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[] | null>(null);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending">("all");

  useEffect(() => {
    fetch("/api/admin/users", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { users: [] }))
      .then((d) => setUsers(d.users ?? []));
  }, []);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = query.trim().toLowerCase();
    return users
      .filter((u) => (filter === "pending" ? !u.approved && !u.isAdmin : true))
      .filter(
        (u) =>
          !q ||
          u.name.toLowerCase().includes(q) ||
          u.userId.toLowerCase().includes(q),
      );
  }, [users, query, filter]);

  async function act(userId: string, action: Action) {
    setBusyId(userId);
    try {
      const res = await fetch("/api/admin/user-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      if (res.ok) {
        const d = await res.json();
        setUsers((prev) =>
          (prev ?? []).map((u) =>
            u.userId === userId ? { ...u, approved: d.approved, active: d.active } : u,
          ),
        );
      }
    } finally {
      setBusyId(null);
    }
  }

  const pendingCount = users?.filter((u) => !u.approved && !u.isAdmin).length ?? 0;

  return (
    <div className="mx-auto max-w-wide space-y-6">
      <header className="pt-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Administration</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Users</h1>
        <p className="mt-2 text-[15px] text-ink-muted">
          Approve new registrations and manage student access.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <input
          className="input-field max-w-xs"
          placeholder="Search by name or ID…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex gap-1 rounded-pill bg-accent-soft p-1">
          {(["all", "pending"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-pill px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                filter === f ? "bg-surface text-ink shadow-sm" : "text-ink-muted hover:text-ink",
              )}
            >
              {f}
              {f === "pending" && pendingCount > 0 && (
                <span className="ml-1.5 rounded-full bg-gold px-1.5 text-xs text-white">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {users === null ? (
        <p className="py-8 text-center text-ink-subtle">Loading users…</p>
      ) : filtered.length === 0 ? (
        <Card className="text-center text-ink-muted">No users match.</Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((u) => (
            <Card key={u.userId} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-ink">{u.name}</span>
                  <span className="font-mono text-xs text-ink-subtle">{u.userId}</span>
                  {u.isAdmin && <Badge tone="accent">Admin</Badge>}
                  {!u.isAdmin && !u.approved && <Badge tone="warning">Pending</Badge>}
                  {!u.isAdmin && u.approved && <Badge tone="success">Approved</Badge>}
                  {!u.active && <Badge tone="danger">Inactive</Badge>}
                </div>
                <p className="mt-1 text-sm text-ink-muted">
                  {u.level} · {u.city}, {u.country} · joined {u.createdAt.slice(0, 10)}
                </p>
              </div>

              {!u.isAdmin && (
                <div className="flex shrink-0 flex-wrap gap-2">
                  {!u.approved ? (
                    <Button size="sm" disabled={busyId === u.userId} onClick={() => act(u.userId, "approve")}>
                      Approve
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" disabled={busyId === u.userId} onClick={() => act(u.userId, "revoke")}>
                      Revoke
                    </Button>
                  )}
                  {u.active ? (
                    <Button size="sm" variant="danger" disabled={busyId === u.userId} onClick={() => act(u.userId, "deactivate")}>
                      Deactivate
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" disabled={busyId === u.userId} onClick={() => act(u.userId, "activate")}>
                      Activate
                    </Button>
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
