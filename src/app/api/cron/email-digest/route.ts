import { timingSafeEqual } from "node:crypto";
import { Resend } from "resend";
import { env, features } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { dailyVerse } from "@/data/daily-verses";

/**
 * Weekly email digest.
 *
 * Schedule from vercel.json: Mondays at 12:00 UTC
 *
 * Auth: Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}`. The check
 * fails closed — if CRON_SECRET is not set in env, every request is rejected,
 * preventing accidental open-internet exposure of the email-sending endpoint.
 *
 * Data access: uses the SERVICE ROLE Supabase client (RLS-bypassing) because
 * the cron has no user session. The route is gated by the secret above; the
 * service role client must never be reachable through any other route.
 */
export async function GET(req: Request) {
  if (!authorize(req)) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!features.email) {
    return new Response("Resend not configured", { status: 503 });
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return new Response(
      "Supabase service role not configured — set SUPABASE_SERVICE_ROLE_KEY",
      { status: 503 },
    );
  }
  const resend = new Resend(env.resendApiKey!);

  // Find notes from the past 7 days
  const sinceIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: recentNotes, error: notesErr } = await supabase
    .from("notes")
    .select("user_id, book_slug, chapter, verse, text, created_at")
    .gte("created_at", sinceIso)
    .order("created_at", { ascending: false })
    .limit(5000);
  if (notesErr) {
    return new Response(`notes query failed: ${notesErr.message}`, {
      status: 500,
    });
  }

  const byUser = new Map<string, NonNullable<typeof recentNotes>>();
  for (const n of recentNotes ?? []) {
    if (!byUser.has(n.user_id)) byUser.set(n.user_id, []);
    byUser.get(n.user_id)!.push(n);
  }

  const userIds = [...byUser.keys()];
  if (userIds.length === 0) {
    return new Response(
      JSON.stringify({ ok: true, sent: 0, reason: "no notes in past 7 days" }),
      { headers: { "content-type": "application/json" } },
    );
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, display_name, daily_verse")
    .in("id", userIds);

  const today = dailyVerse();
  let sent = 0;
  const errors: string[] = [];

  for (const profile of profiles ?? []) {
    if (!profile.email || !profile.daily_verse) continue;
    const notes = byUser.get(profile.id) ?? [];
    if (notes.length === 0) continue;

    try {
      await resend.emails.send({
        from: env.resendFromEmail,
        to: profile.email,
        subject: `Your week of study — ${notes.length} note${notes.length === 1 ? "" : "s"}`,
        html: renderEmail({
          displayName: profile.display_name,
          notes,
          dailyRef: today.ref,
          dailyNote: today.note,
        }),
      });
      sent++;
    } catch (err) {
      errors.push(
        `${profile.email}: ${err instanceof Error ? err.message : "unknown"}`,
      );
    }
  }

  return new Response(
    JSON.stringify({ ok: true, sent, errors }),
    { headers: { "content-type": "application/json" } },
  );
}

/**
 * FAIL-CLOSED bearer check. Returns false if CRON_SECRET is missing OR the
 * header doesn't match. Uses timingSafeEqual so the comparison itself doesn't
 * leak the secret via response timing.
 */
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

function renderEmail({
  displayName,
  notes,
  dailyRef,
  dailyNote,
}: {
  displayName: string | null;
  notes: { book_slug: string; chapter: number; verse: number; text: string }[];
  dailyRef: string;
  dailyNote: string;
}) {
  // EVERY user-influenced interpolation goes through escapeHtml. Server-side
  // data (refs, site URL) does not need to be escaped but it doesn't hurt.
  const greeting = displayName
    ? `Hello ${escapeHtml(displayName)},`
    : "Hello,";
  const notesHtml = notes
    .slice(0, 12)
    .map((n) => {
      const ref = `${escapeHtml(cap(n.book_slug))} ${n.chapter}:${n.verse}`;
      const safeText = escapeHtml(n.text).slice(0, 600);
      return `
        <div style="border-top:1px solid #e6e1d4;padding:18px 0">
          <div style="font-family:'SF Mono',Menlo,monospace;font-size:12px;color:#5b6271">${ref}</div>
          <div style="font-family:Georgia,serif;font-size:15px;line-height:24px;color:#14171f;margin-top:6px;white-space:pre-wrap">${safeText}</div>
        </div>`;
    })
    .join("");

  return `
<!doctype html>
<html><body style="margin:0;background:#fbfaf7;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#14171f">
  <table align="center" style="max-width:600px;width:100%;background:#fbfaf7" cellpadding="0" cellspacing="0">
    <tr><td>
      <div style="font-family:'SF Mono',Menlo,monospace;font-size:11px;letter-spacing:3px;color:#5b6271;text-transform:uppercase;font-weight:500">AskScripture · Weekly digest</div>
      <h1 style="font-family:Georgia,serif;font-size:32px;line-height:1.1;font-weight:600;margin:8px 0 0">Your week of study.</h1>
      <p style="font-size:15px;line-height:24px;color:#5b6271;margin:16px 0 0">${greeting} Here are the notes you saved over the past seven days.</p>
      <div style="margin-top:32px">${notesHtml}</div>
      <div style="margin-top:40px;border-top:1px solid #e6e1d4;padding-top:24px">
        <div style="font-family:'SF Mono',Menlo,monospace;font-size:11px;letter-spacing:3px;color:#5b6271;text-transform:uppercase;font-weight:500">Today</div>
        <div style="font-family:Georgia,serif;font-size:20px;font-weight:600;margin-top:6px">${escapeHtml(dailyRef)}</div>
        <p style="font-family:Georgia,serif;font-size:15px;line-height:24px;color:#5b6271;margin:8px 0 0">${escapeHtml(dailyNote)}</p>
        <a href="${env.siteUrl}/dashboard" style="display:inline-block;margin-top:18px;background:#1B2845;color:#fbfaf7;padding:10px 18px;text-decoration:none;font-size:13px;font-weight:500;letter-spacing:0.5px">Open your study →</a>
      </div>
      <div style="margin-top:48px;font-size:12px;color:#8b92a0">
        You're receiving this because you saved notes on AskScripture and opted into the daily verse. You can opt out in <a href="${env.siteUrl}/settings" style="color:#1B2845">preferences</a>.
      </div>
    </td></tr>
  </table>
</body></html>`;
}

function cap(s: string) {
  return s
    .split("-")
    .map((p) => p[0]?.toUpperCase() + p.slice(1))
    .join(" ");
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
