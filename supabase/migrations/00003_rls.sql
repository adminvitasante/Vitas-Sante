-- ============================================================
-- Vita Santé Club — Row Level Security Policies
-- Authorization enforced at the database level
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollment ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────────────────────
-- HELPER: Check if current user has a specific capability
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION has_capability(p_capability capability_type)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM capabilities
    WHERE user_id = auth.uid()
      AND capability = p_capability
      AND status = 'ACTIVE'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ────────────────────────────────────────────────────────────
-- USERS
-- ────────────────────────────────────────────────────────────

-- Everyone can read their own row
CREATE POLICY users_select_own ON users
  FOR SELECT USING (id = auth.uid());

-- Admins can read all
CREATE POLICY users_select_admin ON users
  FOR SELECT USING (has_capability('ADMIN'));

-- Users can update their own profile
CREATE POLICY users_update_own ON users
  FOR UPDATE USING (id = auth.uid());

-- Admins can update any user
CREATE POLICY users_update_admin ON users
  FOR UPDATE USING (has_capability('ADMIN'));

-- ────────────────────────────────────────────────────────────
-- CAPABILITIES
-- ────────────────────────────────────────────────────────────

CREATE POLICY capabilities_select_own ON capabilities
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY capabilities_select_admin ON capabilities
  FOR SELECT USING (has_capability('ADMIN'));

-- Only admins can modify capabilities
CREATE POLICY capabilities_all_admin ON capabilities
  FOR ALL USING (has_capability('ADMIN'));

-- ────────────────────────────────────────────────────────────
-- PLANS (read-only for everyone, writable by admin)
-- ────────────────────────────────────────────────────────────

CREATE POLICY plans_select_all ON plans
  FOR SELECT USING (true);

CREATE POLICY plans_modify_admin ON plans
  FOR ALL USING (has_capability('ADMIN'));

-- ────────────────────────────────────────────────────────────
-- SUBSCRIPTIONS
-- ────────────────────────────────────────────────────────────

-- Payer sees their own subscriptions
CREATE POLICY subscriptions_select_payer ON subscriptions
  FOR SELECT USING (payer_id = auth.uid());

-- Admin sees all
CREATE POLICY subscriptions_select_admin ON subscriptions
  FOR SELECT USING (has_capability('ADMIN'));

-- Payer can create subscription
CREATE POLICY subscriptions_insert_payer ON subscriptions
  FOR INSERT WITH CHECK (payer_id = auth.uid() AND has_capability('PAYER'));

-- ────────────────────────────────────────────────────────────
-- ENROLLMENT
-- ────────────────────────────────────────────────────────────

-- Beneficiary sees own enrollment
CREATE POLICY enrollment_select_beneficiary ON enrollment
  FOR SELECT USING (beneficiary_id = auth.uid());

-- Payer sees enrollments on their subscriptions
CREATE POLICY enrollment_select_payer ON enrollment
  FOR SELECT USING (
    subscription_id IN (SELECT id FROM subscriptions WHERE payer_id = auth.uid())
  );

-- Doctor sees enrollment during active visit
CREATE POLICY enrollment_select_doctor ON enrollment
  FOR SELECT USING (
    has_capability('DOCTOR') AND
    id IN (
      SELECT enrollment_id FROM visits
      WHERE doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())
        AND status IN ('INITIATED', 'VERIFIED', 'CONFIRMED', 'COMPLETED')
    )
  );

-- Admin sees all
CREATE POLICY enrollment_select_admin ON enrollment
  FOR SELECT USING (has_capability('ADMIN'));

-- Payer can create enrollment (draft) on their subscription
CREATE POLICY enrollment_insert_payer ON enrollment
  FOR INSERT WITH CHECK (
    subscription_id IN (SELECT id FROM subscriptions WHERE payer_id = auth.uid())
  );

-- ────────────────────────────────────────────────────────────
-- CREDIT ACCOUNTS
-- ────────────────────────────────────────────────────────────

-- Beneficiary sees own credits
CREATE POLICY credits_select_beneficiary ON credit_accounts
  FOR SELECT USING (
    enrollment_id IN (SELECT id FROM enrollment WHERE beneficiary_id = auth.uid())
  );

-- Payer sees their beneficiaries' credits
CREATE POLICY credits_select_payer ON credit_accounts
  FOR SELECT USING (
    enrollment_id IN (
      SELECT e.id FROM enrollment e
      JOIN subscriptions s ON e.subscription_id = s.id
      WHERE s.payer_id = auth.uid()
    )
  );

