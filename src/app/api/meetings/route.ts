import { NextResponse } from "next/server";
import { getMeetings } from "@/lib/server/store";
import { CONVERSATION_CIRCLES, BOOKING_SLOTS } from "@/lib/mockData";
import type { MeetingsConfig } from "@/lib/types";

export const runtime = "nodejs";

/** Current meetings shown to students. Falls back to the seeded sample data. */
export async function GET() {
  const stored = await getMeetings();
  const meetings: MeetingsConfig = stored ?? {
    circles: CONVERSATION_CIRCLES,
    slots: BOOKING_SLOTS,
  };
  return NextResponse.json(meetings);
}
