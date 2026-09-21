import { NextResponse } from "next/server";
import { getResources } from "@/lib/server/store";
import { getLang } from "@/lib/server/lang";
import { defaultResources } from "@/lib/mockData";

export const runtime = "nodejs";

/** Resource library for the current course. Falls back to the seeded list. */
export async function GET() {
  const lang = await getLang();
  return NextResponse.json({ resources: (await getResources(lang)) ?? defaultResources(lang) });
}
