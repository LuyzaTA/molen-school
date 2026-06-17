import { NextRequest, NextResponse } from "next/server";
import { kvSet } from "@/lib/server/blobKV";

export const runtime = "nodejs";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  createdAt: string;
}

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; phone?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name    = body.name?.trim()    ?? "";
  const email   = body.email?.trim()   ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const record: ContactSubmission = {
    id,
    name,
    email,
    phone: body.phone?.trim() || null,
    message,
    createdAt: new Date().toISOString(),
  };

  await kvSet(`contacts/${id}`, record);

  return NextResponse.json({ ok: true });
}
