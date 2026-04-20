# Architecture — Vita Santé Club

This document describes how the application is organized, how requests flow through the system, and where each responsibility lives.

## 1. Layer overview

```
┌────────────────────────────────────────────────────────────────────┐
│  Browser (RSC + Client Components, fr/en via next-intl)            │
└────────────────────────────────────────────────────────────────────┘
                   │                                │
                   ▼                                ▼
┌────────────────────────────────────────────────────────────────────┐
│  Next.js 14 App Router  (src/app/*)                                │
│   • Route groups per portal: (public), member, doctor, affiliate,  │
│     sponsor, admin                                                 │
│   • middleware.ts — session cookie gate                            │
│   • api/auth, api/webhooks/stripe, api/cron                        │
└────────────────────────────────────────────────────────────────────┘
                   │                                │
                   ▼                                ▼
┌────────────────────────────────────────────────────────────────────┐
│  Server modules  (src/lib/server/*)  — "use server"                │
│   enrollment.ts · visits.ts · billing.ts · queries.ts ·            │
│   event-processor.ts                                               │
└────────────────────────────────────────────────────────────────────┘
                   │                                │
                   ▼                                ▼
┌────────────────────────────────────────────────────────────────────┐
│  Supabase Postgres   (supabase/migrations/*)                       │
│   • Tables + enums + CHECK constraints  (00001_foundation)         │
│   • State-transition functions (SQL)    (00002_functions)          │
│   • Row Level Security policies         (00003_rls)                │
│   • Seed data                           (00004_seed)               │
└────────────────────────────────────────────────────────────────────┘
                   │                                │
                   ▼                                ▼
        Stripe (billing)                 NextAuth (sessions, JWT)
```

The **authoritative layer is Postgres**. All business rules — state transitions, credit deduction, invariants, event emission — are implemented as SQL functions. TypeScript is a thin orchestration shell.

## 2. Route topology

Route groups under [src/app/](src/app/):

| Group | Audience | Landing after login |
|---|---|---|
| `(public)` | anonymous visitors | `/` |
| `member/` | `BENEFICIARY` / `PAYER` | `/member/dashboard` |
| `doctor/` | `DOCTOR` | `/doctor/patient-care` |
| `affiliate/` | `AFFILIATE` | `/affiliate/dashboard` |
| `sponsor/` | `PAYER` (institutional) | `/sponsor/overview` |
| `admin/` | `ADMIN` | `/admin/dashboard` |

