# Data Reliability — Vita Santé Club

How the platform stays correct under retries, network failures, concurrent doctors, and partial outages. If you are adding a new mutation or touching an existing one, read this first.

## Core principle

**Every state-changing operation is atomic and idempotent, and the authoritative logic lives in Postgres** — not in TypeScript. The application layer calls SQL functions via `supabase.rpc(...)` and trusts the database to refuse illegal transitions. A retry of the same logical operation always produces the same final state.

## 1. Idempotency

Every critical write carries a `UNIQUE NOT NULL idempotency_key text` column. Re-executing the same logical request (same key) is a no-op.

Tables with enforced idempotency keys — see [supabase/migrations/00001_foundation.sql](supabase/migrations/00001_foundation.sql):

| Table | Key pattern | Purpose |
|---|---|---|
| `credit_transactions` | `visit_deduction:<visit_id>`, `yearly_reset:<enrollment_id>:<year>` | prevents double-deducting a credit if a doctor retries |
| `visits` | caller-supplied or `gen_random_uuid()` | prevents duplicate visit rows from a retried `initiate_visit` |
| `referrals` | `referral:<enrollment_id>` | one referral per enrollment, even under retry |
| `invoices` | `invoice:<subscription_id>:<year>` | one invoice per period |
| `events` | `<event_type>:<aggregate_id>[:<extra>]` | at-most-once downstream side effects |

