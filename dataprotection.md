# Data Protection — Vita Santé Club

How the platform handles personal, medical, and financial data. This document is the reference when adding a feature that stores, reads, or transmits member data — and when talking to auditors, partners, or regulators.

Vita Santé operates across Haiti and its Diaspora, so the applicable regimes include Haitian privacy norms for medical records, plus GDPR/CCPA-class obligations for diaspora members resident in the EU or US. When in doubt, apply the strictest regime.

## 1. Data classification

| Class | Examples | Where stored |
|---|---|---|
| **PHI / Medical** | `visits.notes`, `visits.visit_type`, `visits.network`, `visits.copay_amount_cents`, doctor specialty + clinic, patient–doctor linkage | `visits`, `doctors`, `credit_transactions` |
| **PII — identity** | `users.name`, `users.email`, `users.phone`, `users.is_diaspora`, `users.locale` | `users` |
| **PII — secrets** | `users.password_hash` | `users` |
| **Financial** | `invoices.*`, `invoice_lines.*`, `affiliates.total_earned_cents`, `subscriptions.stripe_subscription_id`, `invoices.stripe_invoice_id` | `invoices`, `invoice_lines`, `affiliates`, `subscriptions` |
| **Professional identity** | `doctors.license_id`, `doctors.clinic_address`, `doctors.region`, verification metadata | `doctors` |
| **Audit** | `events.payload`, `events.actor_id` | `events` |

The fact that a user is a **beneficiary** of a specific plan, or has visited a doctor of a given specialty, is itself PHI.

## 2. Where personal data is stored

Personal data lives in Supabase Postgres only. See the schema in [supabase/migrations/00001_foundation.sql](supabase/migrations/00001_foundation.sql). There are no side copies in third-party analytics stores today.

Third parties that receive data:

- **Stripe** — receives payer identity, amount, currency, metadata (`memberId`). Does not receive medical notes. Integration in [src/lib/stripe.ts](src/lib/stripe.ts) and [src/app/api/webhooks/stripe/route.ts](src/app/api/webhooks/stripe/route.ts).
- **NextAuth** — session tokens live in HTTP-only cookies (`authjs.session-token`). Signed with `NEXTAUTH_SECRET`.

No data is sent to analytics, AI providers, or marketing platforms from the server.

## 3. Authentication & credential handling

