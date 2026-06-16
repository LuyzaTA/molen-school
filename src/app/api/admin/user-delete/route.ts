import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/server/adminGuard";
import { deleteAccountByUserId } from "@/lib/server/store";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: { userId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!body.userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }
  if (body.userId === admin.userId) {
    return NextResponse.json({ error: "You can't delete your own account." }, { status: 400 });
  }

  const ok = await deleteAccountByUserId(body.userId);
  if (!ok) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
