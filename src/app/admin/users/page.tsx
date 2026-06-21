"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PAYMENT_METHODS, type AdminUserRow, type PaymentMethod } from "@/lib/account";
import { CEFR_LEVELS } from "@/lib/cefr";
import type { CEFRLevel } from "@/lib/types";
import { cn } from "@/lib/cn";

type Action = "approve" | "revoke" | "activate" | "deactivate";

interface EditDraft {
  name: string;
  city: string;
  state: string;
  country: string;
  paymentMethod: PaymentMethod;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending">("all");
  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EditDraft | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function loadUsers() {
    setFetchError(null);
    setUsers(null);
    fetch("/api/admin/users", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) {
          const d = await r.json().catch(() => ({}));
          throw new Error(d.error || `HTTP ${r.status}`);
        }
        return r.json();
      })
      .then((d) => setUsers(d.users ?? []))
      .catch((e) => setFetchError(e.message));
  }

  useEffect(() => { loadUsers(); }, []);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = query.trim().toLowerCase();
    return users
      .filter((u) => (filter === "pending" ? !u.approved && !u.isAdmin : true))
      .filter((u) => !q || u.name.toLowerCase().includes(q) || u.userId.toLowerCase().includes(q));
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

  function startEdit(u: AdminUserRow) {
    setConfirmDeleteId(null);
    setEditId(u.userId);
    setDraft({
      name: u.name,
      city: u.city,
      state: u.state,
      country: u.country,
      paymentMethod: u.paymentMethod,
    });
  }

  async function saveEdit(userId: string) {
    if (!draft) return;
    setBusyId(userId);
    try {
      const res = await fetch("/api/admin/user-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, patch: draft }),
      });
      if (res.ok) {
        setUsers((prev) => (prev ?? []).map((u) => (u.userId === userId ? { ...u, ...draft } : u)));
        setEditId(null);
        setDraft(null);
      }
    } finally {
      setBusyId(null);
    }
  }

  async function changeLevel(userId: string, level: CEFRLevel) {
    setBusyId(userId);
    try {
      const res = await fetch("/api/admin/user-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, patch: { level } }),
      });
      if (res.ok) {
        setUsers((prev) => (prev ?? []).map((u) => (u.userId === userId ? { ...u, level } : u)));
      }
    } finally {
      setBusyId(null);
    }
  }

  async function remove(userId: string) {
    setBusyId(userId);
    try {
      const res = await fetch("/api/admin/user-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) setUsers((prev) => (prev ?? []).filter((u) => u.userId !== userId));
    } finally {
      setBusyId(null);
      setConfirmDeleteId(null);
    }
  }

  const pendingCount = users?.filter((u) => !u.approved && !u.isAdmin).length ?? 0;

  return (
    <div className="mx-auto max-w-wide space-y-6">
      <header className="pt-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Administration</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Users</h1>
        <p className="mt-2 text-[15px] text-ink-muted">
          Approve registrations, edit details, and manage access.
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
                <span className="ml-1.5 rounded-full bg-gold px-1.5 text-xs text-white">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {fetchError ? (
        <Card className="space-y-3 text-center">
          <p className="text-sm text-danger">{fetchError}</p>
          <Button size="sm" variant="secondary" onClick={loadUsers}>Retry</Button>
        </Card>
      ) : users === null ? (
        <p className="py-8 text-center text-ink-subtle">Loading users…</p>
      ) : filtered.length === 0 ? (
        <Card className="text-center text-ink-muted">No users match.</Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((u) => (
            <Card key={u.userId} className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                    {u.city}, {u.state}, {u.country} · joined {u.createdAt.slice(0, 10)}
                  </p>
                  {!u.isAdmin && (
                    <label className="mt-2 inline-flex items-center gap-2 text-sm">
                      <span className="font-medium text-ink-muted">CEFR level</span>
                      <select
                        className="rounded-lg border border-border bg-surface px-2 py-1 text-sm font-semibold text-ink"
                        value={u.level}
                        disabled={busyId === u.userId}
                        onChange={(e) => changeLevel(u.userId, e.target.value as CEFRLevel)}
                      >
                        {CEFR_LEVELS.map((l) => (
                          <option key={l.level} value={l.level}>
                            {l.level} · {l.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
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
                      <Button size="sm" variant="secondary" disabled={busyId === u.userId} onClick={() => act(u.userId, "deactivate")}>
                        Deactivate
                      </Button>
                    ) : (
                      <Button size="sm" variant="secondary" disabled={busyId === u.userId} onClick={() => act(u.userId, "activate")}>
                        Activate
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => (editId === u.userId ? setEditId(null) : startEdit(u))}>
                      {editId === u.userId ? "Close" : "Edit"}
                    </Button>
                    <Button size="sm" variant="danger" disabled={busyId === u.userId} onClick={() => setConfirmDeleteId(u.userId)}>
                      Remove
                    </Button>
                  </div>
                )}
              </div>

              {/* Inline edit */}
              {editId === u.userId && draft && (
                <div className="grid gap-3 rounded-xl border border-border bg-base/50 p-4 sm:grid-cols-2">
                  <EditField label="Name">
                    <input className="input-field" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                  </EditField>
                  <EditField label="City">
                    <input className="input-field" value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} />
                  </EditField>
                  <EditField label="State / Province">
                    <input className="input-field" value={draft.state} onChange={(e) => setDraft({ ...draft, state: e.target.value })} />
                  </EditField>
                  <EditField label="Country">
                    <input className="input-field" value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} />
                  </EditField>
                  <EditField label="Payment method">
                    <select className="input-field" value={draft.paymentMethod} onChange={(e) => setDraft({ ...draft, paymentMethod: e.target.value as PaymentMethod })}>
                      {PAYMENT_METHODS.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </EditField>
                  <div className="flex gap-2 sm:col-span-2">
                    <Button size="sm" disabled={busyId === u.userId} onClick={() => saveEdit(u.userId)}>
                      {busyId === u.userId ? "Saving…" : "Save changes"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setEditId(null); setDraft(null); }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Delete confirm */}
              {confirmDeleteId === u.userId && (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-danger/40 bg-danger/5 p-4">
                  <p className="text-sm text-ink">
                    Permanently remove <span className="font-semibold">{u.name}</span> ({u.userId})? This deletes their account and progress.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="danger" disabled={busyId === u.userId} onClick={() => remove(u.userId)}>
                      {busyId === u.userId ? "Removing…" : "Yes, remove"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setConfirmDeleteId(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function EditField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