- **Library**: `next-auth` v5 beta, JWT sessions. Config in [src/lib/auth.ts](src/lib/auth.ts).
- **Password storage**: `bcryptjs` hashes. Verified at [src/lib/auth.ts:64-71](src/lib/auth.ts#L64-L71). **Known gap**: the `authorize` callback falls back to plaintext comparison when `password_hash` does not start with `$2` — this is only for dev seed data and must be removed before production. Replace with a forced password reset for seeded users and drop the branch entirely.
- **Session strategy**: JWT (no server-side session store). The token carries `role`, `userId`, email. Rotate `NEXTAUTH_SECRET` if leaked.
- **Cookies**: `authjs.session-token` (dev) or `__Secure-authjs.session-token` (HTTPS). See [src/middleware.ts:17-19](src/middleware.ts#L17-L19).

When adding a new sensitive endpoint, never bypass `auth()` — always derive the caller identity from the session.

## 4. Authorization model

Defense in depth: both RLS (DB) and capability checks (app) exist, but the current runtime relies primarily on the **app layer**.

### 4.1 DB layer — Row Level Security

Defined in [supabase/migrations/00003_rls.sql](supabase/migrations/00003_rls.sql). RLS is **enabled** on every table. Highlights:

- `has_capability(cap)` helper uses `auth.uid()` to check the JWT claim for an active capability.
- Beneficiaries see their own rows; payers see their beneficiaries' rows; doctors see only enrollments and credits during an **in-flight visit** they own (`visits.status IN INITIATED|VERIFIED|CONFIRMED`). See [supabase/migrations/00003_rls.sql:113-121](supabase/migrations/00003_rls.sql#L113-L121).
- Events are admin-only.
- Plans are publicly readable (they're marketing content).

### 4.2 App layer — capability checks

The server uses the **service-role key** ([src/lib/supabase.ts](src/lib/supabase.ts)), which **bypasses RLS**. This is intentional — server-side state transitions need to cross user boundaries (e.g. admin approving an enrollment).

Because RLS is bypassed, **the app code is solely responsible for enforcing authorization at the server entry points**:

- `middleware.ts` gates protected prefixes on the presence of a session cookie only — it does **not** check role.
- Each server function must look up the caller's capabilities before acting. Today this is implicit in SQL functions like `approve_enrollment` (checks ADMIN) and `complete_visit` (checks doctor ownership). Any new server action touching another user's data must do the same.

### 4.3 Supabase Auth interop — open item

RLS policies rely on `auth.uid()`. Since the app uses the service-role client, `auth.uid()` is effectively unavailable for application traffic. If we introduce a second path that uses anon-key / signed-JWT access for clients, the RLS policies will take effect automatically and should be audited end-to-end before doing so.

## 5. Secrets & environment variables

Environment contract (see [.env.example — if missing, this is the canonical list]):

| Variable | Classification | Where used |
|---|---|---|
| `DATABASE_URL`, `DIRECT_URL` | secret | Postgres pooler + direct |
| `NEXTAUTH_SECRET` | secret | session signing — **rotate on incident** |
| `NEXTAUTH_URL` | config | callback URLs |
| `SUPABASE_SERVICE_ROLE_KEY` | **highly sensitive — full DB bypass** | [src/lib/supabase.ts](src/lib/supabase.ts) |
| `NEXT_PUBLIC_SUPABASE_URL` | public | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | |
| `STRIPE_SECRET_KEY` | secret | [src/lib/stripe.ts](src/lib/stripe.ts) |
| `STRIPE_WEBHOOK_SECRET` | secret | signature verification — [src/app/api/webhooks/stripe/route.ts:12](src/app/api/webhooks/stripe/route.ts#L12) |
| `CRON_SECRET` | secret | cron bearer token — [src/app/api/cron/route.ts:11](src/app/api/cron/route.ts#L11) |

**Rules**:
- Never expose `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, or `CRON_SECRET` to the client bundle. `NEXT_PUBLIC_*` is the only prefix allowed to reach the browser.
- Rotate all non-public keys on any suspected leak and after any departure with prod access.
- In Vercel, secrets live in project env. Use `vercel env pull` for local sync; never commit `.env` with production values.
- **Known issue**: `.env` in the current repo contains a live Supabase URL and service-role key. Treat those as dev-only, and ensure production uses separate credentials (and that `.env` is gitignored — verify [.gitignore](.gitignore) covers it before committing).

## 6. Medical data safeguards (PHI)

Special treatment for PHI above and beyond standard PII:

### 6.1 Access
- Doctors see PHI only for visits they initiated (`visits_select_doctor` policy at [supabase/migrations/00003_rls.sql:234-237](supabase/migrations/00003_rls.sql#L234-L237)) and only enrollments during in-flight visits (`enrollment_select_doctor` — [supabase/migrations/00003_rls.sql:113-121](supabase/migrations/00003_rls.sql#L113-L121)).
- Payers see their beneficiaries' visit history; beneficiaries see their own. Neither sees clinical notes of other members.
- Admins see all — they are a trusted role and their reads are in the `events` audit trail.

### 6.2 Minimization
- The member ID code (`VSC-XXXXX-HT`) is designed as the only identifier a doctor needs to type — they do not need to know the member's email or address to record a visit.
- `visits.notes` is free-text: instruct doctors to avoid recording more detail than necessary.

### 6.3 Retention
- No automatic deletion is currently scheduled. Medical records generally require multi-year retention; confirm specific retention periods with Haitian and EU legal counsel before writing a purge job.
- Suspension / expiry changes **status**, not data. Rows remain for audit and potential reinstatement.

## 7. Auditability

- Every state transition emits an `events` row with `actor_id`, `payload`, and a deterministic `idempotency_key`. See [supabase/migrations/00001_foundation.sql:287-297](supabase/migrations/00001_foundation.sql#L287-L297).
- Append-only: handlers only stamp `processed_at`; the payload itself is never rewritten. See [invariants.md](invariants.md#g-events-audit) G2.
- `credit_transactions` is a second append-only ledger for all credit movements.
- System-originated actions (cron suspensions) currently pass `actor_id = null`. Consider introducing a dedicated system user ID so the audit trail never has ambiguous nulls.

## 8. Transport & infrastructure

- All traffic terminates at Vercel over TLS (HTTP-only + `Secure` cookies in production via the `__Secure-` session cookie name).
- Supabase traffic uses TLS from the Vercel Function to the database.
- No internal service-to-service traffic exits the Vercel + Supabase perimeter.

## 9. Subject rights (GDPR / CCPA-style)

Currently **unimplemented**. Design notes for when we add them:

- **Access / export** — a `/member/settings/export` route producing a JSON bundle of the user's row in `users`, `enrollment`, `credit_accounts`, `credit_transactions`, and `visits` (filtered to their own PHI).
- **Erasure** — hard delete is not appropriate for PHI during retention windows. Implement a **soft delete** (`users.deleted_at`, plus anonymization of `name`, `email`, `phone`) while retaining clinical records by `enrollment_id` for actuarial and legal purposes. Document the approach and get counsel sign-off before enabling.
- **Rectification** — already possible for non-clinical fields through profile update; admin-mediated for clinical fields.

## 10. Incident response

If a key leaks or a data exposure is suspected:

1. **Rotate** the affected secret immediately (`SUPABASE_SERVICE_ROLE_KEY`, `NEXTAUTH_SECRET`, `STRIPE_*`, `CRON_SECRET`).
2. **Invalidate sessions** — rotating `NEXTAUTH_SECRET` invalidates all JWTs.
3. **Review the events table** for suspicious activity in the window of exposure.
4. **Notify** affected users in line with the strictest applicable regime (GDPR: 72h).
5. **Postmortem** — record what happened, the blast radius, and the guardrail added.

## 11. Checklist when adding a feature that touches personal data

Before merging:

- [ ] Is the caller's identity derived from `auth()` (NextAuth), not from a client-supplied user ID?
- [ ] Is there a capability check (or SQL function that does one) before reading or writing another user's data?
- [ ] If reading PHI, does the access rule match an existing RLS policy? If it does not, document why in the PR.
- [ ] Is any new secret added to the environment and documented in section 5?
- [ ] Does the new flow produce an `events` row (at-least-once, via `emit_event`)?
- [ ] Is the data classified (section 1), and does the UI avoid showing more of it than needed for the task?
- [ ] If sending data to a third party (Stripe, future email provider, future analytics), is the minimum necessary sent, and is the destination documented in section 2?
