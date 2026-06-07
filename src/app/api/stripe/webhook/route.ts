import { env, features } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

/**
 * Stripe webhook handler.
 * Configure in Stripe Dashboard → Developers → Webhooks → Add endpoint:
 *   URL: https://YOUR_DOMAIN/api/stripe/webhook
 *   Events: checkout.session.completed, customer.subscription.deleted,
 *           customer.subscription.updated, customer.subscription.created
 *
 * Set STRIPE_WEBHOOK_SECRET to the signing secret Stripe gives you.
 *
 * IDEMPOTENCY: every event id is recorded in `public.stripe_events` (migration
 * 0004) before any side-effect. Retries by Stripe are no-ops.
 *
 * CUSTOMER LINKAGE: `profiles.stripe_customer_id` is UNIQUE (migration 0004)
 * so a webhook can only update at most one profile.
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe || !features.stripe) {
    return new Response("Stripe not configured", { status: 503 });
  }
  if (!env.stripeWebhookSecret) {
    return new Response("Webhook secret not configured", { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing stripe-signature", { status: 400 });

  const raw = await req.text();
  let evt: Stripe.Event;
  try {
    evt = await stripe.webhooks.constructEventAsync(
      raw,
      sig,
      env.stripeWebhookSecret,
    );
  } catch (err) {
    return new Response(
      `Signature verification failed: ${err instanceof Error ? err.message : "unknown"}`,
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    // Without the service role key we can't reliably update profile flags.
    // Returning 200 means Stripe won't retry — be explicit about the no-op.
    return new Response(
      "ok (no service-role; profile updates skipped)",
      { status: 200 },
    );
  }

  // Idempotency: dedupe by event id.
  const { error: insertErr } = await supabase
    .from("stripe_events")
    .insert({ id: evt.id, type: evt.type });
  if (insertErr) {
    const code = (insertErr as { code?: string }).code;
    if (code === "23505") {
      // Already processed — acknowledge so Stripe stops retrying.
      return new Response("ok (duplicate)", { status: 200 });
    }
    return new Response(`event log insert failed: ${insertErr.message}`, {
      status: 500,
    });
  }

  try {
    switch (evt.type) {
      case "checkout.session.completed": {
        const session = evt.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const kind = session.metadata?.kind;
        const customerId = customerIdOf(session.customer);

        if (kind === "pro" && userId && customerId) {
          await supabase
            .from("profiles")
            .update({
              is_pro: true,
              stripe_customer_id: customerId,
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId);
        }
        // Donation: log it if userId present; nothing to flip on profile.
        if (kind === "donation" && session.amount_total) {
          await supabase.from("donations").insert({
            user_id: userId ?? null,
            amount_cents: session.amount_total,
            currency: session.currency ?? "usd",
            stripe_session_id: session.id,
          });
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = evt.data.object as Stripe.Subscription;
        const customerId = customerIdOf(sub.customer);
        if (!customerId) break;
        const active =
          sub.status === "active" || sub.status === "trialing";
        await supabase
          .from("profiles")
          .update({ is_pro: active, updated_at: new Date().toISOString() })
          .eq("stripe_customer_id", customerId);
        break;
      }
      default:
        // Unknown event types are recorded in stripe_events (above) but
        // produce no side-effects.
        break;
    }
  } catch (err) {
    return new Response(
      `handler error: ${err instanceof Error ? err.message : "unknown"}`,
      { status: 500 },
    );
  }

  return new Response("ok", { status: 200 });
}

/**
 * Stripe's `customer` field can be either a string id or an expanded
 * Customer object. Handle both.
 */
function customerIdOf(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null,
): string | null {
  if (!customer) return null;
  if (typeof customer === "string") return customer;
  return customer.id ?? null;
}
