import type { Config } from "tailwindcss";

// Design tokens live in src/design-system/tokens.ts.
// This config extends Tailwind with those tokens + the legacy Material-3
// surface scale still used by existing components.

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primaries
        primary: "#00346f",
        "primary-container": "#004a99",
        "primary-fixed": "#d7e2ff",
        "primary-fixed-dim": "#abc7ff",
        "on-primary": "#ffffff",
        "on-primary-fixed": "#001b3f",
        "on-primary-fixed-variant": "#00458f",
        "on-primary-container": "#9bbdff",
        secondary: "#046b5e",
        "secondary-container": "#9defde",
        "secondary-fixed": "#a0f2e1",
        "secondary-fixed-dim": "#84d5c5",
        "on-secondary": "#ffffff",
        "on-secondary-fixed": "#00201b",
        "on-secondary-fixed-variant": "#005046",
        "on-secondary-container": "#0f6f62",
        tertiary: "#003f0b",
        "tertiary-container": "#005914",
        "tertiary-fixed": "#a3f69c",
        "tertiary-fixed-dim": "#88d982",
        "on-tertiary": "#ffffff",
        "on-tertiary-fixed": "#002204",
        "on-tertiary-fixed-variant": "#005312",
        "on-tertiary-container": "#7ecf79",

        // Warm palette — Haitian terracotta + cream
        warm: "#d4804d",
        "warm-subtle": "#f5e6dc",
        "warm-ink": "#6b3d1e",
        "warm-container": "#fae4d2",

        // Errors
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        // Surfaces
        surface: "#fafbfc",
        "surface-warm": "#faf4ec",
        "surface-dim": "#d8dadc",
        "surface-bright": "#fafbfc",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f4f6",
        "surface-container": "#eceef0",
        "surface-container-high": "#e6e8ea",
        "surface-container-highest": "#e0e3e5",
        "surface-variant": "#e0e3e5",
        "surface-tint": "#255dad",

        // Ink (text) — warm slate
        ink: "#1f2937",
        "ink-muted": "#475569",
        "ink-subtle": "#94a3b8",
        "on-surface": "#1f2937",
        "on-surface-variant": "#475569",
        "on-background": "#1f2937",
        background: "#fafbfc",
        outline: "#64748b",
        "outline-variant": "#cbd5e1",
        "inverse-surface": "#2d3133",
        "inverse-on-surface": "#eff1f3",
        "inverse-primary": "#abc7ff",
      },
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
      },
      boxShadow: {
        clinical: "0 20px 40px rgba(0, 27, 63, 0.06)",
        warm: "0 20px 40px rgba(212, 128, 77, 0.12)",
      },
      lineHeight: {
        // Tuned for French (longer words, slightly more generous than default)
        body: "1.7",
      },
      letterSpacing: {
        headline: "-0.02em",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config;
