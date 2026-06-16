import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/server/adminGuard";
import { updateAccountByUserId } from "@/lib/server/store";

export const runtime = "nodejs";

const TIME_RE = /^([01]?\d|2[0-3]):[0-5]\d$/;

export async function PUT(req: NextRequest) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: { userId?: string; days?: number[]; time?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!body.userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const days = Array.isArray(body.days)
    ? Array.from(new Set(body.days.filter((d) => Number.isInteger(d) && d >= 0 && d <= 6))).sort()
    : [];
  const time = body.time && TIME_RE.test(body.time) ? body.time : "18:00";

  const updated = await updateAccountByUserId(body.userId, (a) => {
    a.schedule = days.length ? { days, time } : null;
  });

  if (!updated) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ ok: true, schedule: updated.schedule });
}
