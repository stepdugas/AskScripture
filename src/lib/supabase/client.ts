import { createBrowserClient } from "@supabase/ssr";
import { env, features } from "@/lib/env";

/**
 * Returns a Supabase browser client if env is configured; null otherwise.
 * Callers must handle the null case so the app keeps running without Supabase.
 */
export function getSupabaseBrowserClient() {
  if (!features.supabase) return null;
  return createBrowserClient(env.supabaseUrl!, env.supabaseAnonKey!);
}
