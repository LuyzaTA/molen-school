import { NextRequest, NextResponse } from "next/server";
import { isValidCPF } from "@/lib/account";
import { verifyPassword, setSessionCookie } from "@/lib/server/auth";
import { getAccount, cpfToSub } from "@/lib/server/store";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { cpf?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!body.cpf || !body.password || !isValidCPF(body.cpf)) {
    return NextResponse.json({ error: "Invalid CPF or password." }, { status: 400 });
  }

  try {
    const sub = cpfToSub(body.cpf);
    const account = await getAccount(sub);
    // Same generic error whether the account is missing or the password is
    // wrong, so we don't reveal which CPFs are registered.
    if (!account || !verifyPassword(body.password, account.passwordHash)) {
      return NextResponse.json({ error: "Invalid CPF or password." }, { status: 401 });
    }
    await setSessionCookie(sub, account.name);
    return NextResponse.json({ ok: true, name: account.name });
  } catch (err) {
    console.error("login error:", err);
    return NextResponse.json({ error: "Could not sign in." }, { status: 500 });
  }
}