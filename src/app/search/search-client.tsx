"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Hit = {
  ref: string;
  bookSlug: string;
  chapter: number;
  verse: number;
  text: string;
  score: number;
  href: string;
};

type Response = {
  query: string;
  total: number;
  returned: number;
  tokens: string[];
  hits: Hit[];
};

export function SearchClient({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(initialQuery);
  const [data, setData] = useState<Response | null>(null);
  const [loading, setLoading] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync URL ?q= when user types (debounced)
  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      const usp = new URLSearchParams(params.toString());
      if (q.trim()) usp.set("q", q.trim());
      else usp.delete("q");
      router.replace(`/search${usp.toString() ? `?${usp}` : ""}`, {
        scroll: false,
      });
    }, 400);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [q, router, params]);

  // Run the search whenever URL ?q= changes
  useEffect(() => {
    const query = params.get("q")?.trim() ?? "";
    if (!query) {
      setData(null);
      return;
    }
    setLoading(true);
    const ctl = new AbortController();
    fetch(`/api/v1/search?q=${encodeURIComponent(query)}&limit=80`, {
      signal: ctl.signal,
    })
      .then((r) => r.json())
      .then((d: Response) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => ctl.abort();
  }, [params]);

  function highlightText(text: string, tokens: string[]) {
    if (tokens.length === 0) return text;
    const pattern = new RegExp(
      `(${tokens.map((t) => t.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")).join("|")})`,
      "gi",
    );
    const parts = text.split(pattern);
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <mark
          key={i}
          className="bg-accent/15 text-accent rounded-none px-0.5"
        >
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      ),
    );
  }

  return (
    <div>
      <div className="flex items-stretch border border-rule-strong bg-paper focus-within:border-accent h-12">
        <input
          type="text"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="bread of life, kingdom, mustard seed, …"
          className="flex-1 bg-transparent px-4 outline-none text-[1rem] text-ink placeholder:text-ink-subtle"
          aria-label="Search query"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ("")}
            className="px-3 text-ink-muted hover:text-ink text-[0.8125rem]"
            aria-label="Clear"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mt-6 min-h-[8rem]">
        {!data && !loading && (
          <p className="text-[0.9375rem] text-ink-muted">
            Try{" "}
            <button
              type="button"
              className="text-accent hover:underline"
              onClick={() => setQ("bread of life")}
            >
              bread of life
            </button>
            ,{" "}
            <button
              type="button"
              className="text-accent hover:underline"
              onClick={() => setQ("kingdom of heaven")}
            >
              kingdom of heaven
            </button>
            ,{" "}
            <button
              type="button"
              className="text-accent hover:underline"
              onClick={() => setQ("the meek")}
            >
              the meek
            </button>
            .
          </p>
        )}

        {loading && (
          <p className="text-[0.8125rem] text-ink-muted">Searching…</p>
        )}

        {data && (
          <>
            <p className="text-[0.8125rem] text-ink-muted">
              {data.total === 0
                ? "No matches."
                : `${data.total.toLocaleString()} match${data.total === 1 ? "" : "es"} — showing ${data.returned}.`}
            </p>
            {data.hits.length > 0 && (
              <ol className="mt-4 divide-y divide-rule border-y border-rule">
                {data.hits.map((h) => (
                  <li key={`${h.bookSlug}-${h.chapter}-${h.verse}`} className="py-4">
                    <Link
                      href={h.href}
                      className="block sm:grid sm:grid-cols-[7rem_1fr] sm:gap-x-5 sm:items-baseline group"
                    >
                      <span className="block font-mono text-[0.75rem] text-ink-muted tabular-nums mb-1 sm:mb-0">
                        {h.ref}
                      </span>
                      <p className="serif text-[1rem] leading-7 text-ink group-hover:text-accent transition-colors">
                        {highlightText(h.text, data.tokens)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </>
        )}
      </div>
    </div>
  );
}
