import { dailyVerse } from "@/data/daily-verses";

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "cache-control": "public, max-age=3600",
  "content-type": "application/json",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET() {
  return new Response(
    JSON.stringify({
      ...dailyVerse(),
      _docs: "https://askscripture.com/api-docs",
    }),
    { headers: CORS },
  );
}
