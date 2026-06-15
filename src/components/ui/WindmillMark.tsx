import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * The Molen windmill mark — the actual logo artwork (windmill tile with the
 * ornate gold frame), cropped from the brand image with a transparent
 * background so it sits cleanly on any surface, light or dark. Square.
 */
export function WindmillMark({
  size = 48,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src="/molen-mark.png"
      alt="Molen English Classes"
      width={size}
      height={size}
      priority
      className={cn("shrink-0", className)}
    />
  );
}
