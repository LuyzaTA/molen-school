import { NextRequest, NextResponse } from "next/server";
import { kvSet } from "@/lib/server/blobKV";
import { Resend } from "resend";

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
  const phone   = body.phone?.trim()   || null;

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
    id, name, email, phone, message,
    createdAt: new Date().toISOString(),
  };

  await kvSet(`contacts/${id}`, record);

  // Send notification email if RESEND_API_KEY is configured
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Molen Contact <onboarding@resend.dev>",
      to: "alexandre.t.luyza@gmail.com",
      replyTo: email,
      subject: `New contact from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap">${message}</p>
      `,
    });
  }

  return NextResponse.json({ ok: true });
}
