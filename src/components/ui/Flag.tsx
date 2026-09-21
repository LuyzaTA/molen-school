import type { ReactNode } from "react";

// Flag emojis don't render on Windows (they fall back to letter pairs like
// "NL"), so flags are drawn as tiny inline SVGs that look the same everywhere.
export type FlagCode = "gb" | "nl" | "br";

const FLAG_ART: Record<FlagCode, ReactNode> = {
  gb: (
    <>
      <rect width="30" height="21" fill="#012169" />
      <path d="M0 0 30 21M30 0 0 21" stroke="#FFFFFF" strokeWidth="4.2" />
      <path d="M0 0 30 21M30 0 0 21" stroke="#C8102E" strokeWidth="1.6" />
      <path d="M15 0v21M0 10.5h30" stroke="#FFFFFF" strokeWidth="7" />
      <path d="M15 0v21M0 10.5h30" stroke="#C8102E" strokeWidth="4.2" />
    </>
  ),
  nl: (
    <>
      <rect width="30" height="7" fill="#AE1C28" />
      <rect y="7" width="30" height="7" fill="#FFFFFF" />
      <rect y="14" width="30" height="7" fill="#21468B" />
    </>
  ),
  br: (
    <>
      <rect width="30" height="21" fill="#009C3B" />
      <path d="M15 3.2 26 10.5 15 17.8 4 10.5Z" fill="#FEDF00" />
      <circle cx="15" cy="10.5" r="4" fill="#002776" />
    </>
  ),
};

export function Flag({
  code,
  width = 20,
  className,
}: {
  code: FlagCode;
  width?: number;
  className?: string;
}) {
  const height = Math.round(width * 0.7);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 21"
      className={className}
      style={{ borderRadius: 2, boxShadow: "0 0 0 1px rgba(0,0,0,0.12)", flexShrink: 0 }}
      aria-hidden
    >
      {FLAG_ART[code]}
    </svg>
  );
}

/** Flag for a support/target language code ("en" → UK, "pt" → Brazil, "nl"). */
export function langFlag(lang: "en" | "nl" | "pt"): FlagCode {
  return lang === "nl" ? "nl" : lang === "pt" ? "br" : "gb";
}
