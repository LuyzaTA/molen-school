import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export function Card({ padded = true, className, ...rest }: CardProps) {
  return (
    <div
      className={cn("card", padded && "p-5 sm:p-6", className)}
      {...rest}
    />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1 text-xl font-semibold text-ink sm:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}