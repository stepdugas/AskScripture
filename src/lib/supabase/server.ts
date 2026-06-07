import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env, features } from "@/lib/env";

/**
 * Returns a Supabase server client wired to Next.js cookies.
 * Returns null if env is not configured.
 */
export async function getSupabaseServerClient() {
  if (!features.supabase) return null;
  const cookieStore = await cookies();
  return createServerClient(env.supabaseUrl!, env.supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(toSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // route handlers can't set cookies in middleware-less reads
        }
      },
    },
  });
}
