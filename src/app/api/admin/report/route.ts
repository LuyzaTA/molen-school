import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/server/adminGuard";
import { listAccounts, getState, cpfToSub } from "@/lib/server/store";
import { weekKey } from "@/lib/storage";
import { CEFR_LEVELS } from "@/lib/cefr";

export const runtime = "nodejs";

const dayWeek = (isoDay: string) => weekKey(new Date(isoDay + "T00:00:00"));

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const wk = weekKey();
  // Monday–Sunday bounds of the current ISO week (UTC).
  const now = new Date();
  const offset = (now.getUTCDay() + 6) % 7; // Mon=0
  const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - offset));
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  const accounts = await listAccounts();
  const students = accounts.filter((a) => !a.isAdmin && a.active !== false);

  const users = await Promise.all(
    students.map(async (a) => {
      const state = await getState(cpfToSub(a.cpf));
      const p = state.progress;
      const classDates = (p.history ?? [])
        .filter((h) => dayWeek(h.date) === wk)
        .map((h) => ({ date: h.date, topic: h.topic, level: h.level }));

      const weeklyHomeworkDone = Object.entries(state.weeklyDone ?? {}).filter(
        ([k, v]) => v && k.startsWith(`${a.level}:${wk}:`),
      ).length;

      const dailyHomeworkDays = Object.values(state.homeworkByDay ?? {}).filter(
        (hw) => hw.countedComplete && dayWeek(hw.date) === wk,
      ).length;

      return {
        userId: a.userId ?? "—",
        name: a.name,
        level: a.level,
        track: a.settings?.track ?? "general",
        classesThisWeek: classDates.length,
        classesTotal: p.classesCompleted ?? 0,
        classDates,
        schedule: a.schedule ?? null,
        scheduledPerWeek: a.schedule?.days.length ?? 0,
        weeklyHomeworkDone,
        dailyHomeworkDays,
        meetingsAttended: p.meetingsAttended ?? 0,
        streak: p.streak ?? 0,
        lastActiveDay: p.lastActiveDay ?? null,
        activeThisWeek: p.lastActiveDay ? dayWeek(p.lastActiveDay) === wk : false,
        vocabTotal: p.learnedVocab?.length ?? 0,
        grammarTotal: p.learnedGrammar?.length ?? 0,
      };
    }),
  );

  // Per-level aggregates.
  const perLevel: Record<string, {
    activeUsers: number;
    classesThisWeek: number;
    homeworkThisWeek: number;
    scheduledPerWeek: number;
    avgClassesPerUser: number;
  }> = {};
  for (const l of CEFR_LEVELS) {
    perLevel[l.level] = { activeUsers: 0, classesThisWeek: 0, homeworkThisWeek: 0, scheduledPerWeek: 0, avgClassesPerUser: 0 };
  }
  for (const u of users) {
    const row = perLevel[u.level];
    if (!row) continue;
    row.activeUsers += 1;
    row.classesThisWeek += u.classesThisWeek;
    row.homeworkThisWeek += u.weeklyHomeworkDone + u.dailyHomeworkDays;
    row.scheduledPerWeek += u.scheduledPerWeek;
  }
  for (const k of Object.keys(perLevel)) {
    const r = perLevel[k];
    r.avgClassesPerUser = r.activeUsers ? Math.round((r.classesThisWeek / r.activeUsers) * 10) / 10 : 0;
  }

  // Highest engagement first.
  users.sort((a, b) => b.classesThisWeek - a.classesThisWeek || b.classesTotal - a.classesTotal);

  return NextResponse.json({
    weekKey: wk,
    weekStart: monday.toISOString().slice(0, 10),
    weekEnd: sunday.toISOString().slice(0, 10),
    totals: {
      activeUsers: users.length,
      classesThisWeek: users.reduce((n, u) => n + u.classesThisWeek, 0),
      homeworkThisWeek: users.reduce((n, u) => n + u.weeklyHomeworkDone + u.dailyHomeworkDays, 0),
      activeThisWeek: users.filter((u) => u.activeThisWeek).length,
    },
    perLevel,
    users,
  });
}
