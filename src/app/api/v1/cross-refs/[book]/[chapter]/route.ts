import { bookBySlug } from "@/lib/bible/books";
import { getCrossRefsForChapter, formatCrossRef } from "@/lib/bible/cross-refs";

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "cache-control": "public, max-age=86400",
  "content-type": "application/json",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

type Params = { book: string; chapter: string };

export async function GET(
  _req: Request,
  { params }: { params: Promise<Params> },
) {
  const { book: bookSlug, chapter } = await params;
  const book = bookBySlug(bookSlug);
  if (!book) {
    return new Response(JSON.stringify({ error: "Book not found" }), {
      status: 404,
      headers: CORS,
    });
  }
  const chap = parseInt(chapter, 10);
  if (!Number.isInteger(chap) || chap < 1 || chap > book.chapters) {
    return new Response(JSON.stringify({ error: "Chapter out of range" }), {
      status: 404,
      headers: CORS,
    });
  }
  const refs = await getCrossRefsForChapter(book.slug, chap);
  const out: Record<number, { ref: string; votes: number; href: string }[]> = {};
  for (const [verseStr, list] of Object.entries(refs)) {
    out[Number(verseStr)] = list.map((r) => ({
      ref: formatCrossRef(r),
      votes: r.votes,
      href: `/${r.slug}/${r.chap}#v${r.verse}`,
    }));
  }
  return new Response(
    JSON.stringify({
      book: book.slug,
      chapter: chap,
      crossRefs: out,
      _docs: "https://askscripture.com/api-docs",
    }),
    { headers: CORS },
  );
}
