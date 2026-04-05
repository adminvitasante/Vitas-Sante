-- ============================================================
-- Vita Santé Club — Business Logic Functions
-- State transitions, credit deduction, invariant enforcement
-- All critical operations are atomic and idempotent
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- HELPER: Emit event (used by all state transition functions)
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION emit_event(
  p_event_type text,
  p_aggregate_type event_aggregate,
  p_aggregate_id uuid,
  p_payload jsonb,
  p_actor_id uuid,
  p_idempotency_key text
) RETURNS uuid AS $$
DECLARE
  v_event_id uuid;
BEGIN
  INSERT INTO events (event_type, aggregate_type, aggregate_id, payload, actor_id, idempotency_key)
  VALUES (p_event_type, p_aggregate_type, p_aggregate_id, p_payload, p_actor_id, p_idempotency_key)
  ON CONFLICT (idempotency_key) DO NOTHING
  RETURNING id INTO v_event_id;

  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql;

-- ────────────────────────────────────────────────────────────
-- MEMBER ID GENERATOR (VSC-XXXXX-HT format)
-- ────────────────────────────────────────────────────────────

CREATE SEQUENCE member_id_seq START 10000;

CREATE OR REPLACE FUNCTION generate_member_id()
RETURNS text AS $$
BEGIN
  RETURN 'VSC-' || LPAD(nextval('member_id_seq')::text, 5, '0') || '-HT';
END;
$$ LANGUAGE plpgsql;

-- ────────────────────────────────────────────────────────────
-- ENROLLMENT STATE MACHINE
-- ────────────────────────────────────────────────────────────

-- Submit enrollment (DRAFT → SUBMITTED → UNDER_REVIEW)
CREATE OR REPLACE FUNCTION submit_enrollment(
  p_enrollment_id uuid,
  p_actor_id uuid
) RETURNS enrollment AS $$
DECLARE
  v_enrollment enrollment;
BEGIN
  UPDATE enrollment
  SET status = 'UNDER_REVIEW', enrolled_at = now()
  WHERE id = p_enrollment_id AND status IN ('DRAFT', 'SUBMITTED')
  RETURNING * INTO v_enrollment;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Enrollment % not in submittable state', p_enrollment_id;
  END IF;

  PERFORM emit_event(
    'enrollment.submitted', 'ENROLLMENT', p_enrollment_id,
    jsonb_build_object('beneficiary_id', v_enrollment.beneficiary_id, 'plan_id', v_enrollment.plan_id),
    p_actor_id,
    'enrollment.submitted:' || p_enrollment_id
  );

  RETURN v_enrollment;
END;
$$ LANGUAGE plpgsql;

-- Approve enrollment (UNDER_REVIEW → APPROVED → ACTIVE, all in one transaction)
CREATE OR REPLACE FUNCTION approve_enrollment(
  p_enrollment_id uuid,
  p_admin_id uuid
) RETURNS enrollment AS $$
DECLARE
  v_enrollment enrollment;
  v_plan plans;
  v_member_id text;
  v_year integer;
BEGIN
  -- Verify admin capability
  IF NOT EXISTS (
    SELECT 1 FROM capabilities
    WHERE user_id = p_admin_id AND capability = 'ADMIN' AND status = 'ACTIVE'
  ) THEN
    RAISE EXCEPTION 'User % is not an active admin', p_admin_id;
  END IF;

  -- Transition to APPROVED
  UPDATE enrollment
  SET status = 'ACTIVE',
      member_id_code = generate_member_id(),
      activated_at = now()
  WHERE id = p_enrollment_id AND status = 'UNDER_REVIEW'
  RETURNING * INTO v_enrollment;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Enrollment % not in UNDER_REVIEW state', p_enrollment_id;
  END IF;

  -- Ensure beneficiary has BENEFICIARY capability
  INSERT INTO capabilities (user_id, capability, status)
  VALUES (v_enrollment.beneficiary_id, 'BENEFICIARY', 'ACTIVE')
  ON CONFLICT (user_id, capability)
  DO UPDATE SET status = 'ACTIVE';

  -- Get plan details
  SELECT * INTO v_plan FROM plans WHERE id = v_enrollment.plan_id;

  -- Create credit account for current year
  v_year := EXTRACT(YEAR FROM now())::integer;

  INSERT INTO credit_accounts (enrollment_id, period_year, visits_total, visits_remaining)
  VALUES (v_enrollment.id, v_year, v_plan.visits_per_year, v_plan.visits_per_year)
  ON CONFLICT (enrollment_id, period_year) DO NOTHING;

  -- Emit events
  PERFORM emit_event(
    'enrollment.approved', 'ENROLLMENT', p_enrollment_id,
    jsonb_build_object(
      'beneficiary_id', v_enrollment.beneficiary_id,
      'member_id_code', v_enrollment.member_id_code,
      'plan_slug', v_plan.slug
    ),
    p_admin_id,
    'enrollment.approved:' || p_enrollment_id
  );

  PERFORM emit_event(
    'enrollment.activated', 'ENROLLMENT', p_enrollment_id,
    jsonb_build_object(
      'beneficiary_id', v_enrollment.beneficiary_id,
      'visits_total', v_plan.visits_per_year,
      'period_year', v_year
    ),
    p_admin_id,
    'enrollment.activated:' || p_enrollment_id
  );

  RETURN v_enrollment;
