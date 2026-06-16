import { cn } from "@/lib/cn";
import { WindmillMark } from "./WindmillMark";

// Heritage serif for the wordmark, echoing the printed logotype.
const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";

/**
 * Molen English Classes brand lockup: the crisp windmill mark plus a
 * theme-aware serif wordmark (dark "Molen" over green "English Classes").
 * `size` is the mark height in px; the wordmark scales with it.
 */
export function Logo({
  size = 44,
  withWordmark = true,
  className,
}: {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}) {
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
            English Classes
          </span>
        </span>
      )}
    </span>
  );
}