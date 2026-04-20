-- ============================================================
-- Vita Santé Club — Rich Demo Data
-- Populates seed accounts with referrals, sponsor grants, doctor
-- applications, notifications, and extra visits so every role's
-- portal looks alive when showing clients.
--
-- Idempotent. Uses ON CONFLICT / IF NOT EXISTS / NOT EXISTS guards.
-- Safe to re-run. Apply AFTER 00004_seed.sql and 00005_notifications.sql.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- Extra users: enrollment pending admin review + a doctor applicant
-- ────────────────────────────────────────────────────────────

-- Pending-enrollment user (admin will see them in /admin/members queue)
INSERT INTO users (id, email, name, phone, password_hash, locale, is_diaspora)
VALUES (
  'a0000000-0000-0000-0000-000000000010',
  'pierre@diaspora.us',
  'Pierre Dorcé',
  '+1 514 555 2020',
  '$2b$12$/7bQG5xILe191Qa4uGTiK.p5Wf5Y5PqGgL6DW2l00DCWzv98u08ES',
  'fr',
  true
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO capabilities (user_id, capability, status)
VALUES ('a0000000-0000-0000-0000-000000000010', 'PAYER', 'ACTIVE')
ON CONFLICT (user_id, capability) DO NOTHING;

-- His mother in Haiti, who he's trying to enroll
INSERT INTO users (id, email, name, phone, password_hash, locale)
VALUES (
  'a0000000-0000-0000-0000-000000000011',
  'rose.dorce@haiti.ht',
  'Rose Dorcé',
  '+509 4444 5555',
  '$2b$12$/7bQG5xILe191Qa4uGTiK.p5Wf5Y5PqGgL6DW2l00DCWzv98u08ES',
  'fr'
)
ON CONFLICT (id) DO NOTHING;

-- Pending subscription for Pierre's enrollment attempt
INSERT INTO subscriptions (id, payer_id, status, current_period_start, current_period_end)
VALUES (
  'b0000000-0000-0000-0000-000000000010',
  'a0000000-0000-0000-0000-000000000010',
  'ACTIVE',
  now(),
  now() + interval '1 year'
)
ON CONFLICT (id) DO NOTHING;

-- Pending enrollment waiting for admin approval
INSERT INTO enrollment (id, subscription_id, beneficiary_id, plan_id, status, enrolled_at)
SELECT
  'c0000000-0000-0000-0000-000000000010',
  'b0000000-0000-0000-0000-000000000010',
  'a0000000-0000-0000-0000-000000000011',
  id,
  'UNDER_REVIEW',
  now() - interval '2 days'
FROM plans WHERE slug = 'advantage'
  AND NOT EXISTS (SELECT 1 FROM enrollment WHERE id = 'c0000000-0000-0000-0000-000000000010');

-- ────────────────────────────────────────────────────────────
-- Doctor applications: 2 pending, ready for admin review
-- ────────────────────────────────────────────────────────────

INSERT INTO doctor_applications (
  id, full_name, email, phone, license_id, specialty,
  clinic_name, clinic_address, region, years_experience, notes, status, created_at
)
VALUES (
  'e0000000-0000-0000-0000-000000000001',
  'Dr. Marie Delva',
  'marie.delva@example.ht',
  '+509 3333 4444',
  'HT-9912-MED-2024',
  'Pédiatrie',
  'Clinique Sainte-Rose',
  'Rue Pavée, Pétion-Ville',
  'Ouest',
  12,
  'Spécialisée en pédiatrie néonatale. 8 ans dans le système public avant de rejoindre le privé.',
  'PENDING',
  now() - interval '1 day'
),
(
  'e0000000-0000-0000-0000-000000000002',
  'Dr. Jacques Petit-Frère',
  'jacques.pf@example.ht',
  '+509 2222 6677',
  'HT-7745-MED-2023',
  'Médecine générale',
  'Cabinet Médical Delmas',
  '62 Route de Delmas',
  'Ouest',
  6,
  'Formé à la Faculté de Médecine UEH. Cherche à rejoindre le réseau Vita Santé pour servir la Diaspora.',
  'PENDING',
  now() - interval '3 hours'
)
ON CONFLICT (id) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- Sponsor grants: Fondation Haïti Santé funds 50 seats
-- ────────────────────────────────────────────────────────────

-- A funded grant with seats available to claim
INSERT INTO sponsor_grants (
  id, sponsor_user_id, plan_id, seats_total, seats_claimed, status, notes, created_at
)
SELECT
  'f0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000008',
  id,
  50,
  2,
  'FUNDED',
  'Campagne 2026 — soutien aux familles de Jacmel',
  now() - interval '10 days'
FROM plans WHERE slug = 'advantage'
  AND NOT EXISTS (SELECT 1 FROM sponsor_grants WHERE id = 'f0000000-0000-0000-0000-000000000001');

-- Link Sarah's enrollment to the grant (Marie's beneficiary — yes, overlap is fine for demo)
INSERT INTO sponsor_grant_enrollments (grant_id, enrollment_id)
VALUES (
  'f0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000002'
)
ON CONFLICT (enrollment_id) DO NOTHING;

