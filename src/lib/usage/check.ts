import { getCurrentUser, type AppUser } from "@/lib/auth/user";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  LIMITS,
  startOfMonthIso,
  todayUtcKey,
  type Tier,
  type UsageKind,
} from "./limits";

export type UsageState = {
  tier: Tier;
  user: AppUser | null;
  used: { chatToday: number; chatThisMonth: number; generateToday: number };
  remaining: {
    chatToday: number;
    chatThisMonth: number;
    generateToday: number;
  };
  limit: {
    chatPerDay: number;
    chatPerMonth: number;
    customGeneratePerDay: number;
  };
};

/** In-memory daily counter for anonymous (no Supabase row). IP-bucketed. */
const memUsage = new Map<string, number>();
let memLastDay = todayUtcKey();
function rotateMem() {
  const today = todayUtcKey();
  if (today !== memLastDay) {
    memUsage.clear();
    memLastDay = today;
  }
}
function memKey(bucket: string, kind: UsageKind) {
  return `${bucket}:${kind}`;
}
function getMem(bucket: string, kind: UsageKind): number {
  rotateMem();
  return memUsage.get(memKey(bucket, kind)) ?? 0;
}
function incMem(bucket: string, kind: UsageKind) {
  rotateMem();
  const k = memKey(bucket, kind);
  memUsage.set(k, (memUsage.get(k) ?? 0) + 1);
}

function clientIp(req: Request): string {
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1];
  }
  return "anon";
}
function anonymousBucket(req: Request): string {
  return `ip:${clientIp(req)}`;
}

/**
 * Read current usage state. Includes monthly chat total for signed-in users.
 */
export async function readUsage(req: Request): Promise<UsageState> {
  const user = await getCurrentUser();
  const tier: Tier = !user
    ? "anonymous"
    : user.unlimited
      ? "lifetime"
      : "free";
  const limit = LIMITS[tier];

  let chatToday = 0;
  let chatThisMonth = 0;
  let generateToday = 0;

  if (user) {
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      const day = todayUtcKey();
      // Daily row
      const { data: dayRow } = await supabase
        .from("chat_usage")
        .select("messages, generates")
        .eq("user_id", user.id)
        .eq("day", day)
        .maybeSingle();
      chatToday = dayRow?.messages ?? 0;
      generateToday = dayRow?.generates ?? 0;

      // Monthly sum
      const since = startOfMonthIso();
      const { data: monthRows } = await supabase
        .from("chat_usage")
        .select("messages")
        .eq("user_id", user.id)
        .gte("day", since);
      chatThisMonth = (monthRows ?? []).reduce(
        (s, r) => s + (r.messages ?? 0),
        0,
      );
    } else {
      // No Supabase configured — best-effort in-memory daily counter.
      // We have no cross-day persistence, so report monthly proportional
      // to daily so the UI doesn't show "unlimited month remaining" when
      // the daily cap is much lower (which would mislead the user).
      const bucket = `u:${user.id}`;
      chatToday = getMem(bucket, "chat");
      generateToday = getMem(bucket, "generate");
      chatThisMonth = Math.min(
        chatToday * (limit.chatPerMonth / Math.max(limit.chatPerDay, 1)),
        limit.chatPerMonth,
      );
    }
  } else {
    const bucket = anonymousBucket(req);
    chatToday = getMem(bucket, "chat");
    generateToday = getMem(bucket, "generate");
    chatThisMonth = Math.min(
      chatToday * (limit.chatPerMonth / Math.max(limit.chatPerDay, 1)),
      limit.chatPerMonth,
    );
  }

  return {
    tier,
    user,
    used: { chatToday, chatThisMonth, generateToday },
    remaining: {
      chatToday: Math.max(0, limit.chatPerDay - chatToday),
      chatThisMonth: Math.max(0, limit.chatPerMonth - chatThisMonth),
      generateToday: Math.max(
        0,
        limit.customGeneratePerDay - generateToday,
      ),
    },
    limit: {
      chatPerDay: limit.chatPerDay,
      chatPerMonth: limit.chatPerMonth,
      customGeneratePerDay: limit.customGeneratePerDay,
    },
  };
}

