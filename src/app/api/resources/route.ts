import { NextResponse } from "next/server";
import { getResources } from "@/lib/server/store";
import { RESOURCES } from "@/lib/mockData";

export const runtime = "nodejs";

/** Resource library shown to students. Falls back to the seeded list. */
export async function GET() {
  const stored = await getResources();
  return NextResponse.json({ resources: stored ?? RESOURCES });
}
