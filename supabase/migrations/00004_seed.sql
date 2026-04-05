-- ============================================================
-- Vita Santé Club — Seed Data
-- Plans + demo users for development
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- PLANS
-- ────────────────────────────────────────────────────────────

INSERT INTO plans (slug, name_en, name_fr, name_ht, tier, yearly_price_cents, dependent_fee_cents, visits_per_year, copay_min_cents, copay_max_cents, haiti_labs_pct, haiti_pharmacy_pct, haiti_surgery_pct, haiti_hospitalization_pct, us_labs_pct, us_surgery_pct, has_us_network, at_home_eligible, at_home_included) VALUES
('essential',      'Essential',       'Essentiel',       'Esansyèl',      'CORE',  9900,   5500,  6,  100, 1000, 15, 15, 0,  0,  0,  0,  false, false, false),
('advantage',      'Advantage',       'Avantage',        'Avantaj',        'CORE',  13500,  5500,  8,  100, 1000, 20, 20, 0,  0,  0,  0,  false, false, false),
('premium',        'Premium',         'Premium',         'Premyòm',        'CORE',  20000,  5500,  12, 100, 1000, 35, 35, 0,  0,  0,  0,  false, false, false),
('elite',          'Elite',           'Élite',           'Elit',           'ELITE', 36500,  9500,  24, 100, 1000, 70, 70, 70, 70, 0,  0,  false, false, false),
('elite_plus',     'Elite Plus',      'Élite Plus',      'Elit Plis',      'ELITE', 70000,  12000, 50, 100, 1000, 85, 85, 85, 85, 0,  0,  false, false, false),
('elite_silver',   'Elite Silver',    'Élite Argent',    'Elit Ajan',      'ELITE', 150000, 12000, 99, 100, 1000, 95, 95, 95, 95, 0,  0,  false, true,  false),
('elite_gold',     'Elite Gold',      'Élite Or',        'Elit Lò',        'ELITE', 300000, 0,     99, 5000, 5000, 95, 95, 95, 95, 25, 10, true,  true,  false),
('elite_platinum', 'Elite Platinum',  'Élite Platine',   'Elit Platinòm',  'ELITE', 500000, 0,     99, 5000, 5000, 95, 95, 95, 95, 45, 30, true,  true,  true);

-- ────────────────────────────────────────────────────────────
-- DEMO USERS
-- ────────────────────────────────────────────────────────────

-- Admin
INSERT INTO users (id, email, name, phone, password_hash, locale)
VALUES ('a0000000-0000-0000-0000-000000000001', 'admin@vitasante.ht', 'Admin Vita Santé', '+509 0000 0001', 'dev-password', 'fr');

INSERT INTO capabilities (user_id, capability, status)
VALUES ('a0000000-0000-0000-0000-000000000001', 'ADMIN', 'ACTIVE');

-- Self-paying member in Haiti (PAYER + BENEFICIARY)
INSERT INTO users (id, email, name, phone, password_hash, locale, is_diaspora)
VALUES ('a0000000-0000-0000-0000-000000000002', 'jean@member.ht', 'Jean-Pierre Valcourt', '+509 3456 7890', 'dev-password', 'fr', false);

INSERT INTO capabilities (user_id, capability, status) VALUES
('a0000000-0000-0000-0000-000000000002', 'PAYER', 'ACTIVE'),
('a0000000-0000-0000-0000-000000000002', 'BENEFICIARY', 'ACTIVE');

-- Diaspora payer in Miami (PAYER only — not a beneficiary)
INSERT INTO users (id, email, name, phone, password_hash, locale, is_diaspora)
VALUES ('a0000000-0000-0000-0000-000000000003', 'marie@diaspora.us', 'Marie Valcourt-Dupont', '+1 305 555 1234', 'dev-password', 'fr', true);

INSERT INTO capabilities (user_id, capability, status)
VALUES ('a0000000-0000-0000-0000-000000000003', 'PAYER', 'ACTIVE');

-- Beneficiary in Haiti (funded by diaspora payer — BENEFICIARY only)
INSERT INTO users (id, email, name, phone, password_hash, locale)
VALUES ('a0000000-0000-0000-0000-000000000004', 'sarah@haiti.ht', 'Sarah Valcourt', '+509 4567 8901', 'dev-password', 'fr');

INSERT INTO capabilities (user_id, capability, status)
VALUES ('a0000000-0000-0000-0000-000000000004', 'BENEFICIARY', 'ACTIVE');

-- Dependent child (funded by diaspora payer)
INSERT INTO users (id, email, name, phone, password_hash, locale)
VALUES ('a0000000-0000-0000-0000-000000000005', 'leo@haiti.ht', 'Leo Valcourt', NULL, 'dev-password', 'fr');

INSERT INTO capabilities (user_id, capability, status)
VALUES ('a0000000-0000-0000-0000-000000000005', 'BENEFICIARY', 'ACTIVE');

-- Doctor
INSERT INTO users (id, email, name, phone, password_hash, locale)
VALUES ('a0000000-0000-0000-0000-000000000006', 'doctor@vitasante.ht', 'Dr. Jean-Baptiste Celestin', '+509 5678 9012', 'dev-password', 'fr');

