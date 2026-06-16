import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/server/adminGuard";
import { getPricing, savePricing } from "@/lib/server/store";
import type { PricingMap } from "@/lib/account";
import { CEFR_LEVELS } from "@/lib/cefr";

export const runtime = "nodejs";

const LEVELS = CEFR_LEVELS.map((l) => l.level);

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json({ pricing: await getPricing() });
}

export async function PUT(req: NextRequest) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: { pricing?: Partial<PricingMap> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const current = await getPricing();
  const next = { ...current } as PricingMap;
  for (const level of LEVELS) {
    const v = body.pricing?.[level];
    if (typeof v === "number" && isFinite(v) && v >= 0) {
      next[level] = Math.round(v * 100) / 100;
    }
  }
  await savePricing(next);
  return NextResponse.json({ ok: true, pricing: next });
}