Gating happens in [src/middleware.ts](src/middleware.ts#L4-L10): requests to `/member|/doctor|/affiliate|/sponsor|/admin` without a NextAuth session cookie redirect to `/auth/signin`. Role-specific access inside each group is enforced by DB RLS + server-side capability checks.

Sidebar composition per role lives in [src/components/layout/sidebar-items.ts](src/components/layout/sidebar-items.ts).

## 3. Authentication & role derivation

- Library: `next-auth` v5 beta, Credentials provider, JWT session strategy.
- Config: [src/lib/auth.ts](src/lib/auth.ts).
- The `authorize` callback loads the user, verifies the password (bcrypt; plaintext fallback for seed data at [src/lib/auth.ts:65-71](src/lib/auth.ts#L65-L71)), then queries `capabilities` to compute a **single primary role** for routing.
- Priority ladder: `ADMIN > DOCTOR > AFFILIATE > PAYER > BENEFICIARY` — see `getPrimaryRole` in [src/lib/auth.ts:22-31](src/lib/auth.ts#L22-L31).
- `roleRedirects` maps the resolved role to the landing URL.
- The JWT stores `role` and `userId`; the session exposes them on `session.user`.

Note: a user can hold multiple capabilities simultaneously (e.g. `PAYER` + `BENEFICIARY`). The primary role is only used for portal routing — authorization elsewhere checks capabilities individually.

## 4. Data access layer

Two ways the app talks to Postgres:

1. **Service-role client** — [src/lib/supabase.ts](src/lib/supabase.ts) creates a single Supabase client with `SUPABASE_SERVICE_ROLE_KEY`, which **bypasses RLS**. This is the only client used by server code today. Authorization is therefore enforced at the **app layer** (via NextAuth + capability checks inside server functions).

2. **SQL functions via RPC** — every state transition is implemented as a Postgres function and called with `supabase.rpc(...)`. Examples:
   - `submit_enrollment`, `approve_enrollment`, `reject_enrollment`, `suspend_enrollment`
   - `initiate_visit`, `complete_visit`
   - `start_grace_period`, `suspend_subscription`, `renew_subscription`
   - `verify_doctor`
   - `emit_event` (helper used by all of the above)

   These live in [supabase/migrations/00002_functions.sql](supabase/migrations/00002_functions.sql) and are the single source of truth for business rules.

Server modules in [src/lib/server/](src/lib/server/) are thin wrappers:

| Module | Responsibility |
|---|---|
| [enrollment.ts](src/lib/server/enrollment.ts) | Create enrollment + referral link; dispatch `submit/approve/reject_enrollment` RPCs |
| [visits.ts](src/lib/server/visits.ts) | Dispatch `initiate_visit` / `complete_visit`; query visit history |
| [billing.ts](src/lib/server/billing.ts) | Generate invoice + lines; record payment → renew subscription |
| [queries.ts](src/lib/server/queries.ts) | Read-only aggregations for dashboards (payer, beneficiary, doctor, admin) |
| [event-processor.ts](src/lib/server/event-processor.ts) | Drain `events` table and run side-effect handlers (emails, referral activation, etc.) |

Every file is marked `"use server"`.

## 5. Event sourcing

The [events](supabase/migrations/00001_foundation.sql#L287-L297) table is an append-only log.

- Every state transition function calls `emit_event(...)` with a deterministic `idempotency_key` (e.g. `enrollment.approved:<uuid>`, `visit.completed:<uuid>`). The `UNIQUE` constraint on `idempotency_key` makes re-execution a no-op.
- Events are **not** the write model — they record facts after the authoritative row has already been updated. The app is fully queryable from the row state alone.
- Side effects (notifications, affiliate commission activation, low-credit alerts) are triggered by the event processor in [src/lib/server/event-processor.ts](src/lib/server/event-processor.ts), drained by the cron route.
- An event without a handler is still marked `processed_at`, so the queue cannot block forever on an unregistered type.

## 6. Background work (cron)

[src/app/api/cron/route.ts](src/app/api/cron/route.ts) is the single scheduled entry point. On each tick (Bearer token gated by `CRON_SECRET`) it:

1. Calls `processEvents(50)` to drain pending events.
2. Finds subscriptions with `status = 'GRACE_PERIOD'` whose `grace_period_ends_at` is in the past and calls `suspend_subscription` — which in turn suspends every `ACTIVE` enrollment on that subscription and cancels their in-flight visits.
3. Finds subscriptions stuck in `SUSPENDED` for > 30 days and transitions them to `EXPIRED` (and their enrollments likewise).

Schedule the cron through Vercel Cron or an external scheduler hitting the route with the bearer token.

## 7. Payments

- Stripe client: [src/lib/stripe.ts](src/lib/stripe.ts) (`apiVersion: "2024-06-20"`).
- Webhook: [src/app/api/webhooks/stripe/route.ts](src/app/api/webhooks/stripe/route.ts) verifies the signature via `stripe.webhooks.constructEvent` using `STRIPE_WEBHOOK_SECRET`, then dispatches on `checkout.session.completed` and `invoice.paid`.
- In the canonical path, a successful payment should end in `recordPayment(invoiceId, actorId)` ([src/lib/server/billing.ts](src/lib/server/billing.ts)), which marks the invoice `PAID` and calls `renew_subscription` to reset credits and bump the period. The current webhook writes a simplified `payments`/`members` path; aligning it with the canonical flow is tracked implicitly in the code.

## 8. i18n

- Library: `next-intl` v4.
- Plugin wired in [next.config.mjs](next.config.mjs#L3): request config is at [src/i18n/request.ts](src/i18n/request.ts).
- Supported locales: `fr` (default), `en` — see [src/i18n/routing.ts](src/i18n/routing.ts).
- Messages: [src/i18n/messages/en.json](src/i18n/messages/en.json), [src/i18n/messages/fr.json](src/i18n/messages/fr.json).
- Plans also carry a Haitian Creole name (`name_ht`) stored at the DB level for future display.

## 9. Design system

- Tailwind config: [tailwind.config.ts](tailwind.config.ts). Material-3-style color roles (primary/secondary/tertiary + container/on-/fixed variants, full surface scale).
- Fonts: Inter (body) + Manrope (headline), Material Symbols Outlined for icons via [src/components/ui/icon.tsx](src/components/ui/icon.tsx).
- Primitives: `button`, `card`, `input`, `badge`, `icon`, `stat-card` in [src/components/ui/](src/components/ui/).
- Layout shells: `sidebar`, `top-bar`, `public-navbar`, `public-footer` in [src/components/layout/](src/components/layout/).

## 10. Deployment

- Host: Vercel. Configured via [vercel.json](vercel.json) (`framework: nextjs`).
- Runtime: default Node (Fluid Compute). No custom `vercel.ts` or function-level config yet — consider migrating to `vercel.ts` if cron schedules, rewrites, or per-route runtime settings need to be declared.
- Env: `.env` for local dev; use `vercel env pull` in cloud work.

## 11. Extending the system — conventions

- **New state transition** → add a SQL function in `00002_functions.sql` with an `emit_event` call; expose a thin wrapper in `src/lib/server/*` and call via RPC. Never do multi-row transitions in TypeScript.
- **New event side effect** → register a handler in `handlers` inside [src/lib/server/event-processor.ts](src/lib/server/event-processor.ts). The cron will drain it within the next tick.
- **New role** → add to `capability_type` enum, update `getPrimaryRole` + `roleRedirects` in [src/lib/auth.ts](src/lib/auth.ts), add a route group + sidebar config, add RLS policies.
- **New protected route prefix** → add to `protectedPrefixes` in [src/middleware.ts](src/middleware.ts#L4-L10).
- **Monetary values** → always store and manipulate in cents (`*_cents`). Never use floats for money.
