import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, setSessionCookie } from "@/lib/server/auth";
import { getSubByUserId, getAccount } from "@/lib/server/store";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { userId?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const userId = (body.userId || "").trim().toUpperCase();
  if (!userId || !body.password) {
    return NextResponse.json({ error: "Enter your User ID and password." }, { status: 400 });
  }

  try {
    const sub = await getSubByUserId(userId);
    const account = sub ? await getAccount(sub) : null;
    // Same generic error whether the user is missing or the password is wrong.
    if (!account || !verifyPassword(body.password, account.passwordHash)) {
      return NextResponse.json({ error: "Invalid User ID or password." }, { status: 401 });
    }
    await setSessionCookie(sub!, account.name);
    return NextResponse.json({ ok: true, name: account.name });
  } catch (err) {
    console.error("login error:", err);
    return NextResponse.json({ error: "Could not sign in." }, { status: 500 });
  }
}
