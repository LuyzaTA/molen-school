import { NextResponse } from "next/server";
import { getMeetings } from "@/lib/server/store";
import { getLang } from "@/lib/server/lang";
import { defaultMeetings } from "@/lib/mockData";

export const runtime = "nodejs";

/** Meetings for the current course. Falls back to the seeded sample data. */
export async function GET() {
  const lang = await getLang();
  return NextResponse.json((await getMeetings(lang)) ?? defaultMeetings(lang));
}
