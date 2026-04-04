# Vita Santé Club Platform — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready Next.js application with 5 role-based portals (member, doctor, affiliate, sponsor, admin), Prisma/PostgreSQL persistence, NextAuth RBAC, Stripe payments, and bilingual (FR/EN) support — all faithfully reproducing the provided HTML screens.

**Architecture:** Next.js 14 App Router with route groups per role (`(public)`, `(member)`, `(doctor)`, `(affiliate)`, `(sponsor)`, `(admin)`). Each route group has its own layout with role-specific sidebar. Shared UI components extracted into a design-system library under `src/components/ui/`. Server Actions handle mutations; API routes handle webhooks (Stripe). Prisma ORM with PostgreSQL.

**Tech Stack:** Next.js 14, TypeScript, TailwindCSS 3, Prisma, PostgreSQL, NextAuth.js v5, Stripe, next-intl, Material Symbols (Google Fonts)

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx                          # Root layout (fonts, providers)
│   ├── globals.css                         # Tailwind + custom CSS (glass, gradients)
│   ├── (public)/
│   │   ├── layout.tsx                      # Public navbar + footer
│   │   ├── page.tsx                        # Landing page
│   │   ├── about/page.tsx                  # About Us
│   │   ├── plans/page.tsx                  # Plans comparison
│   │   ├── affiliate-program/page.tsx      # Affiliate info
│   │   └── auth/
│   │       ├── signin/page.tsx             # Sign in
│   │       └── signup/page.tsx             # Sign up / enrollment step 1
│   ├── (member)/
│   │   ├── layout.tsx                      # Member sidebar layout
│   │   ├── dashboard/page.tsx              # Member dashboard
│   │   ├── medical-card/page.tsx           # Digital medical card
│   │   ├── dependents/page.tsx             # Dependents management
│   │   ├── payments/page.tsx               # Payment history
│   │   └── enrollment/page.tsx             # Enrollment step 2+ flow
│   ├── (doctor)/
│   │   ├── layout.tsx                      # Doctor sidebar layout
│   │   ├── verification/page.tsx           # Patient verification tool
│   │   ├── patient-care/page.tsx           # Patient care / daily queue
│   │   ├── visit-history/page.tsx          # Visit history
│   │   └── profile/page.tsx               # Doctor profile
│   ├── (affiliate)/
│   │   ├── layout.tsx                      # Affiliate sidebar layout
│   │   ├── dashboard/page.tsx              # Affiliate dashboard
│   │   ├── referrals/page.tsx              # Referral tracking
│   │   ├── commissions/page.tsx            # Commissions & payments
│   │   └── marketing/page.tsx              # Marketing materials
│   ├── (sponsor)/
│   │   ├── layout.tsx                      # Sponsor sidebar layout
│   │   ├── overview/page.tsx               # Sponsor overview
│   │   ├── funded-members/page.tsx         # Funded members directory
│   │   ├── impact-reports/page.tsx         # Impact reports
│   │   ├── billing/page.tsx                # Billing & investment
│   │   └── sponsor-new/page.tsx            # Sponsor new members form
│   ├── (admin)/
│   │   ├── layout.tsx                      # Admin sidebar layout
│   │   ├── dashboard/page.tsx              # Mission control
│   │   ├── members/page.tsx                # Member management
│   │   ├── doctors/page.tsx                # Doctor registry
│   │   ├── affiliates/page.tsx             # Affiliate oversight
│   │   └── plans/page.tsx                  # Plan configuration
│   └── api/
│       ├── auth/[...nextauth]/route.ts     # NextAuth handler
│       └── webhooks/stripe/route.ts        # Stripe webhook
├── components/
│   ├── ui/
│   │   ├── button.tsx                      # Primary, secondary, ghost buttons
│   │   ├── card.tsx                        # Surface cards with tonal layering
│   │   ├── input.tsx                       # Text input, select, textarea
│   │   ├── badge.tsx                       # Status badges
│   │   ├── table.tsx                       # Data tables with pagination
│   │   ├── progress-bar.tsx                # Linear progress indicator
│   │   ├── stat-card.tsx                   # KPI metric cards
│   │   ├── modal.tsx                       # Dialog/modal with glass header
│   │   └── icon.tsx                        # Material Symbols wrapper
│   ├── layout/
│   │   ├── public-navbar.tsx               # Public site top nav
│   │   ├── public-footer.tsx               # Public site footer
│   │   ├── sidebar.tsx                     # Role-aware sidebar shell
│   │   ├── sidebar-items.ts               # Nav config per role
│   │   └── top-bar.tsx                     # Portal top bar (greeting, notifications, avatar)
│   └── shared/
│       ├── language-toggle.tsx             # FR/EN toggle
│       └── member-card-visual.tsx          # Digital card graphic
├── lib/
│   ├── auth.ts                             # NextAuth config (providers, callbacks)
│   ├── prisma.ts                           # Prisma client singleton
│   ├── stripe.ts                           # Stripe client init
│   └── utils.ts                            # Utility functions (cn, formatCurrency)
├── i18n/
│   ├── request.ts                          # next-intl server config
│   ├── routing.ts                          # Locale routing config
│   └── messages/
│       ├── en.json                         # English translations
│       └── fr.json                         # French translations
├── prisma/
│   ├── schema.prisma                       # Database schema
│   └── seed.ts                             # Seed data
├── middleware.ts                            # Auth + i18n middleware
├── tailwind.config.ts                      # Vita Azure design tokens
├── next.config.ts                          # Next.js config + next-intl plugin
├── package.json
└── tsconfig.json
```

---

## Phase 1: Project Foundation

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, `postcss.config.mjs`

- [ ] **Step 1: Create Next.js app**

```bash
cd d:/stitch-vitasante/stitch
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
```

Note: If prompted about overwriting existing files, accept. The existing HTML reference files are in subdirectories and won't conflict.

- [ ] **Step 2: Install core dependencies**

```bash
npm install prisma @prisma/client next-auth@beta @auth/prisma-adapter stripe next-intl clsx tailwind-merge
npm install -D @types/node
```

- [ ] **Step 3: Configure Tailwind with Vita Azure design tokens**

Replace `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
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
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
        surface: "#f7f9fb",
        "surface-dim": "#d8dadc",
        "surface-bright": "#f7f9fb",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f4f6",
        "surface-container": "#eceef0",
        "surface-container-high": "#e6e8ea",
        "surface-container-highest": "#e0e3e5",
        "surface-variant": "#e0e3e5",
        "surface-tint": "#255dad",
        "on-surface": "#191c1e",
        "on-surface-variant": "#424751",
        "on-background": "#191c1e",
        background: "#f7f9fb",
        outline: "#737783",
        "outline-variant": "#c2c6d3",
        "inverse-surface": "#2d3133",
        "inverse-on-surface": "#eff1f3",
        "inverse-primary": "#abc7ff",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "0.75rem",
      },
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
      },
      boxShadow: {
        clinical: "0 20px 40px rgba(0, 27, 63, 0.06)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config;
```

- [ ] **Step 4: Set up globals.css**

Replace `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .clinical-gradient {
    background: linear-gradient(135deg, #00346f 0%, #004a99 100%);
  }

  .glass-effect {
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .material-symbols-outlined {
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
  }
}
```

- [ ] **Step 5: Set up root layout with fonts**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vita Santé Club",
  description: "Premium health platform for Haiti and its Diaspora",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${manrope.variable} font-body bg-surface text-on-surface antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Create a simple landing page placeholder**

Replace `src/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <h1 className="font-headline text-4xl font-extrabold text-primary">
        Vita Santé Club
      </h1>
    </main>
  );
}
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts on http://localhost:3000 showing "Vita Santé Club" heading.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js 14 project with Vita Azure design tokens"
```

---

### Task 2: Utility Functions & Icon Component

**Files:**
- Create: `src/lib/utils.ts`, `src/components/ui/icon.tsx`

- [ ] **Step 1: Create utility functions**

Create `src/lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatMemberId(id: string): string {
  return id.replace(/(\w{4})(?=\w)/g, "$1 ");
}
```

- [ ] **Step 2: Create Material Symbols icon component**

Create `src/components/ui/icon.tsx`:

```tsx
import { cn } from "@/lib/utils";

interface IconProps {
  name: string;
  filled?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-5xl",
};

