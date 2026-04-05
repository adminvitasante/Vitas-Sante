# Vita Santé Club — Backend Architecture Design Spec

## 1. Domain Overview

Vita Santé Club is a premium health platform for Haiti and its Diaspora. The backend must support:
- **Payers** (diaspora, local, or institutional) who fund healthcare for **Beneficiaries** in Haiti
- A **credit-based visit system** where doctors verify eligibility and deduct visit credits
- **Affiliate referral tracking** with tiered commissions
- **Admin oversight** of the entire network
- **Bilingual (FR/EN)** content with Haitian Creole plan names

---

## 2. Role & Capability Model

A **User** (account) can have one or more **capabilities**:

| Capability | Description |
|---|---|
| **PAYER** | Purchases plans, funds beneficiaries (self or others). Billing anchor. Diaspora payer, sponsor, and self-paying member are all PAYER — just different scales. |
| **BENEFICIARY** | Receives care, has credits, can visit doctors. Every person who gets medical coverage. |
| **DOCTOR** | Verified medical provider. Can verify beneficiaries and record visits. |
| **AFFILIATE** | Earns commissions from referrals via partner code. |
| **ADMIN** | Platform operations — approvals, configuration, oversight. |

**Key rules:**
- Payer and Beneficiary are independent. A user can be both (self-paying member), just Payer (diaspora funding family), or just Beneficiary (dependent funded by someone else).
- A payer can fund beneficiaries on **different plan tiers**.
- If a payer stops paying, ALL their beneficiaries lose coverage (after grace period).
- A dependent whose payer stops can become self-paying (gains PAYER capability, creates own subscription).

---

## 3. Data Model

### 3.1 Users & Capabilities

```
users
├── id (uuid, PK)
├── email (unique)
├── name
├── phone
├── password_hash
├── locale (fr/en, default: fr)
├── is_diaspora (boolean, default: false)
├── created_at
└── updated_at

capabilities
├── id (uuid, PK)
├── user_id → users
├── capability: PAYER | BENEFICIARY | DOCTOR | AFFILIATE | ADMIN
├── status: ACTIVE | SUSPENDED | REVOKED
├── created_at
└── UNIQUE(user_id, capability)
```

### 3.2 Plans

Immutable reference data. 8 tiers across Core and Elite.

```
plans
├── id (uuid, PK)
├── slug (unique: essential, advantage, premium, elite, elite_plus, elite_silver, elite_gold, elite_platinum)
├── name_en / name_fr / name_ht
├── tier: CORE | ELITE
├── yearly_price_cents (integer, USD)
├── dependent_fee_cents (integer, 0 for Gold/Platinum)
├── visits_per_year (6, 8, 12, 24, 50, 99)
├── copay_min_cents / copay_max_cents
├── haiti_labs_pct (0-100)
├── haiti_pharmacy_pct (0-100)
├── haiti_surgery_pct (0-100)
├── haiti_hospitalization_pct (0-100)
├── us_labs_pct (0-100, only Gold/Platinum)
├── us_surgery_pct (0-100, only Gold/Platinum)
├── has_us_network (boolean)
├── at_home_eligible (boolean)
├── at_home_included (boolean)
├── is_active (boolean)
├── created_at
└── updated_at
```

**Plan seed data:**

| Slug | Price | Visits | Haiti Labs/Pharm | Haiti Surg/Hosp | US Labs | US Surg | Dep Fee |
|------|-------|--------|------------------|-----------------|---------|---------|---------|
| essential | $99 | 6 | 15%/15% | 0%/0% | — | — | $55 |
| advantage | $135 | 8 | 20%/20% | 0%/0% | — | — | $55 |
| premium | $200 | 12 | 35%/35% | 0%/0% | — | — | $55 |
| elite | $365 | 24 | 70%/70% | 70%/70% | — | — | $95 |
| elite_plus | $700 | 50 | 85%/85% | 85%/85% | — | — | $120 |
| elite_silver | $1,500 | 99 | 95%/95% | 95%/95% | — | — | $120 |
| elite_gold | $3,000 | 99 | 95%/95%* | 95%/95%* | 25% | 10% | $0 |
| elite_platinum | $5,000 | 99 | 95%/95%* | 95%/95%* | 45% | 30% | $0 |

