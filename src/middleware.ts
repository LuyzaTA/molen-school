import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require a session.
const PUBLIC = ["/login", "/register"];
const SESSION_COOKIE = "mes_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Old onboarding path now points at registration.
  if (pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/register", req.url));
  }

  const hasSession = req.cookies.has(SESSION_COOKIE);
  const isPublic = PUBLIC.some((p) => pathname === p || pathname.startsWith(p + "/"));

  // Not signed in → send to login (preserve intended destination).
  if (!hasSession && !isPublic) {
    const url = new URL("/login", req.url);
    if (pathname !== "/") url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Already signed in → keep them out of login/register.
  if (hasSession && isPublic) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except API routes, Next internals, and static files
  // (anything with a dot, e.g. molen-mark.png).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};