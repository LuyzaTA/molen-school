import { NextRequest, NextResponse } from "next/server";
import { listAccounts } from "@/lib/server/store";

export const runtime = "nodejs";

// TEMPORARY secret-gated lookup of admin account IDs. Remove after use.
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
  const admins = (await listAccounts())
    .filter((a) => a.isAdmin)
    .map((a) => ({ userId: a.userId, name: a.name, createdAt: a.createdAt }));
  return NextResponse.json({ admins });
}
