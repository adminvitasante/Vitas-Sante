# Vita Santé Club — Project Guide

> Premium health platform for Haiti and its Diaspora. Multi-role portal (member, doctor, affiliate, sponsor, admin) with subscription-based medical coverage, visit credits, and referral commissions.

## Companion documents — read before non-trivial work

- [architecture.md](architecture.md) — layers, routing, event sourcing, deployment
- [data-reliability.md](data-reliability.md) — idempotency, atomicity, concurrency, cron durability
- [invariants.md](invariants.md) — business rules enforced at the DB level (read before changing schema or state machines)
- [dataprotection.md](dataprotection.md) — PHI/PII handling, auth, secrets, subject rights

## gstack

gstack is vendored into this repo as a git submodule at [.claude/skills/gstack](.claude/skills/gstack) (upstream: `https://github.com/garrytan/gstack.git`). It is the project's authoritative toolkit for planning, design, QA, review, shipping, and browser automation.

### Rules

- **Always use `/browse`** from gstack for any web navigation, screenshots, QA, or UI verification. It is the single supported browser path.
- **Never use `mcp__claude-in-chrome__*` tools**. They are disallowed. Route all browser work through `/browse` (headless) or `/connect-chrome` / `/open-gstack-browser` (visible).
- Before a risky session, invoke `/guard` (or `/careful` + `/freeze`). Before any non-trivial feature or refactor, invoke `/autoplan` or one of the `/plan-*-review` commands.
- Before a PR, run `/review`; for anything touching auth, payments, PHI, or RLS, also run `/cso`.

### Teammate setup (first checkout)

```bash
git submodule update --init --recursive             # fetch gstack
# install bun (required by gstack)
#   Windows:  powershell -c "irm bun.sh/install.ps1 | iex"
#   macOS/Linux:  curl -fsSL https://bun.sh/install | bash
cd .claude/skills/gstack && ./setup                 # compile /browse + link skills
```

Upgrade later with `/gstack-upgrade`.

### Canonical workflows

- **New feature**: `/autoplan` → `/plan-eng-review` (+ `/plan-design-review` if UI, `/plan-ceo-review` if product-shaping) → implement → `/qa` → `/review` → `/ship` → `/land-and-deploy` → `/canary`.
- **Bug / incident**: `/investigate` → fix → `/qa` or `/qa-only` → `/review` → `/ship`.
- **UI polish**: `/design-consultation` → `/design-shotgun` → `/design-html` → `/design-review`.
- **Session hygiene**: `/context-save` before handing off; `/context-restore` on resume; `/learn` to capture durable lessons; `/retro` weekly.

### Command catalogue (grouped by purpose)

#### Plan & strategy

- `/office-hours` — open-ended YC-style help / Q&A
- `/autoplan` — automated multi-lens plan pass
- `/plan-ceo-review` — founder-lens plan review (problem, scope, 10-star version)
- `/plan-eng-review` — eng-manager-lens plan review (architecture, edge cases, tests)
- `/plan-design-review` — design-lens plan review
- `/plan-devex-review` — developer-experience plan review
- `/plan-tune` — tune gstack's question-sensitivity to your style

#### Design

- `/design-consultation` — research + propose a complete design system
- `/design-shotgun` — generate and compare multiple AI design variants
- `/design-html` — produce production-quality HTML/CSS from an approved mockup
- `/design-review` — designer's-eye QA on shipped UI

#### Build-time QA & browser

- `/browse` — **preferred headless browser for all web work**
- `/open-gstack-browser` — visible Chromium window with sidebar; watch actions live
- `/connect-chrome` — attach to an existing Chrome session
- `/setup-browser-cookies` — import real-browser cookies into the headless session
- `/pair-agent` — pair a remote AI agent with your browser
- `/qa` — systematic QA + auto-fix bugs iteratively
- `/qa-only` — QA and produce a report without fixing
- `/benchmark` — page-load / CWV regression detection
- `/benchmark-models` — cross-model benchmark for gstack skills (Claude / GPT / Gemini)

#### Review & investigation

