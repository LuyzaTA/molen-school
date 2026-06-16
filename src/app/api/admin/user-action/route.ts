import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/server/adminGuard";
import { updateAccountByUserId } from "@/lib/server/store";

export const runtime = "nodejs";

type Action = "approve" | "revoke" | "activate" | "deactivate";
const ACTIONS: Action[] = ["approve", "revoke", "activate", "deactivate"];

export async function POST(req: NextRequest) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: { userId?: string; action?: Action };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!body.userId || !body.action || !ACTIONS.includes(body.action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
  // An admin can't deactivate/revoke their own account.
  if (body.userId === admin.userId) {
    return NextResponse.json(
      { error: "You can't change your own admin account." },
      { status: 400 },
    );
  }

  const updated = await updateAccountByUserId(body.userId, (a) => {
    if (body.action === "approve") a.approved = true;
    else if (body.action === "revoke") a.approved = false;
    else if (body.action === "activate") a.active = true;
    else if (body.action === "deactivate") a.active = false;
  });

  if (!updated) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({
    ok: true,
    userId: updated.userId,
    approved: updated.approved,
    active: updated.active,
  });
}