-- Link Leo's enrollment to the grant
INSERT INTO sponsor_grant_enrollments (grant_id, enrollment_id)
VALUES (
  'f0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000003'
)
ON CONFLICT (enrollment_id) DO NOTHING;

-- A second grant, fully claimed, to show history
INSERT INTO sponsor_grants (
  id, sponsor_user_id, plan_id, seats_total, seats_claimed, status, notes, created_at
)
SELECT
  'f0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000008',
  id,
  10,
  10,
  'FULFILLED',
  'Campagne 2024 — Les Cayes',
  now() - interval '8 months'
FROM plans WHERE slug = 'essential'
  AND NOT EXISTS (SELECT 1 FROM sponsor_grants WHERE id = 'f0000000-0000-0000-0000-000000000002');

-- ────────────────────────────────────────────────────────────
-- Referral attribution for affiliate demo
-- ────────────────────────────────────────────────────────────

-- Marie-Claire Dupont (affiliate) parrained Jean-Pierre
INSERT INTO referrals (
  affiliate_id, enrollment_id, status, commission_cents, commission_rate_pct,
  activated_at, idempotency_key, created_at
)
SELECT
  a.id,
  'c0000000-0000-0000-0000-000000000001',
  'ACTIVE',
  3000, -- 15% of $200 Premium plan
  15,
  now() - interval '60 days',
  'demo-referral-jean',
  now() - interval '60 days'
FROM affiliates a
WHERE a.partner_code = 'VITA-MARIE'
  AND NOT EXISTS (SELECT 1 FROM referrals WHERE idempotency_key = 'demo-referral-jean');

-- She also referred Marie (Diaspora payer)
INSERT INTO referrals (
  affiliate_id, enrollment_id, status, commission_cents, commission_rate_pct,
  activated_at, idempotency_key, created_at
)
SELECT
  a.id,
  'c0000000-0000-0000-0000-000000000002',
  'ACTIVE',
  2025,
  15,
  now() - interval '45 days',
  'demo-referral-sarah',
  now() - interval '45 days'
FROM affiliates a
WHERE a.partner_code = 'VITA-MARIE'
  AND NOT EXISTS (SELECT 1 FROM referrals WHERE idempotency_key = 'demo-referral-sarah');

-- Pending referral (to show the full lifecycle)
INSERT INTO referrals (
  affiliate_id, enrollment_id, status, commission_rate_pct,
  idempotency_key, created_at
)
SELECT
  a.id,
  'c0000000-0000-0000-0000-000000000010',
  'PENDING',
  15,
  'demo-referral-pierre',
  now() - interval '2 days'
FROM affiliates a
WHERE a.partner_code = 'VITA-MARIE'
  AND NOT EXISTS (SELECT 1 FROM referrals WHERE idempotency_key = 'demo-referral-pierre');

-- ────────────────────────────────────────────────────────────
-- More visits for Jean-Pierre (make the visit history feel real)
-- ────────────────────────────────────────────────────────────

