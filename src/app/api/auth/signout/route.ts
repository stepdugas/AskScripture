import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
export async function POST(req: Request) {
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  return NextResponse.redirect(new URL("/", req.url));
}