/**
 * Atomic gate check + increment for chat.
 */
export async function gateChat(req: Request): Promise<Response | null> {
  const user = await getCurrentUser();
  const tier: Tier = !user
    ? "anonymous"
    : user.unlimited
      ? "lifetime"
      : "free";
  if (tier === "lifetime") return null;

  const limit = LIMITS[tier];

  if (user) {
    const admin = getSupabaseAdminClient();
    if (admin) {
      // Atomic daily + monthly increment via RPC. The monthly cap is checked
      // inside the function (SECURITY DEFINER, race-free).
      const { data, error } = await admin.rpc("increment_usage", {
        p_user_id: user.id,
        p_day: todayUtcKey(),
        p_kind: "chat",
        p_chat_per_month:
          limit.chatPerMonth === Infinity ? null : limit.chatPerMonth,
      });
      if (error) {
        return new Response(
          JSON.stringify({
            error: "USAGE_TRACKING_FAILED",
            message: "Couldn't record usage. Try again.",
          }),
          { status: 500, headers: { "content-type": "application/json" } },
        );
      }
      const row = Array.isArray(data) ? data[0] : data;
      if (row?.blocked_reason === "monthly_limit") {
        return blockedChatMonth(tier, limit.chatPerMonth);
      }
      const postCount = row?.messages ?? 0;
      if (postCount > limit.chatPerDay) {
        return blockedChatDay(tier, limit.chatPerDay, postCount - 1);
      }
      return null;
    }
    // No service role — fall back to in-memory
    const bucket = `u:${user.id}`;
    const used = getMem(bucket, "chat");
    if (used >= limit.chatPerDay) {
      return blockedChatDay(tier, limit.chatPerDay, used);
    }
    incMem(bucket, "chat");
    return null;
  }

  // Anonymous: in-memory by IP
  const bucket = anonymousBucket(req);
  const used = getMem(bucket, "chat");
  if (used >= limit.chatPerDay) {
    return blockedChatDay(tier, limit.chatPerDay, used);
  }
  incMem(bucket, "chat");
  return null;
}

/**
 * Gate custom-passage generation. Free tier = 0 custom generations.
 * (Free users see the daily shared content via the cron job instead.)
 */
export async function gateCustomGenerate(): Promise<Response | null> {
  const user = await getCurrentUser();
  const tier: Tier = !user
    ? "anonymous"
    : user.unlimited
      ? "lifetime"
      : "free";
  if (tier === "lifetime") return null;

  // Free + anonymous can't generate from custom passages.
  return new Response(
    JSON.stringify({
      error: "PRO_FEATURE",
      message:
        "Custom-passage generation is a Pro feature. Today's daily devotional, family devotional, sermon outline, and story are free for everyone.",
      upgradeUrl: "/pricing",
    }),
    { status: 402, headers: { "content-type": "application/json" } },
  );
}

function blockedChatDay(tier: Tier, limit: number, used: number) {
  return new Response(
    JSON.stringify({
      error: "DAILY_LIMIT_REACHED" as const,
      scope: "day",
      tier,
      limit,
      used,
      message:
        tier === "anonymous"
          ? "Free guest limit reached. Sign in for a higher daily allowance."
          : "You've hit today's chat limit. Resets at midnight UTC.",
    }),
    { status: 429, headers: { "content-type": "application/json" } },
  );
}
function blockedChatMonth(tier: Tier, limit: number) {
  return new Response(
    JSON.stringify({
      error: "MONTHLY_LIMIT_REACHED" as const,
      scope: "month",
      tier,
      limit,
      message:
        "You've hit your monthly chat limit. Upgrade to Pro for unlimited, or wait until next month.",
      upgradeUrl: "/pricing",
    }),
    { status: 429, headers: { "content-type": "application/json" } },
  );
}
