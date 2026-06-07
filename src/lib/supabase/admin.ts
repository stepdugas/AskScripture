import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/**
 * Service-role Supabase client for privileged server-side writes only.
 * Bypasses RLS. NEVER expose this to the browser.
 *
 * Returns null if the env vars are missing — callers must degrade gracefully.
 */
let cached: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient | null {
  if (!env.supabaseUrl || !env.supabaseServiceKey) return null;
  if (cached) return cached;
  cached = createClient(env.supabaseUrl, env.supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