END;
$$ LANGUAGE plpgsql;

-- Reject enrollment (UNDER_REVIEW → REJECTED)
CREATE OR REPLACE FUNCTION reject_enrollment(
  p_enrollment_id uuid,
  p_admin_id uuid,
  p_reason text
) RETURNS enrollment AS $$
DECLARE
  v_enrollment enrollment;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM capabilities
    WHERE user_id = p_admin_id AND capability = 'ADMIN' AND status = 'ACTIVE'
  ) THEN
    RAISE EXCEPTION 'User % is not an active admin', p_admin_id;
  END IF;

  UPDATE enrollment
  SET status = 'REJECTED', rejection_reason = p_reason
  WHERE id = p_enrollment_id AND status = 'UNDER_REVIEW'
  RETURNING * INTO v_enrollment;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Enrollment % not in UNDER_REVIEW state', p_enrollment_id;
  END IF;

  PERFORM emit_event(
    'enrollment.rejected', 'ENROLLMENT', p_enrollment_id,
    jsonb_build_object('reason', p_reason),
    p_admin_id,
    'enrollment.rejected:' || p_enrollment_id
  );

  RETURN v_enrollment;
END;
$$ LANGUAGE plpgsql;

-- Suspend enrollment (ACTIVE → SUSPENDED)
CREATE OR REPLACE FUNCTION suspend_enrollment(
  p_enrollment_id uuid,
  p_actor_id uuid,
  p_reason text DEFAULT 'Payment grace period expired'
) RETURNS enrollment AS $$
DECLARE
  v_enrollment enrollment;
BEGIN
  UPDATE enrollment
  SET status = 'SUSPENDED', suspended_at = now()
  WHERE id = p_enrollment_id AND status = 'ACTIVE'
  RETURNING * INTO v_enrollment;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Enrollment % not in ACTIVE state', p_enrollment_id;
  END IF;

  -- Suspend beneficiary capability
  UPDATE capabilities
  SET status = 'SUSPENDED'
  WHERE user_id = v_enrollment.beneficiary_id AND capability = 'BENEFICIARY';

  -- Cancel any in-progress visits
  UPDATE visits
  SET status = 'CANCELLED'
  WHERE enrollment_id = p_enrollment_id AND status IN ('INITIATED', 'VERIFIED', 'CONFIRMED');

  PERFORM emit_event(
    'enrollment.suspended', 'ENROLLMENT', p_enrollment_id,
    jsonb_build_object('reason', p_reason, 'beneficiary_id', v_enrollment.beneficiary_id),
    p_actor_id,
    'enrollment.suspended:' || p_enrollment_id || ':' || now()::text
  );

  RETURN v_enrollment;
END;
$$ LANGUAGE plpgsql;

-- ────────────────────────────────────────────────────────────
-- VISIT STATE MACHINE + CREDIT DEDUCTION
-- ────────────────────────────────────────────────────────────

-- Initiate a visit (doctor starts verification)
CREATE OR REPLACE FUNCTION initiate_visit(
  p_doctor_id uuid,
  p_member_id_code text,
  p_visit_type visit_type,
  p_network visit_network DEFAULT 'HAITI',
  p_idempotency_key text DEFAULT NULL
) RETURNS jsonb AS $$
DECLARE
  v_doctor doctors;
  v_enrollment enrollment;
  v_credit credit_accounts;
  v_visit visits;
  v_year integer;
  v_key text;
