"use server";

import { supabase } from "@/lib/supabase";

// ── Event Handlers ────────────────────────────────────────

type EventHandler = (event: {
  id: string;
  event_type: string;
  aggregate_id: string;
  payload: Record<string, unknown>;
  actor_id: string | null;
}) => Promise<void>;

const handlers: Record<string, EventHandler> = {
  "enrollment.submitted": async (event) => {
    // TODO: Send notification to admins (email/push)
    console.log(`[EVENT] New enrollment submitted: ${event.aggregate_id}`);
  },

  "enrollment.approved": async (event) => {
    // TODO: Send welcome email to beneficiary with member ID
    const { member_id_code, beneficiary_id } = event.payload as {
      member_id_code: string;
      beneficiary_id: string;
    };
    console.log(`[EVENT] Enrollment approved: ${member_id_code} for user ${beneficiary_id}`);
  },

  "enrollment.activated": async (event) => {
    // Check if there's a referral for this enrollment
    const { data: referral } = await supabase
      .from("referrals")
      .select("*, affiliates(*)")
      .eq("enrollment_id", event.aggregate_id)
      .eq("status", "PENDING")
      .single();

    if (referral) {
      // Calculate commission
      const { data: enrollment } = await supabase
        .from("enrollment")
        .select("plans(yearly_price_cents)")
        .eq("id", event.aggregate_id)
        .single();

      if (enrollment?.plans) {
        const plan = enrollment.plans as unknown as { yearly_price_cents: number };
        const commission = Math.floor(
          plan.yearly_price_cents * (referral.commission_rate_pct / 100)
        );

        // Activate referral with commission
        await supabase
          .from("referrals")
          .update({
            status: "ACTIVE",
            commission_cents: commission,
            activated_at: new Date().toISOString(),
          })
          .eq("id", referral.id);

        // Update affiliate pending balance
        await supabase.rpc("update_affiliate_pending", {
          p_affiliate_id: referral.affiliate_id,
          p_amount: commission,
        });

        console.log(`[EVENT] Referral activated: ${commission} cents commission for affiliate ${referral.affiliate_id}`);
      }
    }
  },

  "enrollment.suspended": async (event) => {
    const { beneficiary_id, reason } = event.payload as {
      beneficiary_id: string;
      reason: string;
    };
    // TODO: Send suspension notification
    console.log(`[EVENT] Enrollment suspended for ${beneficiary_id}: ${reason}`);
  },

  "visit.completed": async (event) => {
    const { beneficiary_id, credits_remaining } = event.payload as {
      beneficiary_id: string;
      credits_remaining: number;
    };

    // Notify payer if credits are running low (< 3 remaining)
    if (credits_remaining <= 2) {
      const { data: enrollment } = await supabase
        .from("enrollment")
        .select("subscription_id, subscriptions(payer_id)")
        .eq("beneficiary_id", beneficiary_id)
        .eq("status", "ACTIVE")
        .single();

      if (enrollment) {
        console.log(`[EVENT] Low credits alert: ${credits_remaining} remaining for ${beneficiary_id}`);
        // TODO: Send low-credit notification to payer
      }
    }
  },

  "subscription.grace_started": async (event) => {
    const { payer_id, grace_ends_at } = event.payload as {
      payer_id: string;
      grace_ends_at: string;
    };
    // TODO: Send grace period warning email
    console.log(`[EVENT] Grace period started for payer ${payer_id}, ends ${grace_ends_at}`);
  },

  "subscription.renewed": async (event) => {
    const { payer_id, period_year } = event.payload as {
      payer_id: string;
      period_year: number;
    };
    // TODO: Send renewal confirmation
    console.log(`[EVENT] Subscription renewed for payer ${payer_id}, year ${period_year}`);
  },

  "doctor.verified": async (event) => {
    const { user_id, license_id } = event.payload as {
      user_id: string;
      license_id: string;
    };
    // TODO: Send verification confirmation to doctor
    console.log(`[EVENT] Doctor verified: ${license_id} (user ${user_id})`);
  },
};

// ── Process Unhandled Events ──────────────────────────────

export async function processEvents(batchSize: number = 50) {
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .is("processed_at", null)
    .order("created_at", { ascending: true })
    .limit(batchSize);

  if (error || !events || events.length === 0) {
    return { processed: 0 };
  }

  let processed = 0;

  for (const event of events) {
    const handler = handlers[event.event_type];

    if (handler) {
      try {
        await handler(event);
      } catch (err) {
        console.error(`[EVENT ERROR] Failed to process ${event.event_type}:`, err);
        continue; // Skip this event, try again next cycle
      }
    }

    // Mark as processed
    await supabase
      .from("events")
      .update({ processed_at: new Date().toISOString() })
      .eq("id", event.id);

    processed++;
  }

  return { processed };
}
