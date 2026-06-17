import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/server/adminGuard";
import { getCertDesign, saveCertDesign, DEFAULT_CERT_DESIGN } from "@/lib/server/store";
import type { CertDesign } from "@/lib/server/store";

export const runtime = "nodejs";

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json({ design: await getCertDesign() });
}

export async function PUT(req: NextRequest) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: { design?: Partial<CertDesign> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const incoming = body.design ?? {};
  const next: CertDesign = { ...DEFAULT_CERT_DESIGN };
  for (const k of Object.keys(DEFAULT_CERT_DESIGN) as (keyof CertDesign)[]) {
    const v = incoming[k];
    if (typeof v === "number" && isFinite(v)) next[k] = v;
  }
  await saveCertDesign(next);
  return NextResponse.json({ ok: true, design: next });
}