BEGIN
  v_key := COALESCE(p_idempotency_key, gen_random_uuid()::text);
  v_year := EXTRACT(YEAR FROM now())::integer;

  -- Check: doctor is verified
  SELECT * INTO v_doctor FROM doctors WHERE id = p_doctor_id;
  IF v_doctor.verification_status != 'VERIFIED' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Doctor not verified');
  END IF;

  -- Find enrollment by member ID code
  SELECT * INTO v_enrollment
  FROM enrollment
  WHERE member_id_code = p_member_id_code;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Member not found');
  END IF;

  -- Check: enrollment is ACTIVE
  IF v_enrollment.status != 'ACTIVE' THEN
    -- Create NOT_ELIGIBLE visit for audit
    INSERT INTO visits (enrollment_id, doctor_id, status, visit_type, network, idempotency_key)
    VALUES (v_enrollment.id, p_doctor_id, 'NOT_ELIGIBLE', p_visit_type, p_network, v_key);

    RETURN jsonb_build_object(
      'success', false,
      'error', 'Member not eligible',
      'enrollment_status', v_enrollment.status
    );
  END IF;

  -- Check: credits remaining
  SELECT * INTO v_credit
  FROM credit_accounts
  WHERE enrollment_id = v_enrollment.id AND period_year = v_year;

  IF NOT FOUND OR v_credit.visits_remaining <= 0 THEN
    INSERT INTO visits (enrollment_id, doctor_id, status, visit_type, network, idempotency_key)
    VALUES (v_enrollment.id, p_doctor_id, 'NOT_ELIGIBLE', p_visit_type, p_network, v_key);

    RETURN jsonb_build_object(
      'success', false,
      'error', 'No credits remaining',
      'visits_remaining', COALESCE(v_credit.visits_remaining, 0)
    );
  END IF;

  -- Create visit in VERIFIED state
  INSERT INTO visits (enrollment_id, doctor_id, status, visit_type, network, idempotency_key)
  VALUES (v_enrollment.id, p_doctor_id, 'VERIFIED', p_visit_type, p_network, v_key)
  RETURNING * INTO v_visit;

  RETURN jsonb_build_object(
    'success', true,
    'visit_id', v_visit.id,
    'beneficiary_name', (SELECT name FROM users WHERE id = v_enrollment.beneficiary_id),
    'member_id_code', v_enrollment.member_id_code,
    'plan_slug', (SELECT slug FROM plans WHERE id = v_enrollment.plan_id),
    'visits_remaining', v_credit.visits_remaining,
    'enrollment_status', v_enrollment.status
  );
END;
$$ LANGUAGE plpgsql;

-- Complete a visit (VERIFIED/CONFIRMED → COMPLETED + credit deduction)
-- This is the most critical function — atomic and idempotent
CREATE OR REPLACE FUNCTION complete_visit(
  p_visit_id uuid,
  p_doctor_user_id uuid,
  p_notes text DEFAULT NULL,
  p_copay_cents integer DEFAULT NULL
) RETURNS jsonb AS $$
DECLARE
  v_visit visits;
  v_enrollment enrollment;
  v_credit credit_accounts;
  v_tx credit_transactions;
  v_doctor doctors;
  v_year integer;
  v_idemp_key text;
