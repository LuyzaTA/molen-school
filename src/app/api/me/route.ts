import { NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { getAccount, saveAccount, countAdmins } from "@/lib/server/store";
import { maskCPF } from "@/lib/account";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  let account = await getAccount(session.sub);
  if (!account) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // If no admin exists yet, auto-promote this account so the platform is not
  // permanently locked out. Saves the change back to the store.
  if (!account.isAdmin && (await countAdmins()) === 0) {
    account = { ...account, isAdmin: true, approved: true };
    await saveAccount(session.sub, account);
  }

  // Client "profile" shape (settings + level + name). No sensitive data.
  return NextResponse.json({
    authenticated: true,
    profile: {
      name: account.name,
      level: account.level,
      ...account.settings,
      // registeredTrack is the authoritative source; settings.track may be stale
      // from the old dashboard toggle. Legacy accounts without registeredTrack
      // default to "general".
      track: account.registeredTrack ?? "general",
      createdAt: account.createdAt,
      onboarded: true,
    },
    account: {
      userId: account.userId,
      isAdmin: account.isAdmin === true,
      // Admins are always approved; legacy accounts default to approved.
      approved: account.isAdmin === true || account.approved !== false,
      active: account.active !== false,
      schedule: account.schedule ?? null,
      cpfMasked: maskCPF(account.cpf),
      city: account.city,
      state: account.state,
      country: account.country,
      paymentMethod: account.paymentMethod,
    },
  });
}