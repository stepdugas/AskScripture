import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/lib/env";
import type { AppUser } from "@/lib/auth/user";

/**
 * Model selection.
 *
 * Free tier  → Haiku 4.5 (~3× cheaper than Sonnet for both input + output).
 *              Adequate for the daily chat + simple Q&A. Quality is the
 *              tradeoff for keeping per-user cost under $1/month.
 *
 * Pro tier   → Sonnet 4.6. Pro is the only thing paid users notice the
 *              difference of, so we don't cheap out on it.
 *
 * Daily-shared generation runs at site cost, so it always uses Sonnet —
 * one generation per day per kind, fixed cost regardless of user count.
 */
export const MODELS = {
  haiku: "claude-haiku-4-5",
  sonnet: "claude-sonnet-4-6",
} as const;

export function modelFor(user: AppUser | null): string {
  // Anonymous + free signed-in users get Haiku.
  // Pro / Lifetime / Admin get Sonnet.
  return user?.unlimited ? MODELS.sonnet : MODELS.haiku;
}

/** For published daily content — always Sonnet, only fires once a day. */
export const DAILY_MODEL = MODELS.sonnet;

let cached: Anthropic | null = null;
export function getAnthropic(): Anthropic | null {
  if (!env.anthropicApiKey) return null;
  if (cached) return cached;
  cached = new Anthropic({ apiKey: env.anthropicApiKey });
  return cached;
}
