import { NextResponse } from "next/server";
import { updateAccountByUserId } from "@/lib/server/store";

export const runtime = "nodejs";

// ONE-TIME USE: promotes M387388 to admin. Delete this file after use.
export async function GET() {
  const updated = await updateAccountByUserId("M387388", (a) => {
    a.isAdmin = true;
    a.approved = true;
  });
  if (!updated) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ ok: true, userId: updated.userId, isAdmin: updated.isAdmin, approved: updated.approved });
}