-- Doctor sees current patient's credits during visit
CREATE POLICY credits_select_doctor ON credit_accounts
  FOR SELECT USING (
    has_capability('DOCTOR') AND
    enrollment_id IN (
      SELECT enrollment_id FROM visits
      WHERE doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())
        AND status IN ('INITIATED', 'VERIFIED', 'CONFIRMED')
    )
  );

-- Admin sees all
CREATE POLICY credits_select_admin ON credit_accounts
  FOR SELECT USING (has_capability('ADMIN'));

-- ────────────────────────────────────────────────────────────
-- CREDIT TRANSACTIONS
-- ────────────────────────────────────────────────────────────

-- Beneficiary sees own ledger
CREATE POLICY credit_tx_select_beneficiary ON credit_transactions
  FOR SELECT USING (
    credit_account_id IN (
      SELECT ca.id FROM credit_accounts ca
      JOIN enrollment e ON ca.enrollment_id = e.id
      WHERE e.beneficiary_id = auth.uid()
    )
  );

-- Payer sees their beneficiaries' ledger
CREATE POLICY credit_tx_select_payer ON credit_transactions
  FOR SELECT USING (
    credit_account_id IN (
      SELECT ca.id FROM credit_accounts ca
      JOIN enrollment e ON ca.enrollment_id = e.id
      JOIN subscriptions s ON e.subscription_id = s.id
      WHERE s.payer_id = auth.uid()
    )
  );

-- Admin sees all
CREATE POLICY credit_tx_select_admin ON credit_transactions
  FOR SELECT USING (has_capability('ADMIN'));

-- ────────────────────────────────────────────────────────────
-- DOCTORS
-- ────────────────────────────────────────────────────────────

-- Everyone can read doctor directory (public network)
CREATE POLICY doctors_select_all ON doctors
  FOR SELECT USING (true);

-- Doctor can update own row
CREATE POLICY doctors_update_own ON doctors
  FOR UPDATE USING (user_id = auth.uid());

-- Admin can modify all
CREATE POLICY doctors_all_admin ON doctors
  FOR ALL USING (has_capability('ADMIN'));

-- ────────────────────────────────────────────────────────────
-- VISITS
-- ────────────────────────────────────────────────────────────

-- Beneficiary sees own visits
CREATE POLICY visits_select_beneficiary ON visits
  FOR SELECT USING (
    enrollment_id IN (SELECT id FROM enrollment WHERE beneficiary_id = auth.uid())
  );

-- Payer sees their beneficiaries' visits
CREATE POLICY visits_select_payer ON visits
  FOR SELECT USING (
    enrollment_id IN (
      SELECT e.id FROM enrollment e
      JOIN subscriptions s ON e.subscription_id = s.id
      WHERE s.payer_id = auth.uid()
    )
  );

-- Doctor sees visits they recorded
CREATE POLICY visits_select_doctor ON visits
  FOR SELECT USING (
    doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())
  );

-- Admin sees all
CREATE POLICY visits_select_admin ON visits
  FOR SELECT USING (has_capability('ADMIN'));

-- ────────────────────────────────────────────────────────────
-- AFFILIATES
-- ────────────────────────────────────────────────────────────

CREATE POLICY affiliates_select_own ON affiliates
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY affiliates_select_admin ON affiliates
  FOR SELECT USING (has_capability('ADMIN'));

CREATE POLICY affiliates_update_own ON affiliates
  FOR UPDATE USING (user_id = auth.uid());

-- ────────────────────────────────────────────────────────────
-- REFERRALS
-- ────────────────────────────────────────────────────────────

CREATE POLICY referrals_select_affiliate ON referrals
  FOR SELECT USING (
    affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid())
  );

CREATE POLICY referrals_select_admin ON referrals
  FOR SELECT USING (has_capability('ADMIN'));

-- ────────────────────────────────────────────────────────────
-- INVOICES & LINES
-- ────────────────────────────────────────────────────────────

CREATE POLICY invoices_select_payer ON invoices
  FOR SELECT USING (
    subscription_id IN (SELECT id FROM subscriptions WHERE payer_id = auth.uid())
  );

CREATE POLICY invoices_select_admin ON invoices
  FOR SELECT USING (has_capability('ADMIN'));

CREATE POLICY invoice_lines_select_payer ON invoice_lines
  FOR SELECT USING (
    invoice_id IN (
      SELECT i.id FROM invoices i
      JOIN subscriptions s ON i.subscription_id = s.id
      WHERE s.payer_id = auth.uid()
    )
  );

CREATE POLICY invoice_lines_select_admin ON invoice_lines
  FOR SELECT USING (has_capability('ADMIN'));

-- ────────────────────────────────────────────────────────────
-- EVENTS (admin only)
-- ────────────────────────────────────────────────────────────

CREATE POLICY events_select_admin ON events
  FOR SELECT USING (has_capability('ADMIN'));
