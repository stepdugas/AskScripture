"use client";

import { useEffect, useState } from "react";
import { usePreferences } from "@/lib/preferences/provider";
import { getTranslationOrDefault } from "@/lib/bible/translations";

type Props = {
  bookSlug: string;
  bookId: string;
  bookName: string;
  chapter: number;
};

export function StoryClient({ bookSlug, bookId, bookName, chapter }: Props) {
  const { preferences } = usePreferences();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      setText("");
      try {
        const translation = getTranslationOrDefault(preferences.translation);
        const chapterRes = await fetch(
          `https://bible.helloao.org/api/${translation.id}/${bookId}/${chapter}.json`,
          { cache: "force-cache" },
        );
        const data = await chapterRes.json();
        const verses: string[] = [];
        for (const c of data.chapter.content) {
          if (c.type !== "verse") continue;
          const t = c.content
            .map((x: unknown) =>
              typeof x === "string"
                ? x
                : x && typeof x === "object" && "text" in x
                  ? String((x as { text?: string }).text ?? "")
                  : "",
            )
            .join("");
          verses.push(`${c.number} ${t}`);
        }
        const passageText = verses.join(" ");

        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            kind: "story",
            passage: `${bookName} ${chapter}`,
            passageText,
            lens: preferences.lens,
            denomination: preferences.denomination,
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          if (!cancelled)
            setError(
              body?.error ??
                "Couldn't generate. Make sure ANTHROPIC_API_KEY is set on the server.",
            );
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
          setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [bookId, bookName, chapter, preferences.translation, preferences.lens, preferences.denomination]);

  if (error) {
    return (
      <div className="text-[0.875rem] text-flag bg-flag/10 border border-flag/30 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="serif text-[1.0625rem] leading-[1.85] text-ink whitespace-pre-wrap">
      {text}
      {loading && (
        <span className="inline-block w-2 h-5 bg-ink-muted align-middle animate-pulse ml-1" />
      )}
    </div>
  );
}
