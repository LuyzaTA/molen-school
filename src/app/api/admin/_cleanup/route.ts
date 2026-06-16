import { NextRequest, NextResponse } from "next/server";
import { list, del } from "@vercel/blob";

export const runtime = "nodejs";

// ONE-TIME maintenance endpoint to wipe seed/test data created during
// development. Gated by AUTH_SECRET. Remove after use.
export async function POST(req: NextRequest) {
  let body: { secret?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (!process.env.AUTH_SECRET || body.secret !== process.env.AUTH_SECRET) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let deleted = 0;
  for (const prefix of ["users/", "state/", "userid/", "meta/"]) {
    const { blobs } = await list({ prefix, limit: 1000 });
    if (blobs.length) {
      await del(blobs.map((b) => b.url));
      deleted += blobs.length;
    }
  }
  return NextResponse.json({ ok: true, deleted });
}