BEGIN
  v_year := EXTRACT(YEAR FROM now())::integer;
  v_idemp_key := 'visit_deduction:' || p_visit_id;

  -- Idempotency check: if already completed, return success
  SELECT * INTO v_visit FROM visits WHERE id = p_visit_id;
  IF v_visit.status = 'COMPLETED' THEN
    RETURN jsonb_build_object('success', true, 'already_completed', true, 'visit_id', p_visit_id);
  END IF;

  -- Check visit is in completable state
  IF v_visit.status NOT IN ('VERIFIED', 'CONFIRMED') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Visit not in completable state', 'status', v_visit.status);
  END IF;

  -- Verify doctor owns this visit
  SELECT * INTO v_doctor FROM doctors WHERE user_id = p_doctor_user_id;
  IF v_visit.doctor_id != v_doctor.id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Visit does not belong to this doctor');
  END IF;

  -- Re-check enrollment is still ACTIVE (may have changed since VERIFIED)
  SELECT * INTO v_enrollment FROM enrollment WHERE id = v_visit.enrollment_id;
  IF v_enrollment.status != 'ACTIVE' THEN
    UPDATE visits SET status = 'CANCELLED' WHERE id = p_visit_id;
    RETURN jsonb_build_object('success', false, 'error', 'Enrollment no longer active');
  END IF;

  -- Get credit account
  SELECT * INTO v_credit
  FROM credit_accounts
  WHERE enrollment_id = v_enrollment.id AND period_year = v_year
  FOR UPDATE; -- lock the row to prevent race conditions

  IF v_credit.visits_remaining <= 0 THEN
    UPDATE visits SET status = 'NOT_ELIGIBLE' WHERE id = p_visit_id;
    RETURN jsonb_build_object('success', false, 'error', 'No credits remaining');
  END IF;

  -- Deduct credit (idempotent via unique idempotency_key)
  INSERT INTO credit_transactions (credit_account_id, visit_id, delta, balance_after, reason, idempotency_key)
  VALUES (v_credit.id, p_visit_id, -1, v_credit.visits_remaining - 1, 'VISIT_DEDUCTION', v_idemp_key)
  ON CONFLICT (idempotency_key) DO NOTHING
  RETURNING * INTO v_tx;

  -- If insert was skipped (idempotent retry), get existing transaction
  IF v_tx IS NULL THEN
    SELECT * INTO v_tx FROM credit_transactions WHERE idempotency_key = v_idemp_key;
  ELSE
    -- Only decrement if we actually inserted (not idempotent retry)
    UPDATE credit_accounts
    SET visits_remaining = visits_remaining - 1
    WHERE id = v_credit.id AND visits_remaining > 0;
  END IF;

  -- Complete the visit
  UPDATE visits
  SET status = 'COMPLETED',
      completed_at = now(),
      notes = COALESCE(p_notes, notes),
      copay_amount_cents = p_copay_cents,
      credit_transaction_id = v_tx.id
  WHERE id = p_visit_id;

  -- Emit event
  PERFORM emit_event(
    'visit.completed', 'VISIT', p_visit_id,
    jsonb_build_object(
      'enrollment_id', v_enrollment.id,
      'beneficiary_id', v_enrollment.beneficiary_id,
      'doctor_id', v_doctor.id,
      'visit_type', v_visit.visit_type::text,
      'credits_remaining', v_credit.visits_remaining - 1
    ),
    p_doctor_user_id,
    'visit.completed:' || p_visit_id
  );

  RETURN jsonb_build_object(
    'success', true,
    'visit_id', p_visit_id,
    'credits_remaining', v_credit.visits_remaining - 1,
    'transaction_id', v_tx.id
  );
END;
$$ LANGUAGE plpgsql;

-- ────────────────────────────────────────────────────────────
-- SUBSCRIPTION LIFECYCLE
-- ────────────────────────────────────────────────────────────

-- Start grace period (ACTIVE → GRACE_PERIOD)
CREATE OR REPLACE FUNCTION start_grace_period(
  p_subscription_id uuid,
  p_actor_id uuid
) RETURNS subscriptions AS $$
DECLARE
  v_sub subscriptions;
BEGIN
  UPDATE subscriptions
  SET status = 'GRACE_PERIOD',
      grace_period_ends_at = now() + interval '30 days'
  WHERE id = p_subscription_id AND status = 'ACTIVE'
  RETURNING * INTO v_sub;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Subscription % not in ACTIVE state', p_subscription_id;
  END IF;

  PERFORM emit_event(
    'subscription.grace_started', 'SUBSCRIPTION', p_subscription_id,
    jsonb_build_object('grace_ends_at', v_sub.grace_period_ends_at, 'payer_id', v_sub.payer_id),
    p_actor_id,
    'subscription.grace_started:' || p_subscription_id || ':' || now()::text
  );

  RETURN v_sub;
END;
$$ LANGUAGE plpgsql;

-- Suspend subscription and ALL beneficiaries (GRACE_PERIOD → SUSPENDED)
CREATE OR REPLACE FUNCTION suspend_subscription(
  p_subscription_id uuid,
  p_actor_id uuid
) RETURNS subscriptions AS $$
DECLARE
  v_sub subscriptions;
  v_enr enrollment;
