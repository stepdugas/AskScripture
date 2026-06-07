/**
 * Freemium tier limits.
 *
 * Goal: a free signed-in user maxing out every day costs less than $1/month.
 *
 * Cost math at the chosen caps (Haiku 4.5: ~$1/M input, ~$5/M output):
 *   Per chat message ≈ $0.0055
 *
 * Free signed-in worst case:
 *   - 8 chat/day × $0.0055 = $0.044/day
 *   - Monthly cap of 120 chats = $0.66/month (hard ceiling)
 *
 * Free anonymous worst case:
 *   - 3 chat/day × $0.0055 = $0.017/day = $0.50/month
 *
 * Generations are NOT counted here per-user. Free users see today's daily
 * shared content (one generation per kind per day total — site cost, ~$0.08/day).
 * Pro users can generate from arbitrary passages, billed against unlimited.
 */

export type Tier = "anonymous" | "free" | "lifetime";

export type Limits = {
  chatPerDay: number;
  chatPerMonth: number;
  /** Number of CUSTOM-passage generations a tier can request per day.
   *  Free users hit 0 (they see the daily shared one); Pro is unlimited. */
  customGeneratePerDay: number;
};

export const LIMITS: Record<Tier, Limits> = {
  anonymous: {
    chatPerDay: 3,
    chatPerMonth: 50,
    customGeneratePerDay: 0,
  },
  free: {
    chatPerDay: 8,
    chatPerMonth: 120,
    customGeneratePerDay: 0,
  },
  lifetime: {
    chatPerDay: Infinity,
    chatPerMonth: Infinity,
    customGeneratePerDay: Infinity,
  },
};

export const TIER_LABELS: Record<Tier, string> = {
  anonymous: "Guest",
  free: "Free",
  lifetime: "Pro",
};

export type UsageKind = "chat" | "generate";

export function todayUtcKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/** YYYY-MM (UTC) used for monthly cap lookups */
export function monthUtcKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 7);
}

/** First day of current UTC month — for chat_usage SUM queries */
export function startOfMonthIso(): string {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
    .toISOString()
    .slice(0, 10);
}
