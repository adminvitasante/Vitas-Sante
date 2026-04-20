"use server";

import { supabase } from "@/lib/supabase";

// Event-driven side effects. Handlers run idempotently (idempotency_key on
// the notifications table prevents double-sending). Each handler is
// isolated — one failure must not block processing the next event.

type DbEvent = {
  id: string;
  event_type: string;
  aggregate_id: string;
  payload: Record<string, unknown>;
  actor_id: string | null;
};

type EventHandler = (event: DbEvent) => Promise<void>;

// Helper: insert a notification row, idempotent on (event_id + user_id + kind).
async function notify(params: {
  eventId: string;
  userId: string;
  kind: string;
  channel?: "IN_APP" | "EMAIL" | "SMS";
  priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  subject: string;
  body: string;
  linkUrl?: string;
  metadata?: Record<string, unknown>;
}) {
  await supabase.from("notifications").insert({
    user_id: params.userId,
    channel: params.channel ?? "IN_APP",
    priority: params.priority ?? "NORMAL",
    subject: params.subject,
    body: params.body,
    link_url: params.linkUrl ?? null,
    metadata: params.metadata ?? {},
    event_id: params.eventId,
    idempotency_key: `${params.eventId}:${params.userId}:${params.kind}`,
  });
}

const handlers: Record<string, EventHandler> = {
  // Enrollment submitted → tell every admin.
  "enrollment.submitted": async (event) => {
    const { data: admins } = await supabase
      .from("capabilities")
      .select("user_id")
      .eq("capability", "ADMIN")
      .eq("status", "ACTIVE");

    for (const a of admins ?? []) {
      await notify({
        eventId: event.id,
        userId: a.user_id,
        kind: "admin_review",
        priority: "HIGH",
        subject: "Nouvelle inscription en attente de validation",
        body: "Une nouvelle inscription vient d'être soumise et attend votre revue.",
        linkUrl: "/admin/members",
        metadata: { enrollment_id: event.aggregate_id },
      });
    }
  },

  // Enrollment approved → welcome the beneficiary with their member ID.
  "enrollment.approved": async (event) => {
    const payload = event.payload as {
      beneficiary_id: string;
      member_id_code: string;
      plan_slug: string;
    };
    await notify({
      eventId: event.id,
      userId: payload.beneficiary_id,
      kind: "welcome",
      channel: "EMAIL",
      priority: "HIGH",
      subject: `Bienvenue chez Vita Santé — ${payload.member_id_code}`,
      body: `Votre adhésion est active. Votre carte membre numérique est disponible dans votre espace.`,
      linkUrl: "/member/medical-card",
      metadata: payload,
    });
  },

  // Enrollment activated → if a referral exists, activate it + compute + credit
  // the commission, then notify the affiliate.
  "enrollment.activated": async (event) => {
    const { data: referral } = await supabase
      .from("referrals")
      .select("*, affiliates(id, user_id)")
      .eq("enrollment_id", event.aggregate_id)
      .eq("status", "PENDING")
      .maybeSingle();

    if (referral) {
      const aff = referral.affiliates as unknown as { id: string; user_id: string };

      // Compute commission from the enrollment's plan price.
      const { data: enrollment } = await supabase
        .from("enrollment")
        .select("plans(yearly_price_cents)")
        .eq("id", event.aggregate_id)
        .single();

      const plan = enrollment?.plans as unknown as { yearly_price_cents: number } | undefined;
      const priceCents = plan?.yearly_price_cents ?? 0;
      const commissionCents = Math.floor(priceCents * (referral.commission_rate_pct / 100));

      // Flip referral to ACTIVE with commission computed.
      await supabase
        .from("referrals")
        .update({
          status: "ACTIVE",
          commission_cents: commissionCents,
          activated_at: new Date().toISOString(),
        })
        .eq("id", referral.id);

      // Bump affiliate's pending balance + total earned.
      await supabase.rpc("update_affiliate_pending", {
        p_affiliate_id: aff.id,
        p_amount: commissionCents,
      }).then(async (res) => {
        // If RPC doesn't exist, fall back to direct update.
        if (res.error) {
          await supabase
            .from("affiliates")
            .update({
              pending_cents: (await getAffiliatePending(aff.id)) + commissionCents,
              total_earned_cents: (await getAffiliateEarned(aff.id)) + commissionCents,
            })
            .eq("id", aff.id);
        }
      });

      await notify({
        eventId: event.id,
        userId: aff.user_id,
        kind: "commission_earned",
        channel: "EMAIL",
        priority: "HIGH",
        subject: "Commission de parrainage activée",
        body: `Une inscription que vous avez parrainée est maintenant active. Votre commission de ${(commissionCents / 100).toFixed(2)} USD a été créditée à votre solde en attente.`,
        linkUrl: "/affiliate/commissions",
        metadata: { referral_id: referral.id, commission_cents: commissionCents },
      });
    }

    // Also ping any sponsor funding this enrollment.
    const { data: grantLink } = await supabase
      .from("sponsor_grant_enrollments")
      .select("grant_id, sponsor_grants!inner(sponsor_user_id)")
      .eq("enrollment_id", event.aggregate_id)
      .maybeSingle();

    if (grantLink) {
      const grant = grantLink.sponsor_grants as unknown as { sponsor_user_id: string };
      await notify({
        eventId: event.id,
        userId: grant.sponsor_user_id,
        kind: "sponsored_active",
        subject: "Un bénéficiaire que vous avez financé est maintenant actif",
        body: `L'inscription financée par votre don est maintenant active.`,
        linkUrl: "/sponsor/funded-members",
        metadata: { enrollment_id: event.aggregate_id },
      });
    }
  },

  "enrollment.rejected": async (event) => {
    const { data: enrollment } = await supabase
      .from("enrollment")
      .select("beneficiary_id, subscriptions!inner(payer_id)")
      .eq("id", event.aggregate_id)
      .single();

    if (!enrollment) return;

    const sub = enrollment.subscriptions as unknown as { payer_id: string };
    const reason = (event.payload as { reason?: string }).reason ?? "Non spécifiée";

    await notify({
      eventId: event.id,
      userId: sub.payer_id,
      kind: "rejected",
      channel: "EMAIL",
      priority: "HIGH",
      subject: "Votre inscription n'a pas été approuvée",
      body: `Votre inscription a été refusée. Raison: ${reason}. Vous pouvez corriger et resoumettre.`,
      linkUrl: "/member/support",
      metadata: event.payload,
    });
  },

  "enrollment.suspended": async (event) => {
    const payload = event.payload as { beneficiary_id: string; reason: string };

    // Notify beneficiary.
    await notify({
      eventId: event.id,
      userId: payload.beneficiary_id,
      kind: "suspended_beneficiary",
      channel: "EMAIL",
      priority: "URGENT",
      subject: "Votre adhésion est suspendue",
      body: `Votre couverture a été suspendue. Motif: ${payload.reason}. Contactez votre payeur.`,
      linkUrl: "/member/support",
      metadata: payload,
    });

    // Notify payer.
    const { data: enrollment } = await supabase
      .from("enrollment")
      .select("subscriptions!inner(payer_id)")
      .eq("id", event.aggregate_id)
      .single();

    if (enrollment) {
      const sub = enrollment.subscriptions as unknown as { payer_id: string };
      await notify({
        eventId: event.id,
        userId: sub.payer_id,
        kind: "suspended_payer",
        channel: "EMAIL",
        priority: "URGENT",
        subject: "Une adhésion que vous payez est suspendue",
        body: `Action requise. Régularisez le paiement pour réactiver la couverture.`,
        linkUrl: "/member/payments",
        metadata: payload,
      });
    }
  },

  "visit.completed": async (event) => {
    const payload = event.payload as {
      beneficiary_id: string;
      credits_remaining: number;
      doctor_id: string;
    };

    // Low-credit alert to both beneficiary and payer.
    if (payload.credits_remaining <= 2) {
      await notify({
        eventId: event.id,
        userId: payload.beneficiary_id,
        kind: "low_credits_self",
        priority: "HIGH",
        subject: `Il ne reste que ${payload.credits_remaining} visite(s)`,
        body: `Votre forfait annuel arrive à épuisement. Pensez à renouveler ou à ajuster votre plan.`,
        linkUrl: "/member/medical-card",
        metadata: payload,
      });

      const { data: enrollment } = await supabase
        .from("enrollment")
        .select("subscriptions!inner(payer_id, payer:payer_id)")
        .eq("beneficiary_id", payload.beneficiary_id)
        .eq("status", "ACTIVE")
        .maybeSingle();

      if (enrollment) {
        const sub = enrollment.subscriptions as unknown as { payer_id: string };
        if (sub.payer_id !== payload.beneficiary_id) {
          await notify({
            eventId: event.id,
            userId: sub.payer_id,
            kind: "low_credits_payer",
            priority: "HIGH",
            subject: `Un bénéficiaire que vous financez n'a plus que ${payload.credits_remaining} visite(s)`,
            body: `Vous pouvez renouveler ou augmenter son forfait depuis votre tableau de bord.`,
            linkUrl: "/member/dashboard",
            metadata: payload,
          });
        }
      }
    }
  },

  "subscription.grace_started": async (event) => {
    const payload = event.payload as { payer_id: string; grace_ends_at: string };
    await notify({
      eventId: event.id,
      userId: payload.payer_id,
      kind: "grace_started",
      channel: "EMAIL",
      priority: "URGENT",
      subject: "Votre paiement a échoué — 30 jours pour régulariser",
      body: `Nous n'avons pas pu débiter votre moyen de paiement. Vous avez jusqu'au ${new Date(payload.grace_ends_at).toLocaleDateString("fr-FR")} pour régulariser avant suspension.`,
      linkUrl: "/member/payments",
      metadata: payload,
    });
  },

  "subscription.suspended": async (event) => {
    const payload = event.payload as { payer_id: string };
    await notify({
      eventId: event.id,
      userId: payload.payer_id,
      kind: "sub_suspended",
      channel: "EMAIL",
      priority: "URGENT",
      subject: "Votre abonnement est suspendu",
      body: "Toutes les adhésions liées à votre abonnement sont suspendues. Régularisez pour réactiver.",
      linkUrl: "/member/payments",
      metadata: payload,
    });
  },

  "subscription.renewed": async (event) => {
    const payload = event.payload as { payer_id: string; period_year: number };
    await notify({
      eventId: event.id,
      userId: payload.payer_id,
      kind: "renewed",
      channel: "EMAIL",
      subject: "Abonnement renouvelé avec succès",
      body: `Votre abonnement Vita Santé est renouvelé pour ${payload.period_year}. Les crédits de visite ont été réinitialisés.`,
      linkUrl: "/member/dashboard",
      metadata: payload,
    });
  },

  "doctor.verified": async (event) => {
    const payload = event.payload as { user_id: string; license_id: string };
    await notify({
      eventId: event.id,
      userId: payload.user_id,
      kind: "doctor_verified",
      channel: "EMAIL",
      priority: "HIGH",
      subject: "Votre compte médecin est vérifié",
      body: `Votre licence ${payload.license_id} est vérifiée. Vous pouvez maintenant recevoir des patients Vita Santé.`,
      linkUrl: "/doctor/patient-care",
      metadata: payload,
    });
  },
};

