import { NextRequest, NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { hashPassword } from "@/lib/server/auth";
import { listAccounts, saveAccount, cpfToSub } from "@/lib/server/store";
import { kvGet } from "@/lib/server/blobKV";

export const runtime = "nodejs";

// Temporary diagnostic + recovery endpoint. Protected by AUTH_SECRET. Delete after use.
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  const secret = process.env.AUTH_SECRET ?? "";
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { blobs: allBlobs } = await list({ limit: 100 });
  const { blobs: userBlobs } = await list({ prefix: "users/", limit: 100 });

  // Try to fetch the first user blob directly
  let fetchTest: { url: string; status: number; body?: unknown } | null = null;
  if (userBlobs[0]) {
    const res = await fetch(userBlobs[0].url, { cache: "no-store" });
    fetchTest = { url: userBlobs[0].url, status: res.status, body: res.ok ? await res.json() : await res.text() };
  }

  const sub1 = "7c4e5aff23ad38e64042ab040ccb0381";
  const sub2 = "7d1d4fa6e25915b00f1ee20d90cc4d46";
  const [acc1, acc2] = await Promise.all([
    kvGet(`users/${sub1}`),
    kvGet(`users/${sub2}`),
  ]);

  return NextResponse.json({
    allBlobCount: allBlobs.length,
    userBlobCount: userBlobs.length,
    userBlobPathnames: userBlobs.map((b) => b.pathname),
    fetchTest,
    acc1: acc1 ? { userId: (acc1 as { userId?: string }).userId, isAdmin: (acc1 as { isAdmin?: boolean }).isAdmin } : null,
    acc2: acc2 ? { userId: (acc2 as { userId?: string }).userId, isAdmin: (acc2 as { isAdmin?: boolean }).isAdmin } : null,
  });
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