INSERT INTO visits (
  id, enrollment_id, doctor_id, status, visit_type, network,
  copay_amount_cents, notes, visited_at, completed_at, idempotency_key
)
SELECT
  ('d0000000-0000-0000-0000-00000000001' || n)::uuid,
  'c0000000-0000-0000-0000-000000000001'::uuid,
  d.id,
  'COMPLETED',
  (ARRAY['GENERALIST','TELEVISIT','SPECIALIST','GENERALIST']::visit_type[])[n],
  'HAITI',
  CASE n WHEN 1 THEN 500 WHEN 2 THEN 300 ELSE 1000 END,
  (ARRAY[
    'Contrôle annuel — tension artérielle dans la norme.',
    'Télévisite — suivi post-opératoire, plaie bien cicatrisée.',
    'Consultation cardio — recommandation échographie à 3 mois.',
    'Dépistage diabète — glycémie normale, suivi dans 6 mois.'
  ])[n],
  now() - (n * interval '45 days'),
  now() - (n * interval '45 days') + interval '25 minutes',
  'demo-visit-extra-' || n
FROM doctors d, generate_series(1, 4) n
WHERE d.license_id = 'HT-8829-MED-2024'
  AND NOT EXISTS (SELECT 1 FROM visits WHERE id = ('d0000000-0000-0000-0000-00000000001' || n)::uuid);

-- Add visits for Sarah too (so the Diaspora payer's dashboard shows action)
INSERT INTO visits (
  id, enrollment_id, doctor_id, status, visit_type, network,
  copay_amount_cents, notes, visited_at, completed_at, idempotency_key
)
SELECT
  ('d0000000-0000-0000-0000-00000000002' || n)::uuid,
  'c0000000-0000-0000-0000-000000000002'::uuid,
  d.id,
  'COMPLETED',
  (ARRAY['GENERALIST','TELEVISIT']::visit_type[])[n],
  'HAITI',
  500,
  (ARRAY[
    'Consultation générale — bon état de santé général.',
    'Télévisite — consultation rapide pour renouvellement ordonnance.'
  ])[n],
  now() - (n * interval '30 days'),
  now() - (n * interval '30 days') + interval '20 minutes',
  'demo-visit-sarah-' || n
FROM doctors d, generate_series(1, 2) n
WHERE d.license_id = 'HT-8829-MED-2024'
  AND NOT EXISTS (SELECT 1 FROM visits WHERE id = ('d0000000-0000-0000-0000-00000000002' || n)::uuid);

-- ────────────────────────────────────────────────────────────
-- Notifications (unread, per role, so each portal shows activity)
-- ────────────────────────────────────────────────────────────

-- Admin gets pending-review notifications
INSERT INTO notifications (user_id, channel, priority, subject, body, link_url, idempotency_key, created_at)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'IN_APP', 'HIGH',
   'Nouvelle inscription en attente',
   'Rose Dorcé (parrainée par Pierre Dorcé) attend votre revue pour le forfait Avantage.',
   '/admin/members', 'demo-notif-admin-1', now() - interval '2 days'),
  ('a0000000-0000-0000-0000-000000000001', 'IN_APP', 'HIGH',
   'Candidature médecin: Dr. Marie Delva',
   'Pédiatre à Pétion-Ville — 12 ans d''expérience. À vérifier.',
   '/admin/doctors', 'demo-notif-admin-2', now() - interval '1 day'),
  ('a0000000-0000-0000-0000-000000000001', 'IN_APP', 'NORMAL',
   'Candidature médecin: Dr. Jacques Petit-Frère',
   'Médecine générale à Delmas — 6 ans d''expérience.',
   '/admin/doctors', 'demo-notif-admin-3', now() - interval '3 hours')
ON CONFLICT (idempotency_key) DO NOTHING;

-- Member (Jean-Pierre) notifications
INSERT INTO notifications (user_id, channel, priority, subject, body, link_url, idempotency_key, created_at)
VALUES
  ('a0000000-0000-0000-0000-000000000002', 'IN_APP', 'NORMAL',
   'Visite terminée',
   'Votre consultation cardio est enregistrée. Prochain suivi conseillé dans 3 mois.',
   '/member/medical-card', 'demo-notif-jean-1', now() - interval '45 days'),
  ('a0000000-0000-0000-0000-000000000002', 'IN_APP', 'NORMAL',
   'Renouvellement dans 30 jours',
   'Votre abonnement Vita Santé se renouvelle bientôt. Aucune action requise.',
   '/member/payments', 'demo-notif-jean-2', now() - interval '12 hours')
