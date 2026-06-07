import { readUsage } from "@/lib/usage/check";

/**
 * Lightweight read for the usage meter. No mutation.
 * Does NOT include isAdmin / email — see /api/me for those (still
 * minimized for client safety).
 */
export async function GET(req: Request) {
  const state = await readUsage(req);
  const inf = (n: number) => (n === Infinity ? null : n);
  return new Response(
    JSON.stringify({
      tier: state.tier,
      used: state.used,
      remaining: {
        chatToday: inf(state.remaining.chatToday),
        chatThisMonth: inf(state.remaining.chatThisMonth),
        generateToday: inf(state.remaining.generateToday),
      },
      limit: {
        chatPerDay: inf(state.limit.chatPerDay),
        chatPerMonth: inf(state.limit.chatPerMonth),
        customGeneratePerDay: inf(state.limit.customGeneratePerDay),
      },
    }),
    {
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
      },
    },
  );
}
