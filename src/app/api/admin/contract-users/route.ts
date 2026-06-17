import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/server/adminGuard";
import { listAccounts } from "@/lib/server/store";
import { formatCPF } from "@/lib/account";

export const runtime = "nodejs";

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const accounts = await listAccounts();
  const users = accounts
    .filter((a) => !a.isAdmin)
    .map((a) => ({
      userId: a.userId ?? "—",
      name: a.name,
      cpf: formatCPF(a.cpf),
      address: a.address,
      city: a.city,
      state: a.state,
    }));

  return NextResponse.json({ users });
}