// ── Process unhandled events in batches ─────────────────────

export async function processEvents(batchSize: number = 50) {
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .is("processed_at", null)
    .order("created_at", { ascending: true })
    .limit(batchSize);

  if (error || !events || events.length === 0) {
    return { processed: 0, failed: 0 };
  }

  let processed = 0;
  let failed = 0;

  for (const event of events) {
    const handler = handlers[event.event_type];

    if (handler) {
      try {
        await handler(event as DbEvent);
      } catch (err) {
        console.error(`[event-processor] handler failed: ${event.event_type}`, err);
        failed++;
        // Leave processed_at null so we retry next cycle.
        continue;
      }
    }

    // Mark processed regardless of whether a handler existed (unhandled types
    // shouldn't loop forever).
    await supabase
      .from("events")
      .update({ processed_at: new Date().toISOString() })
      .eq("id", event.id);

    processed++;
  }

  return { processed, failed };
}

// ── Helper: load a user's unread notifications ──────────────
// Used by the member/doctor/affiliate/sponsor dashboards.
export async function getUnreadNotifications(userId: string, limit: number = 20) {
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .is("read_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export async function markNotificationRead(notificationId: string, userId: string) {
  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString(), delivery_status: "READ" })
    .eq("id", notificationId)
    .eq("user_id", userId);
}

// ── Helpers for affiliate pending-balance fallback ──────────

async function getAffiliatePending(affiliateId: string): Promise<number> {
  const { data } = await supabase
    .from("affiliates")
    .select("pending_cents")
    .eq("id", affiliateId)
    .single();
  return data?.pending_cents ?? 0;
}

async function getAffiliateEarned(affiliateId: string): Promise<number> {
  const { data } = await supabase
    .from("affiliates")
    .select("total_earned_cents")
    .eq("id", affiliateId)
    .single();
  return data?.total_earned_cents ?? 0;
}
