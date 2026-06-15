"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-ink hover:opacity-90 active:opacity-100 disabled:opacity-50",
  secondary:
    "bg-surface text-ink border border-border hover:border-accent disabled:opacity-50",
  ghost: "bg-transparent text-ink-muted hover:text-ink hover:bg-accent-soft",
  danger: "bg-transparent text-danger border border-danger/40 hover:bg-danger/10",
};

const SIZES: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5 rounded-lg",
  md: "text-[15px] px-4 py-2.5 rounded-xl",
  lg: "text-base px-6 py-3.5 rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", block, className, ...rest }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-[opacity,colors,border] focus-visible:outline-2",
        "disabled:cursor-not-allowed",
        VARIANTS[variant],
        SIZES[size],
        block && "w-full",
        className,
      )}
      {...rest}
    />
  ),
);
Button.displayName = "Button";