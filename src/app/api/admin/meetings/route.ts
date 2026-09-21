import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/server/adminGuard";
import { getMeetings, saveMeetings } from "@/lib/server/store";
import { getLang } from "@/lib/server/lang";
import { defaultMeetings } from "@/lib/mockData";
import type { MeetingsConfig, ConversationCircle, BookingSlot } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const lang = await getLang();
  return NextResponse.json((await getMeetings(lang)) ?? defaultMeetings(lang));
}

export async function PUT(req: NextRequest) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: Partial<MeetingsConfig>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const meetings: MeetingsConfig = {
    circles: Array.isArray(body.circles) ? (body.circles as ConversationCircle[]) : [],
    slots: Array.isArray(body.slots) ? (body.slots as BookingSlot[]) : [],
  };
  await saveMeetings(meetings, await getLang());
  return NextResponse.json({ ok: true, ...meetings });
}
