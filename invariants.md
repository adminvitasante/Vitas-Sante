# Invariants — Vita Santé Club

Invariants are conditions that must **always** hold. They are enforced at the database level whenever possible so that no application bug, admin script, or direct SQL hotfix can violate them.

Each invariant below lists:
- **What** must be true.
- **Where** it is enforced (file + line where applicable).
- **Why** it matters — the business or safety reason.

## A. Identity & authorization

### A1 — Unique email per user
- **What**: `users.email` is unique.
- **Where**: `UNIQUE NOT NULL` on [supabase/migrations/00001_foundation.sql:44](supabase/migrations/00001_foundation.sql#L44).
- **Why**: email is the login identifier for NextAuth credentials ([src/lib/auth.ts:56-59](src/lib/auth.ts#L56-L59)).

### A2 — One capability row per (user, capability) pair
- **What**: `capabilities (user_id, capability)` is unique.
- **Where**: `UNIQUE(user_id, capability)` on [supabase/migrations/00001_foundation.sql:60](supabase/migrations/00001_foundation.sql#L60).
- **Why**: a user either has a capability or does not. Status (`ACTIVE|SUSPENDED|REVOKED`) tracks lifecycle; upserts use `ON CONFLICT DO UPDATE`.

### A3 — Admin-gated state transitions
- **What**: `approve_enrollment`, `reject_enrollment`, and `verify_doctor` require the caller to hold an `ACTIVE ADMIN` capability.
- **Where**: checks at the top of each function, e.g. [supabase/migrations/00002_functions.sql:87-93](supabase/migrations/00002_functions.sql#L87-L93).
- **Why**: application bugs cannot bypass admin gating — the DB refuses.

### A4 — Doctor identity uniqueness
- **What**: `doctors.user_id` is unique; `doctors.license_id` is unique.
- **Where**: [supabase/migrations/00001_foundation.sql:177-178](supabase/migrations/00001_foundation.sql#L177-L178).
- **Why**: one doctor record per user; license IDs are the real-world identifier.

## B. Enrollment

### B1 — At most one active enrollment per beneficiary
- **What**: A beneficiary cannot hold two non-terminal enrollments at once.
- **Where**: partial unique index `enrollment_one_active` at [supabase/migrations/00001_foundation.sql:132-135](supabase/migrations/00001_foundation.sql#L132-L135) — covers `ACTIVE | APPROVED | UNDER_REVIEW | SUBMITTED`.
- **Why**: prevents double coverage, double billing, and ambiguous credit account ownership.

### B2 — Member ID format and uniqueness
- **What**: On approval, an enrollment receives `VSC-XXXXX-HT` where XXXXX is a zero-padded sequence. `enrollment.member_id_code` is unique.
- **Where**: `generate_member_id()` + sequence `member_id_seq` at [supabase/migrations/00002_functions.sql:35-42](supabase/migrations/00002_functions.sql#L35-L42); `UNIQUE` on [supabase/migrations/00001_foundation.sql:123](supabase/migrations/00001_foundation.sql#L123).
- **Why**: the member ID is what doctors type at the point of care. It must be unambiguous and never collide.

### B3 — Only `UNDER_REVIEW` enrollments can be approved or rejected
- **What**: `approve_enrollment` / `reject_enrollment` only transition from `UNDER_REVIEW`.
- **Where**: `WHERE id = p_enrollment_id AND status = 'UNDER_REVIEW'` + `IF NOT FOUND RAISE EXCEPTION` — [supabase/migrations/00002_functions.sql:100-105](supabase/migrations/00002_functions.sql#L100-L105).
- **Why**: prevents re-approving an already active enrollment (which would double-mint a member ID) or approving a draft that has not been submitted.

### B4 — Activating an enrollment creates its credit account
- **What**: `approve_enrollment` inserts a `credit_accounts` row for the current year with `visits_total = visits_remaining = plan.visits_per_year`.
- **Where**: [supabase/migrations/00002_functions.sql:117-121](supabase/migrations/00002_functions.sql#L117-L121) (with `ON CONFLICT DO NOTHING` for idempotency).
- **Why**: an `ACTIVE` enrollment without a credit account is not usable — visits would fail. Creating it in the same transaction eliminates the window.

### B5 — Suspending an enrollment cancels open visits and suspends the capability
- **What**: `suspend_enrollment` cascades to `capabilities` (BENEFICIARY → SUSPENDED) and to all `visits` in `INITIATED|VERIFIED|CONFIRMED` → `CANCELLED`, all in one transaction.
- **Where**: [supabase/migrations/00002_functions.sql:205-212](supabase/migrations/00002_functions.sql#L205-L212).
- **Why**: a suspended member must not be able to complete an in-flight visit after the suspension fires.

## C. Credits

### C1 — Non-negative remaining credits
- **What**: `credit_accounts.visits_remaining >= 0`.
- **Where**: `CHECK (visits_remaining >= 0)` at [supabase/migrations/00001_foundation.sql:150](supabase/migrations/00001_foundation.sql#L150).
- **Why**: a visit cannot run on negative balance; the CHECK catches bugs that skipped the application-layer guard.

### C2 — One credit account per (enrollment, year)
- **What**: `UNIQUE(enrollment_id, period_year)` on `credit_accounts`.
- **Where**: [supabase/migrations/00001_foundation.sql:152](supabase/migrations/00001_foundation.sql#L152).
- **Why**: yearly reset is the single ledger; two parallel accounts would diverge.

### C3 — Credit deduction is exactly-once per visit
- **What**: Completing a visit inserts **at most one** `credit_transactions` row with `idempotency_key = 'visit_deduction:<visit_id>'`.
- **Where**: `UNIQUE` on `credit_transactions.idempotency_key` + the `ON CONFLICT DO NOTHING` pattern at [supabase/migrations/00002_functions.sql:365-378](supabase/migrations/00002_functions.sql#L365-L378).
- **Why**: prevents a doctor's duplicate click or a retried request from billing a member for two credits on one visit.

### C4 — Credit deduction requires the lock
- **What**: `complete_visit` must `SELECT ... FOR UPDATE` on the credit account row before decrementing.
- **Where**: [supabase/migrations/00002_functions.sql:354-357](supabase/migrations/00002_functions.sql#L354-L357).
- **Why**: prevents two concurrent visits from both reading `visits_remaining = 1` and both succeeding.

### C5 — Yearly reset is idempotent
- **What**: `renew_subscription` uses idempotency key `yearly_reset:<enrollment_id>:<year>`.
- **Where**: [supabase/migrations/00002_functions.sql:527-528](supabase/migrations/00002_functions.sql#L527-L528).
- **Why**: replaying a renewal (Stripe webhook retry) does not inflate `visits_remaining` nor duplicate ledger rows.

## D. Visits

### D1 — Visit transitions are gated
- **What**: `complete_visit` only accepts `VERIFIED` or `CONFIRMED` visits. Re-calling it on a `COMPLETED` visit returns `{ already_completed: true }` without side effects.
- **Where**: [supabase/migrations/00002_functions.sql:330-337](supabase/migrations/00002_functions.sql#L330-L337).
- **Why**: a completed visit is terminal. Idempotent re-completion preserves at-most-once credit deduction.

### D2 — Visit belongs to its doctor
- **What**: `complete_visit` refuses to complete a visit that does not belong to the calling doctor.
- **Where**: [supabase/migrations/00002_functions.sql:340-344](supabase/migrations/00002_functions.sql#L340-L344).
- **Why**: prevents one doctor from closing another's visit.

### D3 — Visits require a verified doctor
- **What**: `initiate_visit` rejects the call unless `doctors.verification_status = 'VERIFIED'`.
- **Where**: [supabase/migrations/00002_functions.sql:249-253](supabase/migrations/00002_functions.sql#L249-L253).
- **Why**: clinical actions cannot be logged by a doctor whose license has not been vetted.

### D4 — Ineligible visits still leave an audit trail
- **What**: When a member is inactive, has no credits, or is not found, `initiate_visit` still writes a `NOT_ELIGIBLE` visit row.
- **Where**: [supabase/migrations/00002_functions.sql:266-283](supabase/migrations/00002_functions.sql#L266-L283).
- **Why**: gives operations a complete record of attempted care and identifies abuse or coverage gaps.

## E. Subscriptions & billing

### E1 — Grace period is 30 days
- **What**: `start_grace_period` sets `grace_period_ends_at = now() + interval '30 days'`.
- **Where**: [supabase/migrations/00002_functions.sql:425-427](supabase/migrations/00002_functions.sql#L425-L427).
- **Why**: documented policy; cron relies on this field to decide when to suspend.

### E2 — Suspension is cascading
- **What**: `suspend_subscription` calls `suspend_enrollment` for every `ACTIVE` enrollment on the subscription.
- **Where**: [supabase/migrations/00002_functions.sql:463-469](supabase/migrations/00002_functions.sql#L463-L469).
- **Why**: a suspended payer must not have beneficiaries still consuming credits.

### E3 — One invoice per (subscription, year)
- **What**: `invoices.idempotency_key = 'invoice:<subscription_id>:<year>'` is unique.
- **Where**: generator + check in [src/lib/server/billing.ts:20-31](src/lib/server/billing.ts#L20-L31); `UNIQUE` column in schema.
- **Why**: prevents generating two invoices for the same period on a retry.

### E4 — Invoice total equals the sum of its lines
- **What**: `invoices.total_cents = Σ invoice_lines.amount_cents`.
- **Where**: trigger `trg_invoice_lines_sum` at [supabase/migrations/00001_foundation.sql:348-350](supabase/migrations/00001_foundation.sql#L348-L350).
- **Why**: totals on invoices are derived, never manually set. Eliminates drift.

### E5 — Non-negative money fields
- **What**: `total_cents`, `amount_cents`, `yearly_price_cents`, `dependent_fee_cents`, `total_earned_cents`, `pending_cents`, `commission_cents` are all `>= 0`.
- **Where**: `CHECK (... >= 0)` across [supabase/migrations/00001_foundation.sql](supabase/migrations/00001_foundation.sql).
- **Why**: negative money shows up in reconciliation bugs; the DB refuses.

### E6 — Coverage percentages are bounded
- **What**: all `*_pct` fields on `plans` and `referrals.commission_rate_pct` are in `[0, 100]`.
- **Where**: `CHECK (... BETWEEN 0 AND 100)` throughout [supabase/migrations/00001_foundation.sql](supabase/migrations/00001_foundation.sql).
- **Why**: arithmetic correctness — coverage over 100% or negative is nonsensical.

## F. Affiliates & referrals

### F1 — One referral per enrollment
- **What**: `referrals.enrollment_id` is unique.
- **Where**: [supabase/migrations/00001_foundation.sql:239](supabase/migrations/00001_foundation.sql#L239).
- **Why**: commission cannot be attributed to two affiliates for the same enrollment.

### F2 — Affiliate totals are non-negative
- **What**: `total_earned_cents >= 0`, `pending_cents >= 0`.
- **Where**: `CHECK` at [supabase/migrations/00001_foundation.sql:230-231](supabase/migrations/00001_foundation.sql#L230-L231).
- **Why**: protects payout calculations from bad updates.

### F3 — Commission rate matches the affiliate's tier at time of referral
- **What**: `STANDARD=10%`, `ELITE=15%`, `DIAMOND=20%`.
- **Where**: [src/lib/server/enrollment.ts:114](src/lib/server/enrollment.ts#L114).
- **Why**: the rate is frozen at enrollment creation so later tier changes do not retroactively re-price existing referrals.

## G. Events (audit)

### G1 — Every event has a deterministic idempotency key
- **What**: Every `emit_event(...)` call passes a key built from the event type + aggregate ID (+ optionally a period/timestamp for per-cycle events).
- **Where**: `UNIQUE NOT NULL` on `events.idempotency_key` at [supabase/migrations/00001_foundation.sql:294](supabase/migrations/00001_foundation.sql#L294); callers throughout [supabase/migrations/00002_functions.sql](supabase/migrations/00002_functions.sql).
- **Why**: replaying a transition (idempotent retry) does not duplicate the audit trail or re-trigger side effects.

### G2 — Events are append-only
- **What**: No function updates an existing event row except to stamp `processed_at`.
- **Where**: drain logic in [src/lib/server/event-processor.ts:161-166](src/lib/server/event-processor.ts#L161-L166).
- **Why**: the event log is the historical record — if you need to correct it, emit a compensating event, do not rewrite history.

## H. Locale & i18n

### H1 — User locale is one of `fr` or `en`
- **What**: `users.locale IN ('fr', 'en')`.
- **Where**: `CHECK (locale IN ('fr', 'en'))` at [supabase/migrations/00001_foundation.sql:48](supabase/migrations/00001_foundation.sql#L48).
- **Why**: the app does not have fallbacks for other locales; default is `fr`.

### H2 — Every plan is translated into all three official names
- **What**: `name_en`, `name_fr`, `name_ht` are all `NOT NULL`.
- **Where**: [supabase/migrations/00001_foundation.sql:73-75](supabase/migrations/00001_foundation.sql#L73-L75).
- **Why**: plans surface in all three languages on marketing and member interfaces; no rendering path can be missing a translation.

## I. Invariants that are NOT yet enforced (known gaps)

Documented here so they are visible during review:

- **Copay band sanity**: there is no DB-level check that `copay_max_cents >= copay_min_cents`. Enforce if a plan admin UI is added.
- **US network consistency**: a plan with `has_us_network = false` could still have non-zero `us_*_pct`. A `CHECK` combining them would harden the model.
- **Stripe webhook canonical path**: the current webhook writes to `payments`/`members` rather than calling `recordPayment` → `renew_subscription`. Not strictly an invariant, but a reliability gap noted in [data-reliability.md](data-reliability.md#6-webhook-durability-stripe).

When adding a new invariant, extend this file and — whenever possible — enforce it in SQL, not TypeScript.
