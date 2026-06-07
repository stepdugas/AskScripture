import { FREE_TRANSLATIONS } from "@/lib/bible/translations";

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "cache-control": "public, max-age=86400",
  "content-type": "application/json",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET() {
  return new Response(
    JSON.stringify({
      translations: FREE_TRANSLATIONS,
      _docs: "https://askscripture.com/api-docs",
    }),
    { headers: CORS },
  );
}
