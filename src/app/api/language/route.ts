import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { getAccount, saveAccount, startCourse } from "@/lib/server/store";
import { setLangCookie } from "@/lib/server/lang";
import { isTargetLanguage, isSupportLanguage } from "@/lib/language";

export const runtime = "nodejs";

/**
 * Switch the signed-in user's active course without signing out.
 * Body: { language: "en" | "nl", supportLang?: "en" | "pt" }.
 */
export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { language?: string; supportLang?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!isTargetLanguage(body.language)) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }

  const account = await getAccount(session.sub);
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const language = body.language;
  const supportLang = isSupportLanguage(body.supportLang) ? body.supportLang : undefined;
  if (startCourse(account, language, supportLang)) await saveAccount(session.sub, account);

  await setLangCookie(language);
  return NextResponse.json({ ok: true, language });
}
