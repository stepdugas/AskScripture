import { isAdminEmail } from "@/lib/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type AppUser = {
  id: string;
  email: string | null;
  /** Email is in ADMIN_EMAILS env list */
  isAdmin: boolean;
  /** is_lifetime flag set on profile, OR admin, OR is_early_user (grandfathered) */
  isLifetime: boolean;
  /** Free signed-in users hit the daily caps; admins/lifetime bypass */
  unlimited: boolean;
  displayName: string | null;
};

/**
 * Resolve the current user from a server component / route handler.
 * Returns null when no Supabase or no session.
 */
export async function getCurrentUser(): Promise<AppUser | null> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const email = user.email ?? null;
  const isAdmin = isAdminEmail(email);

  // Look up profile flags. .maybeSingle() so a missing profile row (e.g. trigger
  // didn't fire) returns null instead of throwing.
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, is_lifetime, is_early_user, is_pro")
    .eq("id", user.id)
    .maybeSingle();

  const isLifetime =
    isAdmin ||
    !!profile?.is_lifetime ||
    !!profile?.is_early_user;

  return {
    id: user.id,
    email,
    isAdmin,
    isLifetime,
    // isLifetime already includes isAdmin; Pro subscribers also get unlimited.
    unlimited: isLifetime || !!profile?.is_pro,
    displayName: profile?.display_name ?? null,
  };
}

/**
 * Require a signed-in admin (for /admin routes + admin APIs).
 * Returns the user or null; callers should send 403 / redirect on null.
 */
export async function requireAdmin(): Promise<AppUser | null> {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) return null;
  return user;
}
