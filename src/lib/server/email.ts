"use server";

import { supabase } from "@/lib/supabase";

// Email delivery worker. Drains notifications where channel='EMAIL' and
// delivery_status='PENDING'. Uses Resend via fetch (no extra dep) to keep
// the bundle small and the provider swappable. Set:
//   RESEND_API_KEY       — from resend.com
//   RESEND_FROM_ADDRESS  — e.g. "Vita Santé <no-reply@vitasante.ht>"
//
// If RESEND_API_KEY is not set, the worker logs and marks rows FAILED
// without throwing so the cron keeps working in environments without email.

const MAX_BATCH = 50;
const MAX_RETRIES = 3;

type PendingRow = {
  id: string;
  user_id: string;
  subject: string;
  body: string;
  link_url: string | null;
  priority: string;
  retry_count: number;
};

export async function deliverPendingEmails(
  batchSize: number = MAX_BATCH
): Promise<{ sent: number; failed: number; skipped: number }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_ADDRESS ?? "Vita Santé <no-reply@vitasante.ht>";

  // Load a batch of pending email notifications with the recipient email.
  const { data: rows } = await supabase
    .from("notifications")
    .select("id, user_id, subject, body, link_url, priority, retry_count")
    .eq("channel", "EMAIL")
    .eq("delivery_status", "PENDING")
    .lt("retry_count", MAX_RETRIES)
    .order("created_at", { ascending: true })
    .limit(batchSize);

  if (!rows || rows.length === 0) {
    return { sent: 0, failed: 0, skipped: 0 };
  }

  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — marking pending emails skipped");
    const ids = rows.map((r) => r.id);
    await supabase
      .from("notifications")
      .update({
        delivery_status: "FAILED",
        last_error: "RESEND_API_KEY not configured",
      })
      .in("id", ids);
    return { sent: 0, failed: 0, skipped: rows.length };
  }

  // Batch-fetch recipient emails.
  const userIds = Array.from(new Set(rows.map((r) => r.user_id)));
  const { data: users } = await supabase
    .from("users")
    .select("id, email, name, locale")
    .in("id", userIds);

  const userMap = new Map(
    (users ?? []).map((u: { id: string; email: string; name: string; locale: string }) => [u.id, u])
  );

  let sent = 0;
  let failed = 0;

  for (const row of rows as PendingRow[]) {
    const user = userMap.get(row.user_id);
    if (!user) {
      await markFailed(row.id, row.retry_count, "Recipient user not found");
      failed++;
      continue;
    }

    const html = renderEmail({
      recipientName: user.name,
      subject: row.subject,
      body: row.body,
      linkUrl: row.link_url,
      priority: row.priority,
    });

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [user.email],
          subject: row.subject,
          html,
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "unknown");
        await markFailed(row.id, row.retry_count, `Resend ${res.status}: ${errText.slice(0, 300)}`);
        failed++;
        continue;
      }

      await supabase
        .from("notifications")
        .update({
          delivery_status: "SENT",
          delivered_at: new Date().toISOString(),
          last_error: null,
        })
        .eq("id", row.id);

      sent++;
    } catch (err) {
      await markFailed(row.id, row.retry_count, (err as Error).message.slice(0, 300));
      failed++;
    }
  }

  return { sent, failed, skipped: 0 };
}

async function markFailed(id: string, retryCount: number, error: string) {
  const nextRetry = retryCount + 1;
  await supabase
    .from("notifications")
    .update({
      delivery_status: nextRetry >= MAX_RETRIES ? "FAILED" : "PENDING",
      retry_count: nextRetry,
      last_error: error,
    })
    .eq("id", id);
}

function renderEmail(params: {
  recipientName: string;
  subject: string;
  body: string;
  linkUrl: string | null;
  priority: string;
}) {
  const priorityBadge =
    params.priority === "URGENT" || params.priority === "HIGH"
      ? `<span style="display:inline-block;padding:4px 10px;border-radius:999px;background:${params.priority === "URGENT" ? "#fee2e2" : "#fef3c7"};color:${params.priority === "URGENT" ? "#991b1b" : "#854d0e"};font-size:11px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:16px;">${params.priority}</span>`
      : "";

  const ctaButton = params.linkUrl
    ? `<div style="margin:28px 0;"><a href="${escapeHtml(params.linkUrl)}" style="display:inline-block;padding:12px 24px;background:#00346f;color:#fff;text-decoration:none;border-radius:12px;font-weight:700;font-size:14px;">Accéder à mon espace</a></div>`
    : "";

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(params.subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f6fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1a202c;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="background:#fff;border-radius:24px;padding:40px 32px;box-shadow:0 4px 12px rgba(0,52,111,0.06);">
      <div style="margin-bottom:24px;">
        <div style="font-family:'Manrope',sans-serif;font-weight:900;color:#00346f;font-size:22px;letter-spacing:-0.02em;">Vita Santé</div>
      </div>
      ${priorityBadge}
      <h1 style="margin:0 0 16px 0;font-family:'Manrope',sans-serif;font-size:22px;font-weight:800;color:#0f172a;line-height:1.3;">${escapeHtml(params.subject)}</h1>
      <p style="margin:0 0 12px 0;font-size:14px;color:#475569;">Bonjour ${escapeHtml(params.recipientName)},</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:#1a202c;white-space:pre-wrap;">${escapeHtml(params.body)}</p>
      ${ctaButton}
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0 20px 0;">
      <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.5;">
        Cet email est envoyé par Vita Santé Club. Vous pouvez modifier vos préférences de notification dans votre espace membre.
      </p>
    </div>
    <p style="margin:16px 0 0 0;text-align:center;font-size:11px;color:#94a3b8;">
      © ${new Date().getFullYear()} Vita Santé Club — Haiti Medical Network
    </p>
  </div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