Every state-transition SQL function constructs its idempotency key **deterministically from the aggregate IDs**, never from random input. Examples: [supabase/migrations/00002_functions.sql:327](supabase/migrations/00002_functions.sql#L327) (`visit_deduction:<visit_id>`), [supabase/migrations/00002_functions.sql:528](supabase/migrations/00002_functions.sql#L528) (`yearly_reset:<enrollment_id>:<year>`).

The canonical upsert pattern:

```sql
INSERT INTO credit_transactions (...)
VALUES (...)
ON CONFLICT (idempotency_key) DO NOTHING
RETURNING * INTO v_tx;

IF v_tx IS NULL THEN
  -- Retry: the row already existed. Fetch it and skip side effects.
  SELECT * INTO v_tx FROM credit_transactions WHERE idempotency_key = v_idemp_key;
ELSE
  -- First write: do the side-effect update.
  UPDATE credit_accounts SET visits_remaining = visits_remaining - 1 WHERE ...;
END IF;
```

See [supabase/migrations/00002_functions.sql:365-378](supabase/migrations/00002_functions.sql#L365-L378).

**Rule**: when you add a new write, put an `idempotency_key` on it or explain why one of the natural `UNIQUE` constraints already gives you the same guarantee.

## 2. Atomicity

Every SQL function runs inside a single implicit transaction. Multi-row transitions must stay **inside one function call** so they commit or roll back together.

Concrete multi-row transitions currently in use:

- **`approve_enrollment`** — flips enrollment to `ACTIVE`, generates the member ID code, upserts the `BENEFICIARY` capability, and creates the year's `credit_accounts` row, all in one transaction. See [supabase/migrations/00002_functions.sql:77-148](supabase/migrations/00002_functions.sql#L77-L148).
- **`suspend_enrollment`** — marks the enrollment `SUSPENDED`, suspends the beneficiary's `capabilities` row, and cancels every in-flight visit in one pass.
- **`complete_visit`** — locks the credit row (`FOR UPDATE`), inserts a `credit_transactions` entry, decrements `visits_remaining`, flips the visit to `COMPLETED`, and emits `visit.completed`.
- **`renew_subscription`** — resets `credit_accounts.visits_remaining` for every enrollment on the subscription and logs a `YEARLY_RESET` ledger entry per enrollment.

**Rule**: if you find yourself making a second `supabase.from(...)` call to "finish" a first one, move both into a SQL function.

## 3. Concurrency (the doctor race)

The real-world race: two doctor devices attempt to complete the same visit at the same time, or two different visits on the last credit. We handle this with **row-level locking**:

```sql
SELECT * INTO v_credit
FROM credit_accounts
WHERE enrollment_id = v_enrollment.id AND period_year = v_year
FOR UPDATE;  -- blocks concurrent readers until commit
```

Found in `complete_visit` at [supabase/migrations/00002_functions.sql:354-357](supabase/migrations/00002_functions.sql#L354-L357).

Combined with the unique `idempotency_key` on `credit_transactions`, this guarantees:
- Exactly one deduction per visit, even with duplicate clicks.
- No negative balance (`CHECK (visits_remaining >= 0)` + the `FOR UPDATE` wait).
- If the loser's request still had a credit reserved when it entered but doesn't by the time it acquires the lock, the visit is marked `NOT_ELIGIBLE` instead of failing silently.

**Rule**: any SQL function that decrements a bounded counter must `SELECT ... FOR UPDATE` on the counter row before modifying it.

## 4. State machines as guards

The DB functions only transition from the states they expect. Example:

```sql
UPDATE enrollment SET status = 'ACTIVE', ...
WHERE id = p_enrollment_id AND status = 'UNDER_REVIEW'
RETURNING * INTO v_enrollment;

IF NOT FOUND THEN
  RAISE EXCEPTION 'Enrollment % not in UNDER_REVIEW state', p_enrollment_id;
END IF;
```

This pattern — `WHERE status = 'expected'` + `IF NOT FOUND RAISE` — means an out-of-order call is rejected atomically rather than corrupting state.

The full machines:

- **Enrollment**: `DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED → ACTIVE → SUSPENDED → EXPIRED`, plus `REJECTED` as a terminal branch from `UNDER_REVIEW`.
- **Subscription**: `CREATED → ACTIVE ⇄ GRACE_PERIOD → SUSPENDED → EXPIRED`, plus `CANCELLED`.
- **Visit**: `INITIATED → VERIFIED → CONFIRMED → COMPLETED`, plus `NOT_ELIGIBLE` and `CANCELLED` as terminal branches.
- **Doctor verification**: `PENDING → VERIFIED`, plus `SUSPENDED`/`REVOKED`.
- **Capability**: `ACTIVE ⇄ SUSPENDED → REVOKED`.

## 5. Event-driven side effects

Events in the [events](supabase/migrations/00001_foundation.sql#L287-L297) table are the **outbox**. The flow:

1. A SQL function updates the authoritative row.
2. **In the same transaction**, it inserts an event via `emit_event(...)`.
3. The cron route drains the `events` table (`idx_events_unprocessed` — a partial index on `processed_at IS NULL`) and dispatches handlers in [src/lib/server/event-processor.ts](src/lib/server/event-processor.ts).
4. On handler success, the event is stamped `processed_at = now()`.
5. On handler failure, the event is left unprocessed for the next tick (`continue` skip, not `return`).

Guarantees:

- **Never lost**: events commit atomically with the state change that caused them.
- **Never duplicated downstream**: deterministic `idempotency_key` in `emit_event` means a retried transition does not insert a second event.
- **At-least-once delivery**: a handler can be re-run. Handlers must be idempotent themselves (e.g. the enrollment-activated handler uses the existing `referrals` row, not a new one).

Order is not guaranteed across aggregates. Within one aggregate, `created_at ASC` in the cron query gives a consistent replay order.

## 6. Webhook durability (Stripe)

[src/app/api/webhooks/stripe/route.ts](src/app/api/webhooks/stripe/route.ts):

- Verifies the signature first via `stripe.webhooks.constructEvent` with `STRIPE_WEBHOOK_SECRET`. A bad signature returns `400` before touching the DB.
- Writes are keyed by `payment_intent` / invoice IDs — Stripe retries the same webhook on 5xx, so downstream writes must dedupe.

**Known gap**: the current webhook writes to a simplified `payments`/`members` path rather than the canonical invoice flow. When tightening this, route success through `recordPayment(invoiceId, actorId)` in [src/lib/server/billing.ts](src/lib/server/billing.ts), which already has an early-return for `status = 'PAID'` and calls `renew_subscription` in one atomic SQL function.

## 7. Cron reliability

- Auth: Bearer token vs `CRON_SECRET`. A missed tick does not lose work — the next tick reprocesses anything unprocessed.
- Batch: events are drained 50 at a time; oldest first.
- Failure handling: per-event try/catch; one poison event cannot block the queue. Add instrumentation when registering a new handler that can fail transiently.

## 8. Schema-level safety nets

Beyond the functions:

- `CHECK` constraints block invalid numeric ranges: coverage percentages `0..100`, prices `≥ 0`, `visits_remaining ≥ 0`, `copay_max_cents ≥ copay_min_cents` via app logic.
- `UNIQUE` constraints block duplicate identities: `users.email`, `doctors.license_id`, `enrollment.member_id_code`, `plans.slug`, `affiliates.partner_code`, `invoices.invoice_number`.
- Partial unique index `enrollment_one_active` at [supabase/migrations/00001_foundation.sql:132-135](supabase/migrations/00001_foundation.sql#L132-L135) — one active enrollment per beneficiary, enforced across all non-terminal statuses.
- Trigger `check_invoice_total` recomputes `invoices.total_cents` from `invoice_lines` on every line insert/update/delete — the invoice total cannot drift from its line items.

## 9. Money handling

- All monetary columns are `integer` cents. No floats.
- Currency is stored on `invoices.currency` (default `USD`).
- Commissions are computed server-side in [src/lib/server/event-processor.ts:49-51](src/lib/server/event-processor.ts#L49-L51) using `Math.floor` on `yearly_price_cents * rate_pct / 100` — never fractional cents.

## 10. Checklist when adding a mutation

Before merging a new mutation, confirm:

- [ ] Is it in a SQL function, not a TypeScript multi-statement transaction?
- [ ] Does every write that can be retried have an `idempotency_key` (or rely on a natural UNIQUE)?
- [ ] Does the state update use `WHERE status = 'expected'` + `IF NOT FOUND RAISE`?
- [ ] If it decrements a counter, does it `SELECT ... FOR UPDATE`?
- [ ] Does it emit an event via `emit_event` with a deterministic key?
- [ ] If triggered by a webhook or external system, does the entry point dedupe?
- [ ] Is a retry of the full request a no-op (or a correctly merged update)?

If all boxes are checked, the mutation will survive duplicate clicks, flaky networks, Stripe retries, and deploys in the middle of a request.
