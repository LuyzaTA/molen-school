import type { ReactNode } from "react";

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

// Inline stroke icons keep the bundle tiny and inherit currentColor.
const I = (path: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
    aria-hidden
  >
    {path}
  </svg>
);

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Today",
    icon: I(
      <>
        <path d="M3 10.5 12 4l9 6.5" />
        <path d="M5 9.5V20h14V9.5" />
      </>,
    ),
  },
  {
    href: "/class",
    label: "Class",
    icon: I(
      <>
        <path d="M12 6.5C9 4 5 4 3 5v13c2-1 6-1 9 1 3-2 7-2 9-1V5c-2-1-6-1-9 1.5Z" />
        <path d="M12 6.5V20" />
      </>,
    ),
  },
  {
    href: "/homework",
    label: "Homework",
    icon: I(
      <>
        <path d="M9 5h6M5 5h.01M5 12h.01M5 19h.01" />
        <path d="M9 12h10M9 19h10M9 5h10" />
      </>,
    ),
  },
  {
    href: "/meetings",
    label: "Meetings",
    icon: I(
      <>
        <path d="M17 11a4 4 0 1 0-4-4" />
        <path d="M3 20a6 6 0 0 1 12 0" />
        <circle cx="9" cy="7" r="3" />
        <path d="M15 14a6 6 0 0 1 6 6" />
      </>,
    ),
  },
  {
    href: "/resources",
    label: "Resources",
    icon: I(
      <>
        <path d="M4 5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
        <path d="M14 3v5h5M8 13h8M8 17h6" />
      </>,
    ),
  },
  {
    href: "/progress",
    label: "Progress",
    icon: I(
      <>
        <path d="M4 19V5M4 19h16" />
        <path d="M8 16v-4M12 16V8M16 16v-6" />
      </>,
    ),
  },
];