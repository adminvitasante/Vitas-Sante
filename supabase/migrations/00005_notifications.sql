-- ============================================================
-- Vita Santé Club — Notifications + V2 support tables
-- Idempotent: safe to re-apply. Use DO $$ guards for enums and
-- IF NOT EXISTS for tables/indexes.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- NOTIFICATIONS
-- ────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE notification_channel AS ENUM ('IN_APP', 'EMAIL', 'SMS');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE notification_priority AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE notification_delivery_status AS ENUM ('PENDING', 'SENT', 'FAILED', 'READ');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS notifications (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  channel         notification_channel NOT NULL DEFAULT 'IN_APP',
  priority        notification_priority NOT NULL DEFAULT 'NORMAL',
  subject         text NOT NULL,
  body            text NOT NULL,
  link_url        text,
  metadata        jsonb NOT NULL DEFAULT '{}',
  delivery_status notification_delivery_status NOT NULL DEFAULT 'PENDING',
  delivered_at    timestamptz,
  read_at         timestamptz,
  event_id        uuid REFERENCES events(id),
  idempotency_key text UNIQUE NOT NULL,
  last_error      text,
  retry_count     integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
  ON notifications(user_id, created_at DESC)
  WHERE read_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_pending
  ON notifications(created_at)
  WHERE delivery_status = 'PENDING';

-- ────────────────────────────────────────────────────────────
-- DOCTOR APPLICATIONS
-- ────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE doctor_application_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS doctor_applications (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid REFERENCES users(id) ON DELETE SET NULL,
  full_name          text NOT NULL,
  email              text NOT NULL,
  phone              text,
  license_id         text NOT NULL,
  specialty          text NOT NULL,
  clinic_name        text,
  clinic_address     text,
  region             text,
  years_experience   integer,
  notes              text,
  status             doctor_application_status NOT NULL DEFAULT 'PENDING',
  reviewed_at        timestamptz,
  reviewed_by        uuid REFERENCES users(id),
  rejection_reason   text,
  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_doctor_applications_status ON doctor_applications(status, created_at);

-- ────────────────────────────────────────────────────────────
-- SPONSOR GRANTS
-- ────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE sponsor_grant_status AS ENUM ('PLEDGED', 'FUNDED', 'FULFILLED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS sponsor_grants (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_user_id       uuid NOT NULL REFERENCES users(id),
  plan_id               uuid NOT NULL REFERENCES plans(id),
  seats_total           integer NOT NULL CHECK (seats_total > 0),
  seats_claimed         integer NOT NULL DEFAULT 0 CHECK (seats_claimed >= 0),
  status                sponsor_grant_status NOT NULL DEFAULT 'PLEDGED',
  stripe_invoice_id     text,
  notes                 text,
  created_at            timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT seats_claimed_bounded CHECK (seats_claimed <= seats_total)
);

CREATE INDEX IF NOT EXISTS idx_sponsor_grants_sponsor ON sponsor_grants(sponsor_user_id);
CREATE INDEX IF NOT EXISTS idx_sponsor_grants_status ON sponsor_grants(status);

CREATE TABLE IF NOT EXISTS sponsor_grant_enrollments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grant_id        uuid NOT NULL REFERENCES sponsor_grants(id) ON DELETE CASCADE,
  enrollment_id   uuid UNIQUE NOT NULL REFERENCES enrollment(id),
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sponsor_grant_enrollments_grant ON sponsor_grant_enrollments(grant_id);

-- ────────────────────────────────────────────────────────────
-- AFFILIATE PENDING RPC (fallback-safe upsert of pending_cents)
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_affiliate_pending(
  p_affiliate_id uuid,
  p_amount integer
) RETURNS void AS $$
BEGIN
  UPDATE affiliates
  SET pending_cents = pending_cents + p_amount,
      total_earned_cents = total_earned_cents + p_amount
  WHERE id = p_affiliate_id;
END;
$$ LANGUAGE plpgsql;
