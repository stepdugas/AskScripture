import { z } from "zod";
import { env } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/auth/user";

const BodySchema = z.object({
  mode: z.enum(["subscription", "donation"]),
  amountCents: z.number().int().min(100).max(100_000).optional(),
});

/**
 * Creates a Stripe Checkout session.
 * - mode=subscription → uses STRIPE_PRICE_PRO (monthly Pro tier)
 * - mode=donation → ad-hoc price for amountCents
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return new Response(
      JSON.stringify({ error: "Stripe is not configured." }),
      { status: 503, headers: { "content-type": "application/json" } },
    );
  }

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Invalid body", details: String(e) }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  const user = await getCurrentUser();

  try {
    if (body.mode === "subscription") {
      if (!env.stripePricePro) {
        return new Response(
          JSON.stringify({
            error:
              "STRIPE_PRICE_PRO not set. Create a Stripe price for the Pro tier and add the price id to env.",
          }),
          { status: 503, headers: { "content-type": "application/json" } },
        );
      }
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: env.stripePricePro, quantity: 1 }],
        success_url: `${env.siteUrl}/dashboard?upgrade=success`,
        cancel_url: `${env.siteUrl}/pricing`,
        customer_email: user?.email ?? undefined,
        client_reference_id: user?.id ?? undefined,
        metadata: { kind: "pro" },
        allow_promotion_codes: true,
      });
      return new Response(JSON.stringify({ url: session.url }), {
        headers: { "content-type": "application/json" },
      });
    }

    // Donation
    const amount = body.amountCents ?? 500;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: amount,
            product_data: {
              name: "AskScripture · One-time donation",
              description:
                "Supports the work — server costs, content, and the developer's coffee.",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${env.siteUrl}/support?status=thanks`,
      cancel_url: `${env.siteUrl}/support`,
      customer_email: user?.email ?? undefined,
      client_reference_id: user?.id ?? undefined,
      metadata: { kind: "donation" },
    });
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Stripe error",
      }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }
}
