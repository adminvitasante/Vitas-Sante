-- ============================================================
-- Vita Santé Club — Foundation Migration
-- Core tables, enums, constraints, indexes
-- All invariants enforced at the database level
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- ENUMS
-- ────────────────────────────────────────────────────────────

CREATE TYPE capability_type AS ENUM ('PAYER', 'BENEFICIARY', 'DOCTOR', 'AFFILIATE', 'ADMIN');
CREATE TYPE capability_status AS ENUM ('ACTIVE', 'SUSPENDED', 'REVOKED');

CREATE TYPE plan_tier AS ENUM ('CORE', 'ELITE');

CREATE TYPE subscription_status AS ENUM ('CREATED', 'ACTIVE', 'GRACE_PERIOD', 'SUSPENDED', 'EXPIRED', 'CANCELLED');

CREATE TYPE enrollment_status AS ENUM (
  'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED',
  'ACTIVE', 'SUSPENDED', 'EXPIRED', 'REJECTED'
);

CREATE TYPE doctor_verification_status AS ENUM ('PENDING', 'VERIFIED', 'SUSPENDED', 'REVOKED');

CREATE TYPE visit_status AS ENUM ('INITIATED', 'VERIFIED', 'CONFIRMED', 'COMPLETED', 'NOT_ELIGIBLE', 'CANCELLED');
CREATE TYPE visit_type AS ENUM ('GENERALIST', 'SPECIALIST', 'TELEVISIT', 'HOME_VISIT');
CREATE TYPE visit_network AS ENUM ('HAITI', 'US');

CREATE TYPE credit_reason AS ENUM ('VISIT_DEDUCTION', 'YEARLY_RESET', 'ADMIN_ADJUSTMENT', 'REVERSAL');

CREATE TYPE invoice_status AS ENUM ('DRAFT', 'ISSUED', 'PAID', 'OVERDUE', 'FAILED', 'REFUNDED');

CREATE TYPE referral_status AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED', 'COMMISSION_PAID');
CREATE TYPE affiliate_tier AS ENUM ('STANDARD', 'ELITE', 'DIAMOND');

CREATE TYPE event_aggregate AS ENUM ('ENROLLMENT', 'VISIT', 'SUBSCRIPTION', 'DOCTOR', 'AFFILIATE');

-- ────────────────────────────────────────────────────────────
-- USERS & CAPABILITIES
-- ────────────────────────────────────────────────────────────

CREATE TABLE users (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text UNIQUE NOT NULL,
  name        text NOT NULL,
  phone       text,
  password_hash text,
  locale      text NOT NULL DEFAULT 'fr' CHECK (locale IN ('fr', 'en')),
  is_diaspora boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE capabilities (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  capability  capability_type NOT NULL,
  status      capability_status NOT NULL DEFAULT 'ACTIVE',
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, capability)
);

CREATE INDEX idx_capabilities_user ON capabilities(user_id);
CREATE INDEX idx_capabilities_type ON capabilities(capability, status);

-- ────────────────────────────────────────────────────────────
-- PLANS (immutable reference data)
-- ────────────────────────────────────────────────────────────

