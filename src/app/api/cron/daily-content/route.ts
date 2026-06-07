import { timingSafeEqual } from "node:crypto";
import { env, features } from "@/lib/env";
import {
  DAILY_KINDS,
  generateAndStoreDailyContent,
  readDailyContent,
} from "@/lib/daily-content";

/**
 * Daily shared-content cron.
 *
 * Schedule (vercel.json): 00:05 UTC every day.
 *
 * Generates today's devotional, family devotional, sermon outline, and story
 * from the daily verse. Stores them so every user sees the same content (one
 * generation per kind per day total).
 *
 * Auth: fails closed when CRON_SECRET unset. Timing-safe bearer compare.
 */
export async function GET(req: Request) {
  if (!authorize(req)) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!features.ai) {
    return new Response("Anthropic not configured", { status: 503 });
  }
  if (!features.supabase) {
    return new Response("Supabase not configured", { status: 503 });
  }

  // Run all four kinds in parallel — Vercel hobby cron has a 60s timeout,
  // and Sonnet calls can take 10-15s each. Sequential would risk a timeout.
  const settled = await Promise.allSettled(
    DAILY_KINDS.map(async (kind) => {
      const existing = await readDailyContent(kind);
      if (existing) return { kind, ok: true, reason: "already generated" };
      const r = await generateAndStoreDailyContent(kind);
      return {
        kind,
        ok: !!r,
        reason: r ? undefined : "generation returned null",
      };
    }),
  );

  const results: Record<string, { ok: boolean; reason?: string }> = {};
  settled.forEach((res, i) => {
    const kind = DAILY_KINDS[i];
    if (res.status === "fulfilled") {
      results[kind] = { ok: res.value.ok, reason: res.value.reason };
    } else {
      results[kind] = {
        ok: false,
        reason:
          res.reason instanceof Error ? res.reason.message : String(res.reason),
      };
    }
  });

  return new Response(JSON.stringify({ ok: true, results }), {
    headers: { "content-type": "application/json" },
  });
}

function authorize(req: Request): boolean {
  const secret = env.cronSecret;
  if (!secret) return false;
  const header = req.headers.get("authorization");
  if (!header) return false;
  const expected = `Bearer ${secret}`;
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