- `/review` — pre-landing PR review (SQL safety, LLM trust boundaries, side effects)
- `/codex` — OpenAI Codex CLI wrapper: review, challenge, consult
- `/cso` — chief-security-officer audit (secrets, supply chain, LLM boundaries)
- `/devex-review` — live developer-experience audit via `/browse`
- `/investigate` — root-cause debugging, no fixes without a cause
- `/health` — composite code-quality dashboard across linter / tests / types
- `/retro` — weekly engineering retrospective

#### Ship & deploy

- `/ship` — tests + diff review + VERSION/CHANGELOG bump + PR
- `/land-and-deploy` — merge, wait for CI, verify prod health
- `/canary` — post-deploy live-monitoring for console / perf regressions
- `/setup-deploy` — configure `/land-and-deploy` for this project's platform
- `/document-release` — update README / ARCHITECTURE / CHANGELOG / CLAUDE.md post-ship

#### Session state & safety

- `/careful` — warn before destructive commands (rm -rf, DROP TABLE, force-push)
- `/freeze` — restrict edits to a specific directory this session
- `/unfreeze` — lift the freeze
- `/guard` — `/careful` + `/freeze` together
- `/context-save` — snapshot working state for later resume
- `/context-restore` — resume from the latest saved snapshot

#### Utilities

- `/learn` — manage durable project learnings
- `/make-pdf` — turn a markdown file into a publication-quality PDF
- `/gstack-upgrade` — upgrade gstack to the latest version

## Tech stack

