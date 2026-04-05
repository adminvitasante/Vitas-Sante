import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { processEvents } from "@/lib/server/event-processor";

// ── Cron Job: Process events + check grace periods ────────
// Call this via Vercel Cron or external scheduler

export async function GET(req: NextRequest) {
  // Verify cron secret (prevent unauthorized access)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, unknown> = {};

  // 1. Process pending events
  const eventResult = await processEvents();
  results.events_processed = eventResult.processed;

  // 2. Check for expired grace periods → suspend
  const { data: expiredGrace } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("status", "GRACE_PERIOD")
    .lt("grace_period_ends_at", new Date().toISOString());

  if (expiredGrace && expiredGrace.length > 0) {
    for (const sub of expiredGrace) {
      await supabase.rpc("suspend_subscription", {
        p_subscription_id: sub.id,
        p_actor_id: null, // system action
      });
    }
    results.subscriptions_suspended = expiredGrace.length;
  }

  // 3. Check for expired suspensions → expire
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: expiredSuspensions } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("status", "SUSPENDED")
    .lt("updated_at", thirtyDaysAgo);

  if (expiredSuspensions && expiredSuspensions.length > 0) {
    for (const sub of expiredSuspensions) {
      await supabase
        .from("subscriptions")
        .update({ status: "EXPIRED" })
        .eq("id", sub.id);

      // Expire all enrollments
      await supabase
        .from("enrollment")
        .update({ status: "EXPIRED", expires_at: new Date().toISOString() })
        .eq("subscription_id", sub.id)
        .eq("status", "SUSPENDED");
    }
    results.subscriptions_expired = expiredSuspensions.length;
  }

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    ...results,
  });
}