*Gold/Platinum include all Silver Haiti benefits + US network access.

### 3.3 Subscriptions & Enrollment

```
subscriptions (billing anchor — one per payer)
├── id (uuid, PK)
├── payer_id → users
├── status: CREATED | ACTIVE | GRACE_PERIOD | SUSPENDED | EXPIRED | CANCELLED
├── grace_period_ends_at (nullable)
├── current_period_start
├── current_period_end
├── stripe_subscription_id (nullable, for later)
├── created_at
└── updated_at

enrollment (one row per beneficiary on a subscription)
├── id (uuid, PK)
├── subscription_id → subscriptions
├── beneficiary_id → users
├── plan_id → plans
├── status: DRAFT | SUBMITTED | UNDER_REVIEW | APPROVED | ACTIVE | SUSPENDED | EXPIRED | REJECTED
├── member_id_code (VSC-XXXXX-HT, generated on APPROVED)
├── enrolled_at
├── activated_at
├── suspended_at
├── expires_at
├── rejection_reason (nullable)
└── created_at

-- Invariant: one active enrollment per beneficiary
CREATE UNIQUE INDEX enrollment_one_active
  ON enrollment (beneficiary_id)
  WHERE status IN ('ACTIVE', 'APPROVED', 'UNDER_REVIEW', 'SUBMITTED');
```

**Enrollment state machine:**

```
DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED → ACTIVE
                        ↓                        ↓
                    REJECTED              SUSPENDED → EXPIRED
                        ↓
                    (resubmit → SUBMITTED)
```

Transitions:
- DRAFT → SUBMITTED: Payer completes form + payment
- SUBMITTED → UNDER_REVIEW: Automatic
- UNDER_REVIEW → APPROVED: Admin approves, member ID generated
- APPROVED → ACTIVE: Immediate in same transaction as approval (credit account created, event emitted)
- UNDER_REVIEW → REJECTED: Admin rejects (with reason)
- REJECTED → SUBMITTED: Payer resubmits
- ACTIVE → SUSPENDED: Payment grace expired or admin action
- SUSPENDED → ACTIVE: Payment received or admin reinstates
- SUSPENDED → EXPIRED: 30 days after suspension

### 3.4 Credits

```
credit_accounts (per beneficiary, per year)
├── id (uuid, PK)
├── enrollment_id → enrollment
├── period_year (2024, 2025...)
├── visits_total (copied from plan at activation)
├── visits_remaining
├── created_at
└── CHECK (visits_remaining >= 0)
└── UNIQUE(enrollment_id, period_year)

credit_transactions (append-only audit ledger)
├── id (uuid, PK)
├── credit_account_id → credit_accounts
├── visit_id → visits (nullable)
├── delta (integer: -1 for deduction, +N for reset/adjustment)
├── balance_after (integer)
├── reason: VISIT_DEDUCTION | YEARLY_RESET | ADMIN_ADJUSTMENT | REVERSAL
├── idempotency_key (unique)
├── created_at
```

Invariants:
- `visits_remaining >= 0` — enforced by CHECK constraint
- `idempotency_key` is UNIQUE — same visit cannot deduct twice
- `balance_after` must equal previous balance + delta — enforced by trigger

### 3.5 Doctors & Visits

```
doctors
├── id (uuid, PK)
├── user_id → users (unique)
├── license_id (unique, format: HT-XXXX-MED-YYYY)
├── specialty
├── clinic_name
├── clinic_address
├── region
├── verification_status: PENDING | VERIFIED | SUSPENDED | REVOKED
├── verified_at
├── verified_by → users (admin)
└── created_at
```