INSERT INTO capabilities (user_id, capability, status)
VALUES ('a0000000-0000-0000-0000-000000000006', 'DOCTOR', 'ACTIVE');

INSERT INTO doctors (user_id, license_id, specialty, clinic_name, clinic_address, region, verification_status, verified_at, verified_by)
VALUES ('a0000000-0000-0000-0000-000000000006', 'HT-8829-MED-2024', 'Interventional Cardiology', 'Centre de Santé', 'Rue Capois, Pétion-Ville', 'Ouest', 'VERIFIED', now(), 'a0000000-0000-0000-0000-000000000001');

-- Affiliate
INSERT INTO users (id, email, name, phone, password_hash, locale)
VALUES ('a0000000-0000-0000-0000-000000000007', 'affiliate@vitasante.ht', 'Marie-Claire Dupont', '+509 6789 0123', 'dev-password', 'fr');

INSERT INTO capabilities (user_id, capability, status)
VALUES ('a0000000-0000-0000-0000-000000000007', 'AFFILIATE', 'ACTIVE');

INSERT INTO affiliates (user_id, partner_code, tier, total_earned_cents, pending_cents)
VALUES ('a0000000-0000-0000-0000-000000000007', 'VITA-MARIE', 'ELITE', 3284000, 429050);

-- Sponsor (institutional payer)
INSERT INTO users (id, email, name, phone, password_hash, locale)
VALUES ('a0000000-0000-0000-0000-000000000008', 'sponsor@vitasante.ht', 'Fondation Haïti Santé', '+509 7890 1234', 'dev-password', 'fr');

INSERT INTO capabilities (user_id, capability, status)
VALUES ('a0000000-0000-0000-0000-000000000008', 'PAYER', 'ACTIVE');

-- ────────────────────────────────────────────────────────────
-- DEMO SUBSCRIPTIONS & ENROLLMENTS
-- ────────────────────────────────────────────────────────────

-- Jean-Pierre's self-subscription (Premium plan)
INSERT INTO subscriptions (id, payer_id, status, current_period_start, current_period_end)
VALUES ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'ACTIVE', '2024-01-01', '2025-01-01');

INSERT INTO enrollment (id, subscription_id, beneficiary_id, plan_id, status, member_id_code, enrolled_at, activated_at)
SELECT 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', id, 'ACTIVE', 'VSC-88291-HT', '2024-01-01', '2024-01-02'
FROM plans WHERE slug = 'premium';

INSERT INTO credit_accounts (enrollment_id, period_year, visits_total, visits_remaining)
VALUES ('c0000000-0000-0000-0000-000000000001', 2024, 12, 9);

-- Marie's diaspora subscription (funds Sarah + Leo in Haiti)
INSERT INTO subscriptions (id, payer_id, status, current_period_start, current_period_end)
VALUES ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003', 'ACTIVE', '2024-06-01', '2025-06-01');

-- Sarah on Advantage plan
INSERT INTO enrollment (id, subscription_id, beneficiary_id, plan_id, status, member_id_code, enrolled_at, activated_at)
SELECT 'c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004', id, 'ACTIVE', 'VSC-10001-HT', '2024-06-01', '2024-06-02'
FROM plans WHERE slug = 'advantage';

INSERT INTO credit_accounts (enrollment_id, period_year, visits_total, visits_remaining)
VALUES ('c0000000-0000-0000-0000-000000000002', 2024, 8, 6);

-- Leo on Essential plan
INSERT INTO enrollment (id, subscription_id, beneficiary_id, plan_id, status, member_id_code, enrolled_at, activated_at)
SELECT 'c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000005', id, 'ACTIVE', 'VSC-10002-HT', '2024-06-01', '2024-06-02'
FROM plans WHERE slug = 'essential';

INSERT INTO credit_accounts (enrollment_id, period_year, visits_total, visits_remaining)
VALUES ('c0000000-0000-0000-0000-000000000003', 2024, 6, 5);

-- ────────────────────────────────────────────────────────────
-- DEMO VISITS (3 completed visits for Jean-Pierre)
-- ────────────────────────────────────────────────────────────

INSERT INTO visits (id, enrollment_id, doctor_id, status, visit_type, network, copay_amount_cents, notes, visited_at, completed_at, idempotency_key)
SELECT
  'v0000000-0000-0000-0000-00000000000' || n,
  'c0000000-0000-0000-0000-000000000001',
  d.id,
  'COMPLETED',
  CASE n WHEN 1 THEN 'GENERALIST' WHEN 2 THEN 'TELEVISIT' ELSE 'SPECIALIST' END :: visit_type,
  'HAITI',
  500,
  CASE n WHEN 1 THEN 'Routine check-up, all vitals normal' WHEN 2 THEN 'Follow-up consultation via video' ELSE 'Cardiac assessment, recommended follow-up' END,
  now() - (n * interval '10 days'),
  now() - (n * interval '10 days') + interval '30 minutes',
  'demo-visit-' || n
FROM doctors d, generate_series(1, 3) n
WHERE d.license_id = 'HT-8829-MED-2024';
