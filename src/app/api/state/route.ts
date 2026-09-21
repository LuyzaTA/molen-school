import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { getState, saveState, defaultState, type AppState } from "@/lib/server/store";
import { getLang } from "@/lib/server/lang";
import { isTargetLanguage } from "@/lib/language";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const language = await getLang();
  return NextResponse.json({ ...(await getState(session.sub, language)), language });
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
  // The client pins saves to the language it loaded; fall back to the cookie.
  const q = req.nextUrl.searchParams.get("lang");
  const language = isTargetLanguage(q) ? q : await getLang();
  await saveState(session.sub, next, language);
  return NextResponse.json({ ok: true });
}