```
visits
├── id (uuid, PK)
├── enrollment_id → enrollment
├── doctor_id → doctors
├── status: INITIATED | VERIFIED | CONFIRMED | COMPLETED | NOT_ELIGIBLE | CANCELLED
├── visit_type: GENERALIST | SPECIALIST | TELEVISIT | HOME_VISIT
├── network: HAITI | US
├── copay_amount_cents
├── notes (text, nullable)
├── visited_at
├── completed_at (nullable)
├── credit_transaction_id → credit_transactions (nullable)
├── idempotency_key (unique)
└── created_at
```

**Visit state machine:**

```
INITIATED → VERIFIED → CONFIRMED → COMPLETED
               ↓            ↓
           NOT_ELIGIBLE   CANCELLED
```

**Critical transition (CONFIRMED → COMPLETED) — PostgreSQL function:**
- Check enrollment is ACTIVE
- Check visits_remaining > 0
- Insert credit_transaction with idempotency_key = visit.id
- Decrement credit_account.visits_remaining
- Update visit status to COMPLETED
- All in one transaction — atomic, idempotent

### 3.6 Affiliates & Commissions

```
affiliates
├── id (uuid, PK)
├── user_id → users (unique)
├── partner_code (unique, e.g., "VITA-MARIE")
├── tier: STANDARD | ELITE | DIAMOND
├── tier_threshold_cents
├── total_earned_cents
├── pending_cents
├── status: ACTIVE | SUSPENDED | REVOKED
└── created_at

referrals
├── id (uuid, PK)
├── affiliate_id → affiliates
├── enrollment_id → enrollment (unique)
├── status: PENDING | ACTIVE | EXPIRED | COMMISSION_PAID
├── commission_cents
├── commission_rate_pct (snapshot at creation)
├── activated_at
├── paid_at
├── idempotency_key (unique)
└── created_at
```

**Referral state machine:**

```
PENDING → ACTIVE → COMMISSION_PAID
  ↓         ↓
EXPIRED   EXPIRED
```

**Tier thresholds:**

| Tier | Threshold | Commission Rate |
|------|-----------|----------------|
| Standard | $0+ | 10% |
| Elite | $15,000+ | 15% |
| Diamond | $50,000+ | 20% |

Invariants:
- Commission calculated only when enrollment reaches ACTIVE (not on submission)
- enrollment_id UNIQUE on referrals — no double-crediting
- Commission rate snapshot at referral creation — rate changes don't affect existing referrals
- 30-day validation window — if member suspended within 30 days, commission clawed back

### 3.7 Invoices & Billing

```
invoices
├── id (uuid, PK)
├── subscription_id → subscriptions
├── invoice_number (unique, format: INV-YYYYMM-XXXXX)
├── status: DRAFT | ISSUED | PAID | OVERDUE | FAILED | REFUNDED
├── total_cents
├── currency (USD)
├── due_date
├── paid_at (nullable)
├── stripe_invoice_id (nullable)
├── idempotency_key (unique)
└── created_at

invoice_lines
├── id (uuid, PK)
├── invoice_id → invoices
├── enrollment_id → enrollment
├── description
├── amount_cents
└── created_at
```

**Invoice state machine:**

```
DRAFT → ISSUED → PAID
                → FAILED → (retry) → PAID
                                    → OVERDUE
PAID → REFUNDED
```

Invariants:
- total_cents must equal SUM(invoice_lines.amount_cents) — enforced by trigger
- idempotency_key = subscription_id + period_year — prevents duplicate invoices
- Credit reset only on subscription.renewed event — no payment, no credits

**Subscription lifecycle:**

```
CREATED → ACTIVE → GRACE_PERIOD (30 days) → SUSPENDED (30 days) → EXPIRED
             ↑          ↓
             └── payment received
ACTIVE → CANCELLED (voluntary)
```

### 3.8 Events

```
events
├── id (uuid, PK)
├── event_type (string)
├── aggregate_type: ENROLLMENT | VISIT | SUBSCRIPTION | DOCTOR | AFFILIATE
├── aggregate_id (uuid)
├── payload (jsonb)
├── actor_id → users
├── idempotency_key (unique)
├── processed_at (nullable)
└── created_at
```

