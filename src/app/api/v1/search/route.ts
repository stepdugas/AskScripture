import { searchVerses } from "@/lib/bible/search";

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "cache-control": "public, max-age=300",
  "content-type": "application/json",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(
    100,
    Math.max(1, parseInt(url.searchParams.get("limit") ?? "50", 10) || 50),
  );

  if (!q) {
    return new Response(
      JSON.stringify({ query: q, hits: [], total: 0, tokens: [] }),
      { headers: CORS },
    );
  }

  const result = await searchVerses(q, limit);
  return new Response(
    JSON.stringify({
      query: q,
      total: result.total,
      returned: result.hits.length,
      tokens: result.tokens,
      hits: result.hits.map((h) => ({
        ref: `${h.bookName} ${h.chapter}:${h.verse}`,
        bookSlug: h.bookSlug,
        chapter: h.chapter,
        verse: h.verse,
        text: h.text,
        score: h.score,
        href: `/${h.bookSlug}/${h.chapter}#v${h.verse}`,
      })),
      _docs: "https://askscripture.com/api-docs",
      _note: "Searches BSB only. Token-AND scoring with phrase boost.",
    }),
    { headers: CORS },
  );
}
