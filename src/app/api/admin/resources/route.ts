import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/server/adminGuard";
import { getResources, saveResources } from "@/lib/server/store";
import { RESOURCES } from "@/lib/mockData";
import type { ResourceItem, ResourceCategory } from "@/lib/types";

export const runtime = "nodejs";

const CATEGORIES: ResourceCategory[] = ["podcast", "platform", "community"];

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const stored = await getResources();
  return NextResponse.json({ resources: stored ?? RESOURCES });
}

export async function PUT(req: NextRequest) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: { resources?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!Array.isArray(body.resources)) {
    return NextResponse.json({ error: "resources must be an array" }, { status: 400 });
  }

  const clean: ResourceItem[] = (body.resources as ResourceItem[])
    .filter((r) => r && typeof r.name === "string" && r.name.trim())
    .map((r) => ({
      name: String(r.name).trim(),
      category: CATEGORIES.includes(r.category) ? r.category : "podcast",
      free: r.free !== false,
      description: String(r.description ?? "").trim(),
      url: String(r.url ?? "").trim(),
    }));

  await saveResources(clean);
  return NextResponse.json({ ok: true, resources: clean });
}
