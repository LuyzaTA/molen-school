import { cn } from "@/lib/cn";

const TILE = "#2E3A30"; // dark forest green
const GOLD = "#C79A4B"; // antique gold
const OLIVE = "#5D6B35"; // olive green
const CREAM = "#F5EFE0"; // mill house / hub

/**
 * The Molen windmill icon, rebuilt as crisp vector art in the heritage
 * palette: a dark forest-green tile with a gold frame, olive + gold blades,
 * and a cream mill house. Scales sharply to any size, matches the page.
 */
export function WindmillMark({
  size = 48,
  className,
}: {
  size?: number;
  className?: string;
}) {
  // One blade pointing up; rotated to the four diagonals. Opposite blades
  // share a colour: gold on the TL–BR diagonal, olive on TR–BL.
  const blades = [
    { rot: 45, fill: OLIVE }, // top-right  → olive
    { rot: 135, fill: GOLD }, // bottom-right → gold
    { rot: 225, fill: OLIVE }, // bottom-left → olive
    { rot: 315, fill: GOLD }, // top-left   → gold
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      role="img"
      aria-label="Molen English Classes"
      className={cn("shrink-0", className)}
    >
      {/* Tile + gold frame */}
      <rect x="2" y="2" width="96" height="96" rx="24" fill={TILE} />
      <rect
        x="6.5"
        y="6.5"
        width="87"
        height="87"
        rx="19"
        fill="none"
        stroke={GOLD}
        strokeWidth="2"
      />

      {/* Blades */}
      {blades.map((b) => (
        <rect
          key={b.rot}
          x="45.5"
          y="13"
          width="9"
          height="36"
          rx="4"
          fill={b.fill}
          transform={`rotate(${b.rot} 50 50)`}
        />
      ))}

      {/* Hub (cream ring) */}
      <circle cx="50" cy="50" r="7.5" fill={CREAM} />
      <circle cx="50" cy="50" r="3.4" fill={TILE} />

      {/* Mill house */}
      <path
        d="M40.5 84 L44.5 60 H55.5 L59.5 84 Q59.6 85 58.6 85 H41.4 Q40.4 85 40.5 84 Z"
        fill={CREAM}
      />
      <path
        d="M33 86 Q50 80 67 86"
        stroke={CREAM}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Window + arched door */}
      <rect x="48.4" y="65" width="3.2" height="3.2" rx="1" fill={TILE} />
      <path
        d="M47.6 84 V74.5 Q47.6 71 50 71 Q52.4 71 52.4 74.5 V84 Z"
        fill={TILE}
      />
    </svg>
  );
}