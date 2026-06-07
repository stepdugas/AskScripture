import { ImageResponse } from "next/og";
import { bookBySlug } from "@/lib/bible/books";

export const alt = "AskScripture chapter";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Params = { book: string; chapter: string };

export default async function OG({ params }: { params: Params }) {
  const { book: bookSlug, chapter } = params;
  const book = bookBySlug(bookSlug);
  const chapNum = parseInt(chapter, 10);

  if (!book) {
    return new ImageResponse(
      <div style={{ background: "#FBFAF7", width: "100%", height: "100%" }} />,
      size,
    );
  }

  let firstVerseText = "";
  try {
    const res = await fetch(
      `https://bible.helloao.org/api/BSB/${book.id}/${chapNum}.json`,
      { cache: "force-cache" },
    );
    const data = await res.json();
    const firstVerse = (data.chapter?.content ?? []).find(
      (c: { type: string }) => c.type === "verse",
    );
    if (firstVerse) {
      firstVerseText = (firstVerse.content ?? [])
        .map((x: unknown) =>
          typeof x === "string"
            ? x
            : x && typeof x === "object" && "text" in x
              ? String((x as { text?: string }).text ?? "")
              : "",
        )
        .join("")
        .slice(0, 220);
    }
  } catch {
    /* graceful fallback */
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#FBFAF7",
          padding: 80,
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Arial",
            fontSize: 20,
            color: "#5B6271",
            letterSpacing: 4,
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          <span>AskScripture</span>
          <span>{book.testament === "OT" ? "Old Testament" : "New Testament"} · {book.section}</span>
        </div>

        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
          <div
            style={{
              borderLeft: "4px solid #1B2845",
              paddingLeft: 60,
              maxWidth: 1040,
            }}
          >
            <div
              style={{
                fontSize: 96,
                lineHeight: 1.02,
                color: "#14171F",
                fontWeight: 600,
                letterSpacing: -2,
              }}
            >
              {book.name}{" "}
              <span style={{ color: "#5B6271", fontWeight: 400 }}>
                {chapNum}
              </span>
            </div>
            {firstVerseText && (
              <div
                style={{
                  marginTop: 32,
                  fontSize: 28,
                  lineHeight: 1.45,
                  color: "#2A2F3D",
                  fontStyle: "italic",
                }}
              >
                “{firstVerseText.trim()}…”
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Arial",
            fontSize: 20,
            color: "#5B6271",
          }}
        >
          <span>Read with context, not commentary.</span>
          <span>askscripture.com</span>
        </div>
      </div>
    ),
    size,
  );
}