- **Framework**: Next.js 14.2 (App Router) on Vercel (`vercel.json` → `framework: nextjs`)
- **Language**: TypeScript (strict). Path alias `@/*` → [src/*](src/)
- **UI**: Tailwind CSS with Material-3-inspired design tokens in [tailwind.config.ts](tailwind.config.ts); fonts Inter + Manrope; Material Symbols Outlined for icons
- **Auth**: NextAuth v5 (beta) with Credentials provider, JWT strategy — [src/lib/auth.ts](src/lib/auth.ts)
- **Database**: Supabase (Postgres) accessed via `@supabase/supabase-js` service-role client — [src/lib/supabase.ts](src/lib/supabase.ts). SQL-first schema in [supabase/migrations/](supabase/migrations/).
- **Payments**: Stripe (API `2024-06-20`) — [src/lib/stripe.ts](src/lib/stripe.ts)
- **i18n**: `next-intl` with locales `fr` (default) and `en` — [src/i18n/](src/i18n/), messages in [src/i18n/messages/](src/i18n/messages/)
- **Passwords**: bcryptjs (with legacy plaintext fallback for seed data in [src/lib/auth.ts:65-71](src/lib/auth.ts#L65-L71))

## Commands

```bash
npm run dev     # next dev (port 3000)
npm run build   # next build
npm run start   # next start
npm run lint    # next lint
```

No test framework is configured.

## Project structure

```text
src/
├── app/
│   ├── (public)/          # Marketing pages: home, about, plans, auth, affiliate-program
│   ├── admin/             # Mission control: members, doctors, affiliates, plans, logs
│   ├── affiliate/         # Partner: dashboard, referrals, commissions, marketing
│   ├── doctor/            # Clinical: verification, patient-care, visit-history, profile
│   ├── member/            # Beneficiary: dashboard, medical-card, dependents, payments, profile, analytics, settings, support
│   ├── sponsor/           # Institutional: overview, funded-members, impact-reports, billing, sponsor-new
│   ├── api/
│   │   ├── auth/          # [...nextauth] + signup
│   │   ├── cron/          # Scheduled jobs (billing, credit resets)
│   │   └── webhooks/stripe
│   ├── layout.tsx         # Root layout (html lang="fr", loads Material Symbols)
│   └── globals.css
├── components/
│   ├── layout/            # sidebar.tsx, top-bar.tsx, sidebar-items.ts (role-based nav), public-navbar/footer
│   ├── ui/                # button, card, input, badge, icon, stat-card
│   ├── shared/
│   └── providers.tsx
├── lib/
│   ├── auth.ts            # NextAuth config — role derivation from capabilities
│   ├── supabase.ts        # Service-role client (bypasses RLS — auth handled at app layer)
│   ├── stripe.ts
│   ├── utils.ts
│   └── server/            # Server-only data access: queries, billing, enrollment, event-processor, visits
├── i18n/                  # routing.ts, request.ts, messages/{en,fr}.json
├── types/database.ts
└── middleware.ts          # Gates /member, /doctor, /affiliate, /sponsor, /admin via authjs session cookie

supabase/migrations/       # 00001_foundation → 00002_functions → 00003_rls → 00004_seed
docs/superpowers/specs/
public/                    # Vita-Sante-Logo-500.png and other assets
```

## Domain model (from [supabase/migrations/00001_foundation.sql](supabase/migrations/00001_foundation.sql))

- **users** — single auth identity with `email`, `password_hash`, `locale`, `is_diaspora`
- **capabilities** — a user can hold multiple: `PAYER`, `BENEFICIARY`, `DOCTOR`, `AFFILIATE`, `ADMIN` (each with `ACTIVE`/`SUSPENDED`/`REVOKED`)
- **plans** — tiers `CORE`/`ELITE` with Haiti + US network coverage percentages, yearly price, visit quota, copay band
- **subscriptions / enrollment / credit_accounts** — payer funds enrollment for a beneficiary; credits consumed per visit
- **visits** — `INITIATED → VERIFIED → CONFIRMED → COMPLETED` (or `NOT_ELIGIBLE`/`CANCELLED`); types `GENERALIST`/`SPECIALIST`/`TELEVISIT`/`HOME_VISIT`; networks `HAITI`/`US`
- **invoices, referrals, affiliates, events** — billing, commission flow, event-sourced audit

All invariants (enum constraints, percentage bounds, status transitions) are enforced at the DB level.

## Role-based routing

Role is derived in [src/lib/auth.ts:22-31](src/lib/auth.ts#L22-L31) from active capabilities with priority:
`ADMIN > DOCTOR > AFFILIATE > PAYER > BENEFICIARY`.

Post-login redirect map is `roleRedirects` in [src/lib/auth.ts:33-39](src/lib/auth.ts#L33-L39).

Sidebar navigation per role is configured in [src/components/layout/sidebar-items.ts](src/components/layout/sidebar-items.ts).

The middleware in [src/middleware.ts](src/middleware.ts) redirects unauthenticated requests to `/auth/signin` for the 5 protected prefixes.

## Design system

Tailwind theme extends with Material-3 tokens (primary `#00346f`, secondary `#046b5e`, tertiary `#003f0b`, full surface/container/outline scale). Fonts: `font-headline` (Manrope), `font-body` (Inter). Custom shadow `shadow-clinical`.

Icons: use Material Symbols Outlined via the `<Icon>` component in [src/components/ui/icon.tsx](src/components/ui/icon.tsx) — icon names are strings matching Material Symbols (e.g. `dashboard`, `medical_services`).

Logo: [public/Vita-Sante-Logo-500.png](public/Vita-Sante-Logo-500.png) (used across the app since c8c5bc4).

## Environment variables

`.env` (not committed beyond dev secrets):

- `DATABASE_URL`, `DIRECT_URL` — Supabase Postgres (pooler + direct)
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

The server-side Supabase client uses the **service role key** and bypasses RLS — authorization is handled at the app layer by NextAuth + capability checks. Do not expose this client to the browser.

## Conventions

- **Server components by default**; mark interactive leaves with `"use client"`.
- Server-only data access lives in [src/lib/server/](src/lib/server/) files starting with `"use server"`.
- Default locale is French (`lang="fr"` on `<html>` in [src/app/layout.tsx:29](src/app/layout.tsx#L29)). Plans carry trilingual names (`name_en`, `name_fr`, `name_ht`).
- Monetary amounts are stored in cents (`*_cents` columns).
- Use `clsx` + `tailwind-merge` for conditional classes (both already installed).
- The `prisma.seed` entry in `package.json` is vestigial — there is no `prisma/` directory; migrations and seed live in [supabase/migrations/](supabase/migrations/).

## Deployment

- Vercel with `framework: nextjs` in [vercel.json](vercel.json).
- Node runtime (default). No `vercel.ts` / custom function config yet.
- `/api/webhooks/stripe` and `/api/cron/*` run on Vercel Functions.

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health
