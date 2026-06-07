import { getCurrentUser } from "@/lib/auth/user";

/**
 * Minimal info about the current user for client components.
 * Deliberately does NOT include `isAdmin`, full email, or any other
 * field that would help an XSS payload pivot. Admin UI is server-rendered.
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return new Response(
      JSON.stringify({ signedIn: false, tier: "anonymous", isPro: false }),
      {
        headers: {
          "content-type": "application/json",
          "cache-control": "no-store",
        },
      },
    );
  }
  return new Response(
    JSON.stringify({
      signedIn: true,
      tier: user.unlimited ? "lifetime" : "free",
      isPro: user.unlimited,
    }),
    {
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
      },
    },
  );
}
