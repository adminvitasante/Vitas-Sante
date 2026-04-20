import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { processEvents } from "@/lib/server/event-processor";
import { deliverPendingEmails } from "@/lib/server/email";

// ── Cron entrypoint ──────────────────────────────────────────
// Runs three passes:
//   1. Event processor drains the events queue → writes notifications
//   2. Email worker delivers pending EMAIL-channel notifications via Resend
//   3. Subscription lifecycle: grace-period expiry → suspend → expire
//
// Wire via vercel.json:
//   { "crons": [{ "path": "/api/cron", "schedule": "*/5 * * * *" }] }

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, unknown> = {};

  // 1. Process pending events (generates notifications as side effect).
  const eventResult = await processEvents();
  results.events_processed = eventResult.processed;
  results.events_failed = eventResult.failed;

  // 2. Deliver pending emails.
  try {
    const emailResult = await deliverPendingEmails();
    results.emails_sent = emailResult.sent;
    results.emails_failed = emailResult.failed;
    results.emails_skipped = emailResult.skipped;
  } catch (err) {
    console.error("[cron] email delivery failed:", err);
    results.emails_error = (err as Error).message;
  }

  // 3. Grace-period expiry → suspend.
  const { data: expiredGrace } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("status", "GRACE_PERIOD")
    .lt("grace_period_ends_at", new Date().toISOString());

  if (expiredGrace && expiredGrace.length > 0) {
    for (const sub of expiredGrace) {
      await supabase.rpc("suspend_subscription", {
        p_subscription_id: sub.id,
        p_actor_id: null,
      });
    }
    results.subscriptions_suspended = expiredGrace.length;
  }

  // 4. Long-suspended → expire.
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: expiredSuspensions } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("status", "SUSPENDED")
    .lt("updated_at", thirtyDaysAgo);

  if (expiredSuspensions && expiredSuspensions.length > 0) {
    for (const sub of expiredSuspensions) {
      await supabase.from("subscriptions").update({ status: "EXPIRED" }).eq("id", sub.id);
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
