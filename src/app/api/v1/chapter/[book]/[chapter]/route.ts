import { bookBySlug } from "@/lib/bible/books";
import { getChapter } from "@/lib/bible/api";
import { getTranslationOrDefault } from "@/lib/bible/translations";

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
  req: Request,
  { params }: { params: Promise<Params> },
) {
  const { book: bookSlug, chapter } = await params;
  const url = new URL(req.url);
  const translationId = url.searchParams.get("t") ?? "BSB";

  const book = bookBySlug(bookSlug);
  if (!book) {
    return new Response(
      JSON.stringify({ error: "Book not found", slug: bookSlug }),
      { status: 404, headers: CORS },
    );
  }
  const chap = parseInt(chapter, 10);
  if (!Number.isInteger(chap) || chap < 1 || chap > book.chapters) {
    return new Response(
      JSON.stringify({ error: "Chapter out of range" }),
      { status: 404, headers: CORS },
    );
  }
  const translation = getTranslationOrDefault(translationId);

  try {
    const data = await getChapter(translation.id, book.id, chap);
    return new Response(
      JSON.stringify({
        book: {
          slug: book.slug,
          name: book.name,
          testament: book.testament,
          section: book.section,
        },
        chapter: chap,
        translation: {
          id: translation.id,
          shortName: translation.shortName,
          name: translation.name,
        },
        verses: data.chapter.content
          .filter((c) => c.type === "verse")
          .map((c) => {
            const v = c as { type: "verse"; number: number; content: unknown[] };
            return {
              number: v.number,
              text: v.content
                .map((x) =>
                  typeof x === "string"
                    ? x
                    : x && typeof x === "object" && "text" in x
                      ? String((x as { text?: string }).text ?? "")
                      : "",
                )
                .join("")
                .replace(/\s+/g, " ")
                .trim(),
            };
          }),
        footnotes: data.chapter.footnotes,
        _docs: "https://askscripture.com/api-docs",
      }),
      { headers: CORS },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Upstream Bible API failed",
        details: err instanceof Error ? err.message : "unknown",
      }),
      { status: 502, headers: CORS },
    );
  }
}
