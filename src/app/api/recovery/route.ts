import { NextRequest, NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { hashPassword } from "@/lib/server/auth";
import { listAccounts, saveAccount, cpfToSub } from "@/lib/server/store";

export const runtime = "nodejs";

// Temporary diagnostic + recovery endpoint. Protected by AUTH_SECRET. Delete after use.
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  const secret = process.env.AUTH_SECRET ?? "";
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  // List ALL blobs to see what prefixes exist
  const { blobs } = await list({ limit: 100 });
  const pathnames = blobs.map((b) => b.pathname);
  const accounts = await listAccounts();
  return NextResponse.json({ blobCount: blobs.length, pathnames, accountCount: accounts.length });
}

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
    return NextResponse.json({ error: "No admin account found", accountCount: accounts.length }, { status: 404 });
  }

  admin.passwordHash = hashPassword(newPassword);
  await saveAccount(cpfToSub(admin.cpf), admin);

  return NextResponse.json({ ok: true, userId: admin.userId, name: admin.name });
}
