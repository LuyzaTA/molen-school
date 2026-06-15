import type { Config } from "tailwindcss";

/**
 * Colors are driven by CSS variables defined in globals.css so that the
 * theme can be swapped at runtime via [data-theme] and [data-autistic]
 * attributes on <html> without re-rendering React. Use the rgb(var(--x))
 * pattern so Tailwind opacity modifiers (e.g. bg-surface/50) still work.
 */
function withVar(variable: string) {
  return `rgb(var(${variable}) / <alpha-value>)`;
}

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        base: withVar("--c-base"),
        surface: withVar("--c-surface"),
        "surface-raised": withVar("--c-surface-raised"),
        border: withVar("--c-border"),
        ink: withVar("--c-ink"),
        "ink-muted": withVar("--c-ink-muted"),
        "ink-subtle": withVar("--c-ink-subtle"),
        accent: withVar("--c-accent"),
        "accent-soft": withVar("--c-accent-soft"),
        "accent-ink": withVar("--c-accent-ink"),
        green: withVar("--c-green"),
        "green-soft": withVar("--c-green-soft"),
        gold: withVar("--c-gold"),
        "gold-soft": withVar("--c-gold-soft"),
        mark: withVar("--c-mark"),
        success: withVar("--c-success"),
        warning: withVar("--c-warning"),
        danger: withVar("--c-danger"),
      },
      fontFamily: {
        sans: "var(--font-sans)",
      },
      borderRadius: {
        card: "var(--radius-card)",
        pill: "999px",
      },
      maxWidth: {
        content: "44rem",
        wide: "72rem",
      },
      transitionDuration: {
        DEFAULT: "var(--motion-fast)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in var(--motion-med) ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;