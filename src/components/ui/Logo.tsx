"use client";

import { cn } from "@/lib/cn";
import { WindmillMark } from "./WindmillMark";
import { useSettings } from "@/context/SettingsContext";
import { LANGUAGES, type TargetLanguage } from "@/lib/language";

// Heritage serif for the wordmark, echoing the printed logotype.
const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";

/**
 * Molen brand lockup: the crisp windmill mark plus a theme-aware serif
 * wordmark (dark "Molen" over green "English Classes" / "Dutch Classes").
 * The subtitle follows the course chosen at sign-in unless `language` is
 * given (the sign-in page previews the choice before a session exists).
 * `size` is the mark height in px; the wordmark scales with it.
 */
export function Logo({
  size = 44,
  withWordmark = true,
  language,
  className,
}: {
  size?: number;
  withWordmark?: boolean;
  language?: TargetLanguage;
  className?: string;
}) {
  const { profile } = useSettings();
  const brand = LANGUAGES[language ?? profile.language ?? "en"].brand;
  return (
    <span className={cn("inline-flex items-center", className)} style={{ gap: size * 0.26 }}>
      <WindmillMark size={size} />
      {withWordmark && (
        <span className="flex flex-col justify-center leading-none">
          <span
            className="font-bold text-ink"
            style={{ fontFamily: SERIF, fontSize: size * 0.62, letterSpacing: "-0.01em" }}
          >
            Molen
          </span>
          <span
            className="font-semibold uppercase text-green"
            style={{
              fontSize: size * 0.215,
              letterSpacing: size * 0.045,
              marginTop: size * 0.08,
            }}
          >
            {brand}
          </span>
        </span>
      )}
    </span>
  );
}