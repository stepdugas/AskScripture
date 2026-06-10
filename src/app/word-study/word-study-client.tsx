"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { BiasFlag } from "@/data/bias-flags";
import { bookBySlug } from "@/lib/bible/books";
import { cn } from "@/lib/utils/cn";

type Props = {
  flags: BiasFlag[];
};

const TAG_LABELS: Record<string, string> = {
  gender: "Gender",
  sexuality: "Sexuality",
  creation: "Creation",
  afterlife: "Afterlife",
  atonement: "Atonement",
  authority: "Authority",
  slavery: "Slavery",
  christology: "Christology",
  messianic: "Messianic",
};

const TAG_ORDER = Object.keys(TAG_LABELS) as (keyof typeof TAG_LABELS)[];

export function WordStudyClient({ flags }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const sorted = useMemo(() => {
    return [...flags].sort((a, b) => {
      const ao = bookBySlug(a.bookSlug)?.order ?? 999;
      const bo = bookBySlug(b.bookSlug)?.order ?? 999;
      if (ao !== bo) return ao - bo;
      if (a.chapter !== b.chapter) return a.chapter - b.chapter;
      return a.verses[0] - b.verses[0];
    });
  }, [flags]);

  const filtered = useMemo(() => {
    if (!activeTag) return sorted;
    return sorted.filter((f) =>
      (f.tags as readonly string[]).includes(activeTag),
    );
  }, [sorted, activeTag]);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const tag of TAG_ORDER) {
      counts[tag] = flags.filter((f) =>
        (f.tags as readonly string[]).includes(tag),
      ).length;
    }
    return counts;
  }, [flags]);

  return (
    <>
      <div
        className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-rule pt-6"
        role="tablist"
        aria-label="Filter by topic"
      >
        <span className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mr-2">
          Filter
        </span>
        <button
          type="button"
          role="tab"
          aria-selected={activeTag === null}
          onClick={() => setActiveTag(null)}
          className={cn(
            "h-8 px-3 text-[0.8125rem] border transition-colors",
            activeTag === null
              ? "bg-accent text-paper border-accent"
              : "border-rule-strong text-ink-muted hover:text-accent hover:border-accent",
          )}
        >
          All
          <span className="ml-1.5 font-mono text-[0.6875rem] opacity-70">
            {flags.length}
          </span>
        </button>
        {TAG_ORDER.map((tag) => {
          const count = tagCounts[tag];
          if (count === 0) return null;
          const active = activeTag === tag;
          return (
            <button
              key={tag}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTag(active ? null : tag)}
              className={cn(
                "h-8 px-3 text-[0.8125rem] border transition-colors",
                active
                  ? "bg-accent text-paper border-accent"
                  : "border-rule-strong text-ink-muted hover:text-accent hover:border-accent",
              )}
            >
              {TAG_LABELS[tag]}
              <span className="ml-1.5 font-mono text-[0.6875rem] opacity-70">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <ol className="mt-6 divide-y divide-rule">
        {filtered.map((flag, idx) => {
          const book = bookBySlug(flag.bookSlug);
          return (
            <li key={flag.id} className="py-6">
              <Link
                href={`/word-study/${flag.id}`}
                className="block group"
              >
                <div className="grid grid-cols-12 gap-x-6">
                  <div className="col-span-1 font-mono text-[0.6875rem] text-ink-subtle pt-1">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div className="col-span-11">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-mono text-[0.75rem] text-ink-muted">
                        {book?.abbr ?? flag.bookSlug} {flag.chapter}:
                        {flag.verses.join(",")}
                      </span>
                      <span className="font-mono text-[0.8125rem] text-flag">
                        {flag.script}
                      </span>
                      <span className="font-mono text-[0.6875rem] text-ink-subtle">
                        {flag.term}
                      </span>
                    </div>
                    <h2 className="serif mt-2 text-[1.25rem] leading-snug text-ink font-semibold group-hover:text-accent transition-colors">
                      {flag.headline}
                    </h2>
                    <p className="mt-2 text-[0.9375rem] leading-6 text-ink-muted max-w-[68ch]">
                      {flag.summary}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-[0.875rem] text-ink-muted">
          No entries match this filter yet.
        </p>
      )}
    </>
  );
}