BEGIN
  UPDATE subscriptions
  SET status = 'SUSPENDED'
  WHERE id = p_subscription_id AND status = 'GRACE_PERIOD'
  RETURNING * INTO v_sub;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Subscription % not in GRACE_PERIOD state', p_subscription_id;
  END IF;

  -- Suspend ALL active enrollments on this subscription
  FOR v_enr IN
    SELECT * FROM enrollment
    WHERE subscription_id = p_subscription_id AND status = 'ACTIVE'
  LOOP
    PERFORM suspend_enrollment(v_enr.id, p_actor_id, 'Subscription payment overdue');
  END LOOP;

  PERFORM emit_event(
    'subscription.suspended', 'SUBSCRIPTION', p_subscription_id,
    jsonb_build_object('payer_id', v_sub.payer_id),
    p_actor_id,
    'subscription.suspended:' || p_subscription_id || ':' || now()::text
  );

  RETURN v_sub;
END;
$$ LANGUAGE plpgsql;

-- Renew subscription (payment received → reset credits)
CREATE OR REPLACE FUNCTION renew_subscription(
  p_subscription_id uuid,
  p_actor_id uuid
) RETURNS subscriptions AS $$
DECLARE
  v_sub subscriptions;
  v_enr enrollment;
  v_plan plans;
  v_year integer;
BEGIN
  v_year := EXTRACT(YEAR FROM now())::integer;

  UPDATE subscriptions
  SET status = 'ACTIVE',
      grace_period_ends_at = NULL,
      current_period_start = now(),
      current_period_end = now() + interval '1 year'
  WHERE id = p_subscription_id AND status IN ('ACTIVE', 'GRACE_PERIOD', 'CREATED')
  RETURNING * INTO v_sub;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Subscription % not in renewable state', p_subscription_id;
  END IF;

  -- Reset credits for ALL active enrollments
  FOR v_enr IN
    SELECT * FROM enrollment
    WHERE subscription_id = p_subscription_id AND status = 'ACTIVE'
  LOOP
    SELECT * INTO v_plan FROM plans WHERE id = v_enr.plan_id;

    INSERT INTO credit_accounts (enrollment_id, period_year, visits_total, visits_remaining)
    VALUES (v_enr.id, v_year, v_plan.visits_per_year, v_plan.visits_per_year)
    ON CONFLICT (enrollment_id, period_year)
    DO UPDATE SET visits_total = v_plan.visits_per_year, visits_remaining = v_plan.visits_per_year;

    -- Log the reset
    INSERT INTO credit_transactions (
      credit_account_id, delta, balance_after, reason, idempotency_key
    )
    SELECT
      ca.id,
      v_plan.visits_per_year - ca.visits_remaining,
      v_plan.visits_per_year,
      'YEARLY_RESET',
      'yearly_reset:' || v_enr.id || ':' || v_year
    FROM credit_accounts ca
    WHERE ca.enrollment_id = v_enr.id AND ca.period_year = v_year
    ON CONFLICT (idempotency_key) DO NOTHING;
  END LOOP;

  PERFORM emit_event(
    'subscription.renewed', 'SUBSCRIPTION', p_subscription_id,
    jsonb_build_object('payer_id', v_sub.payer_id, 'period_year', v_year),
    p_actor_id,
    'subscription.renewed:' || p_subscription_id || ':' || v_year
  );

  RETURN v_sub;
END;
$$ LANGUAGE plpgsql;

-- ────────────────────────────────────────────────────────────
-- DOCTOR VERIFICATION
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION verify_doctor(
  p_doctor_id uuid,
  p_admin_id uuid
) RETURNS doctors AS $$
DECLARE
  v_doctor doctors;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM capabilities
    WHERE user_id = p_admin_id AND capability = 'ADMIN' AND status = 'ACTIVE'
  ) THEN
    RAISE EXCEPTION 'User % is not an active admin', p_admin_id;
  END IF;

  UPDATE doctors
  SET verification_status = 'VERIFIED',
      verified_at = now(),
      verified_by = p_admin_id
  WHERE id = p_doctor_id AND verification_status = 'PENDING'
  RETURNING * INTO v_doctor;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Doctor % not in PENDING state', p_doctor_id;
  END IF;

  -- Ensure DOCTOR capability is active
  INSERT INTO capabilities (user_id, capability, status)
  VALUES (v_doctor.user_id, 'DOCTOR', 'ACTIVE')
  ON CONFLICT (user_id, capability)
  DO UPDATE SET status = 'ACTIVE';

  PERFORM emit_event(
    'doctor.verified', 'DOCTOR', p_doctor_id,
    jsonb_build_object('user_id', v_doctor.user_id, 'license_id', v_doctor.license_id),
    p_admin_id,
    'doctor.verified:' || p_doctor_id
  );

  RETURN v_doctor;
END;
$$ LANGUAGE plpgsql;
