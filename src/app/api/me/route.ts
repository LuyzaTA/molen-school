import { NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { getAccount } from "@/lib/server/store";
import { maskCPF } from "@/lib/account";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  const account = await getAccount(session.sub);
  if (!account) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Client "profile" shape (settings + level + name). No sensitive data.
  return NextResponse.json({
    authenticated: true,
    profile: {
      name: account.name,
      level: account.level,
      ...account.settings,
      createdAt: account.createdAt,
      onboarded: true,
    },
    account: {
      cpfMasked: maskCPF(account.cpf),
      city: account.city,
      state: account.state,
      country: account.country,
      paymentMethod: account.paymentMethod,
    },
  });
}