ON CONFLICT (idempotency_key) DO NOTHING;

-- Diaspora payer (Marie) notifications
INSERT INTO notifications (user_id, channel, priority, subject, body, link_url, idempotency_key, created_at)
VALUES
  ('a0000000-0000-0000-0000-000000000003', 'IN_APP', 'HIGH',
   'Sarah a utilisé 2 visites ce mois-ci',
   'Il lui reste 6 visites sur 8 pour l''année. Tout va bien.',
   '/member/dependents', 'demo-notif-marie-1', now() - interval '5 days'),
  ('a0000000-0000-0000-0000-000000000003', 'IN_APP', 'NORMAL',
   'Rapport mensuel prêt',
   'Consultez l''activité médicale de Sarah et Leo pour le mois dernier.',
   '/member/dashboard', 'demo-notif-marie-2', now() - interval '1 day')
ON CONFLICT (idempotency_key) DO NOTHING;

-- Doctor notifications
INSERT INTO notifications (user_id, channel, priority, subject, body, link_url, idempotency_key, created_at)
VALUES
  ('a0000000-0000-0000-0000-000000000006', 'IN_APP', 'NORMAL',
   'Nouvelle visite clôturée',
   'Vous avez clôturé une consultation avec Jean-Pierre Valcourt. Paiement prévu dans 30 jours.',
   '/doctor/visit-history', 'demo-notif-doctor-1', now() - interval '10 days'),
  ('a0000000-0000-0000-0000-000000000006', 'IN_APP', 'NORMAL',
   'Rappel mensuel',
   'Vous avez complété 6 consultations ce mois-ci. Excellent travail.',
   '/doctor/patient-care', 'demo-notif-doctor-2', now() - interval '1 day')
ON CONFLICT (idempotency_key) DO NOTHING;

-- Affiliate notifications
INSERT INTO notifications (user_id, channel, priority, subject, body, link_url, idempotency_key, created_at)
VALUES
  ('a0000000-0000-0000-0000-000000000007', 'IN_APP', 'HIGH',
   'Commission activée: $30.00',
   'Votre filleul Jean-Pierre Valcourt est maintenant actif. Commission créditée.',
   '/affiliate/commissions', 'demo-notif-aff-1', now() - interval '60 days'),
  ('a0000000-0000-0000-0000-000000000007', 'IN_APP', 'HIGH',
   'Commission activée: $20.25',
   'Sarah Valcourt est désormais active. Commission créditée à votre solde.',
   '/affiliate/commissions', 'demo-notif-aff-2', now() - interval '45 days'),
  ('a0000000-0000-0000-0000-000000000007', 'IN_APP', 'NORMAL',
   'Nouveau parrainage en attente',
   'Pierre Dorcé a utilisé votre lien. Commission créditée quand l''inscription est validée.',
   '/affiliate/referrals', 'demo-notif-aff-3', now() - interval '2 days')
ON CONFLICT (idempotency_key) DO NOTHING;

-- Sponsor notifications
INSERT INTO notifications (user_id, channel, priority, subject, body, link_url, idempotency_key, created_at)
VALUES
  ('a0000000-0000-0000-0000-000000000008', 'IN_APP', 'NORMAL',
   '2 bénéficiaires maintenant actifs',
   'Sarah et Leo Valcourt utilisent maintenant les places que vous avez financées.',
   '/sponsor/funded-members', 'demo-notif-sponsor-1', now() - interval '7 days'),
  ('a0000000-0000-0000-0000-000000000008', 'IN_APP', 'NORMAL',
   'Rapport d''impact Q1 disponible',
   '10 bénéficiaires financés en 2024 — 47 visites médicales couvertes au total.',
   '/sponsor/impact-reports', 'demo-notif-sponsor-2', now() - interval '3 days'),
  ('a0000000-0000-0000-0000-000000000008', 'IN_APP', 'HIGH',
   '48 places disponibles à assigner',
   'Votre campagne 2026 Jacmel a 48 places libres. Assignez-les depuis votre dashboard.',
   '/sponsor/funded-members', 'demo-notif-sponsor-3', now() - interval '1 day')
ON CONFLICT (idempotency_key) DO NOTHING;
