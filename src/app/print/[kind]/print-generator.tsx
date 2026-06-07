"use client";

import { useEffect, useState } from "react";
import { parseRef } from "@/lib/bible/parse-ref";
import { usePreferences } from "@/lib/preferences/provider";
import { getTranslationOrDefault } from "@/lib/bible/translations";

export function PrintGenerator({
  kind,
  initialRef,
}: {
  kind: string;
  initialRef: string;
}) {
  const { preferences } = usePreferences();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialRef) {
      setError("No reference provided. Use ?ref=Romans+8.");
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function run() {
      try {
        const parsed = parseRef(initialRef);
        if (!parsed) {
          setError(`Couldn't read "${initialRef}".`);
          setLoading(false);
          return;
        }
        const translation = getTranslationOrDefault(preferences.translation);
        const chapterRes = await fetch(
          `https://bible.helloao.org/api/${translation.id}/${parsed.book.id}/${parsed.chapter}.json`,
          { cache: "force-cache" },
        );
        const data = await chapterRes.json();
        const verses: { number: number; text: string }[] = [];
        for (const c of data.chapter.content) {
          if (c.type !== "verse") continue;
          verses.push({
            number: c.number,
            text: c.content
              .map((x: unknown) =>
                typeof x === "string"
                  ? x
                  : x && typeof x === "object" && "text" in x
                    ? String((x as { text?: string }).text ?? "")
                    : "",
              )
              .join(""),
          });
        }
        const startV = parsed.verseStart ?? 1;
        const endV = parsed.verseEnd ?? parsed.verseStart ?? verses.length;
        const filtered = verses.filter(
          (v) => v.number >= startV && v.number <= endV,
        );
        const passageText = filtered.map((v) => `${v.number} ${v.text}`).join(" ");

        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            kind,
            passage: initialRef,
            passageText,
            lens: preferences.lens,
            denomination: preferences.denomination,
          }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          if (!cancelled)
            setError(body?.error ?? "Generation failed.");
          setLoading(false);
          return;
        }
        const reader = res.body?.getReader();
        const dec = new TextDecoder();
        let acc = "";
        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += dec.decode(value, { stream: true });
          if (!cancelled) setText(acc);
        }
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Unknown");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [kind, initialRef, preferences.translation, preferences.lens, preferences.denomination]);

  if (error) {
    return <p style={{ color: "#7a3b2e" }}>{error}</p>;
  }

  return (
    <div>
      <div className="body">{text}</div>
      {loading && <p style={{ color: "#5b6271" }}>Writing…</p>}
      {!loading && text && (
        <>
          <PrintButton />
        </>
      )}
    </div>
  );
}

function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      style={{
        marginTop: 24,
        background: "#1B2845",
        color: "#fbfaf7",
        border: "none",
        padding: "10px 20px",
        fontSize: 13,
        cursor: "pointer",
        fontFamily: "-apple-system, sans-serif",
      }}
      className="no-print"
    >
      Print / Save as PDF
    </button>
  );
}
