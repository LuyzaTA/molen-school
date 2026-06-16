import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/server/adminGuard";
import { updateAccountByUserId } from "@/lib/server/store";
import { CEFR_LEVELS } from "@/lib/cefr";
import type { PaymentMethod } from "@/lib/account";

export const runtime = "nodejs";

const VALID_LEVELS = CEFR_LEVELS.map((l) => l.level) as string[];
const VALID_PAYMENTS: PaymentMethod[] = ["pix", "credit_card", "boleto"];

interface Patch {
  name?: string;
  level?: string;
  rg?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  paymentMethod?: PaymentMethod;
}

export async function POST(req: NextRequest) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: { userId?: string; patch?: Patch };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!body.userId || !body.patch) {
    return NextResponse.json({ error: "userId and patch are required" }, { status: 400 });
  }
  const p = body.patch;

  const updated = await updateAccountByUserId(body.userId, (a) => {
    if (typeof p.name === "string" && p.name.trim()) a.name = p.name.trim();
    if (p.level && VALID_LEVELS.includes(p.level)) a.level = p.level as typeof a.level;
    if (typeof p.rg === "string") a.rg = p.rg.trim();
    if (typeof p.address === "string") a.address = p.address.trim();
    if (typeof p.city === "string") a.city = p.city.trim();
    if (typeof p.state === "string") a.state = p.state.trim();
    if (typeof p.country === "string") a.country = p.country.trim();
    if (p.paymentMethod && VALID_PAYMENTS.includes(p.paymentMethod)) {
      a.paymentMethod = p.paymentMethod;
    }
  });

  if (!updated) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({
    ok: true,
    user: {
      userId: updated.userId,
      name: updated.name,
      level: updated.level,
      city: updated.city,
      state: updated.state,
      country: updated.country,
      paymentMethod: updated.paymentMethod,
    },
  });
}
