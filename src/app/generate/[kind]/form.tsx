"use client";

import { useState } from "react";
import { parseRef, refToString } from "@/lib/bible/parse-ref";
import { usePreferences } from "@/lib/preferences/provider";
import { getTranslationOrDefault } from "@/lib/bible/translations";

type Props = { kind: string; initialRef?: string };

export function GenerateForm({ kind, initialRef = "" }: Props) {
  const { preferences } = usePreferences();
  const [refInput, setRefInput] = useState(initialRef);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = parseRef(refInput);
    if (!parsed) {
      setError(`Could not read "${refInput}". Try "Romans 8" or "John 3:16-18".`);
      return;
    }

    setLoading(true);
    setOutput("");

    try {
      const translation = getTranslationOrDefault(preferences.translation);
      const chapterRes = await fetch(
        `https://bible.helloao.org/api/${translation.id}/${parsed.book.id}/${parsed.chapter}.json`,
        { cache: "force-cache" },
      );
      const data = await chapterRes.json();

      const verses: { number: number; text: string }[] = [];
      for (const c of data.chapter.content) {
        if (c.type !== "verse") continue;
        const text = c.content
          .map((x: unknown) => {
            if (typeof x === "string") return x;
            if (x && typeof x === "object" && "text" in x)
              return String((x as { text?: string }).text ?? "");
            return "";
          })
          .join("");
        verses.push({ number: c.number, text });
      }

      const startV = parsed.verseStart ?? 1;
      const endV = parsed.verseEnd ?? parsed.verseStart ?? verses.length;
      const filtered = verses.filter(
        (v) => v.number >= startV && v.number <= endV,
      );
      const passageText = filtered
        .map((v) => `${v.number} ${v.text}`)
        .join(" ");

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind,
          passage: refToString(parsed),
          passageText,
          lens: preferences.lens,
          denomination: preferences.denomination,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(
          body?.error ??
            "Generation failed. Make sure ANTHROPIC_API_KEY is set on the server.",
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
        setOutput(acc);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={submit}>
        <label className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
          Passage
        </label>
        <div className="mt-2 flex items-stretch border border-rule-strong bg-paper focus-within:border-accent h-12">
          <input
            type="text"
            value={refInput}
            onChange={(e) => setRefInput(e.target.value)}
            placeholder="John 3:16-18, Romans 8, Psalm 23"
            className="flex-1 bg-transparent px-4 outline-none text-[1rem] text-ink placeholder:text-ink-subtle"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 bg-accent text-paper text-[0.875rem] font-medium hover:bg-accent-2 transition-colors disabled:opacity-50"
          >
            {loading ? "Writing…" : "Generate"}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-[0.8125rem] text-flag">{error}</p>
        )}
        <p className="mt-2 text-[0.75rem] text-ink-muted">
          Using preferences: {preferences.lens === "none" ? "no declared lens" : preferences.lens}
          {preferences.denomination !== "none" && ` · ${preferences.denomination}`}.{" "}
          <a href="/settings" className="text-accent hover:underline">
            Adjust
          </a>
        </p>
      </form>

      {(output || loading) && (
        <article className="mt-12 pt-8 border-t border-rule">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-3">
            Output
          </div>
          <div className="serif text-[1.0625rem] leading-[1.75] text-ink whitespace-pre-wrap">
            {output}
            {loading && (
              <span className="inline-block w-2 h-5 bg-ink-muted align-middle animate-pulse ml-1" />
            )}
          </div>
          {output && !loading && (
            <div className="mt-6 flex items-center gap-3 text-[0.8125rem]">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(output);
                }}
                className="px-3 py-1.5 border border-rule-strong text-ink hover:bg-paper-2 transition-colors"
              >
                Copy text
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-1.5 border border-rule-strong text-ink hover:bg-paper-2 transition-colors"
              >
                Print / save as PDF
              </button>
            </div>
          )}
        </article>
      )}
    </div>
  );
}
