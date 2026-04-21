// Vita Santé — design tokens (single source of truth)
// Imported by tailwind.config.ts. Consumed by components via Tailwind utilities.
// Changing a value here updates the whole app.

export const tokens = {
  // ── Colors ───────────────────────────────────────────────
  // Primary blue — institutional trust. Deep, never baby blue.
  primary: "#00346F",
  primaryContainer: "#004A99",
  primaryFixed: "#D7E2FF",

  // Secondary teal-green — healthcare warmth, Haitian nature
  secondary: "#046B5E",
  secondaryContainer: "#9DEFDE",
  secondaryFixed: "#A0F2E1",

  // Tertiary forest green — accents, labels
  tertiary: "#003F0B",
  tertiaryFixed: "#A3F69C",

  // Warm accent — Haitian terracotta. The "human" color.
  // Use for: secondary CTAs, human moments, testimonials, warmth.
  // Not for: medical data, status badges, forms.
  warm: "#D4804D",
  warmSubtle: "#F5E6DC",
  warmInk: "#6B3D1E",

  // Surfaces — slightly warmer than pure gray to avoid cold-hospital feel
  surface: "#FAFBFC",
  surfaceWarm: "#FAF4EC", // crème chaude — testimonial sections, alt backgrounds
  surfaceContainerLowest: "#FFFFFF",
  surfaceContainerLow: "#F2F4F6",
  surfaceContainer: "#ECEEF0",
  surfaceContainerHigh: "#E6E8EA",

  // Ink (text) — slate tinted warm, not pure black
  ink: "#1F2937",
  inkMuted: "#475569",
  inkSubtle: "#94A3B8",
  outline: "#64748B",
  outlineVariant: "#CBD5E1",

  // System
  error: "#BA1A1A",
  errorContainer: "#FFDAD6",

  // ── Typography ───────────────────────────────────────────
  fontHeadline: "Manrope, sans-serif",
  fontBody: "Inter, sans-serif",

  // Line heights tuned for French (longer words than English)
  leadingBody: "1.7",
  leadingHeadline: "1.1",

  // ── Spacing rhythm ───────────────────────────────────────
  radiusSm: "0.5rem",
  radiusMd: "0.75rem",
  radiusLg: "1rem",
  radiusXl: "1.5rem",
  radius2xl: "2rem",

  // ── Motion ───────────────────────────────────────────────
  // Gentle, not bouncy. Healthcare ≠ SaaS marketing.
  transitionFast: "120ms cubic-bezier(0.2, 0, 0, 1)",
  transitionMed: "240ms cubic-bezier(0.2, 0, 0, 1)",

  // ── Shadows ──────────────────────────────────────────────
  shadowClinical: "0 20px 40px rgba(0, 27, 63, 0.06)",
  shadowWarm: "0 20px 40px rgba(212, 128, 77, 0.12)",
} as const;
