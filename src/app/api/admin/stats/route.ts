import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/server/adminGuard";
import { listAccounts, listAllStates, getPricing } from "@/lib/server/store";
import { CEFR_LEVELS } from "@/lib/cefr";
import { weekKey } from "@/lib/storage";
import { WEEKS_PER_MONTH } from "@/lib/account";

export const runtime = "nodejs";

function lastNDays(n: number): string[] {
  const out: string[] = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const x = new Date(d);
    x.setDate(d.getDate() - i);
    out.push(x.toISOString().slice(0, 10));
  }
  return out;
}

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const accounts = await listAccounts();
  const students = accounts.filter((a) => !a.isAdmin);
  const byDateAsc = [...students].sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));

  const perLevel: Record<string, number> = {};
  for (const l of CEFR_LEVELS) perLevel[l.level] = 0;
  for (const s of students) perLevel[s.level] = (perLevel[s.level] ?? 0) + 1;

  const days = lastNDays(14);
  const regByDay = Object.fromEntries(days.map((d) => [d, 0]));
  for (const s of students) {
    const d = (s.createdAt || "").slice(0, 10);
    if (d in regByDay) regByDay[d] += 1;
  }

  // Class activity, aggregated across all students' histories.
  const states = await listAllStates();
  const classByDay = Object.fromEntries(days.map((d) => [d, 0]));
  let classesTotal = 0;
  let classesThisWeek = 0;
  const thisWeek = weekKey();
  for (const st of states) {
    classesTotal += st.progress?.classesCompleted ?? 0;
    for (const h of st.progress?.history ?? []) {
      if (h.date in classByDay) classByDay[h.date] += 1;
      if (weekKey(new Date(h.date + "T00:00:00")) === thisWeek) classesThisWeek += 1;
    }
  }

  // Expected income from recurring scheduled classes (active students only).
  const pricing = await getPricing();
  let weeklyClasses = 0;
  let weeklyIncome = 0;
  const incomeByLevel: Record<string, number> = {};
  for (const l of CEFR_LEVELS) incomeByLevel[l.level] = 0;
  for (const s of students) {
    if (s.active === false) continue;
    const n = s.schedule?.days?.length ?? 0;
    if (!n) continue;
    const price = pricing[s.level] ?? 0;
    weeklyClasses += n;
    weeklyIncome += n * price;
    incomeByLevel[s.level] += n * price * WEEKS_PER_MONTH;
  }

  const first = byDateAsc[0];
  const last = byDateAsc[byDateAsc.length - 1];
  const pick = (a?: (typeof students)[number]) =>
    a ? { userId: a.userId ?? "—", name: a.name, createdAt: a.createdAt } : null;

  return NextResponse.json({
    userCount: students.length,
    adminCount: accounts.length - students.length,
    pendingCount: students.filter((a) => a.approved === false).length,
    activeCount: students.filter((a) => a.active !== false).length,
    inactiveCount: students.filter((a) => a.active === false).length,
    firstUser: pick(first),
    lastUser: pick(last),
    perLevel,
    registrationsByDay: days.map((d) => ({ date: d, count: regByDay[d] })),
    classesByDay: days.map((d) => ({ date: d, count: classByDay[d] })),
    classesTotal,
    classesThisWeek,
    pricing,
    weeklyClasses,
    monthlyClasses: Math.round(weeklyClasses * WEEKS_PER_MONTH),
    weeklyIncome,
    monthlyIncome: weeklyIncome * WEEKS_PER_MONTH,
    incomeByLevel,
  });
}
