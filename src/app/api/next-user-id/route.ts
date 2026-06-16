import { NextResponse } from "next/server";
import { generateUniqueUserId } from "@/lib/server/store";

export const runtime = "nodejs";

// Returns a fresh, currently-unique student id for the registration form.
// The register route re-checks uniqueness, so a race here is harmless.
export async function GET() {
  try {
    return NextResponse.json({ userId: await generateUniqueUserId() });
  } catch {
    return NextResponse.json({ userId: null }, { status: 500 });
  }
}