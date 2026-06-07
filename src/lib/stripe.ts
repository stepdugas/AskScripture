import Stripe from "stripe";
import { env, features } from "@/lib/env";

let cached: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!features.stripe) return null;
  if (cached) return cached;
  cached = new Stripe(env.stripeSecretKey!, {
    // SDK type imports its own apiVersion union; let it default rather than
    // pin a version that may not exist in the installed SDK build.
    typescript: true,
  });
  return cached;
}
