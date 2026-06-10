import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { ChapterNav } from "@/components/chapter-nav";
import { bookBySlug } from "@/lib/bible/books";
import { getChapter } from "@/lib/bible/api";
import { getTranslationOrDefault } from "@/lib/bible/translations";
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

  const aRaw = getTranslationOrDefault(sp.a ?? "BSB");
  const bRequested = getTranslationOrDefault(sp.b ?? "eng_kjv");
  // Defensive: if the two pickers resolved to the same translation, push the
  // right side to KJV (or BSB if A is already KJV). Prevents an empty-diff page.
  const a = aRaw;
  const b =
    bRequested.id === aRaw.id
      ? getTranslationOrDefault(aRaw.id === "eng_kjv" ? "BSB" : "eng_kjv")
      : bRequested;

  const [chapterA, chapterB] = await Promise.all([
    getChapter(a.id, book.id, chapNum),
    getChapter(b.id, book.id, chapNum),
  ]);

  const versesA = collectVerses(chapterA.chapter.content);
  const versesB = collectVerses(chapterB.chapter.content);
  const allVerseNumbers = Array.from(
    new Set([...versesA.keys(), ...versesB.keys()]),
  ).sort((x, y) => x - y);

  return (
    <div className="mx-auto max-w-[1320px] px-6 lg:px-10 pt-10 pb-20">
      <div className="hairline pb-5 mb-10 grid grid-cols-12 gap-6 items-end">
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
        <div className="col-span-12 lg:col-span-5 flex flex-col items-stretch lg:items-end gap-3 text-[0.75rem] text-ink-muted">
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
          {/* Desktop column headers — within grid, not sticky inside cell */}
          <div className="hidden md:grid grid-cols-2 gap-x-8 pb-3 mb-4 border-b border-rule-strong">
            <ColumnHeader t={a} side="a" />
            <ColumnHeader t={b} side="b" />
          </div>

          <div className="space-y-0 md:space-y-1">
            {allVerseNumbers.map((n) => {
              const textA = versesA.get(n) ?? "";
              const textB = versesB.get(n) ?? "";
              const { left, right } = diffTexts(textA, textB);
              return (
                <div
                  key={n}
                  id={`v${n}`}
                  className="md:grid md:grid-cols-2 md:gap-x-8 py-4 border-b border-rule"
                >
                  {/* Mobile: stacked A then B with side labels */}
                  <div className="md:hidden mb-1 text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-mono font-medium">
                    {a.shortName}
                  </div>
                  <VerseColumn
                    verseNumber={n}
                    segments={left}
                    side="a"
                  />
                  <div className="md:hidden mt-3 mb-1 text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-mono font-medium">
                    {b.shortName}
                  </div>
                  <VerseColumn
                    verseNumber={n}
                    segments={right}
                    side="b"
                  />
                </div>
              );
            })}
          </div>

          <p className="mt-12 pt-6 border-t border-rule text-[0.75rem] text-ink-muted leading-6 max-w-[64ch]">
            Highlighted words differ between the two translations. The deeper
            lexical reasons — when one translator chose “servant” and another
            chose “slave,” or “virgin” vs. “young woman” — are documented in
            the{" "}
            <Link
              href="/word-study"
              className="text-accent hover:underline"
            >
              translation debates index
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

function ColumnHeader({
  t,
  side,
}: {
  t: ReturnType<typeof getTranslationOrDefault>;
  side: "a" | "b";
}) {
  return (
    <div>
      <div
        className={
          "text-[0.6875rem] uppercase tracking-[0.16em] font-medium " +
          (side === "a" ? "text-accent" : "text-flag")
        }
      >
        {side === "a" ? "Left" : "Right"}
        <span className="mx-1.5 text-ink-subtle">·</span>
        <span className="text-ink-subtle">{t.shortName}</span>
      </div>
      <div className="serif text-[1.0625rem] text-ink mt-1">{t.name}</div>
      <div className="text-[0.75rem] text-ink-muted mt-0.5">
        {t.year ?? "—"} · {t.lens}
      </div>
    </div>
  );
}

function VerseColumn({
  verseNumber,
  segments,
  side,
}: {
  verseNumber: number;
  segments: { kind: "equal" | "diff"; text: string }[];
  side: "a" | "b";
}) {
  const diffClass =
    side === "a"
      ? "bg-accent/10 text-accent"
      : "bg-flag/10 text-flag";
  return (
    <p className="scripture">
      <sup className="verse-num">{verseNumber}</sup>{" "}
      {segments.map((seg, i) =>
        seg.kind === "equal" ? (
          <span key={i}>{seg.text}</span>
        ) : (
          <span key={i} className={diffClass}>
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
