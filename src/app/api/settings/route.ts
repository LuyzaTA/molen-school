import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { getAccount, saveAccount } from "@/lib/server/store";
import type { AccountSettings } from "@/lib/account";
import { CEFR_LEVELS } from "@/lib/cefr";

export const runtime = "nodejs";

const VALID_LEVELS = CEFR_LEVELS.map((l) => l.level);

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { level?: string; settings?: Partial<AccountSettings> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const account = await getAccount(session.sub);
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (body.level && (VALID_LEVELS as string[]).includes(body.level)) {
    account.level = body.level as (typeof VALID_LEVELS)[number];
  }
  if (body.settings && typeof body.settings === "object") {
    account.settings = { ...account.settings, ...body.settings };
  }
  await saveAccount(session.sub, account);
  return NextResponse.json({ ok: true });
}