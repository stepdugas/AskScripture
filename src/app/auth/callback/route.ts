import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * OAuth callback handler. Supabase redirects here after Google login;
 * we exchange the `code` for a session, then redirect to `?next=…`.
 *
 * SECURITY: the `next` param is validated to a relative path so attackers
 * can't use this route as an open redirect to phish authenticated users.
 */

/** Only allow paths like "/dashboard" — no protocol, no host, no protocol-relative. */
function safeNext(raw: string | null): string {
  if (!raw) return "/dashboard";
  // Must start with single forward slash and NOT "//" (protocol-relative)
  if (!raw.startsWith("/")) return "/dashboard";
  if (raw.startsWith("//")) return "/dashboard";
  // Strip any backslash tricks
  if (raw.includes("\\")) return "/dashboard";
  // Cap length to avoid silly redirects
  if (raw.length > 256) return "/dashboard";
  return raw;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(
      new URL("/signin?error=missing_code", req.url),
    );
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.redirect(
      new URL("/signin?error=auth_not_configured", req.url),
    );
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL(`/signin?error=${encodeURIComponent(error.message)}`, req.url),
    );
  }

  return NextResponse.redirect(new URL(next, req.url));
}
