import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/server/adminGuard";
import { getMeetings, saveMeetings } from "@/lib/server/store";
import { CONVERSATION_CIRCLES, BOOKING_SLOTS } from "@/lib/mockData";
import type { MeetingsConfig, ConversationCircle, BookingSlot } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const stored = await getMeetings();
  return NextResponse.json(
    stored ?? { circles: CONVERSATION_CIRCLES, slots: BOOKING_SLOTS },
  );
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
  await saveMeetings(meetings);
  return NextResponse.json({ ok: true, ...meetings });
}
