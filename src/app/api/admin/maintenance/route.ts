import { NextRequest, NextResponse } from "next/server";
import { listAccounts, cpfToSub } from "@/lib/server/store";
import { kvDelete } from "@/lib/server/blobKV";

export const runtime = "nodejs";

// TEMPORARY secret-gated maintenance. Removes existing admin account(s) so a
// fresh administrator can be registered. Gated by AUTH_SECRET. Remove after use.
export async function POST(req: NextRequest) {
  let body: { secret?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (!process.env.AUTH_SECRET || body.secret !== process.env.AUTH_SECRET) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const accounts = await listAccounts();
  let removed = 0;
  for (const a of accounts) {
    if (!a.isAdmin) continue;
    const sub = cpfToSub(a.cpf);
    await kvDelete(`users/${sub}`);
    await kvDelete(`state/${sub}`);
    if (a.userId) await kvDelete(`userid/${a.userId}`);
    removed += 1;
  }
  return NextResponse.json({ ok: true, removedAdmins: removed });
}
