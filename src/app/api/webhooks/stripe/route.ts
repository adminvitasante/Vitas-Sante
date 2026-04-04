import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const memberId = session.metadata?.memberId;
      if (memberId) {
        await supabase.from("payments").insert({
          member_id: memberId,
          amount: session.amount_total ?? 0,
          currency: session.currency ?? "usd",
          status: "PAID",
          stripe_payment_id: session.payment_intent as string,
          description: "Plan enrollment payment",
        });
        await supabase.from("members").update({ status: "ACTIVE" }).eq("id", memberId);
      }
      break;
    }
    case "invoice.paid": {
      const invoice = event.data.object;
      const memberId = invoice.metadata?.memberId;
      if (memberId) {
        await supabase.from("payments").insert({
          member_id: memberId,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: "PAID",
          stripe_payment_id: (invoice as unknown as Record<string, unknown>).payment_intent as string,
          description: "Recurring premium payment",
        });
      }
      break;
    }
  }
  return NextResponse.json({ received: true });
}