**Event catalog:**

| Event | Trigger | Side Effects |
|-------|---------|-------------|
| enrollment.submitted | Payer submits | Notify admins |
| enrollment.approved | Admin approves | Generate member ID, notify payer |
| enrollment.activated | Auto after approval | Create credit_account, notify beneficiary |
| enrollment.suspended | Grace expired | Disable eligibility, notify payer + beneficiary |
| enrollment.expired | 30d after suspension | Archive, notify all |
| visit.completed | Doctor confirms | Update credits, notify payer |
| visit.not_eligible | Verification fails | Log, notify payer if credits exhausted |
| subscription.payment_failed | Stripe webhook | Start grace period, notify payer |
| subscription.grace_started | 3 days overdue | Email payer warning |
| subscription.renewed | Annual payment | Reset all credits |
| doctor.verified | Admin approves | Enable visit recording |
| referral.activated | Member goes ACTIVE | Calculate commission |

---

## 4. Architecture Split

| Layer | Owns | Enforcement |
|-------|------|-------------|
| **PostgreSQL** | Invariants, state machines, credit ledger, RLS | CHECK constraints, triggers, functions, unique indexes |
| **Events table** | Audit trail, side effect coordination | Append-only, idempotency keys |
| **Next.js Server Actions** | Orchestration, workflows, external integrations | Calls PostgreSQL functions, processes events |
| **Supabase RLS** | Authorization per role | Database-level, unbypassable |
| **Cron jobs** | Grace period expiry, invoice generation, event processing | Daily / 30-second schedules |

**Principle:** PostgreSQL owns "what must always be true." TypeScript owns "what happens next."

---

## 5. Authorization (RLS)

| Table | PAYER | BENEFICIARY | DOCTOR | ADMIN |
|-------|-------|-------------|--------|-------|
| users | Own row | Own row | Own row | All |
| subscriptions | Own | None | None | All |
| enrollment | Their beneficiaries | Own | During active visit | All |
| credit_accounts | Their beneficiaries | Own | Current patient | All |
| credit_transactions | Their beneficiaries | Own | None | All |
| visits | Their beneficiaries | Own | Their visits | All |
| doctors | Read all | Read all | Own (write) | All |
| plans | Read all | Read all | Read all | All (write) |
| events | None | None | None | All |

State-changing operations go through PostgreSQL SECURITY DEFINER functions that verify the caller's capability before executing.

---

## 6. Idempotency Strategy

| Operation | Idempotency Key | Mechanism |
|-----------|----------------|-----------|
| Credit deduction | visit.id | UNIQUE on credit_transactions.idempotency_key |
| Invoice generation | subscription_id + period_year | UNIQUE on invoices.idempotency_key |
| Event emission | aggregate_type + aggregate_id + event_type + trigger_id | UNIQUE on events.idempotency_key |
| Referral commission | enrollment_id | UNIQUE on referrals.enrollment_id |
| Stripe payment | invoice.idempotency_key | Stripe idempotency key header |
| Credit reset | enrollment_id + period_year | UNIQUE on credit_accounts(enrollment_id, period_year) |

---

## 7. Key Second-Order Effects

| When this happens... | ...this must also happen |
|---------------------|------------------------|
| Payer misses payment | Grace period (30d) → all beneficiaries suspended → 30d more → expired |
| Plan upgrade mid-year | New credits = new_plan.visits - (old_plan.visits - remaining). Keep unused. |
| visits_remaining hits 0 | Next verification returns NOT_ELIGIBLE with "Credits exhausted" |
| Enrollment suspended mid-visit | VERIFIED → CONFIRMED transition re-checks and fails |
| Referred member suspended within 30 days | Referral → EXPIRED, commission clawed back from pending_cents |
| Subscription renewed | ALL beneficiary credit_accounts reset for new year |
| Doctor suspended | All their INITIATED/VERIFIED visits → CANCELLED |
| Payer removes a beneficiary | Enrollment → CANCELLED, credits forfeited, next invoice recalculated |
