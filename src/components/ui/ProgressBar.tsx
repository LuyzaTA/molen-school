import { cn } from "@/lib/cn";

export function ProgressBar({
  value,
  max = 100,
  className,
  label,
}: {
  value: number;
  max?: number;
  className?: string;
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-pill bg-accent-soft", className)}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className="h-full rounded-pill bg-accent transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}