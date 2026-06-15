"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { NAV_ITEMS } from "./navItems";
import { QuickSettings } from "./QuickSettings";
import { SiteFooter } from "./SiteFooter";
import { Logo } from "@/components/ui/Logo";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/cn";

// Auth pages render without the app chrome.
const BARE_ROUTES = ["/login", "/register", "/onboarding"];

/**
 * Top-level chrome: header (logo + quick settings + sign out), a desktop
 * side rail, and a mobile bottom nav. Unauthenticated users are redirected
 * to /login; the login & register pages render bare.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, authenticated } = useSettings();

  const isBare = BARE_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"));

  useEffect(() => {
    if (ready && !authenticated && !isBare) {
      router.replace("/login");
    }
  }, [ready, authenticated, isBare, router]);

  if (isBare) return <>{children}</>;

  // Avoid a flash of protected content before auth resolves.
  if (!ready || !authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-ink-subtle">
        <Logo withWordmark={false} size={52} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-base/80 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-wide items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="Molen English Classes home">
            <Logo size={52} />
          </Link>
          <div className="flex items-center gap-2">
            <QuickSettings />
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-wide gap-8 px-4 sm:px-6">
        {/* Desktop side nav */}
        <nav className="sticky top-20 hidden h-[calc(100vh-5rem)] w-52 shrink-0 flex-col gap-1 py-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
          ))}
          <SettingsNavLink active={pathname === "/settings"} />
        </nav>

        {/* Main content */}
        <main className="min-w-0 flex-1 py-6">{children}</main>
      </div>

      {/* Accessibility / neurodivergent-needs footer */}
      <div className="pb-24 md:pb-0">
        <SiteFooter />
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur md:hidden">
        <ul className="mx-auto flex max-w-wide items-stretch justify-around">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors",
                    active ? "text-accent" : "text-ink-subtle",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

function SignOutButton() {
  const router = useRouter();
  async function signOut() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.href = "/login";
    }
  }
  return (
    <button
      type="button"
      onClick={signOut}
      className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:bg-accent-soft hover:text-ink"
    >
      Sign out
    </button>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

function NavLink({ item, active }: { item: (typeof NAV_ITEMS)[number]; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors",
        active
          ? "bg-accent-soft text-ink"
          : "text-ink-muted hover:bg-accent-soft/60 hover:text-ink",
      )}
    >
      <span className={active ? "text-accent" : ""}>{item.icon}</span>
      {item.label}
    </Link>
  );
}

function SettingsNavLink({ active }: { active: boolean }) {
  return (
    <Link
      href="/settings"
      aria-current={active ? "page" : undefined}
      className={cn(
        "mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors",
        active ? "bg-accent-soft text-ink" : "text-ink-muted hover:bg-accent-soft/60 hover:text-ink",
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className={cn("h-5 w-5", active && "text-accent")}
        aria-hidden
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
      </svg>
      Settings
    </Link>
  );
}