// ============================================================
// Vita Santé Club — Database Types
// Mirror of the PostgreSQL schema for TypeScript
// ============================================================

// ── Enums ──────────────────────────────────────────────────

export type CapabilityType = "PAYER" | "BENEFICIARY" | "DOCTOR" | "AFFILIATE" | "ADMIN";
export type CapabilityStatus = "ACTIVE" | "SUSPENDED" | "REVOKED";

export type PlanTier = "CORE" | "ELITE";

export type SubscriptionStatus = "CREATED" | "ACTIVE" | "GRACE_PERIOD" | "SUSPENDED" | "EXPIRED" | "CANCELLED";

export type EnrollmentStatus =
  | "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED"
  | "ACTIVE" | "SUSPENDED" | "EXPIRED" | "REJECTED";

export type DoctorVerificationStatus = "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED";

export type VisitStatus = "INITIATED" | "VERIFIED" | "CONFIRMED" | "COMPLETED" | "NOT_ELIGIBLE" | "CANCELLED";
export type VisitType = "GENERALIST" | "SPECIALIST" | "TELEVISIT" | "HOME_VISIT";
export type VisitNetwork = "HAITI" | "US";

export type CreditReason = "VISIT_DEDUCTION" | "YEARLY_RESET" | "ADMIN_ADJUSTMENT" | "REVERSAL";

export type InvoiceStatus = "DRAFT" | "ISSUED" | "PAID" | "OVERDUE" | "FAILED" | "REFUNDED";

export type ReferralStatus = "PENDING" | "ACTIVE" | "EXPIRED" | "COMMISSION_PAID";
export type AffiliateTier = "STANDARD" | "ELITE" | "DIAMOND";

export type EventAggregate = "ENROLLMENT" | "VISIT" | "SUBSCRIPTION" | "DOCTOR" | "AFFILIATE";

// ── Table Row Types ────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  password_hash: string | null;
  locale: "fr" | "en";
  is_diaspora: boolean;
  created_at: string;
  updated_at: string;
}

export interface Capability {
  id: string;
  user_id: string;
  capability: CapabilityType;
  status: CapabilityStatus;
  created_at: string;
}

export interface Plan {
  id: string;
  slug: string;
  name_en: string;
  name_fr: string;
  name_ht: string;
  tier: PlanTier;
  yearly_price_cents: number;
  dependent_fee_cents: number;
  visits_per_year: number;
  copay_min_cents: number;
  copay_max_cents: number;
  haiti_labs_pct: number;
  haiti_pharmacy_pct: number;
  haiti_surgery_pct: number;
  haiti_hospitalization_pct: number;
  us_labs_pct: number;
  us_surgery_pct: number;
  has_us_network: boolean;
  at_home_eligible: boolean;
  at_home_included: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  payer_id: string;
  status: SubscriptionStatus;
  grace_period_ends_at: string | null;
  current_period_start: string;
  current_period_end: string;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  subscription_id: string;
  beneficiary_id: string;
  plan_id: string;
  status: EnrollmentStatus;
  member_id_code: string | null;
  enrolled_at: string | null;
  activated_at: string | null;
  suspended_at: string | null;
  expires_at: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export interface CreditAccount {
  id: string;
  enrollment_id: string;
  period_year: number;
  visits_total: number;
  visits_remaining: number;
  created_at: string;
}

export interface CreditTransaction {
  id: string;
  credit_account_id: string;
  visit_id: string | null;
  delta: number;
  balance_after: number;
  reason: CreditReason;
  idempotency_key: string;
  created_at: string;
}

export interface Doctor {
  id: string;
  user_id: string;
  license_id: string;
  specialty: string;
  clinic_name: string | null;
  clinic_address: string | null;
  region: string | null;
  verification_status: DoctorVerificationStatus;
  verified_at: string | null;
  verified_by: string | null;
  created_at: string;
}

export interface Visit {
  id: string;
  enrollment_id: string;
  doctor_id: string;
  status: VisitStatus;
  visit_type: VisitType;
  network: VisitNetwork;
  copay_amount_cents: number | null;
  notes: string | null;
  visited_at: string;
  completed_at: string | null;
  credit_transaction_id: string | null;
  idempotency_key: string;
  created_at: string;
}

export interface Affiliate {
  id: string;
  user_id: string;
  partner_code: string;
  tier: AffiliateTier;
  tier_threshold_cents: number;
  total_earned_cents: number;
  pending_cents: number;
  status: CapabilityStatus;
  created_at: string;
}

export interface Referral {
  id: string;
  affiliate_id: string;
  enrollment_id: string;
  status: ReferralStatus;
  commission_cents: number;
  commission_rate_pct: number;
  activated_at: string | null;
  paid_at: string | null;
  idempotency_key: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  subscription_id: string;
  invoice_number: string;
  status: InvoiceStatus;
  total_cents: number;
  currency: string;
  due_date: string;
  paid_at: string | null;
  stripe_invoice_id: string | null;
  idempotency_key: string;
  created_at: string;
}

export interface InvoiceLine {
  id: string;
  invoice_id: string;
  enrollment_id: string;
  description: string;
  amount_cents: number;
  created_at: string;
}

export interface Event {
  id: string;
  event_type: string;
  aggregate_type: EventAggregate;
  aggregate_id: string;
  payload: Record<string, unknown>;
  actor_id: string | null;
  idempotency_key: string;
  processed_at: string | null;
  created_at: string;
}
