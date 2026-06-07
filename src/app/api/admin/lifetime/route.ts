import { z } from "zod";
import { requireAdmin } from "@/lib/auth/user";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const BodySchema = z.object({
  userId: z.string().uuid(),
  value: z.boolean(),
});

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return new Response(JSON.stringify({ error: "FORBIDDEN" }), {
      status: 403,
      headers: { "content-type": "application/json" },
    });
  }

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Invalid body", details: String(e) }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  // SERVICE ROLE for the write — admin auth has been verified above, so we
  // bypass RLS to avoid the GUC-dependent admin policy silently no-opping.
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return new Response(
      JSON.stringify({
        error:
          "Supabase service role not configured. Set SUPABASE_SERVICE_ROLE_KEY in env.",
      }),
      { status: 503, headers: { "content-type": "application/json" } },
    );
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ is_lifetime: body.value, updated_at: new Date().toISOString() })
    .eq("id", body.userId)
    .select("id");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
  if (!data || data.length === 0) {
    return new Response(
      JSON.stringify({ error: "Profile not found", userId: body.userId }),
      { status: 404, headers: { "content-type": "application/json" } },
    );
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" },
  });
}
