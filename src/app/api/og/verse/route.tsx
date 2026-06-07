import { ImageResponse } from "next/og";
import { parseRef, refToString } from "@/lib/bible/parse-ref";
import { getTranslationOrDefault } from "@/lib/bible/translations";


const WIDTH = 1200;
const HEIGHT = 1200;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref") ?? "John 3:16";
  const translationId = searchParams.get("t") ?? "BSB";

  const parsed = parseRef(ref);
  let verseText = "";
  let title = ref;

  if (parsed) {
    title = refToString(parsed);
    try {
      const res = await fetch(
        `https://bible.helloao.org/api/${getTranslationOrDefault(translationId).id}/${parsed.book.id}/${parsed.chapter}.json`,
        { cache: "force-cache" },
      );
      const data = await res.json();
      const verses: { number: number; text: string }[] = [];
      for (const c of data.chapter.content) {
        if (c.type !== "verse") continue;
        const text = c.content
          .map((x: unknown) =>
            typeof x === "string"
              ? x
              : x && typeof x === "object" && "text" in x
                ? String((x as { text?: string }).text ?? "")
                : "",
          )
          .join("");
        verses.push({ number: c.number, text });
      }
      const startV = parsed.verseStart ?? 1;
      const endV = parsed.verseEnd ?? parsed.verseStart ?? Math.min(verses.length, 5);
      const slice = verses.filter(
        (v) => v.number >= startV && v.number <= endV,
      );
      verseText = slice.map((v) => v.text).join(" ").trim();
    } catch {
      verseText = "(passage unavailable)";
    }
  }

  const trimmed =
    verseText.length > 600 ? verseText.slice(0, 580).trim() + "…" : verseText;
  const translation = getTranslationOrDefault(translationId);

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
            alignItems: "center",
            fontSize: 22,
            color: "#5B6271",
            letterSpacing: 4,
            textTransform: "uppercase",
            fontFamily: "Arial",
            fontWeight: 500,
          }}
        >
          <span>AskScripture</span>
          <span>{translation.shortName}</span>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 40,
            paddingBottom: 40,
          }}
        >
          <div
            style={{
              borderLeft: "4px solid #1B2845",
              paddingLeft: 60,
              fontSize: 56,
              lineHeight: 1.4,
              color: "#14171F",
              maxWidth: 980,
            }}
          >
            “{trimmed || "—"}”
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontFamily: "Arial",
            fontSize: 28,
            color: "#14171F",
          }}
        >
          <span style={{ fontStyle: "italic" }}>{title}</span>
          <span style={{ fontSize: 18, color: "#8B92A0" }}>
            askscripture.com
          </span>
        </div>
      </div>
    ),
    { width: WIDTH, height: HEIGHT },
  );
}
