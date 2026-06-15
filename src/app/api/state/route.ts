import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { getState, saveState, defaultState, type AppState } from "@/lib/server/store";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getState(session.sub));
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Partial<AppState>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const base = defaultState();
  const next: AppState = {
    progress: { ...base.progress, ...(body.progress ?? {}) },
    homeworkByDay: body.homeworkByDay ?? {},
    weeklyDone: body.weeklyDone ?? {},
  };
  await saveState(session.sub, next);
  return NextResponse.json({ ok: true });
}