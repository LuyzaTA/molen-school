import { NextRequest, NextResponse } from "next/server";
import { isValidUserId, digitsOnly, DEFAULT_SETTINGS } from "@/lib/account";
import type { RegistrationInput, PaymentMethod } from "@/lib/account";
import { hashPassword } from "@/lib/server/auth";
import {
  accountExists,
  saveAccount,
  saveState,
  defaultState,
  cpfToSub,
  userIdExists,
  generateUniqueUserId,
  reserveUserId,
  countAdmins,
  type AccountRecord,
} from "@/lib/server/store";
import { CEFR_LEVELS } from "@/lib/cefr";

export const runtime = "nodejs";

const VALID_PAYMENTS: PaymentMethod[] = ["pix", "credit_card", "boleto"];
const VALID_LEVELS = CEFR_LEVELS.map((l) => l.level);

export async function POST(req: NextRequest) {
  let body: Partial<RegistrationInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const required: (keyof RegistrationInput)[] = [
    "name",
    "rg",
    "cpf",
    "address",
    "city",
    "state",
    "country",
    "password",
  ];
  for (const f of required) {
    if (!body[f] || typeof body[f] !== "string" || !(body[f] as string).trim()) {
      return NextResponse.json({ error: `Missing field: ${f}` }, { status: 400 });
    }
  }
  // CPF checksum validation intentionally skipped for now (presence is still
  // required above). CPF is used as the unique account key.
  if ((body.password as string).length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 },
    );
  }
  if (body.password !== body.repeatPassword) {
    return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
  }
  const paymentMethod = (body.paymentMethod ?? "pix") as PaymentMethod;
  if (!VALID_PAYMENTS.includes(paymentMethod)) {
    return NextResponse.json({ error: "Invalid payment method." }, { status: 400 });
  }
  const level = body.level && VALID_LEVELS.includes(body.level) ? body.level : "A1";

  try {
    const isAdmin = body.isAdmin === true;

    // Rule: only ONE administrator account may exist. Re-validated on every
    // new registration, so the constraint holds as users are added.
    if (isAdmin && (await countAdmins()) >= 1) {
      return NextResponse.json(
        { error: "An administrator account already exists. Only one is allowed." },
        { status: 409 },
      );
    }

    // Honour the read-only client id if it's still valid & free; otherwise
    // assign a fresh unique one server-side.
    let userId = body.userId as string;
    if (!isValidUserId(userId) || (await userIdExists(userId))) {
      userId = await generateUniqueUserId();
    }

    const record: AccountRecord = {
      userId,
      isAdmin,
      // Admins are always approved; students start pending until an admin approves.
      approved: isAdmin === true,
      active: true,
      schedule: null,
      name: (body.name as string).trim(),
      rg: (body.rg as string).trim(),
      cpf: digitsOnly(body.cpf as string),
      address: (body.address as string).trim(),
      city: (body.city as string).trim(),
      state: (body.state as string).trim(),
      country: (body.country as string).trim(),
      paymentMethod,
      passwordHash: hashPassword(body.password as string),
      level,
      registeredTrack: body.settings?.track === "business" ? "business" : "general",
      settings: { ...DEFAULT_SETTINGS, ...(body.settings ?? {}) },
      createdAt: new Date().toISOString(),
    };

    const sub = cpfToSub(record.cpf);
    await saveAccount(sub, record);
    await saveState(sub, defaultState());
    await reserveUserId(userId, sub);

    // Per spec: do NOT auto-login. The client redirects to /login.
    return NextResponse.json({ ok: true, userId });
  } catch (err) {
    console.error("register error:", err);
    return NextResponse.json(
      { error: "Could not create the account. Please try again." },
      { status: 500 },
    );
  }
}