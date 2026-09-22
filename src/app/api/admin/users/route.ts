import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/server/adminGuard";
import {
  listAccounts,
  levelFor,
  scheduleFor,
  studiesLanguage,
  accountLanguages,
} from "@/lib/server/store";
import { getLang } from "@/lib/server/lang";
import { maskCPF, type AdminUserRow } from "@/lib/account";

export const runtime = "nodejs";

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Only this course's students (plus admins), with this course's level/schedule.
  const lang = await getLang();
  const accounts = (await listAccounts()).filter((a) => a.isAdmin || studiesLanguage(a, lang));
  const users: AdminUserRow[] = accounts.map((a) => ({
    userId: a.userId ?? "—",
    name: a.name,
    cpfMasked: maskCPF(a.cpf),
    rg: a.rg ?? "",
    address: a.address ?? "",
    level: levelFor(a, lang),
    isAdmin: a.isAdmin === true,
    approved: a.approved !== false,
    active: a.active !== false,
    city: a.city,
    state: a.state,
    country: a.country,
    paymentMethod: a.paymentMethod,
    createdAt: a.createdAt,
    schedule: scheduleFor(a, lang),
    languages: accountLanguages(a),
  }));

  return NextResponse.json({ users });
}