CREATE TABLE plans (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                  text UNIQUE NOT NULL,
  name_en               text NOT NULL,
  name_fr               text NOT NULL,
  name_ht               text NOT NULL,
  tier                  plan_tier NOT NULL,
  yearly_price_cents    integer NOT NULL CHECK (yearly_price_cents >= 0),
  dependent_fee_cents   integer NOT NULL DEFAULT 0 CHECK (dependent_fee_cents >= 0),
  visits_per_year       integer NOT NULL CHECK (visits_per_year > 0),
  copay_min_cents       integer NOT NULL DEFAULT 100,
  copay_max_cents       integer NOT NULL DEFAULT 1000,
  -- Haiti network coverage percentages
  haiti_labs_pct        integer NOT NULL DEFAULT 0 CHECK (haiti_labs_pct BETWEEN 0 AND 100),
  haiti_pharmacy_pct    integer NOT NULL DEFAULT 0 CHECK (haiti_pharmacy_pct BETWEEN 0 AND 100),
  haiti_surgery_pct     integer NOT NULL DEFAULT 0 CHECK (haiti_surgery_pct BETWEEN 0 AND 100),
  haiti_hospitalization_pct integer NOT NULL DEFAULT 0 CHECK (haiti_hospitalization_pct BETWEEN 0 AND 100),
  -- US network coverage (Gold/Platinum only)
  us_labs_pct           integer NOT NULL DEFAULT 0 CHECK (us_labs_pct BETWEEN 0 AND 100),
  us_surgery_pct        integer NOT NULL DEFAULT 0 CHECK (us_surgery_pct BETWEEN 0 AND 100),
  has_us_network        boolean NOT NULL DEFAULT false,
  at_home_eligible      boolean NOT NULL DEFAULT false,
  at_home_included      boolean NOT NULL DEFAULT false,
  is_active             boolean NOT NULL DEFAULT true,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- SUBSCRIPTIONS & ENROLLMENT
-- ────────────────────────────────────────────────────────────

CREATE TABLE subscriptions (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payer_id                uuid NOT NULL REFERENCES users(id),
  status                  subscription_status NOT NULL DEFAULT 'CREATED',
  grace_period_ends_at    timestamptz,
  current_period_start    timestamptz NOT NULL DEFAULT now(),
  current_period_end      timestamptz NOT NULL DEFAULT (now() + interval '1 year'),
  stripe_subscription_id  text,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscriptions_payer ON subscriptions(payer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

CREATE TABLE enrollment (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id   uuid NOT NULL REFERENCES subscriptions(id),
  beneficiary_id    uuid NOT NULL REFERENCES users(id),
  plan_id           uuid NOT NULL REFERENCES plans(id),
  status            enrollment_status NOT NULL DEFAULT 'DRAFT',
  member_id_code    text UNIQUE, -- VSC-XXXXX-HT, generated on approval
  enrolled_at       timestamptz,
  activated_at      timestamptz,
  suspended_at      timestamptz,
  expires_at        timestamptz,
  rejection_reason  text,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- INVARIANT: one active enrollment per beneficiary
CREATE UNIQUE INDEX enrollment_one_active
  ON enrollment (beneficiary_id)
  WHERE status IN ('ACTIVE', 'APPROVED', 'UNDER_REVIEW', 'SUBMITTED');

CREATE INDEX idx_enrollment_subscription ON enrollment(subscription_id);
CREATE INDEX idx_enrollment_beneficiary ON enrollment(beneficiary_id);
CREATE INDEX idx_enrollment_status ON enrollment(status);

-- ────────────────────────────────────────────────────────────
-- CREDIT SYSTEM
-- ────────────────────────────────────────────────────────────

CREATE TABLE credit_accounts (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id    uuid NOT NULL REFERENCES enrollment(id),
  period_year      integer NOT NULL,
  visits_total     integer NOT NULL CHECK (visits_total > 0),
  visits_remaining integer NOT NULL CHECK (visits_remaining >= 0),
  created_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE(enrollment_id, period_year)
);

CREATE INDEX idx_credit_accounts_enrollment ON credit_accounts(enrollment_id);

CREATE TABLE credit_transactions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_account_id uuid NOT NULL REFERENCES credit_accounts(id),
  visit_id          uuid, -- set for VISIT_DEDUCTION, null for others
  delta             integer NOT NULL, -- negative for deductions
  balance_after     integer NOT NULL CHECK (balance_after >= 0),
  reason            credit_reason NOT NULL,
  idempotency_key   text UNIQUE NOT NULL,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_credit_tx_account ON credit_transactions(credit_account_id);
CREATE INDEX idx_credit_tx_idempotency ON credit_transactions(idempotency_key);

-- ────────────────────────────────────────────────────────────
-- DOCTORS
-- ────────────────────────────────────────────────────────────

CREATE TABLE doctors (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid UNIQUE NOT NULL REFERENCES users(id),
  license_id            text UNIQUE NOT NULL,
  specialty             text NOT NULL,
  clinic_name           text,
  clinic_address        text,
  region                text,
  verification_status   doctor_verification_status NOT NULL DEFAULT 'PENDING',
  verified_at           timestamptz,
  verified_by           uuid REFERENCES users(id),
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_doctors_status ON doctors(verification_status);

-- ────────────────────────────────────────────────────────────
-- VISITS
-- ────────────────────────────────────────────────────────────

CREATE TABLE visits (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id           uuid NOT NULL REFERENCES enrollment(id),
  doctor_id               uuid NOT NULL REFERENCES doctors(id),
  status                  visit_status NOT NULL DEFAULT 'INITIATED',
  visit_type              visit_type NOT NULL,
  network                 visit_network NOT NULL DEFAULT 'HAITI',
  copay_amount_cents      integer,
  notes                   text,
  visited_at              timestamptz NOT NULL DEFAULT now(),
  completed_at            timestamptz,
  credit_transaction_id   uuid REFERENCES credit_transactions(id),
  idempotency_key         text UNIQUE NOT NULL,
  created_at              timestamptz NOT NULL DEFAULT now()
);

-- Add FK from credit_transactions back to visits
ALTER TABLE credit_transactions
  ADD CONSTRAINT fk_credit_tx_visit
  FOREIGN KEY (visit_id) REFERENCES visits(id);

CREATE INDEX idx_visits_enrollment ON visits(enrollment_id);
CREATE INDEX idx_visits_doctor ON visits(doctor_id);
CREATE INDEX idx_visits_status ON visits(status);

-- ────────────────────────────────────────────────────────────
-- AFFILIATES & REFERRALS
-- ────────────────────────────────────────────────────────────

CREATE TABLE affiliates (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid UNIQUE NOT NULL REFERENCES users(id),
  partner_code        text UNIQUE NOT NULL,
  tier                affiliate_tier NOT NULL DEFAULT 'STANDARD',
  tier_threshold_cents integer NOT NULL DEFAULT 0,
  total_earned_cents  integer NOT NULL DEFAULT 0 CHECK (total_earned_cents >= 0),
  pending_cents       integer NOT NULL DEFAULT 0 CHECK (pending_cents >= 0),
  status              capability_status NOT NULL DEFAULT 'ACTIVE',
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE referrals (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id        uuid NOT NULL REFERENCES affiliates(id),
  enrollment_id       uuid UNIQUE NOT NULL REFERENCES enrollment(id), -- one referral per enrollment
  status              referral_status NOT NULL DEFAULT 'PENDING',
  commission_cents    integer NOT NULL DEFAULT 0 CHECK (commission_cents >= 0),
  commission_rate_pct integer NOT NULL CHECK (commission_rate_pct BETWEEN 0 AND 100),
  activated_at        timestamptz,
  paid_at             timestamptz,
  idempotency_key     text UNIQUE NOT NULL,
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_referrals_affiliate ON referrals(affiliate_id);
CREATE INDEX idx_referrals_status ON referrals(status);

-- ────────────────────────────────────────────────────────────
-- INVOICES
-- ────────────────────────────────────────────────────────────

CREATE TABLE invoices (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id     uuid NOT NULL REFERENCES subscriptions(id),
  invoice_number      text UNIQUE NOT NULL,
  status              invoice_status NOT NULL DEFAULT 'DRAFT',
  total_cents         integer NOT NULL CHECK (total_cents >= 0),
  currency            text NOT NULL DEFAULT 'USD',
  due_date            timestamptz NOT NULL,
  paid_at             timestamptz,
  stripe_invoice_id   text,
  idempotency_key     text UNIQUE NOT NULL,
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE invoice_lines (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id      uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  enrollment_id   uuid NOT NULL REFERENCES enrollment(id),
  description     text NOT NULL,
  amount_cents    integer NOT NULL CHECK (amount_cents >= 0),
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_invoices_subscription ON invoices(subscription_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoice_lines_invoice ON invoice_lines(invoice_id);

-- ────────────────────────────────────────────────────────────
-- EVENTS (append-only log)
-- ────────────────────────────────────────────────────────────

CREATE TABLE events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type      text NOT NULL,
  aggregate_type  event_aggregate NOT NULL,
  aggregate_id    uuid NOT NULL,
  payload         jsonb NOT NULL DEFAULT '{}',
  actor_id        uuid REFERENCES users(id),
  idempotency_key text UNIQUE NOT NULL,
  processed_at    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_unprocessed ON events(created_at) WHERE processed_at IS NULL;
CREATE INDEX idx_events_aggregate ON events(aggregate_type, aggregate_id);
CREATE INDEX idx_events_type ON events(event_type);

-- ────────────────────────────────────────────────────────────
-- UPDATED_AT TRIGGER (auto-update timestamp)
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ────────────────────────────────────────────────────────────
-- INVOICE TOTAL INVARIANT
-- Invoice total_cents must equal SUM of line items
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION check_invoice_total()
RETURNS TRIGGER AS $$
DECLARE
  line_sum integer;
BEGIN
  SELECT COALESCE(SUM(amount_cents), 0) INTO line_sum
  FROM invoice_lines
  WHERE invoice_id = NEW.invoice_id;

  UPDATE invoices SET total_cents = line_sum
  WHERE id = NEW.invoice_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_invoice_lines_sum
  AFTER INSERT OR UPDATE OR DELETE ON invoice_lines
  FOR EACH ROW EXECUTE FUNCTION check_invoice_total();
