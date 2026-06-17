import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/server/auth";
import { listAccounts, saveAccount, cpfToSub } from "@/lib/server/store";

export const runtime = "nodejs";

// Temporary one-time password reset for the admin account.
// Protected by AUTH_SECRET — delete this file after use.
export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  const secret = process.env.AUTH_SECRET ?? "";
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { newPassword?: string };
  try { body = await req.json(); } catch { body = {}; }
  const newPassword = (body.newPassword ?? "").trim();
  if (newPassword.length < 6) {
    return NextResponse.json({ error: "newPassword must be >= 6 chars" }, { status: 400 });
  }

  const accounts = await listAccounts();
  const admin = accounts.find((a) => a.isAdmin);
  if (!admin) {
    return NextResponse.json({ error: "No admin account found" }, { status: 404 });
  }

  admin.passwordHash = hashPassword(newPassword);
  await saveAccount(cpfToSub(admin.cpf), admin);

  return NextResponse.json({ ok: true, userId: admin.userId, name: admin.name });
}
