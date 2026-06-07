import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { ChapterNav } from "@/components/chapter-nav";
import { bookBySlug } from "@/lib/bible/books";
import { getChapter } from "@/lib/bible/api";
import {
  FREE_TRANSLATIONS,
  getTranslationOrDefault,
} from "@/lib/bible/translations";
import { diffTexts } from "@/lib/bible/diff";
import type { ChapterContentItem } from "@/lib/bible/types";
import { CompareSwitcher } from "@/components/compare-switcher";
import { CompareSkeleton } from "@/components/skeletons";

type Params = { book: string; chapter: string };
type Search = { a?: string; b?: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { book: bookSlug, chapter } = await params;
  const book = bookBySlug(bookSlug);
  if (!book) return {};
  return {
    title: `Compare translations · ${book.name} ${parseInt(chapter, 10)}`,
    description: `Side-by-side comparison of ${book.name} ${chapter} across free English translations, with word-level differences highlighted.`,
  };
}

export default function ComparePage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  return (
    <Suspense fallback={<CompareSkeleton />}>
      <CompareContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function CompareContent({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const [{ book: bookSlug, chapter }, sp] = await Promise.all([
    params,
    searchParams,
  ]);
  const book = bookBySlug(bookSlug);
  if (!book) notFound();

  const chapNum = parseInt(chapter, 10);
  if (!Number.isInteger(chapNum) || chapNum < 1 || chapNum > book.chapters) {
    notFound();
  }

  const a = getTranslationOrDefault(sp.a ?? "BSB");
  const b = getTranslationOrDefault(sp.b ?? "eng_kjv");

  const [chapterA, chapterB] = await Promise.all([
    getChapter(a.id, book.id, chapNum),
    getChapter(b.id, book.id, chapNum),
  ]);

  // Extract verses keyed by number from each chapter
  const versesA = collectVerses(chapterA.chapter.content);
  const versesB = collectVerses(chapterB.chapter.content);
  const allVerseNumbers = Array.from(
    new Set([...versesA.keys(), ...versesB.keys()]),
  ).sort((x, y) => x - y);

  return (
    <>
    <div className="mx-auto max-w-[1320px] px-6 lg:px-10 pt-10 pb-20">
      <div className="hairline pb-4 mb-8 grid grid-cols-12 gap-6 items-end">
        <div className="col-span-12 lg:col-span-7">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            Compare translations
            <span className="mx-2 text-rule-strong">/</span>
            {book.testament === "OT" ? "Old Testament" : "New Testament"}
          </div>
          <h1 className="serif mt-1.5 text-[2.25rem] leading-[1.05] tracking-tight text-ink font-semibold">
            {book.name}{" "}
            <span className="text-ink-muted font-normal">{chapNum}</span>
          </h1>
        </div>
        <div className="col-span-12 lg:col-span-5 flex flex-col items-stretch lg:items-end gap-2 text-[0.75rem] text-ink-muted">
          <CompareSwitcher current={{ a: a.id, b: b.id }} />
          <Link
            href={`/${book.slug}/${chapNum}`}
            className="hover:text-ink"
          >
            ← Back to single-translation reader
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10">
        <aside className="hidden lg:block col-span-2">
          <div className="sticky top-6">
            <ChapterNav book={book} currentChapter={chapNum} />
          </div>
        </aside>

        <div className="col-span-12 lg:col-span-10">
          {/* Header row showing translation names (lg+) */}
          <div className="hidden lg:grid grid-cols-2 gap-x-8 pb-3 mb-4 border-b border-rule sticky top-0 bg-paper z-10">
            <ColumnHeader t={a} />
            <ColumnHeader t={b} />
          </div>

          {/* Mobile/tablet — stacked names so each column is labelled inline */}
          <div className="lg:hidden mb-4 pb-3 border-b border-rule grid grid-cols-2 gap-x-4 text-[0.6875rem]">
            <div>
              <div className="font-mono uppercase tracking-[0.16em] text-ink-subtle font-medium">
                {a.shortName}
              </div>
              <div className="serif text-[0.875rem] text-ink mt-0.5">{a.name}</div>
            </div>
            <div>
              <div className="font-mono uppercase tracking-[0.16em] text-ink-subtle font-medium">
                {b.shortName}
              </div>
              <div className="serif text-[0.875rem] text-ink mt-0.5">{b.name}</div>
            </div>
          </div>

          <div className="space-y-4">
            {allVerseNumbers.map((n) => {
              const textA = versesA.get(n) ?? "";
              const textB = versesB.get(n) ?? "";
              const { left, right } = diffTexts(textA, textB);
              return (
                <div
                  key={n}
                  className="grid grid-cols-2 gap-x-4 lg:gap-x-8 gap-y-2 py-3 border-b border-rule"
                >
                  <VerseColumn
                    verseNumber={n}
                    segments={left}
                    translation={a.shortName}
                  />
                  <VerseColumn
                    verseNumber={n}
                    segments={right}
                    translation={b.shortName}
                  />
                </div>
              );
            })}
          </div>

          <p className="mt-10 text-[0.75rem] text-ink-muted leading-6 max-w-[64ch]">
            Words highlighted in ink navy were rendered differently between
            translations. Underlying lexical decisions are documented in the {""}
            <Link href="/word-study" className="text-accent hover:underline">
              translation notes index
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
    </>
  );
}

function ColumnHeader({ t }: { t: ReturnType<typeof getTranslationOrDefault> }) {
  return (
    <div>
      <div className="font-mono text-[0.75rem] text-ink-subtle">
        {t.shortName}
      </div>
      <div className="serif text-[1rem] text-ink mt-0.5">{t.name}</div>
      <div className="text-[0.6875rem] text-ink-muted">
        {t.year ?? "—"} · {t.lens}
      </div>
    </div>
  );
}

function VerseColumn({
  verseNumber,
  segments,
  translation,
}: {
  verseNumber: number;
  segments: { kind: "equal" | "diff"; text: string }[];
  translation: string;
}) {
  return (
    <p className="scripture text-[1rem] leading-[1.75]">
      <span className="font-mono text-[0.625rem] text-ink-subtle mr-2 tabular-nums">
        {translation}
      </span>
      <sup className="verse-num">{verseNumber}</sup>{" "}
      {segments.map((seg, i) =>
        seg.kind === "equal" ? (
          <span key={i}>{seg.text}</span>
        ) : (
          <span
            key={i}
            className="bg-accent/10 text-accent border-b border-accent/40"
          >
            {seg.text}
          </span>
        ),
      )}
    </p>
  );
}

function collectVerses(content: ChapterContentItem[]): Map<number, string> {
  const out = new Map<number, string>();
  for (const item of content) {
    if (item.type !== "verse") continue;
    const text = item.content
      .map((c) => {
        if (typeof c === "string") return c;
        if (c.text) return c.text;
        if (c.lineBreak) return " ";
        return "";
      })
      .join("")
      .replace(/\s+/g, " ")
      .trim();
    out.set(item.number, text);
  }
  return out;
}