export function Icon({
  name,
  filled = false,
  size = "md",
  className,
}: IconProps) {
  return (
    <span
      className={cn("material-symbols-outlined", sizeMap[size], className)}
      style={
        filled
          ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }
          : undefined
      }
    >
      {name}
    </span>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/utils.ts src/components/ui/icon.tsx
git commit -m "feat: add utility functions and Material Symbols icon component"
```

---

### Task 3: Core UI Components

**Files:**
- Create: `src/components/ui/button.tsx`, `src/components/ui/card.tsx`, `src/components/ui/input.tsx`, `src/components/ui/badge.tsx`, `src/components/ui/stat-card.tsx`

- [ ] **Step 1: Create Button component**

Create `src/components/ui/button.tsx`:

```tsx
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "font-headline font-bold tracking-tight transition-all active:scale-95",
          {
            "clinical-gradient text-white shadow-lg hover:opacity-90":
              variant === "primary",
            "text-primary hover:bg-surface-container-high":
              variant === "secondary",
            "border-2 border-primary text-primary hover:bg-primary hover:text-white":
              variant === "ghost",
            "bg-error text-white hover:opacity-90": variant === "danger",
          },
          {
            "px-4 py-2 text-sm rounded-xl": size === "sm",
            "px-6 py-3 text-sm rounded-xl": size === "md",
            "px-8 py-4 text-lg rounded-xl": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
```

- [ ] **Step 2: Create Card component**

Create `src/components/ui/card.tsx`:

```tsx
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  surface?: "lowest" | "low" | "default" | "high";
}

export function Card({
  className,
  surface = "lowest",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-8",
        {
          "bg-surface-container-lowest": surface === "lowest",
          "bg-surface-container-low": surface === "low",
          "bg-surface-container": surface === "default",
          "bg-surface-container-high": surface === "high",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Create Input component**

Create `src/components/ui/input.tsx`:

```tsx
import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5",
            "text-on-surface font-body text-sm placeholder:text-outline",
            "focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none",
            "transition-colors",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
```

- [ ] **Step 4: Create Badge component**

Create `src/components/ui/badge.tsx`:

```tsx
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

interface BadgeProps {
  variant?: "success" | "warning" | "error" | "info" | "neutral";
  children: React.ReactNode;
  icon?: string;
  className?: string;
}

const variantStyles = {
  success:
    "bg-secondary-container text-on-secondary-container",
  warning:
    "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  error: "bg-error-container text-on-error-container",
  info: "bg-primary-fixed text-on-primary-fixed-variant",
  neutral: "bg-surface-container-high text-on-surface-variant",
};

export function Badge({
  variant = "neutral",
  children,
  icon,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold",
        variantStyles[variant],
        className
      )}
    >
      {icon && <Icon name={icon} size="sm" filled />}
      {children}
    </span>
  );
}
```

- [ ] **Step 5: Create StatCard component**

Create `src/components/ui/stat-card.tsx`:

```tsx
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  trendUp,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-surface-container-lowest rounded-2xl p-6 flex flex-col gap-3",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          {label}
        </span>
        <div className="w-10 h-10 bg-primary-fixed rounded-full flex items-center justify-center">
          <Icon name={icon} size="sm" className="text-primary" />
        </div>
      </div>
      <p className="text-3xl font-black text-primary tracking-tight">{value}</p>
      {trend && (
        <span
          className={cn(
            "text-xs font-semibold",
            trendUp ? "text-secondary" : "text-error"
          )}
        >
          {trend}
        </span>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Verify build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add core UI components (Button, Card, Input, Badge, StatCard)"
```

---

### Task 4: Layout Components (Navbar, Footer, Sidebar, TopBar)

**Files:**
- Create: `src/components/layout/public-navbar.tsx`, `src/components/layout/public-footer.tsx`, `src/components/layout/sidebar.tsx`, `src/components/layout/sidebar-items.ts`, `src/components/layout/top-bar.tsx`, `src/components/shared/language-toggle.tsx`

- [ ] **Step 1: Create language toggle**

Create `src/components/shared/language-toggle.tsx`:

```tsx
"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

export function LanguageToggle({ className }: { className?: string }) {
  const [locale, setLocale] = useState<"fr" | "en">("fr");

  return (
    <button
      onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
      className={cn(
        "text-primary font-bold border-b-2 border-primary font-headline text-sm tracking-tight",
        className
      )}
    >
      {locale === "fr" ? "FR" : "EN"} | {locale === "fr" ? "EN" : "FR"}
    </button>
  );
}
```

- [ ] **Step 2: Create public navbar**

Create `src/components/layout/public-navbar.tsx`:

```tsx
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { LanguageToggle } from "@/components/shared/language-toggle";

export function PublicNavbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 glass-effect shadow-sm">
      <nav className="flex justify-between items-center px-6 py-4 w-full max-w-screen-2xl mx-auto">
        <Link
          href="/"
          className="text-xl font-bold tracking-tighter text-primary font-headline"
        >
          Vita Santé Club
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="text-on-surface-variant hover:text-primary font-body text-sm transition-colors"
            >
              About
            </Link>
            <Link
              href="/plans"
              className="text-on-surface-variant hover:text-primary font-body text-sm transition-colors"
            >
              Plans
            </Link>
            <Link
              href="/affiliate-program"
              className="text-on-surface-variant hover:text-primary font-body text-sm transition-colors"
            >
              Affiliate
            </Link>
            <LanguageToggle />
          </div>
          <Link
            href="/auth/signin"
            className="bg-primary text-white px-6 py-2.5 rounded-xl font-headline text-sm font-semibold tracking-tight hover:opacity-90 transition-all"
          >
            Member Login
          </Link>
        </div>
        <div className="md:hidden">
          <Icon name="menu" className="text-primary" />
        </div>
      </nav>
    </header>
  );
}
```

- [ ] **Step 3: Create public footer**

Create `src/components/layout/public-footer.tsx`:

```tsx
import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="bg-surface-container-low py-12 px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-screen-2xl mx-auto">
        <div className="space-y-4">
          <div className="text-lg font-black text-primary font-headline uppercase tracking-tighter">
            Vita Santé Club
          </div>
          <p className="text-on-surface-variant text-xs leading-relaxed max-w-xs">
            Providing premium medical infrastructure and health solutions for
            the Haitian nation and its global diaspora.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h5 className="text-primary font-bold text-sm uppercase tracking-widest mb-2">
            Quick Links
          </h5>
          <Link
            href="/about"
            className="text-on-surface-variant hover:text-primary text-xs transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/plans"
            className="text-on-surface-variant hover:text-primary text-xs transition-colors"
          >
            Medical Network
          </Link>
          <Link
            href="#"
            className="text-on-surface-variant hover:text-primary text-xs transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-on-surface-variant hover:text-primary text-xs transition-colors"
          >
            Contact
          </Link>
        </div>
        <div className="flex flex-col gap-6">
          <h5 className="text-primary font-bold text-sm uppercase tracking-widest">
            Connect With Us
          </h5>
          <p className="text-on-surface-variant text-xs leading-relaxed">
            &copy; {new Date().getFullYear()} Vita Santé Club. All rights
            reserved. Haiti Medical Network.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Create sidebar nav configuration**

Create `src/components/layout/sidebar-items.ts`:

```typescript
export type NavItem = {
  label: string;
  icon: string;
  href: string;
};

export type SidebarConfig = {
  title: string;
  subtitle: string;
  items: NavItem[];
  ctaLabel?: string;
  ctaIcon?: string;
  ctaHref?: string;
  bottomItems: NavItem[];
};

export const sidebarConfigs: Record<string, SidebarConfig> = {
  member: {
    title: "Vita Santé Portal",
    subtitle: "Member Portal",
    items: [
      { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
      { label: "Medical Card", icon: "medical_services", href: "/medical-card" },
      { label: "Dependents", icon: "groups", href: "/dependents" },
      { label: "Payments", icon: "payments", href: "/payments" },
      { label: "Profile", icon: "person", href: "/profile" },
      { label: "Health Analytics", icon: "monitoring", href: "/analytics" },
    ],
    ctaLabel: "Urgent Consult",
    ctaIcon: "emergency",
    ctaHref: "#",
    bottomItems: [
      { label: "Settings", icon: "settings", href: "/settings" },
      { label: "Support", icon: "help", href: "/support" },
    ],
  },
  doctor: {
    title: "Vita Santé Portal",
    subtitle: "Clinical Professional",
    items: [
      { label: "Verification", icon: "verified_user", href: "/verification" },
      { label: "Patient Care", icon: "clinical_notes", href: "/patient-care" },
      { label: "Visit History", icon: "history", href: "/visit-history" },
      { label: "Profile", icon: "person", href: "/profile" },
    ],
    ctaLabel: "New Appointment",
    ctaIcon: "add_circle",
    ctaHref: "#",
    bottomItems: [
      { label: "Settings", icon: "settings", href: "/settings" },
      { label: "Support", icon: "help", href: "/support" },
    ],
  },
  affiliate: {
    title: "Vita Santé Portal",
    subtitle: "Affiliate Partner",
    items: [
      { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
      { label: "Referrals", icon: "people", href: "/referrals" },
      { label: "Commissions", icon: "payments", href: "/commissions" },
      { label: "Marketing", icon: "campaign", href: "/marketing" },
    ],
    ctaLabel: "Generate Referral Link",
    ctaIcon: "link",
    ctaHref: "#",
    bottomItems: [
      { label: "Settings", icon: "settings", href: "/settings" },
      { label: "Support", icon: "help", href: "/support" },
    ],
  },
  sponsor: {
    title: "Vita Santé Portal",
    subtitle: "Institutional Sponsor",
    items: [
      { label: "Overview", icon: "dashboard", href: "/overview" },
      { label: "Funded Members", icon: "groups", href: "/funded-members" },
      { label: "Impact Reports", icon: "assessment", href: "/impact-reports" },
      { label: "Billing", icon: "receipt_long", href: "/billing" },
    ],
    ctaLabel: "Support More Members",
    ctaIcon: "volunteer_activism",
    ctaHref: "/sponsor-new",
    bottomItems: [
      { label: "Settings", icon: "settings", href: "/settings" },
      { label: "Support", icon: "help", href: "/support" },
    ],
  },
  admin: {
    title: "Vita Santé Admin",
    subtitle: "Mission Control",
    items: [
      { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
      { label: "Members", icon: "people", href: "/members" },
      { label: "Doctors", icon: "medical_services", href: "/doctors" },
      { label: "Affiliates", icon: "handshake", href: "/affiliates" },
      { label: "Plan Config", icon: "tune", href: "/plans" },
      { label: "System Logs", icon: "terminal", href: "/logs" },
    ],
    ctaLabel: "Generate Report",
    ctaIcon: "summarize",
    ctaHref: "#",
    bottomItems: [
      { label: "Settings", icon: "settings", href: "/settings" },
      { label: "Support", icon: "help", href: "/support" },
    ],
  },
};
```

- [ ] **Step 5: Create Sidebar component**

Create `src/components/layout/sidebar.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import type { SidebarConfig } from "./sidebar-items";

export function Sidebar({
  config,
  basePath,
}: {
  config: SidebarConfig;
  basePath: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low flex flex-col py-6 px-4 space-y-2 z-40 hidden md:flex">
      <div className="mb-8 px-2">
        <h1 className="text-lg font-black text-primary uppercase tracking-widest font-headline">
          {config.title}
        </h1>
        <p className="text-xs font-medium text-on-surface-variant">
          {config.subtitle}
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {config.items.map((item) => {
          const fullHref = `${basePath}${item.href}`;
          const isActive = pathname === fullHref || pathname.startsWith(fullHref + "/");

          return (
            <Link
              key={item.href}
              href={fullHref}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg font-headline text-sm font-medium transition-all",
                isActive
                  ? "bg-surface-container-lowest text-primary shadow-sm font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              <Icon name={item.icon} size="sm" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 mt-6 border-t border-outline-variant/20 space-y-1">
        {config.ctaLabel && (
          <Link
            href={config.ctaHref || "#"}
            className="w-full mb-4 py-3 bg-error text-white rounded-xl font-headline text-sm font-bold flex items-center justify-center gap-2"
          >
            {config.ctaIcon && <Icon name={config.ctaIcon} size="sm" />}
            {config.ctaLabel}
          </Link>
        )}
        {config.bottomItems.map((item) => (
          <Link
            key={item.href}
            href={`${basePath}${item.href}`}
            className="flex items-center space-x-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-high transition-all font-headline text-sm font-medium"
          >
            <Icon name={item.icon} size="sm" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
```

- [ ] **Step 6: Create TopBar component**

Create `src/components/layout/top-bar.tsx`:

```tsx
import { Icon } from "@/components/ui/icon";

interface TopBarProps {
  greeting: string;
  subtitle: string;
  initials: string;
}

export function TopBar({ greeting, subtitle, initials }: TopBarProps) {
  return (
    <header className="flex justify-between items-center mb-10">
      <div>
        <h2 className="text-3xl font-bold text-primary tracking-tight font-headline">
          {greeting}
        </h2>
        <p className="text-on-surface-variant font-medium">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 bg-surface-container-low rounded-full text-primary relative">
          <Icon name="notifications" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
        </button>
        <div className="h-10 w-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm">
          {initials}
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 7: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 8: Commit**

```bash
git add src/components/layout/ src/components/shared/
git commit -m "feat: add layout components (Navbar, Footer, Sidebar, TopBar)"
```

---

## Phase 2: Database & Auth

### Task 5: Prisma Schema

**Files:**
- Create: `src/prisma/schema.prisma`, `src/lib/prisma.ts`

- [ ] **Step 1: Initialize Prisma**

```bash
npx prisma init --datasource-provider postgresql
```

- [ ] **Step 2: Write the full schema**

Replace `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  MEMBER
  DOCTOR
  AFFILIATE
  SPONSOR
  ADMIN
}

enum MemberStatus {
  ACTIVE
  PENDING
  SUSPENDED
  EXPIRED
}

enum PlanTier {
  ESSENTIAL
  ADVANTAGE
  PREMIUM
}

enum VisitType {
  TELEVISIT
  IN_CLINIC
  SPECIALIST
  GENERALIST
}

enum PaymentStatus {
  PAID
  PENDING
  PROCESSING
  FAILED
}

model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  emailVerified DateTime?
  image         String?
  passwordHash  String?
  role          Role      @default(MEMBER)
  locale        String    @default("fr")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts Account[]
  sessions Session[]
  member   Member?
  doctor   Doctor?
  affiliate Affiliate?
  sponsor  Sponsor?
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Plan {
  id          String   @id @default(cuid())
  name        String
  tier        PlanTier
  priceYearly Int      // in cents
  visits      Int      // total visits per year
  televisits  Int      // televisit allocation
  inClinic    Int      // in-clinic allocation
  labDiscount Int      // percentage
  pharmacyDiscount Int // percentage
  copayMin    Int      // in cents
  copayMax    Int      // in cents
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  members Member[]
}

model Member {
  id           String       @id @default(cuid())
  userId       String       @unique
  memberId     String       @unique // VSC-XXXXX-HT format
  status       MemberStatus @default(PENDING)
  planId       String?
  isDiaspora   Boolean      @default(false)
  bloodType    String?
  region       String?
  validThrough DateTime?
  joinedAt     DateTime     @default(now())

  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  plan        Plan?        @relation(fields: [planId], references: [id])
  dependents  Dependent[]
  visits      Visit[]
  payments    Payment[]
  creditBalance CreditBalance?
}

model CreditBalance {
  id          String @id @default(cuid())
  memberId    String @unique
  televisits  Int    @default(0)
  inClinic    Int    @default(0)
  specialist  Int    @default(0)

  member Member @relation(fields: [memberId], references: [id], onDelete: Cascade)
}

model Dependent {
  id           String  @id @default(cuid())
  memberId     String
  name         String
  relationship String  // spouse, child, parent
  dateOfBirth  DateTime?
  creditAmount Int     @default(0) // in cents

  member Member @relation(fields: [memberId], references: [id], onDelete: Cascade)
}

model Doctor {
  id           String  @id @default(cuid())
  userId       String  @unique
  licenseId    String  @unique // HT-XXXX-MED-YYYY format
  specialty    String
  clinicName   String?
  clinicAddress String?
  isVerified   Boolean @default(false)

  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  visits Visit[]
}

model Visit {
  id        String    @id @default(cuid())
  memberId  String
  doctorId  String
  type      VisitType
  notes     String?
  creditDeducted Int  @default(1)
  createdAt DateTime  @default(now())

  member Member @relation(fields: [memberId], references: [id])
  doctor Doctor @relation(fields: [doctorId], references: [id])
}

model Payment {
  id            String        @id @default(cuid())
  memberId      String
  amount        Int           // in cents
  currency      String        @default("USD")
  status        PaymentStatus @default(PENDING)
  stripePaymentId String?
  description   String?
  createdAt     DateTime      @default(now())

  member Member @relation(fields: [memberId], references: [id])
}

model Affiliate {
  id          String @id @default(cuid())
  userId      String @unique
  partnerId   String @unique // Global Partner ID
  referralCode String @unique
  tier         String @default("Standard") // Standard, Elite, Diamond
  totalEarned  Int    @default(0) // in cents
  pendingAmount Int   @default(0) // in cents

  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  referrals Referral[]
}

model Referral {
  id          String   @id @default(cuid())
  affiliateId String
  memberName  String
  memberEmail String?
  planSelected String?
  status      String   @default("pending") // pending, active, expired
  commission  Int      @default(0) // in cents
  createdAt   DateTime @default(now())

  affiliate Affiliate @relation(fields: [affiliateId], references: [id])
}

model Sponsor {
  id              String @id @default(cuid())
  userId          String @unique
  organizationName String
  totalInvestment Int    @default(0) // in cents
  activeBeneficiaries Int @default(0)

  user             User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  sponsoredMembers SponsoredMember[]
  invoices         Invoice[]
}

model SponsoredMember {
  id         String   @id @default(cuid())
  sponsorId  String
  memberName String
  memberId   String?
  planType   String
  coverageStart DateTime
  coverageEnd   DateTime
  healthStatus  String  @default("active")

  sponsor Sponsor @relation(fields: [sponsorId], references: [id])
}

model Invoice {
  id        String        @id @default(cuid())
  sponsorId String
  amount    Int           // in cents
  status    PaymentStatus @default(PENDING)
  dueDate   DateTime
  createdAt DateTime      @default(now())

  sponsor Sponsor @relation(fields: [sponsorId], references: [id])
}
```

- [ ] **Step 3: Create Prisma client singleton**

Create `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 4: Create .env file**

Create `.env`:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vitasante?schema=public"
NEXTAUTH_SECRET="development-secret-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_placeholder"
STRIPE_WEBHOOK_SECRET="whsec_placeholder"
```

- [ ] **Step 5: Add .env to .gitignore**

Append to `.gitignore`:

```
.env
.env.local
```

- [ ] **Step 6: Generate Prisma client**

```bash
npx prisma generate
```

Expected: "Prisma Client generated successfully"

- [ ] **Step 7: Commit**

```bash
git add prisma/schema.prisma src/lib/prisma.ts .gitignore
git commit -m "feat: add Prisma schema with all entities (Member, Doctor, Affiliate, Sponsor, Plan, Visit)"
```

---

### Task 6: NextAuth Configuration

**Files:**
- Create: `src/lib/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/middleware.ts`

- [ ] **Step 1: Create auth config**

Create `src/lib/auth.ts`:

```typescript
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
      image?: string | null;
    };
  }

  interface User {
    role: Role;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role: Role;
    userId: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        // In production, use bcrypt to verify password
        // For now, accept any password for development
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.id = token.userId;
      return session;
    },
  },
});
```

- [ ] **Step 2: Create API route handler**

Create `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

- [ ] **Step 3: Create middleware for route protection**

Create `src/middleware.ts`:

```typescript
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const roleRouteMap: Record<string, string> = {
  MEMBER: "/dashboard",
  DOCTOR: "/verification",
  AFFILIATE: "/dashboard",
  SPONSOR: "/overview",
  ADMIN: "/dashboard",
};

const protectedPrefixes = [
  "/dashboard",
  "/medical-card",
  "/dependents",
  "/payments",
  "/enrollment",
  "/verification",
  "/patient-care",
  "/visit-history",
  "/profile",
  "/referrals",
  "/commissions",
  "/marketing",
  "/overview",
  "/funded-members",
  "/impact-reports",
  "/billing",
  "/sponsor-new",
  "/members",
  "/doctors",
  "/affiliates",
  "/plans",
  "/analytics",
  "/logs",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtected && !req.auth) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth.ts src/app/api/auth/ src/middleware.ts
git commit -m "feat: add NextAuth v5 with credentials provider and role-based JWT"
```

---

### Task 7: Seed Data

**Files:**
- Create: `prisma/seed.ts`
- Modify: `package.json` (add prisma seed script)

- [ ] **Step 1: Create seed script**

Create `prisma/seed.ts`:

```typescript
import { PrismaClient, Role, PlanTier, MemberStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Plans
  const essential = await prisma.plan.create({
    data: {
      name: "Essential",
      tier: "ESSENTIAL",
      priceYearly: 9900,
      visits: 6,
      televisits: 4,
      inClinic: 2,
      labDiscount: 15,
      pharmacyDiscount: 15,
      copayMin: 100,
      copayMax: 1000,
    },
  });

  const advantage = await prisma.plan.create({
    data: {
      name: "Advantage",
      tier: "ADVANTAGE",
      priceYearly: 13500,
      visits: 8,
      televisits: 6,
      inClinic: 4,
      labDiscount: 20,
      pharmacyDiscount: 20,
      copayMin: 100,
      copayMax: 1000,
    },
  });

  const premium = await prisma.plan.create({
    data: {
      name: "Premium",
      tier: "PREMIUM",
      priceYearly: 20000,
      visits: 12,
      televisits: 8,
      inClinic: 5,
      labDiscount: 35,
      pharmacyDiscount: 35,
      copayMin: 100,
      copayMax: 1000,
    },
  });

  // Create Admin User
  await prisma.user.create({
    data: {
      name: "Admin Vita Santé",
      email: "admin@vitasante.ht",
      role: "ADMIN",
      passwordHash: "dev-password",
    },
  });

  // Create Member User
  const memberUser = await prisma.user.create({
    data: {
      name: "Jean-Pierre Valcourt",
      email: "jean@member.ht",
      role: "MEMBER",
      passwordHash: "dev-password",
      member: {
        create: {
          memberId: "VSC-88291-HT",
          status: "ACTIVE",
          planId: premium.id,
          isDiaspora: false,
          bloodType: "O Positive",
          region: "Port-au-Prince",
          validThrough: new Date("2026-12-31"),
          creditBalance: {
            create: {
              televisits: 6,
              inClinic: 3,
              specialist: 2,
            },
          },
          dependents: {
            create: [
              {
                name: "Sarah Valcourt",
                relationship: "Spouse",
                dateOfBirth: new Date("1990-05-15"),
                creditAmount: 145000,
              },
              {
                name: "Leo Valcourt",
                relationship: "Child",
                dateOfBirth: new Date("2018-03-22"),
                creditAmount: 85000,
              },
            ],
          },
        },
      },
    },
  });

  // Create Doctor User
  await prisma.user.create({
    data: {
      name: "Dr. Jean-Baptiste Valcourt",
      email: "doctor@vitasante.ht",
      role: "DOCTOR",
      passwordHash: "dev-password",
      doctor: {
        create: {
          licenseId: "HT-8829-MED-2024",
          specialty: "Interventional Cardiology",
          clinicName: "Centre de Santé",
          clinicAddress: "Pétion-Ville, Haiti",
          isVerified: true,
        },
      },
    },
  });

  // Create Affiliate User
  await prisma.user.create({
    data: {
      name: "Marie-Claire Dupont",
      email: "affiliate@vitasante.ht",
      role: "AFFILIATE",
      passwordHash: "dev-password",
      affiliate: {
        create: {
          partnerId: "AFF-8829",
          referralCode: "VITA-MARIE",
          tier: "Elite",
          totalEarned: 3284000,
          pendingAmount: 429050,
        },
      },
    },
  });

  // Create Sponsor User
  await prisma.user.create({
    data: {
      name: "Fondation Haïti Santé",
      email: "sponsor@vitasante.ht",
      role: "SPONSOR",
      passwordHash: "dev-password",
      sponsor: {
        create: {
          organizationName: "Fondation Haïti Santé",
          totalInvestment: 45020000,
          activeBeneficiaries: 1284,
          sponsoredMembers: {
            create: [
              {
                memberName: "Beatrice Saint-Jean",
                memberId: "VSC-0032-HT",
                planType: "Premium",
                coverageStart: new Date("2024-01-01"),
                coverageEnd: new Date("2026-12-31"),
                healthStatus: "active",
              },
              {
                memberName: "Pierre Louis",
                memberId: "VSC-0045-HT",
                planType: "Advantage",
                coverageStart: new Date("2024-06-01"),
                coverageEnd: new Date("2025-06-01"),
                healthStatus: "active",
              },
            ],
          },
        },
      },
    },
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
```

- [ ] **Step 2: Add seed command to package.json**

Add to `package.json` (in the root object, after `"devDependencies"`):

```json
"prisma": {
  "seed": "npx tsx prisma/seed.ts"
}
```

- [ ] **Step 3: Install tsx for seed script**

```bash
npm install -D tsx
```

- [ ] **Step 4: Commit**

```bash
git add prisma/seed.ts package.json
git commit -m "feat: add seed data for all roles (member, doctor, affiliate, sponsor, admin)"
```

---

## Phase 3: Public Pages

### Task 8: Public Layout & Landing Page

**Files:**
- Create: `src/app/(public)/layout.tsx`, `src/app/(public)/page.tsx`

- [ ] **Step 1: Create public layout**

Create `src/app/(public)/layout.tsx`:

```tsx
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicNavbar />
      <main className="pt-20">{children}</main>
      <PublicFooter />
    </>
  );
}
```

- [ ] **Step 2: Create landing page**

Create `src/app/(public)/page.tsx`:

```tsx
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[870px] flex items-center px-6 md:px-20 bg-surface-container-low">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="z-10 text-left">
            <h1 className="font-headline font-extrabold text-5xl md:text-7xl text-primary leading-[1.1] mb-6 tracking-tight">
              Your health is our mission.{" "}
              <br />
              <span className="text-primary-container">
                In Haiti and for the Diaspora.
              </span>
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
              Access premium medical care and secure health coverage for you and
              your loved ones, bridging the gap between distances with trust and
              clinical excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/signup">
                <Button size="lg">S&apos;inscrire maintenant</Button>
              </Link>
              <Link href="/plans">
                <Button variant="secondary" size="lg">
                  Voir le réseau
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-secondary-container/30 rounded-full blur-3xl" />
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl transform rotate-2">
              <img
                alt="Professional Haitian doctor in a modern medical setting"
                className="w-full h-[600px] object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCE1OiEnsf-LwHBBcq-igkaU12at_5_z6XZtmOT3k0rpAtFvG2uCrWa1RN1J2lq7qOupWo_g5tIJ5hnuQlmlRu-j_x_a3bEENqh6XcbuDNjS3oPW4w35nGuHBEYcnl24LOs-aQ9JIPrwPZY3OuV7wsMPKYCyD9ZH9oZ4RuF9wdYqYq99P8lRu31iPKwgDR3Ki21qkUWR3DvKaqIJm-brbszrTAO94e6GI65HKnjKAMw6nhcAiT7bF5n5ZUAHj4bNc3CsfXY0xStEaiC"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            </div>

            {/* Stats Card Float */}
            <div className="absolute bottom-12 -left-12 bg-white/90 glass-effect p-6 rounded-2xl shadow-xl border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Icon name="favorite" filled className="text-secondary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary/60 uppercase tracking-widest">
                    Satisfaction
                  </p>
                  <p className="text-2xl font-black text-primary">
                    98% Positive
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
            <div className="col-span-1">
              <div className="w-16 h-1 bg-secondary mb-8" />
              <h2 className="font-headline font-extrabold text-4xl text-on-primary-fixed mb-6 tracking-tighter">
                The Clinical Atelier Philosophy
              </h2>
              <p className="text-on-surface-variant leading-relaxed mb-8">
                We believe healthcare is not a transaction—it is a curated
                journey. Our vision is to provide a sanctuary of health for the
                Haitian community, regardless of geographic boundaries.
              </p>
            </div>
            <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-8 bg-surface-container-lowest rounded-2xl border-l-4 border-primary">
                <Icon
                  name="clinical_notes"
                  size="lg"
                  className="text-primary mb-4"
                />
                <h3 className="font-headline font-bold text-xl mb-3 text-primary">
                  Mission
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Deploying world-class medical standards to every corner of
                  Haiti, ensuring every member receives dignified and precise
                  care.
                </p>
              </div>
              <div className="p-8 bg-surface-container-lowest rounded-2xl border-l-4 border-secondary">
                <Icon
                  name="visibility"
                  size="lg"
                  className="text-secondary mb-4"
                />
                <h3 className="font-headline font-bold text-xl mb-3 text-secondary">
                  Vision
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  To be the digital bridge that connects the Haitian Diaspora to
                  the well-being of their families back home through a trusted
                  medical ecosystem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-24 px-6 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline font-extrabold text-4xl text-primary mb-4">
              Choose Your Membership
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">
              Transparent plans designed to meet the diverse needs of families in
              Haiti and those supporting from abroad.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Essential */}
            <div className="bg-surface-container-lowest p-10 rounded-3xl flex flex-col items-start transition-all hover:translate-y-[-8px]">
              <span className="px-4 py-1 bg-surface-container-high rounded-full text-xs font-bold text-primary mb-6">
                ESSENTIAL
              </span>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-primary">$99</span>
                <span className="text-on-surface-variant text-sm">/year</span>
              </div>
              <ul className="space-y-4 mb-10 w-full">
                {["6 Visits/Televisits", "15% Labs & Pharmacy", "$1-$10 per visit"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-on-surface-variant">
                    <Icon name="check_circle" size="sm" filled className="text-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="w-full mt-auto">
                <Button variant="ghost" className="w-full py-4">
                  Select Essential
                </Button>
              </Link>
            </div>

            {/* Advantage */}
            <div className="clinical-gradient p-10 rounded-3xl flex flex-col items-start relative overflow-hidden text-white transition-all hover:translate-y-[-8px] shadow-2xl">
              <div className="absolute top-0 right-0 p-4 bg-secondary text-white text-[10px] font-black uppercase tracking-widest rotate-45 translate-x-10 translate-y-2 w-40 text-center">
                Popular
              </div>
              <span className="px-4 py-1 bg-white/20 rounded-full text-xs font-bold text-white mb-6">
                ADVANTAGE
              </span>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-white">$135</span>
                <span className="text-white/70 text-sm">/year</span>
              </div>
              <ul className="space-y-4 mb-10 w-full">
                {["8 Visits/Televisits", "20% Labs & Pharmacy", "$1-$10 per visit"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <Icon name="check_circle" size="sm" filled className="text-secondary-fixed" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 bg-white text-primary font-bold rounded-xl hover:bg-opacity-90 transition-opacity mt-auto">
                Select Advantage
              </button>
            </div>

            {/* Premium */}
            <div className="bg-surface-container-lowest p-10 rounded-3xl flex flex-col items-start transition-all hover:translate-y-[-8px]">
              <span className="px-4 py-1 bg-tertiary-fixed text-tertiary rounded-full text-xs font-bold mb-6">
                PREMIUM
              </span>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-primary">$200</span>
                <span className="text-on-surface-variant text-sm">/year</span>
              </div>
              <ul className="space-y-4 mb-10 w-full">
                {["12 Visits/Televisits", "35% Labs & Pharmacy", "$1-$10 per visit"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-on-surface-variant">
                    <Icon name="check_circle" size="sm" filled className="text-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="w-full mt-auto">
                <Button variant="ghost" className="w-full py-4">
                  Select Premium
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Network Map Section */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-headline font-extrabold text-4xl text-primary mb-6">
                Our Medical Network
              </h2>
              <p className="text-on-surface-variant mb-8 text-lg">
                Vita Santé Club partners with the most reputable clinics and
                hospitals across Haiti.
              </p>
              <div className="space-y-6">
                {[
                  { name: "Port-au-Prince Hub", desc: "4 Major Medical Centers + 12 Diagnostic Labs" },
                  { name: "Northern District", desc: "2 Hospitals in Cap-Haïtien" },
                  { name: "Southern Coverage", desc: "Specialized Clinic in Les Cayes" },
                ].map((loc) => (
                  <div key={loc.name} className="flex gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-colors">
                    <Icon name="location_on" className="text-primary" />
                    <div>
                      <h4 className="font-bold text-primary">{loc.name}</h4>
                      <p className="text-sm text-on-surface-variant">{loc.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative bg-surface-container-high rounded-3xl overflow-hidden min-h-[450px] shadow-inner flex items-center justify-center">
              <div className="bg-white/90 glass-effect p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-4">
                <Icon name="map" size="xl" filled className="text-primary mb-4" />
                <h4 className="font-headline font-bold text-xl text-primary mb-2">
                  Interactive Network Map
                </h4>
                <p className="text-sm text-on-surface-variant mb-6">
                  Explore our growing list of 50+ affiliated health partners.
                </p>
                <Button size="sm">Open Network Explorer</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto clinical-gradient rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="font-headline font-extrabold text-4xl text-white mb-6">
              Ready to secure your future?
            </h2>
            <p className="text-primary-fixed-dim text-lg mb-10 max-w-2xl mx-auto">
              Join the 15,000+ members who trust Vita Santé Club for their daily
              healthcare needs and emergency coverage.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth/signup">
                <button className="bg-white text-primary font-bold px-10 py-4 rounded-xl text-lg hover:bg-surface-container-lowest transition-colors">
                  Start Your Journey
                </button>
              </Link>
              <button className="bg-primary-container/30 border border-white/20 text-white font-bold px-10 py-4 rounded-xl text-lg hover:bg-white/10 transition-colors">
                Contact Our Advisors
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 3: Move the root page to redirect to public**

Replace `src/app/page.tsx`:

```tsx
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/");
}
```

Note: Since we're using route groups, the `(public)/page.tsx` will serve as the root `/` page. Delete or redirect `src/app/page.tsx` if it conflicts. The `(public)` route group maps to `/` directly.

- [ ] **Step 4: Verify dev server shows the landing page**

```bash
npm run dev
```

Expected: http://localhost:3000 shows the full landing page with hero, mission, pricing, network, and CTA sections.

- [ ] **Step 5: Commit**

```bash
git add src/app/
git commit -m "feat: add public layout and full landing page with Clinical Atelier design"
```

---

### Task 9: About Us & Plans Pages

**Files:**
- Create: `src/app/(public)/about/page.tsx`, `src/app/(public)/plans/page.tsx`, `src/app/(public)/affiliate-program/page.tsx`

- [ ] **Step 1: Create About Us page**

Create `src/app/(public)/about/page.tsx`:

```tsx
import { Icon } from "@/components/ui/icon";

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-6 md:px-20 bg-surface-container-low">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-16 h-1 bg-secondary mb-8" />
            <h1 className="font-headline font-extrabold text-5xl md:text-6xl text-primary leading-[1.1] mb-6 tracking-tight">
              A Sanctuary of Health for Haiti
            </h1>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
              Vita Santé Club was founded on a simple principle: every Haitian—whether in
              Port-au-Prince or Paris—deserves access to dignified, world-class medical care.
              We are not an insurance company. We are a health collective.
            </p>
          </div>
          <div className="relative hidden lg:block">
            <div className="rounded-[2rem] overflow-hidden shadow-2xl">
              <img
                alt="Haitian medical team in a modern clinic"
                className="w-full h-[500px] object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCE1OiEnsf-LwHBBcq-igkaU12at_5_z6XZtmOT3k0rpAtFvG2uCrWa1RN1J2lq7qOupWo_g5tIJ5hnuQlmlRu-j_x_a3bEENqh6XcbuDNjS3oPW4w35nGuHBEYcnl24LOs-aQ9JIPrwPZY3OuV7wsMPKYCyD9ZH9oZ4RuF9wdYqYq99P8lRu31iPKwgDR3Ki21qkUWR3DvKaqIJm-brbszrTAO94e6GI65HKnjKAMw6nhcAiT7bF5n5ZUAHj4bNc3CsfXY0xStEaiC"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline font-extrabold text-4xl text-primary mb-16 tracking-tighter">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "favorite", title: "Dignity First", desc: "Every interaction is built on respect. No patient is a number." },
              { icon: "public", title: "Bridging Distances", desc: "Connecting the Diaspora to their families' health through trusted technology." },
              { icon: "verified", title: "Clinical Excellence", desc: "Our network upholds the highest medical standards available in Haiti." },
            ].map((v) => (
              <div key={v.title} className="p-8 bg-surface-container-lowest rounded-2xl">
                <Icon name={v.icon} size="lg" filled className="text-primary mb-4" />
                <h3 className="font-headline font-bold text-xl mb-3 text-primary">{v.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-6 bg-surface-container-low">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "15,000+", label: "Active Members" },
            { value: "50+", label: "Partner Clinics" },
            { value: "98%", label: "Satisfaction Rate" },
            { value: "4", label: "Regions Covered" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-black text-primary mb-2">{s.value}</p>
              <p className="text-on-surface-variant text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Create Plans comparison page**

Create `src/app/(public)/plans/page.tsx`:

```tsx
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const plans = [
  {
    name: "Essential",
    price: 99,
    badge: "ESSENTIAL",
    badgeClass: "bg-surface-container-high text-primary",
    features: [
      "6 Visits/Televisits per year",
      "15% Labs & Pharmacy discount",
      "$1-$10 copay per visit",
      "Digital Medical Card",
      "Basic Televisit access",
    ],
    highlighted: false,
  },
  {
    name: "Advantage",
    price: 135,
    badge: "ADVANTAGE",
    badgeClass: "bg-white/20 text-white",
    features: [
      "8 Visits/Televisits per year",
      "20% Labs & Pharmacy discount",
      "$1-$10 copay per visit",
      "Digital Medical Card",
      "Priority Televisit booking",
      "Dependent coverage options",
    ],
    highlighted: true,
  },
  {
    name: "Premium",
    price: 200,
    badge: "PREMIUM",
    badgeClass: "bg-tertiary-fixed text-tertiary",
    features: [
      "12 Visits/Televisits per year",
      "35% Labs & Pharmacy discount",
      "$1-$10 copay per visit",
      "Digital Medical Card",
      "Priority + Specialist access",
      "Full dependent coverage",
      "Health Analytics dashboard",
    ],
    highlighted: false,
  },
];

export default function PlansPage() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-headline font-extrabold text-5xl text-primary mb-4">
            Plans & Coverage
          </h1>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-lg">
            Compare our membership tiers and find the right fit for you and your family.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-10 rounded-3xl flex flex-col items-start transition-all hover:translate-y-[-8px] ${
                plan.highlighted
                  ? "clinical-gradient text-white shadow-2xl"
                  : "bg-surface-container-lowest"
              }`}
            >
              <span className={`px-4 py-1 rounded-full text-xs font-bold mb-6 ${plan.badgeClass}`}>
                {plan.badge}
              </span>
              <div className="flex items-baseline gap-1 mb-8">
                <span className={`text-4xl font-black ${plan.highlighted ? "text-white" : "text-primary"}`}>
                  ${plan.price}
                </span>
                <span className={`text-sm ${plan.highlighted ? "text-white/70" : "text-on-surface-variant"}`}>
                  /year
                </span>
              </div>
              <ul className="space-y-4 mb-10 w-full">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-center gap-3 text-sm ${plan.highlighted ? "" : "text-on-surface-variant"}`}>
                    <Icon
                      name="check_circle"
                      size="sm"
                      filled
                      className={plan.highlighted ? "text-secondary-fixed" : "text-secondary"}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="w-full mt-auto">
                {plan.highlighted ? (
                  <button className="w-full py-4 bg-white text-primary font-bold rounded-xl hover:bg-opacity-90 transition-opacity">
                    Select {plan.name}
                  </button>
                ) : (
                  <Button variant="ghost" className="w-full py-4">
                    Select {plan.name}
                  </Button>
                )}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create Affiliate Program page**

Create `src/app/(public)/affiliate-program/page.tsx`:

```tsx
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AffiliateProgramPage() {
  return (
    <>
      <section className="py-24 px-6 bg-surface-container-low">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-headline font-extrabold text-5xl text-primary mb-6">
            Become a Vita Santé Affiliate
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto mb-12">
            Earn commissions while expanding access to quality healthcare across Haiti.
            Join our network of health advocates.
          </p>
          <Link href="/auth/signup">
            <Button size="lg">Apply Now</Button>
          </Link>
        </div>
      </section>

      <section className="py-24 px-6 bg-surface">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: "link", title: "Share Your Link", desc: "Get a unique referral link and share it with your network." },
            { icon: "people", title: "Members Enroll", desc: "When someone signs up through your link, they become your referral." },
            { icon: "payments", title: "Earn Commissions", desc: "Receive competitive commissions for every active member you refer." },
          ].map((step, i) => (
            <div key={step.title} className="p-8 bg-surface-container-lowest rounded-2xl text-center">
              <div className="w-12 h-12 clinical-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">{i + 1}</span>
              </div>
              <Icon name={step.icon} size="lg" className="text-primary mb-4" />
              <h3 className="font-headline font-bold text-xl mb-3 text-primary">{step.title}</h3>
              <p className="text-on-surface-variant text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 4: Verify all pages load**

```bash
npm run dev
```

Visit: `/about`, `/plans`, `/affiliate-program`. Expected: All pages render correctly.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(public\)/
git commit -m "feat: add About Us, Plans comparison, and Affiliate Program public pages"
```

---

### Task 10: Auth Pages (Sign In & Sign Up)

**Files:**
- Create: `src/app/(public)/auth/signin/page.tsx`, `src/app/(public)/auth/signup/page.tsx`

- [ ] **Step 1: Create Sign In page**

Create `src/app/(public)/auth/signin/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-headline font-extrabold text-4xl text-primary mb-2">
            Welcome Back
          </h1>
          <p className="text-on-surface-variant">
            Sign in to your Vita Santé Club account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-error text-sm font-medium">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full py-4"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center mt-8 text-on-surface-variant text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-primary font-bold hover:underline">
            Sign Up
          </Link>
        </p>

        {/* Dev helper */}
        <div className="mt-8 p-4 bg-surface-container-low rounded-xl">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">
            Dev Quick Login
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Member", email: "jean@member.ht" },
              { label: "Doctor", email: "doctor@vitasante.ht" },
              { label: "Affiliate", email: "affiliate@vitasante.ht" },
              { label: "Sponsor", email: "sponsor@vitasante.ht" },
              { label: "Admin", email: "admin@vitasante.ht" },
            ].map((u) => (
              <button
                key={u.email}
                type="button"
                onClick={() => {
                  setEmail(u.email);
                  setPassword("dev-password");
                }}
                className="text-xs px-3 py-2 bg-surface-container-lowest rounded-lg text-primary hover:bg-primary-fixed transition-colors"
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create Sign Up page**

Create `src/app/(public)/auth/signup/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";

export default function SignUpPage() {
  const [step, setStep] = useState(1);

  return (
    <section className="min-h-[80vh] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
            <span>Step {step} of 3</span>
            <span>Enrollment Module</span>
          </div>
          <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <h1 className="font-headline font-extrabold text-4xl text-primary mb-2">
              {step === 1 && "Create Your Account"}
              {step === 2 && "Personal Information"}
              {step === 3 && "Review & Confirm"}
            </h1>
            <p className="text-on-surface-variant mb-8">
              {step === 1 && "Start your health journey with Vita Santé Club."}
              {step === 2 && "Tell us a bit about yourself."}
              {step === 3 && "Verify your details before enrollment."}
            </p>

            {step === 1 && (
              <div className="space-y-6">
                <Input id="name" label="Full Name" placeholder="Jean-Pierre Valcourt" />
                <Input id="email" label="Email Address" type="email" placeholder="your@email.com" />
                <Input id="password" label="Password" type="password" placeholder="Create a secure password" />
                <Input id="phone" label="Phone Number" type="tel" placeholder="+509 0000 0000" />

                <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl">
                  <input
                    type="checkbox"
                    id="diaspora"
                    className="w-5 h-5 rounded text-secondary focus:ring-secondary"
                  />
                  <label htmlFor="diaspora" className="text-sm text-on-surface-variant">
                    I am a Diaspora member paying for family in Haiti
                  </label>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <Input id="dob" label="Date of Birth" type="date" />
                <Input id="region" label="Region" placeholder="Port-au-Prince" />
                <Input id="bloodType" label="Blood Type (Optional)" placeholder="O Positive" />
                <Input id="emergencyContact" label="Emergency Contact" placeholder="Name & Phone" />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 p-6 bg-surface-container-lowest rounded-2xl">
                <h3 className="font-headline font-bold text-lg text-primary mb-4">Order Summary</h3>
                <div className="flex justify-between py-2">
                  <span className="text-on-surface-variant">Base Premium</span>
                  <span className="font-bold text-primary">$450.00</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-on-surface-variant">Network Access Fee</span>
                  <span className="font-bold text-primary">$25.00</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-on-surface-variant">Tax / TVA</span>
                  <span className="font-bold text-primary">$12.50</span>
                </div>
                <div className="border-t border-outline-variant/20 my-2" />
                <div className="flex justify-between py-2">
                  <span className="font-bold text-primary text-lg">Total</span>
                  <span className="font-black text-primary text-lg">$487.50 USD/Year</span>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10">
              {step > 1 ? (
                <Button variant="secondary" onClick={() => setStep(step - 1)}>
                  <Icon name="arrow_back" size="sm" className="mr-2" />
                  Previous Step
                </Button>
              ) : (
                <div />
              )}
              {step < 3 ? (
                <Button onClick={() => setStep(step + 1)}>
                  Continue to Step {step + 1}
                </Button>
              ) : (
                <Button>Confirm & Pay</Button>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="p-6 bg-surface-container-lowest rounded-2xl">
              <Icon name="verified_user" size="lg" className="text-secondary mb-3" />
              <h4 className="font-headline font-bold text-primary mb-2">Secure Enrollment</h4>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Your data is protected with military-grade encryption. We never share your
                medical information.
              </p>
            </div>
            <div className="p-6 bg-surface-container-lowest rounded-2xl">
              <Icon name="schedule" size="lg" className="text-primary mb-3" />
              <h4 className="font-headline font-bold text-primary mb-2">Instant Coverage</h4>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Your Vita Santé ID will be generated within 24 hours of enrollment.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-on-surface-variant text-sm">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-primary font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify both auth pages**

```bash
npm run dev
```

Visit `/auth/signin` and `/auth/signup`. Expected: Both pages render with proper forms.

- [ ] **Step 4: Commit**

```bash
git add src/app/\(public\)/auth/
git commit -m "feat: add Sign In and Sign Up pages with multi-step enrollment flow"
```

---

## Phase 4: Portal Layouts

### Task 11: All Portal Layouts

**Files:**
- Create: `src/app/(member)/layout.tsx`, `src/app/(doctor)/layout.tsx`, `src/app/(affiliate)/layout.tsx`, `src/app/(sponsor)/layout.tsx`, `src/app/(admin)/layout.tsx`

- [ ] **Step 1: Create Member layout**

Create `src/app/(member)/layout.tsx`:

```tsx
import { Sidebar } from "@/components/layout/sidebar";
import { sidebarConfigs } from "@/components/layout/sidebar-items";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar config={sidebarConfigs.member} basePath="" />
      <main className="md:ml-64 min-h-screen p-6 lg:p-10">{children}</main>
    </div>
  );
}
```

- [ ] **Step 2: Create Doctor layout**

Create `src/app/(doctor)/layout.tsx`:

```tsx
import { Sidebar } from "@/components/layout/sidebar";
import { sidebarConfigs } from "@/components/layout/sidebar-items";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar config={sidebarConfigs.doctor} basePath="" />
      <main className="md:ml-64 min-h-screen p-6 lg:p-10">{children}</main>
    </div>
  );
}
```

- [ ] **Step 3: Create Affiliate layout**

Create `src/app/(affiliate)/layout.tsx`:

```tsx
import { Sidebar } from "@/components/layout/sidebar";
import { sidebarConfigs } from "@/components/layout/sidebar-items";

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar config={sidebarConfigs.affiliate} basePath="" />
      <main className="md:ml-64 min-h-screen p-6 lg:p-10">{children}</main>
    </div>
  );
}
```

- [ ] **Step 4: Create Sponsor layout**

Create `src/app/(sponsor)/layout.tsx`:

```tsx
import { Sidebar } from "@/components/layout/sidebar";
import { sidebarConfigs } from "@/components/layout/sidebar-items";

export default function SponsorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar config={sidebarConfigs.sponsor} basePath="" />
      <main className="md:ml-64 min-h-screen p-6 lg:p-10">{children}</main>
    </div>
  );
}
```

- [ ] **Step 5: Create Admin layout**

Create `src/app/(admin)/layout.tsx`:

```tsx
import { Sidebar } from "@/components/layout/sidebar";
import { sidebarConfigs } from "@/components/layout/sidebar-items";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar config={sidebarConfigs.admin} basePath="" />
      <main className="md:ml-64 min-h-screen p-6 lg:p-10">{children}</main>
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/app/\(member\)/ src/app/\(doctor\)/ src/app/\(affiliate\)/ src/app/\(sponsor\)/ src/app/\(admin\)/
git commit -m "feat: add portal layouts for all 5 roles with role-specific sidebars"
```

---

## Phase 5: Member Portal Pages

### Task 12: Member Dashboard

**Files:**
- Create: `src/app/(member)/dashboard/page.tsx`, `src/components/shared/member-card-visual.tsx`

- [ ] **Step 1: Create digital card visual component**

Create `src/components/shared/member-card-visual.tsx`:

```tsx
import { Icon } from "@/components/ui/icon";

interface MemberCardVisualProps {
  memberNumber: string;
  expiry: string;
}

export function MemberCardVisual({ memberNumber, expiry }: MemberCardVisualProps) {
  return (
    <div className="relative w-full max-w-[320px] aspect-[1.586/1] bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className="uppercase font-black text-[10px] tracking-tighter leading-none">
          Vita Santé<br />Club
        </div>
        <Icon name="contactless" size="sm" className="opacity-50" />
      </div>
      <div>
        <div className="text-[10px] uppercase opacity-60 mb-1">Member Number</div>
        <div className="font-mono text-sm tracking-widest">{memberNumber}</div>
      </div>
      <div className="flex justify-between items-end">
        <div className="text-xs font-medium">EXP {expiry}</div>
        <div className="h-6 w-10 bg-white/20 rounded flex items-center justify-center">
          <div className="w-4 h-4 bg-white/40 rounded-full" />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Member Dashboard page**

Create `src/app/(member)/dashboard/page.tsx`:

```tsx
import { TopBar } from "@/components/layout/top-bar";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { MemberCardVisual } from "@/components/shared/member-card-visual";

export default function MemberDashboard() {
  return (
    <>
      <TopBar
        greeting="Bonjour, Jean-Pierre"
        subtitle="Welcome back to your personalized health sanctuary."
        initials="JP"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Hero Member Card */}
        <section className="lg:col-span-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-container p-8 text-white flex flex-col md:flex-row justify-between items-center group">
            <div className="z-10 text-center md:text-left mb-6 md:mb-0">
              <Badge variant="info" className="bg-white/10 text-white mb-4">
                Premium Member
              </Badge>
              <h3 className="text-4xl font-extrabold mb-1 font-headline">
                Jean-Pierre Valcourt
              </h3>
              <p className="text-primary-fixed opacity-90 font-mono tracking-widest text-lg">
                VSC-88291-HT
              </p>
              <div className="mt-8 flex gap-4">
                <Button className="bg-white text-primary hover:bg-primary-fixed" size="sm">
                  View Full Profile
                </Button>
                <Button className="bg-primary/20 border border-white/20 text-white hover:bg-white/10" size="sm">
                  <Icon name="download" size="sm" className="mr-2" />
                  Download Card
                </Button>
              </div>
            </div>
            <div className="relative z-10 transform rotate-2 group-hover:rotate-0 transition-transform duration-500">
              <MemberCardVisual
                memberNumber="8829 1000 4521 9901"
                expiry="12/26"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
          </div>
        </section>

        {/* Visit Credits */}
        <section className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-surface-container-lowest rounded-2xl p-8 text-center">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
              Visit Credits Remaining
            </p>
            <p className="text-5xl font-black text-primary mb-1">09/10</p>
            <p className="text-on-surface-variant text-sm mb-6">Total Visits Available</p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Televisits</span>
                <span className="font-bold text-primary">06/10</span>
              </div>
              <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "60%" }} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">In-Clinic</span>
                <span className="font-bold text-primary">03/05</span>
              </div>
              <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: "60%" }} />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats Row */}
        <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Active Plan" value="Premium" icon="workspace_premium" />
          <StatCard label="Next Payment" value="$145.00" icon="payments" trend="Due Oct 12" />
          <StatCard label="Dependents" value="2" icon="groups" />
          <StatCard label="Member Since" value="Jan 2024" icon="calendar_month" />
        </div>

        {/* Recent Activity */}
        <section className="lg:col-span-8">
          <div className="bg-surface-container-lowest rounded-2xl p-8">
            <h3 className="font-headline font-bold text-xl text-primary mb-6">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[
                { date: "Oct 10", desc: "Televisit with Dr. Baptiste", amount: "-1 Credit", type: "visit" },
                { date: "Oct 5", desc: "Lab Work - Blood Panel", amount: "-$22.50", type: "lab" },
                { date: "Sep 28", desc: "Monthly Premium Payment", amount: "-$145.00", type: "payment" },
                { date: "Sep 20", desc: "Pharmacy - Prescription Refill", amount: "-$15.00", type: "pharmacy" },
              ].map((item) => (
                <div key={item.date + item.desc} className="flex items-center justify-between py-3 hover:bg-surface-container-low rounded-lg px-3 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-fixed rounded-full flex items-center justify-center">
                      <Icon
                        name={
                          item.type === "visit" ? "videocam" :
                          item.type === "lab" ? "science" :
                          item.type === "payment" ? "payments" : "local_pharmacy"
                        }
                        size="sm"
                        className="text-primary"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-on-surface">{item.desc}</p>
                      <p className="text-xs text-on-surface-variant">{item.date}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-error">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming */}
        <section className="lg:col-span-4">
          <div className="bg-surface-container-lowest rounded-2xl p-8">
            <h3 className="font-headline font-bold text-xl text-primary mb-6">
              Upcoming
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-primary-fixed/30 rounded-xl">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
                  Next Appointment
                </p>
                <p className="font-bold text-primary">Oct 15, 2024</p>
                <p className="text-sm text-on-surface-variant">
                  Dr. Jean-Baptiste — Follow-up
                </p>
              </div>
              <div className="p-4 bg-surface-container-low rounded-xl">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                  Payment Due
                </p>
                <p className="font-bold text-primary">Oct 12, 2024</p>
                <p className="text-sm text-on-surface-variant">Monthly Premium — $145.00</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
```

- [ ] **Step 3: Verify page renders**

```bash
npm run dev
```

Visit `/dashboard`. Expected: Full member dashboard with hero card, credits, stats, activity.

- [ ] **Step 4: Commit**

```bash
git add src/app/\(member\)/dashboard/ src/components/shared/member-card-visual.tsx
git commit -m "feat: add Member Dashboard with hero card, visit credits, stats, and activity feed"
```

---

### Task 13: Member Portal Remaining Pages

**Files:**
- Create: `src/app/(member)/medical-card/page.tsx`, `src/app/(member)/dependents/page.tsx`, `src/app/(member)/payments/page.tsx`

- [ ] **Step 1: Create Digital Medical Card page**

Create `src/app/(member)/medical-card/page.tsx`:

```tsx
import { TopBar } from "@/components/layout/top-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export default function MedicalCardPage() {
  return (
    <>
      <TopBar greeting="Digital Medical Card" subtitle="Your portable health identity" initials="JP" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Card Display */}
        <section className="lg:col-span-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-container p-10 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div>
                <Badge className="bg-white/10 text-white mb-4">
                  <Icon name="check_circle" size="sm" filled className="mr-1" />
                  ACTIVE MEMBER
                </Badge>
                <h2 className="text-3xl font-extrabold font-headline mb-1">
                  Jean-Pierre Valcourt
                </h2>
                <p className="font-mono tracking-widest text-lg text-primary-fixed opacity-90 mb-6">
                  VSC-88291-HT
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/60 text-xs uppercase">Blood Type</p>
                    <p className="font-bold">O Positive</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs uppercase">Region</p>
                    <p className="font-bold">Port-au-Prince</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs uppercase">Valid Through</p>
                    <p className="font-bold">12/2026</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs uppercase">Plan</p>
                    <p className="font-bold">Premium</p>
                  </div>
                </div>
              </div>
              {/* QR Code Placeholder */}
              <div className="w-40 h-40 bg-white rounded-2xl flex items-center justify-center">
                <Icon name="qr_code_2" size="xl" className="text-primary" />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <Button size="sm">
              <Icon name="phone_iphone" size="sm" className="mr-2" />
              Add to Apple Wallet
            </Button>
            <Button variant="ghost" size="sm">
              <Icon name="smartphone" size="sm" className="mr-2" />
              Add to Google Wallet
            </Button>
          </div>
        </section>

        {/* Card Info */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6">
            <h3 className="font-headline font-bold text-lg text-primary mb-4">
              Emergency Contacts
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Primary</span>
                <span className="font-medium text-on-surface">Sarah V. — ****4521</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Secondary</span>
                <span className="font-medium text-on-surface">Pierre V. — ****8832</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl p-6">
            <h3 className="font-headline font-bold text-lg text-primary mb-4">
              Card Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Status</span>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Issued</span>
                <span className="font-medium">Jan 15, 2024</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Last Verified</span>
                <span className="font-medium">Oct 10, 2024</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Create Dependents page**

Create `src/app/(member)/dependents/page.tsx`:

```tsx
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";

const dependents = [
  {
    name: "Sarah Valcourt",
    relationship: "Spouse",
    age: 34,
    credit: "€1,450.00",
    status: "Active",
    initials: "SV",
  },
  {
    name: "Leo Valcourt",
    relationship: "Child",
    age: 6,
    credit: "€850.00",
    status: "Active",
    initials: "LV",
  },
];

export default function DependentsPage() {
  return (
    <>
      <TopBar greeting="Dependents" subtitle="Manage your family coverage" initials="JP" />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-lowest rounded-2xl p-6">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
            Total Dependents
          </p>
          <p className="text-3xl font-black text-primary">2</p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-6">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
            Total Managed Credit
          </p>
          <p className="text-3xl font-black text-primary">€2,300.00</p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-6">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
            Annual Premium Used
          </p>
          <p className="text-3xl font-black text-primary">80%</p>
          <div className="h-2 bg-surface-container rounded-full overflow-hidden mt-2">
            <div className="h-full bg-primary rounded-full" style={{ width: "80%" }} />
          </div>
        </div>
      </div>

      {/* Dependent Cards */}
      <div className="space-y-6">
        {dependents.map((dep) => (
          <div
            key={dep.name}
            className="bg-surface-container-lowest rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-lg">
                {dep.initials}
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-primary">{dep.name}</h3>
                <p className="text-sm text-on-surface-variant">
                  {dep.relationship} · Age {dep.age}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-xs text-on-surface-variant uppercase tracking-widest">Credit Balance</p>
                <p className="text-xl font-black text-primary">{dep.credit}</p>
              </div>
              <Badge variant="success">{dep.status}</Badge>
              <Button variant="secondary" size="sm">
                <Icon name="visibility" size="sm" className="mr-1" />
                Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Button>
          <Icon name="add" size="sm" className="mr-2" />
          Add New Dependent
        </Button>
      </div>
    </>
  );
}
```

- [ ] **Step 3: Create Payments page**

Create `src/app/(member)/payments/page.tsx`:

```tsx
import { TopBar } from "@/components/layout/top-bar";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";

const transactions = [
  { id: "#VST-98231", date: "Oct 12, 2024", desc: "Monthly Premium", amount: "$200.00", status: "Paid" },
  { id: "#VST-98112", date: "Oct 5, 2024", desc: "Lab Work Co-Pay", amount: "$22.50", status: "Paid" },
  { id: "#VST-97994", date: "Sep 28, 2024", desc: "Monthly Premium", amount: "$200.00", status: "Paid" },
  { id: "#VST-97801", date: "Sep 15, 2024", desc: "Dependent Addition", amount: "$95.00", status: "Processing" },
  { id: "#VST-97650", date: "Sep 1, 2024", desc: "Pharmacy Co-Pay", amount: "$15.00", status: "Paid" },
];

export default function PaymentsPage() {
  return (
    <>
      <TopBar greeting="Payments" subtitle="Track your billing and transactions" initials="JP" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard label="Next Payment" value="$145.00" icon="payments" trend="Due Oct 12" />
        <StatCard label="This Year" value="$1,842.50" icon="account_balance" />
        <StatCard label="Plan" value="Premium Gold" icon="workspace_premium" />
      </div>

      {/* Transaction History */}
      <div className="bg-surface-container-lowest rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline font-bold text-xl text-primary">
            Transaction History
          </h3>
          <button className="text-sm text-primary font-bold hover:underline">
            Export CSV
          </button>
        </div>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          <span>Transaction</span>
          <span>Date</span>
          <span>Description</span>
          <span>Amount</span>
          <span>Status</span>
        </div>

        {/* Table Rows */}
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="grid grid-cols-1 md:grid-cols-5 gap-4 px-4 py-4 rounded-xl hover:bg-surface-container-low transition-colors items-center"
            >
              <span className="font-mono text-sm text-primary font-bold">{tx.id}</span>
              <span className="text-sm text-on-surface-variant">{tx.date}</span>
              <span className="text-sm text-on-surface">{tx.desc}</span>
              <span className="text-sm font-bold text-primary">{tx.amount}</span>
              <Badge variant={tx.status === "Paid" ? "success" : "warning"}>
                {tx.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 4: Verify all member pages**

```bash
npm run dev
```

Visit `/medical-card`, `/dependents`, `/payments`. Expected: All pages render.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(member\)/
git commit -m "feat: add Medical Card, Dependents, and Payments member portal pages"
```

---

## Phase 6: Doctor Portal Pages

### Task 14: Doctor Portal

**Files:**
- Create: `src/app/(doctor)/verification/page.tsx`, `src/app/(doctor)/patient-care/page.tsx`, `src/app/(doctor)/visit-history/page.tsx`, `src/app/(doctor)/profile/page.tsx`

- [ ] **Step 1: Create Verification page**

Create `src/app/(doctor)/verification/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";

export default function VerificationPage() {
  const [searchId, setSearchId] = useState("");
  const [verified, setVerified] = useState(false);

  return (
    <>
      <TopBar greeting="Patient Verification" subtitle="Verify member eligibility before consultation" initials="JB" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Search Panel */}
        <section className="lg:col-span-5">
          <div className="bg-surface-container-lowest rounded-2xl p-8">
            <h3 className="font-headline font-bold text-xl text-primary mb-6">
              Search Patient
            </h3>
            <div className="space-y-4">
              <Input
                id="memberId"
                label="Member ID or NFC"
                placeholder="VSC-XXXXX-HT"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              <Button
                className="w-full"
                onClick={() => setVerified(true)}
              >
                <Icon name="search" size="sm" className="mr-2" />
                Verify Member
              </Button>
            </div>
          </div>
        </section>

        {/* Result Panel */}
        <section className="lg:col-span-7">
          {verified ? (
            <div className="bg-surface-container-lowest rounded-2xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-xl">
                    MC
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-2xl text-primary">
                      Marie-Ange Celestin
                    </h3>
                    <p className="font-mono text-sm text-on-surface-variant">VSC-8829-HT</p>
                  </div>
                </div>
                <Badge variant="success" icon="check_circle">
                  Verified Member
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Plan</p>
                  <p className="font-bold text-primary">Global Wellness Plus</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Status</p>
                  <Badge variant="success">Active</Badge>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Remaining Credits</p>
                  <p className="font-bold text-primary">14 Units</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Specialist</p>
                  <p className="font-bold text-primary">2/3 Available</p>
                </div>
              </div>

              {/* Encounter Form */}
              <div className="border-t border-outline-variant/20 pt-6">
                <h4 className="font-headline font-bold text-lg text-primary mb-4">
                  Register Encounter
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                      Service Type
                    </label>
                    <select className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5 text-on-surface text-sm focus:ring-2 focus:ring-primary">
                      <option>Generalist Consultation</option>
                      <option>Specialist Consultation</option>
                      <option>Televisit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                      Visit Notes
                    </label>
                    <textarea
                      rows={3}
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5 text-on-surface text-sm resize-none focus:ring-2 focus:ring-primary"
                      placeholder="Clinical observations..."
                    />
                  </div>
                  <Button className="w-full">
                    <Icon name="check" size="sm" className="mr-2" />
                    Confirm Visit & Deduct Credit
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-surface-container-lowest rounded-2xl p-16 flex flex-col items-center justify-center text-center">
              <Icon name="search" size="xl" className="text-outline mb-4" />
              <h3 className="font-headline font-bold text-xl text-on-surface-variant mb-2">
                Search for a Patient
              </h3>
              <p className="text-on-surface-variant text-sm">
                Enter a Member ID or use NFC to verify eligibility.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Create Patient Care page**

Create `src/app/(doctor)/patient-care/page.tsx`:

```tsx
import { TopBar } from "@/components/layout/top-bar";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";

const patients = [
  { name: "Marie-Ange Celestin", type: "Specialist", time: "9:00 AM", status: "Stable", initials: "MC" },
  { name: "Pierre Louis", type: "Generalist", time: "10:30 AM", status: "At Risk", initials: "PL" },
  { name: "Sophie Jean-Baptiste", type: "Televisit", time: "11:00 AM", status: "Recovered", initials: "SJ" },
  { name: "André Dupont", type: "Specialist", time: "2:00 PM", status: "Critical", initials: "AD" },
];

const statusColors: Record<string, "success" | "warning" | "error" | "neutral"> = {
  Stable: "success",
  "At Risk": "warning",
  Critical: "error",
  Recovered: "neutral",
};

export default function PatientCarePage() {
  return (
    <>
      <TopBar greeting="Patient Care" subtitle="Manage your daily appointments and patient queue" initials="JB" />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <StatCard label="Today's Patients" value="8" icon="people" />
        <StatCard label="Completed" value="4" icon="check_circle" trend="+2 from yesterday" trendUp />
        <StatCard label="Clinic Efficiency" value="94%" icon="speed" />
        <StatCard label="Total Visits" value="128" icon="history" />
      </div>

      {/* Next Appointment */}
      <div className="bg-gradient-to-br from-primary to-primary-container rounded-2xl p-8 text-white mb-8">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">
              Next Appointment
            </p>
            <h3 className="text-2xl font-extrabold font-headline">
              Marie-Ange Celestin
            </h3>
            <p className="text-primary-fixed-dim">Specialist Consultation · 9:00 AM</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black">15:32</p>
            <p className="text-xs text-white/60">minutes until</p>
          </div>
        </div>
      </div>

      {/* Patient Queue */}
      <div className="bg-surface-container-lowest rounded-2xl p-8">
        <h3 className="font-headline font-bold text-xl text-primary mb-6">
          Today&apos;s Queue
        </h3>
        <div className="space-y-3">
          {patients.map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-container-low transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold">
                  {p.initials}
                </div>
                <div>
                  <p className="font-bold text-on-surface">{p.name}</p>
                  <p className="text-sm text-on-surface-variant">{p.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-sm text-on-surface-variant">{p.time}</span>
                <Badge variant={statusColors[p.status]}>{p.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 3: Create Visit History page**

Create `src/app/(doctor)/visit-history/page.tsx`:

```tsx
import { TopBar } from "@/components/layout/top-bar";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";

const visits = [
  { date: "Oct 12, 2024", patient: "Marie-Ange Celestin", type: "Specialist", note: "Post-operative follow-up", status: "Completed" },
  { date: "Oct 11, 2024", patient: "Pierre Louis", type: "Generalist", note: "Routine check-up", status: "Completed" },
  { date: "Oct 10, 2024", patient: "Sophie Jean-Baptiste", type: "Televisit", note: "Prescription renewal", status: "Completed" },
  { date: "Oct 9, 2024", patient: "André Dupont", type: "Specialist", note: "Cardiac assessment", status: "Completed" },
  { date: "Oct 8, 2024", patient: "Claire Moreau", type: "Generalist", note: "Vaccination follow-up", status: "Completed" },
];

export default function VisitHistoryPage() {
  return (
    <>
      <TopBar greeting="Visit History" subtitle="Review past encounters and clinical records" initials="JB" />

      <div className="bg-surface-container-lowest rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline font-bold text-xl text-primary">
            Encounter Records
          </h3>
          <div className="flex gap-2">
            <Badge variant="info">128 Total</Badge>
            <Badge variant="success">98% Notes Complete</Badge>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-3 mb-6">
          {["All", "Specialist", "Generalist", "Televisit"].map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                filter === "All"
                  ? "bg-primary text-white"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          <span>Date</span>
          <span>Patient</span>
          <span>Service Type</span>
          <span>Notes</span>
          <span>Status</span>
        </div>

        <div className="space-y-2">
          {visits.map((v, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-4 px-4 py-4 rounded-xl hover:bg-surface-container-low transition-colors items-center">
              <span className="text-sm text-on-surface-variant">{v.date}</span>
              <span className="text-sm font-bold text-primary">{v.patient}</span>
              <Badge variant="info">{v.type}</Badge>
              <span className="text-sm text-on-surface-variant truncate">{v.note}</span>
              <Badge variant="success">{v.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 4: Create Doctor Profile page**

Create `src/app/(doctor)/profile/page.tsx`:

```tsx
import { TopBar } from "@/components/layout/top-bar";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { StatCard } from "@/components/ui/stat-card";

export default function DoctorProfilePage() {
  return (
    <>
      <TopBar greeting="Doctor Profile" subtitle="Your professional credentials and settings" initials="JB" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Card */}
        <section className="lg:col-span-8">
          <div className="bg-surface-container-lowest rounded-2xl p-8">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-3xl">
                JB
              </div>
              <div>
                <h2 className="font-headline font-extrabold text-3xl text-primary">
                  Dr. Jean-Baptiste Valcourt
                </h2>
                <p className="text-on-surface-variant text-lg">
                  Interventional Cardiology
                </p>
                <div className="flex gap-3 mt-3">
                  <Badge variant="success" icon="verified">Board Verified</Badge>
                  <Badge variant="info">Active Provider</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">
                  License ID
                </p>
                <p className="font-bold text-primary font-mono">HT-8829-MED-2024</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">
                  Clinic
                </p>
                <p className="font-bold text-primary">Centre de Santé</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">
                  Location
                </p>
                <p className="font-bold text-primary">Pétion-Ville, Haiti</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">
                  Languages
                </p>
                <p className="font-bold text-primary">FR / EN</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="lg:col-span-4 space-y-6">
          <StatCard label="Total Consultations" value="128" icon="clinical_notes" />
          <StatCard label="Note Completion" value="98%" icon="edit_note" />
          <StatCard label="Patient Satisfaction" value="96%" icon="thumb_up" trend="+2% this month" trendUp />
        </section>
      </div>
    </>
  );
}
```

- [ ] **Step 5: Verify all doctor pages**

```bash
npm run dev
```

Visit `/verification`, `/patient-care`, `/visit-history`, `/profile`. Expected: All render.

- [ ] **Step 6: Commit**

```bash
git add src/app/\(doctor\)/
git commit -m "feat: add Doctor Portal (verification, patient care, visit history, profile)"
```

---

## Phase 7: Affiliate Portal Pages

### Task 15: Affiliate Portal

**Files:**
- Create: `src/app/(affiliate)/dashboard/page.tsx`, `src/app/(affiliate)/referrals/page.tsx`, `src/app/(affiliate)/commissions/page.tsx`, `src/app/(affiliate)/marketing/page.tsx`

- [ ] **Step 1: Create Affiliate Dashboard**

Create `src/app/(affiliate)/dashboard/page.tsx`:

```tsx
import { TopBar } from "@/components/layout/top-bar";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const recentReferrals = [
  { name: "Pierre Jean", date: "Oct 10", plan: "Premium", status: "Active", commission: "$45.00" },
  { name: "Claire Moreau", date: "Oct 8", plan: "Advantage", status: "Pending", commission: "$30.00" },
  { name: "André Dupont", date: "Oct 5", plan: "Essential", status: "Active", commission: "$20.00" },
];

export default function AffiliateDashboard() {
  return (
    <>
      <TopBar greeting="Affiliate Dashboard" subtitle="Track your referrals and earnings" initials="MD" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Referred" value="1,284" icon="people" trend="+42 this month" trendUp />
        <StatCard label="Commissions Due" value="$4,290.50" icon="payments" />
        <StatCard label="Lifetime Earned" value="$32,840" icon="account_balance" trend="+12.4%" trendUp />
      </div>

      {/* Referral Link */}
      <div className="bg-surface-container-lowest rounded-2xl p-8 mb-8">
        <h3 className="font-headline font-bold text-xl text-primary mb-4">
          Your Referral Link
        </h3>
        <div className="flex gap-3">
          <div className="flex-1 bg-surface-container-low rounded-xl px-4 py-3 font-mono text-sm text-on-surface-variant truncate">
            https://vitasante.ht/join?ref=VITA-MARIE
          </div>
          <Button size="sm">
            <Icon name="content_copy" size="sm" className="mr-2" />
            Copy
          </Button>
          <Button variant="ghost" size="sm">
            <Icon name="qr_code" size="sm" />
          </Button>
        </div>
      </div>

      {/* Recent Referrals */}
      <div className="bg-surface-container-lowest rounded-2xl p-8">
        <h3 className="font-headline font-bold text-xl text-primary mb-6">
          Recent Referrals
        </h3>
        <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          <span>Member</span>
          <span>Date Joined</span>
          <span>Plan</span>
          <span>Status</span>
          <span>Commission</span>
        </div>
        <div className="space-y-2">
          {recentReferrals.map((r) => (
            <div key={r.name} className="grid grid-cols-1 md:grid-cols-5 gap-4 px-4 py-4 rounded-xl hover:bg-surface-container-low transition-colors items-center">
              <span className="font-bold text-primary text-sm">{r.name}</span>
              <span className="text-sm text-on-surface-variant">{r.date}</span>
              <Badge variant="info">{r.plan}</Badge>
              <Badge variant={r.status === "Active" ? "success" : "warning"}>{r.status}</Badge>
              <span className="font-bold text-secondary text-sm">{r.commission}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Create Referrals page**

Create `src/app/(affiliate)/referrals/page.tsx`:

```tsx
import { TopBar } from "@/components/layout/top-bar";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const referrals = [
  { name: "Pierre Jean", date: "Oct 10, 2024", plan: "Premium", status: "Active", commission: "$45.00" },
  { name: "Claire Moreau", date: "Oct 8, 2024", plan: "Advantage", status: "Pending Review", commission: "$30.00" },
  { name: "André Dupont", date: "Oct 5, 2024", plan: "Essential", status: "Active", commission: "$20.00" },
  { name: "Sophie Laurent", date: "Sep 28, 2024", plan: "Premium", status: "Active", commission: "$45.00" },
  { name: "Marc Antoine", date: "Sep 20, 2024", plan: "Advantage", status: "Expired", commission: "$0.00" },
];

const statusVariant: Record<string, "success" | "warning" | "error"> = {
  Active: "success",
  "Pending Review": "warning",
  Expired: "error",
};

export default function ReferralsPage() {
  return (
    <>
      <TopBar greeting="Referral Tracking" subtitle="Monitor your professional network" initials="MD" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <StatCard label="Network Velocity" value="+14%" icon="trending_up" trend="Growing" trendUp />
        <StatCard label="Unclaimed Revenue" value="$1,840.22" icon="warning" trend="From pending referrals" />
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline font-bold text-xl text-primary">
            124 Professional Referrals
          </h3>
          <div className="flex gap-2">
            {["Active", "Pending Review", "Expired"].map((f) => (
              <button key={f} className="px-3 py-1.5 rounded-full text-xs font-bold bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-colors">
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <Input id="search" placeholder="Search by name, plan, or status..." />
        </div>

        <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          <span>Referral Name</span>
          <span>Date Joined</span>
          <span>Plan</span>
          <span>Status</span>
          <span>Commission</span>
        </div>

        <div className="space-y-2">
          {referrals.map((r) => (
            <div key={r.name} className="grid grid-cols-1 md:grid-cols-5 gap-4 px-4 py-4 rounded-xl hover:bg-surface-container-low transition-colors items-center">
              <span className="font-bold text-primary text-sm">{r.name}</span>
              <span className="text-sm text-on-surface-variant">{r.date}</span>
              <Badge variant="info">{r.plan}</Badge>
              <Badge variant={statusVariant[r.status]}>{r.status}</Badge>
              <span className="font-bold text-secondary text-sm">{r.commission}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 3: Create Commissions page**

Create `src/app/(affiliate)/commissions/page.tsx`:

```tsx
import { TopBar } from "@/components/layout/top-bar";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";

const payouts = [
  { id: "#PAY-001", date: "Oct 1, 2024", amount: "$1,250.00", status: "Paid" },
  { id: "#PAY-002", date: "Sep 1, 2024", amount: "$980.00", status: "Paid" },
  { id: "#PAY-003", date: "Aug 1, 2024", amount: "$1,100.00", status: "Paid" },
];

export default function CommissionsPage() {
  return (
    <>
      <TopBar greeting="Commissions & Payments" subtitle="Track your earnings and payouts" initials="MD" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Earned" value="$42,850" icon="account_balance" />
        <StatCard label="Pending Validation" value="$3,120.45" icon="hourglass_top" />
        <StatCard label="Next Payout" value="Oct 15" icon="calendar_month" />
      </div>

      {/* Tier Progress */}
      <div className="bg-surface-container-lowest rounded-2xl p-8 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-headline font-bold text-xl text-primary">Tier Progress</h3>
          <Badge variant="info">Elite Partner</Badge>
        </div>
        <p className="text-sm text-on-surface-variant mb-4">
          $2,400 away from Diamond Tier
        </p>
        <div className="h-3 bg-surface-container rounded-full overflow-hidden">
          <div className="h-full clinical-gradient rounded-full" style={{ width: "75%" }} />
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-surface-container-lowest rounded-2xl p-8">
        <h3 className="font-headline font-bold text-xl text-primary mb-6">
          Payout History
        </h3>
        <div className="hidden md:grid grid-cols-4 gap-4 px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          <span>Payout ID</span>
          <span>Date</span>
          <span>Amount</span>
          <span>Status</span>
        </div>
        <div className="space-y-2">
          {payouts.map((p) => (
            <div key={p.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 py-4 rounded-xl hover:bg-surface-container-low transition-colors items-center">
              <span className="font-mono text-sm font-bold text-primary">{p.id}</span>
              <span className="text-sm text-on-surface-variant">{p.date}</span>
              <span className="font-bold text-secondary text-sm">{p.amount}</span>
              <Badge variant="success">{p.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 4: Create Marketing page**

Create `src/app/(affiliate)/marketing/page.tsx`:

```tsx
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const materials = [
  { name: "Digital Brochure - FR", type: "PDF", size: "2.4 MB", icon: "description" },
  { name: "Digital Brochure - EN", type: "PDF", size: "2.1 MB", icon: "description" },
  { name: "Social Media Kit", type: "ZIP", size: "15.8 MB", icon: "photo_library" },
  { name: "Email Templates", type: "HTML", size: "340 KB", icon: "mail" },
  { name: "Banner Ads Pack", type: "ZIP", size: "8.2 MB", icon: "image" },
  { name: "Presentation Deck", type: "PPTX", size: "5.6 MB", icon: "slideshow" },
];

export default function MarketingPage() {
  return (
    <>
      <TopBar greeting="Marketing Materials" subtitle="Download professional assets to grow your network" initials="MD" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((m) => (
          <div key={m.name} className="bg-surface-container-lowest rounded-2xl p-6 flex flex-col">
            <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center mb-4">
              <Icon name={m.icon} className="text-primary" />
            </div>
            <h3 className="font-headline font-bold text-lg text-primary mb-1">{m.name}</h3>
            <p className="text-sm text-on-surface-variant mb-4">
              {m.type} · {m.size}
            </p>
            <Button variant="ghost" size="sm" className="mt-auto self-start">
              <Icon name="download" size="sm" className="mr-2" />
              Download
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
```

- [ ] **Step 5: Verify all affiliate pages**

```bash
npm run dev
```

Visit `/dashboard` (as affiliate), `/referrals`, `/commissions`, `/marketing`. Expected: All render.

- [ ] **Step 6: Commit**

```bash
git add src/app/\(affiliate\)/
git commit -m "feat: add Affiliate Portal (dashboard, referrals, commissions, marketing)"
```

---

## Phase 8: Sponsor Portal Pages

### Task 16: Sponsor Portal

**Files:**
- Create: `src/app/(sponsor)/overview/page.tsx`, `src/app/(sponsor)/funded-members/page.tsx`, `src/app/(sponsor)/impact-reports/page.tsx`, `src/app/(sponsor)/billing/page.tsx`, `src/app/(sponsor)/sponsor-new/page.tsx`

- [ ] **Step 1: Create Sponsor Overview**

Create `src/app/(sponsor)/overview/page.tsx`:

```tsx
import { TopBar } from "@/components/layout/top-bar";
import { StatCard } from "@/components/ui/stat-card";

export default function SponsorOverview() {
  return (
    <>
      <TopBar greeting="Sponsor Overview" subtitle="Your institutional health investment dashboard" initials="FH" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Investment" value="$450,200" icon="account_balance" trend="+12.4%" trendUp />
        <StatCard label="Active Beneficiaries" value="1,284" icon="groups" trend="+42 new" trendUp />
        <StatCard label="Health Outcomes" value="94.2%" icon="favorite" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Cardiac Health" value="+14%" icon="cardiology" trend="Improving" trendUp />
        <StatCard label="Pediatric Care" value="892" icon="child_care" />
        <StatCard label="Med Adherence" value="98%" icon="medication" />
        <StatCard label="Mental Wellness" value="450" icon="psychology" trend="Sessions this month" />
      </div>

      {/* Wellness Champion */}
      <div className="bg-surface-container-lowest rounded-2xl p-8">
        <h3 className="font-headline font-bold text-xl text-primary mb-6">
          Wellness Champion
        </h3>
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center text-secondary font-bold text-xl">
            BS
          </div>
          <div>
            <h4 className="font-headline font-bold text-lg text-primary">
              Beatrice Saint-Jean
            </h4>
            <p className="text-on-surface-variant text-sm mb-2">
              Elite Premium Member · Port-au-Prince
            </p>
            <p className="text-on-surface-variant text-sm leading-relaxed max-w-xl">
              &quot;Thanks to Vita Santé Club and the support of our sponsors, I was able to
              receive specialized cardiac treatment that changed my life. The care I received
              was world-class.&quot;
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Create Funded Members page**

Create `src/app/(sponsor)/funded-members/page.tsx`:

```tsx
import { TopBar } from "@/components/layout/top-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/ui/stat-card";

const members = [
  { name: "Beatrice Saint-Jean", id: "VSC-0032-HT", plan: "Premium", coverage: "Jan 2024 - Dec 2026", status: "Active" },
  { name: "Pierre Louis", id: "VSC-0045-HT", plan: "Advantage", coverage: "Jun 2024 - Jun 2025", status: "Active" },
  { name: "Marie Dupont", id: "VSC-0078-HT", plan: "Premium", coverage: "Mar 2024 - Mar 2025", status: "Expiring Soon" },
  { name: "Jean Moreau", id: "VSC-0091-HT", plan: "Essential", coverage: "Aug 2024 - Aug 2025", status: "Active" },
];

export default function FundedMembersPage() {
  return (
    <>
      <TopBar greeting="Funded Members" subtitle="Manage your sponsored beneficiaries" initials="FH" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Members" value="124" icon="groups" />
        <StatCard label="Funded to Date" value="$42.8k" icon="account_balance" />
        <StatCard label="Adherence Rate" value="98.2%" icon="check_circle" />
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline font-bold text-xl text-primary">
            Funded Members Directory
          </h3>
          <Button size="sm">Sponsor New Member</Button>
        </div>

        <div className="mb-6">
          <Input id="search" placeholder="Search by name, ID, or plan..." />
        </div>

        <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          <span>Member</span>
          <span>Plan</span>
          <span>Coverage Period</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        <div className="space-y-2">
          {members.map((m) => (
            <div key={m.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 px-4 py-4 rounded-xl hover:bg-surface-container-low transition-colors items-center">
              <div>
                <p className="font-bold text-primary text-sm">{m.name}</p>
                <p className="text-xs text-on-surface-variant font-mono">{m.id}</p>
              </div>
              <Badge variant="info">{m.plan}</Badge>
              <span className="text-sm text-on-surface-variant">{m.coverage}</span>
              <Badge variant={m.status === "Active" ? "success" : "warning"}>{m.status}</Badge>
              <Button variant="secondary" size="sm">Details</Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 3: Create Impact Reports, Billing, and Sponsor New pages**

Create `src/app/(sponsor)/impact-reports/page.tsx`:

```tsx
import { TopBar } from "@/components/layout/top-bar";
import { StatCard } from "@/components/ui/stat-card";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

export default function ImpactReportsPage() {
  return (
    <>
      <TopBar greeting="Impact Reports" subtitle="Measure the health outcomes of your sponsorship" initials="FH" />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <StatCard label="Lives Impacted" value="1,284" icon="favorite" />
        <StatCard label="Visits Funded" value="8,432" icon="clinical_notes" />
        <StatCard label="Health Score" value="94.2%" icon="monitoring" trend="+3.1% YoY" trendUp />
        <StatCard label="Cost per Life" value="$350" icon="savings" trend="-8% efficiency" trendUp />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { title: "Q3 2024 Report", date: "Oct 1, 2024", pages: "24 pages" },
          { title: "Q2 2024 Report", date: "Jul 1, 2024", pages: "22 pages" },
          { title: "Q1 2024 Report", date: "Apr 1, 2024", pages: "20 pages" },
          { title: "Annual 2023 Report", date: "Jan 15, 2024", pages: "48 pages" },
        ].map((r) => (
          <div key={r.title} className="bg-surface-container-lowest rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center">
                <Icon name="description" className="text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-primary">{r.title}</h4>
                <p className="text-xs text-on-surface-variant">{r.date} · {r.pages}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Icon name="download" size="sm" className="mr-1" />
              PDF
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
```

Create `src/app/(sponsor)/billing/page.tsx`:

```tsx
import { TopBar } from "@/components/layout/top-bar";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";

const invoices = [
  { id: "#INV-99234", date: "Oct 1, 2024", amount: "€12,240.00", status: "Paid" },
  { id: "#INV-99112", date: "Sep 1, 2024", amount: "€12,240.00", status: "Paid" },
  { id: "#INV-98990", date: "Aug 1, 2024", amount: "€11,800.00", status: "Paid" },
  { id: "#INV-98870", date: "Jul 1, 2024", amount: "€12,240.00", status: "Pending" },
];

export default function BillingPage() {
  return (
    <>
      <TopBar greeting="Billing & Investment" subtitle="Manage your institutional financial commitments" initials="FH" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard label="Lifetime Investment" value="€842,500" icon="account_balance" />
        <StatCard label="Next Payment Due" value="€12,240" icon="payments" trend="Nov 1, 2024" />
        <StatCard label="Active Members Funded" value="1,248" icon="groups" />
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-8">
        <h3 className="font-headline font-bold text-xl text-primary mb-6">
          Transaction History
        </h3>
        <div className="hidden md:grid grid-cols-4 gap-4 px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          <span>Invoice ID</span>
          <span>Date</span>
          <span>Amount</span>
          <span>Status</span>
        </div>
        <div className="space-y-2">
          {invoices.map((inv) => (
            <div key={inv.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 py-4 rounded-xl hover:bg-surface-container-low transition-colors items-center">
              <span className="font-mono text-sm font-bold text-primary">{inv.id}</span>
              <span className="text-sm text-on-surface-variant">{inv.date}</span>
              <span className="font-bold text-primary text-sm">{inv.amount}</span>
              <Badge variant={inv.status === "Paid" ? "success" : "warning"}>{inv.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
```

Create `src/app/(sponsor)/sponsor-new/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export default function SponsorNewPage() {
  const [step, setStep] = useState(1);

  return (
    <>
      <TopBar greeting="Sponsor New Members" subtitle="Enroll beneficiaries into the network" initials="FH" />

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
          <span>Step {step} of 3</span>
          <span>{step === 1 ? "Beneficiary Info" : step === 2 ? "Select Plan" : "Review"}</span>
        </div>
        <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-8">
        {step === 1 && (
          <div className="space-y-6 max-w-2xl">
            <h3 className="font-headline font-bold text-xl text-primary mb-4">
              Beneficiary Information
            </h3>
            <Input id="fullName" label="Full Name" placeholder="Enter beneficiary's full name" />
            <Input id="dob" label="Date of Birth" type="date" />
            <Input id="email" label="Email Address" type="email" placeholder="beneficiary@email.com" />
            <Input id="phone" label="Phone Number" type="tel" placeholder="+509 0000 0000" />

            <h4 className="font-headline font-bold text-lg text-primary mt-8 mb-4">
              Haiti Residential Address
            </h4>
            <Input id="street" label="Street Address" placeholder="123 Rue Principale" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                  City / Commune
                </label>
                <select className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5 text-on-surface text-sm focus:ring-2 focus:ring-primary">
                  <option>Pétion-Ville</option>
                  <option>Port-au-Prince</option>
                  <option>Cap-Haïtien</option>
                  <option>Jacmel</option>
                  <option>Delmas</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                  Department
                </label>
                <select className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5 text-on-surface text-sm focus:ring-2 focus:ring-primary">
                  <option>Ouest</option>
                  <option>Nord</option>
                  <option>Sud</option>
                  <option>Artibonite</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 max-w-2xl">
            <h3 className="font-headline font-bold text-xl text-primary mb-4">
              Select Plan
            </h3>
            {["Essential - $99/year", "Advantage - $135/year", "Premium - $200/year"].map((plan) => (
              <label key={plan} className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-low cursor-pointer transition-colors">
                <input type="radio" name="plan" className="w-5 h-5 text-primary focus:ring-primary" />
                <span className="font-bold text-primary">{plan}</span>
              </label>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="max-w-2xl">
            <h3 className="font-headline font-bold text-xl text-primary mb-4">
              Review & Confirm
            </h3>
            <div className="p-6 bg-surface-container-low rounded-xl">
              <p className="text-sm text-on-surface-variant">
                Review the beneficiary details and plan selection before confirming enrollment.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 max-w-2xl">
          {step > 1 ? (
            <Button variant="secondary" onClick={() => setStep(step - 1)}>
              <Icon name="arrow_back" size="sm" className="mr-2" />
              Previous
            </Button>
          ) : (
            <Button variant="secondary">Cancel</Button>
          )}
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)}>
              Next: {step === 1 ? "Select Plan" : "Review"}
            </Button>
          ) : (
            <Button>Confirm Enrollment</Button>
          )}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 4: Verify all sponsor pages**

```bash
npm run dev
```

- [ ] **Step 5: Commit**

```bash
git add src/app/\(sponsor\)/
git commit -m "feat: add Sponsor Portal (overview, funded members, impact, billing, new enrollment)"
```

---

## Phase 9: Admin Portal Pages

### Task 17: Admin Portal

**Files:**
- Create: `src/app/(admin)/dashboard/page.tsx`, `src/app/(admin)/members/page.tsx`, `src/app/(admin)/doctors/page.tsx`, `src/app/(admin)/affiliates/page.tsx`, `src/app/(admin)/plans/page.tsx`

- [ ] **Step 1: Create Admin Dashboard (Mission Control)**

Create `src/app/(admin)/dashboard/page.tsx`:

```tsx
import { TopBar } from "@/components/layout/top-bar";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

const pendingRequests = [
  { name: "Dr. Sophie Laurent", type: "Doctor Verification", time: "2h ago" },
  { name: "Pierre Jean", type: "New Affiliate Application", time: "4h ago" },
  { name: "Claire Moreau", type: "Member Plan Upgrade", time: "6h ago" },
];

const recentActivity = [
  { event: "New member registered", category: "Members", time: "10 min ago", status: "Success" },
  { event: "Doctor credential verified", category: "Doctors", time: "25 min ago", status: "Success" },
  { event: "Payment batch processed", category: "Finance", time: "1h ago", status: "Success" },
  { event: "Affiliate payout initiated", category: "Affiliates", time: "2h ago", status: "Processing" },
];

export default function AdminDashboard() {
  return (
    <>
      <TopBar greeting="Mission Control" subtitle="Vita Santé Admin Console" initials="AD" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Members" value="15,284" icon="people" trend="+142 this month" trendUp />
        <StatCard label="Active Doctors" value="48" icon="medical_services" trend="+3 new" trendUp />
        <StatCard label="Revenue MTD" value="$284,500" icon="account_balance" trend="+8.2%" trendUp />
        <StatCard label="System Integrity" value="98.4%" icon="security" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Pending Approvals */}
        <section className="lg:col-span-5">
          <div className="bg-surface-container-lowest rounded-2xl p-8">
            <h3 className="font-headline font-bold text-xl text-primary mb-6">
              Pending Approvals
            </h3>
            <div className="space-y-3">
              {pendingRequests.map((r) => (
                <div key={r.name} className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low">
                  <div>
                    <p className="font-bold text-on-surface text-sm">{r.name}</p>
                    <p className="text-xs text-on-surface-variant">{r.type} · {r.time}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="px-3 py-1.5">Approve</Button>
                    <Button variant="secondary" size="sm" className="px-3 py-1.5">Review</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="lg:col-span-7">
          <div className="bg-surface-container-lowest rounded-2xl p-8">
            <h3 className="font-headline font-bold text-xl text-primary mb-6">
              Recent Activity
            </h3>
            <div className="hidden md:grid grid-cols-4 gap-4 px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              <span>Event</span>
              <span>Category</span>
              <span>Time</span>
              <span>Status</span>
            </div>
            <div className="space-y-2">
              {recentActivity.map((a, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 py-3 rounded-xl hover:bg-surface-container-low transition-colors items-center">
                  <span className="text-sm text-on-surface">{a.event}</span>
                  <Badge variant="info">{a.category}</Badge>
                  <span className="text-sm text-on-surface-variant">{a.time}</span>
                  <Badge variant={a.status === "Success" ? "success" : "warning"}>{a.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Plan Distribution */}
        <section className="lg:col-span-12">
          <div className="bg-surface-container-lowest rounded-2xl p-8">
            <h3 className="font-headline font-bold text-xl text-primary mb-6">
              Plan Distribution
            </h3>
            <div className="grid grid-cols-3 gap-8">
              {[
                { name: "Essential", pct: 30, count: "4,585" },
                { name: "Advantage", pct: 45, count: "6,878" },
                { name: "Premium", pct: 25, count: "3,821" },
              ].map((p) => (
                <div key={p.name}>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-primary text-sm">{p.name}</span>
                    <span className="text-sm text-on-surface-variant">{p.pct}% · {p.count}</span>
                  </div>
                  <div className="h-3 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full clinical-gradient rounded-full" style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Create Members Management page**

Create `src/app/(admin)/members/page.tsx`:

```tsx
import { TopBar } from "@/components/layout/top-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";

const members = [
  { name: "Jean-Pierre Valcourt", nif: "NIF-8829001", plan: "Premium", city: "Port-au-Prince", status: "Verified" },
  { name: "Marie-Ange Celestin", nif: "NIF-8829002", plan: "Advantage", city: "Pétion-Ville", status: "Verified" },
  { name: "Pierre Louis", nif: "NIF-8829003", plan: "Essential", city: "Cap-Haïtien", status: "Pending" },
  { name: "Sophie Jean-Baptiste", nif: "NIF-8829004", plan: "Premium", city: "Jacmel", status: "Verified" },
  { name: "André Dupont", nif: "NIF-8829005", plan: "Advantage", city: "Delmas", status: "Pending" },
];

export default function AdminMembersPage() {
  return (
    <>
      <TopBar greeting="Member Management" subtitle="Oversee the entire member roster" initials="AD" />

      <div className="bg-surface-container-lowest rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline font-bold text-xl text-primary">
            Member Directory
          </h3>
          <Button size="sm">
            <Icon name="add" size="sm" className="mr-2" />
            New Member
          </Button>
        </div>

        <div className="mb-6">
          <Input id="search" placeholder="Search by name, NIF, or plan..." />
        </div>

        <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          <span>Identity</span>
          <span>NIF</span>
          <span>Plan</span>
          <span>City</span>
          <span>Status</span>
        </div>
        <div className="space-y-2">
          {members.map((m) => (
            <div key={m.nif} className="grid grid-cols-1 md:grid-cols-5 gap-4 px-4 py-4 rounded-xl hover:bg-surface-container-low transition-colors items-center">
              <span className="font-bold text-primary text-sm">{m.name}</span>
              <span className="font-mono text-sm text-on-surface-variant">{m.nif}</span>
              <Badge variant="info">{m.plan}</Badge>
              <span className="text-sm text-on-surface-variant">{m.city}</span>
              <Badge variant={m.status === "Verified" ? "success" : "warning"}>{m.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 3: Create Doctors, Affiliates, and Plans admin pages**

Create `src/app/(admin)/doctors/page.tsx`:

```tsx
import { TopBar } from "@/components/layout/top-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const doctors = [
  { name: "Dr. Jean-Baptiste Valcourt", specialty: "Cardiology", license: "HT-8829-MED-2024", location: "Pétion-Ville", verified: true },
  { name: "Dr. Sophie Laurent", specialty: "Pediatrics", license: "HT-9012-MED-2023", location: "Port-au-Prince", verified: true },
  { name: "Dr. Marc Antoine", specialty: "General Practice", license: "HT-7654-MED-2024", location: "Cap-Haïtien", verified: false },
  { name: "Dr. Claire Moreau", specialty: "Dermatology", license: "HT-5432-MED-2023", location: "Jacmel", verified: true },
];

export default function AdminDoctorsPage() {
  return (
    <>
      <TopBar greeting="Doctor Registry" subtitle="Manage the medical provider network" initials="AD" />

      <div className="flex justify-between items-center mb-8">
        <div />
        <Button size="sm">
          <Icon name="add" size="sm" className="mr-2" />
          Register Doctor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {doctors.map((d) => (
          <div key={d.license} className="bg-surface-container-lowest rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold">
                  {d.name.split(" ").slice(-1)[0][0]}{d.name.split(" ").slice(-2)[0][0]}
                </div>
                <div>
                  <h4 className="font-headline font-bold text-lg text-primary">{d.name}</h4>
                  <p className="text-sm text-on-surface-variant">{d.specialty}</p>
                </div>
              </div>
              <Badge variant={d.verified ? "success" : "warning"}>
                {d.verified ? "Verified" : "Pending"}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest">License</p>
                <p className="font-mono font-bold text-primary">{d.license}</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest">Location</p>
                <p className="font-bold text-primary">{d.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
```

Create `src/app/(admin)/affiliates/page.tsx`:

```tsx
import { TopBar } from "@/components/layout/top-bar";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";

const agents = [
  { name: "Marie-Claire Dupont", conversion: "24%", ytd: "$32,840", tier: "Elite" },
  { name: "Pierre Jean", conversion: "18%", ytd: "$18,420", tier: "Standard" },
  { name: "Sophie Laurent", conversion: "31%", ytd: "$45,200", tier: "Diamond" },
  { name: "André Moreau", conversion: "12%", ytd: "$8,900", tier: "Standard" },
];

export default function AdminAffiliatesPage() {
  return (
    <>
      <TopBar greeting="Affiliate Oversight" subtitle="Manage the partner network" initials="AD" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Affiliates" value="86" icon="handshake" />
        <StatCard label="Total Commissions YTD" value="$284,500" icon="payments" />
        <StatCard label="Avg Conversion" value="22%" icon="trending_up" />
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-8">
        <h3 className="font-headline font-bold text-xl text-primary mb-6">
          Agent Performance
        </h3>
        <div className="hidden md:grid grid-cols-4 gap-4 px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          <span>Agent</span>
          <span>Conversion Rate</span>
          <span>YTD Earnings</span>
          <span>Tier</span>
        </div>
        <div className="space-y-2">
          {agents.map((a) => (
            <div key={a.name} className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 py-4 rounded-xl hover:bg-surface-container-low transition-colors items-center">
              <span className="font-bold text-primary text-sm">{a.name}</span>
              <span className="text-sm font-bold text-secondary">{a.conversion}</span>
              <span className="text-sm font-bold text-primary">{a.ytd}</span>
              <Badge variant={a.tier === "Diamond" ? "success" : a.tier === "Elite" ? "info" : "neutral"}>
                {a.tier}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
```

Create `src/app/(admin)/plans/page.tsx`:

```tsx
"use client";

import { TopBar } from "@/components/layout/top-bar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminPlansPage() {
  return (
    <>
      <TopBar greeting="Plan Configuration" subtitle="Manage membership tiers and pricing" initials="AD" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Plan Cards */}
        <div className="space-y-6">
          {[
            { name: "Essential", price: "$99/yr", members: "4,585", status: "Active" },
            { name: "Advantage", price: "$135/yr", members: "6,878", status: "Active" },
            { name: "Premium", price: "$200/yr", members: "3,821", status: "Active" },
          ].map((plan) => (
            <div key={plan.name} className="bg-surface-container-lowest rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h4 className="font-headline font-bold text-lg text-primary">{plan.name}</h4>
                <p className="text-sm text-on-surface-variant">
                  {plan.price} · {plan.members} members
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="success">{plan.status}</Badge>
                <Button variant="secondary" size="sm">Edit</Button>
              </div>
            </div>
          ))}
        </div>

        {/* Configuration Form */}
        <div className="bg-surface-container-lowest rounded-2xl p-8">
          <h3 className="font-headline font-bold text-xl text-primary mb-6">
            Edit Plan Parameters
          </h3>
          <div className="space-y-6">
            <Input id="premium" label="Annual Premium ($)" type="number" placeholder="200" />
            <Input id="deductible" label="Deductible ($)" type="number" placeholder="50" />

            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">
                Benefit Coverage
              </label>
              <div className="space-y-4">
                {["Laboratory", "Pharmaceuticals", "Surgery"].map((benefit) => (
                  <div key={benefit} className="flex items-center justify-between">
                    <span className="text-sm text-on-surface">{benefit}</span>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="35"
                        className="w-32 accent-primary"
                      />
                      <span className="text-sm font-bold text-primary w-10 text-right">35%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">
                Annual Visit Limits
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Input id="specialist" label="Specialist Consults" type="number" placeholder="3" />
                <Input id="mental" label="Mental Health Sessions" type="number" placeholder="6" />
              </div>
            </div>

            <Button className="w-full">Save Configuration</Button>

            <div className="p-4 bg-surface-container-low rounded-xl">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                Impact Forecast
              </p>
              <p className="text-sm text-on-surface-variant">
                Revenue Delta: <span className="font-bold text-secondary">+12.4%</span> ·
                Retention Risk: <span className="font-bold text-secondary">LOW</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 4: Verify all admin pages**

```bash
npm run dev
```

Visit `/dashboard` (admin), `/members`, `/doctors`, `/affiliates`, `/plans`. Expected: All render.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(admin\)/
git commit -m "feat: add Admin Portal (mission control, members, doctors, affiliates, plan config)"
```

---

## Phase 10: Integration & Polish

### Task 18: Stripe Webhook & Payment Integration

**Files:**
- Create: `src/lib/stripe.ts`, `src/app/api/webhooks/stripe/route.ts`

- [ ] **Step 1: Create Stripe client**

Create `src/lib/stripe.ts`:

```typescript
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});
```

- [ ] **Step 2: Create Stripe webhook handler**

Create `src/app/api/webhooks/stripe/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const memberId = session.metadata?.memberId;
      if (memberId) {
        await prisma.payment.create({
          data: {
            memberId,
            amount: session.amount_total ?? 0,
            currency: session.currency ?? "usd",
            status: "PAID",
            stripePaymentId: session.payment_intent as string,
            description: "Plan enrollment payment",
          },
        });
        await prisma.member.update({
          where: { id: memberId },
          data: { status: "ACTIVE" },
        });
      }
      break;
    }
    case "invoice.paid": {
      const invoice = event.data.object;
      const memberId = invoice.metadata?.memberId;
      if (memberId) {
        await prisma.payment.create({
          data: {
            memberId,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: "PAID",
            stripePaymentId: invoice.payment_intent as string,
            description: "Recurring premium payment",
          },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/stripe.ts src/app/api/webhooks/
git commit -m "feat: add Stripe client and webhook handler for payment processing"
```

---

### Task 19: next-intl Bilingual Setup

**Files:**
- Create: `src/i18n/request.ts`, `src/i18n/routing.ts`, `src/i18n/messages/en.json`, `src/i18n/messages/fr.json`
- Modify: `next.config.ts`

- [ ] **Step 1: Create translation files**

Create `src/i18n/messages/en.json`:

```json
{
  "common": {
    "login": "Member Login",
    "signup": "Sign Up",
    "about": "About",
    "plans": "Plans",
    "affiliate": "Affiliate"
  },
  "home": {
    "heroTitle": "Your health is our mission.",
    "heroSubtitle": "In Haiti and for the Diaspora.",
    "heroDescription": "Access premium medical care and secure health coverage for you and your loved ones.",
    "ctaPrimary": "Sign Up Now",
    "ctaSecondary": "View the Network"
  },
  "member": {
    "dashboard": "Dashboard",
    "medicalCard": "Medical Card",
    "dependents": "Dependents",
    "payments": "Payments",
    "urgentConsult": "Urgent Consult"
  }
}
```

Create `src/i18n/messages/fr.json`:

```json
{
  "common": {
    "login": "Connexion Membre",
    "signup": "S'inscrire",
    "about": "À propos",
    "plans": "Forfaits",
    "affiliate": "Affilié"
  },
  "home": {
    "heroTitle": "Votre santé est notre mission.",
    "heroSubtitle": "En Haïti et pour la Diaspora.",
    "heroDescription": "Accédez à des soins médicaux premium et à une couverture santé sécurisée pour vous et vos proches.",
    "ctaPrimary": "S'inscrire maintenant",
    "ctaSecondary": "Voir le réseau"
  },
  "member": {
    "dashboard": "Tableau de bord",
    "medicalCard": "Carte Médicale",
    "dependents": "Personnes à charge",
    "payments": "Paiements",
    "urgentConsult": "Consultation Urgente"
  }
}
```

- [ ] **Step 2: Create i18n config**

Create `src/i18n/request.ts`:

```typescript
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = "fr"; // Default locale, will be dynamic later

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
```

Create `src/i18n/routing.ts`:

```typescript
export const locales = ["fr", "en"] as const;
export const defaultLocale = "fr" as const;
```

- [ ] **Step 3: Update next.config.ts**

Add next-intl plugin to `next.config.ts`:

```typescript
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig = {};

export default withNextIntl(nextConfig);
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/ next.config.ts
git commit -m "feat: add next-intl bilingual setup with FR/EN translations"
```

---

### Task 20: Final Build Verification & Cleanup

- [ ] **Step 1: Run full build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Fix any type errors or warnings**

Address any issues found during build.

- [ ] **Step 3: Verify all routes load in dev**

```bash
npm run dev
```

Manually visit each route:
- `/` — Landing page
- `/about` — About Us
- `/plans` — Plans comparison
- `/affiliate-program` — Affiliate info
- `/auth/signin` — Sign in
- `/auth/signup` — Sign up
- `/dashboard` — Member dashboard
- `/medical-card` — Digital card
- `/dependents` — Dependents
- `/payments` — Payment history
- `/verification` — Doctor verification
- `/patient-care` — Patient queue
- `/visit-history` — Visit history
- `/profile` — Doctor profile
- `/referrals` — Affiliate referrals
- `/commissions` — Affiliate commissions
- `/marketing` — Marketing materials
- `/overview` — Sponsor overview
- `/funded-members` — Funded members
- `/impact-reports` — Impact reports
- `/billing` — Sponsor billing
- `/sponsor-new` — New member enrollment
- `/members` — Admin members
- `/doctors` — Admin doctors
- `/affiliates` — Admin affiliates
- `/plans` — Admin plan config

Expected: All 25+ pages render correctly.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete Vita Santé Club platform with all 5 portals and 25+ pages"
```

- [ ] **Step 5: Push to GitHub**

```bash
git push origin main
```

Expected: Successfully pushes to `adminvitasante/Vitas-Sante`.
