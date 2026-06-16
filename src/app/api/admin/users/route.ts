import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/server/adminGuard";
import { listAccounts } from "@/lib/server/store";
import { maskCPF, type AdminUserRow } from "@/lib/account";

export const runtime = "nodejs";

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const accounts = await listAccounts();
  const users: AdminUserRow[] = accounts.map((a) => ({
    userId: a.userId ?? "—",
    name: a.name,
    cpfMasked: maskCPF(a.cpf),
    level: a.level,
    isAdmin: a.isAdmin === true,
    approved: a.approved !== false,
    active: a.active !== false,
    city: a.city,
    state: a.state,
    country: a.country,
    paymentMethod: a.paymentMethod,
    createdAt: a.createdAt,
    schedule: a.schedule ?? null,
  }));

  return NextResponse.json({ users });
}
