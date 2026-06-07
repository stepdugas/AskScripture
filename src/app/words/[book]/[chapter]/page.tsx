import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { bookBySlug, type CanonicalBook } from "@/lib/bible/books";
import { getWordsForChapter } from "@/lib/bible/word-study";
import { WordStudySkeleton } from "@/components/skeletons";

type Params = { book: string; chapter: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { book: bookSlug, chapter } = await params;
  const book = bookBySlug(bookSlug);
  if (!book) return {};
  const chapNum = parseInt(chapter, 10);
  return {
    title: `Word study · ${book.name} ${chapNum}`,
    description: `Original-language word-by-word study of ${book.name} ${chapNum} — Greek text, transliteration, lemma, gloss, and morphology from STEPBible (CC BY 4.0).`,
  };
}

export default function WordsPage({ params }: { params: Promise<Params> }) {
  return (
    <Suspense fallback={<WordStudySkeleton />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: { params: Promise<Params> }) {
  const { book: bookSlug, chapter } = await params;
  const book = bookBySlug(bookSlug);
  if (!book) notFound();

  const chapNum = parseInt(chapter, 10);
  if (!Number.isInteger(chapNum) || chapNum < 1 || chapNum > book.chapters) {
    notFound();
  }

  const wordsByVerse = await getWordsForChapter(book.slug, chapNum);
  const verseNumbers = Object.keys(wordsByVerse)
    .map((n) => parseInt(n, 10))
    .sort((a, b) => a - b);

  return (
    <div className="mx-auto max-w-[1200px] px-6 lg:px-10 pt-12 pb-24">
      <div className="hairline pb-4 mb-10">
        <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
          Word study
          <span className="mx-2 text-rule-strong">/</span>
          {book.testament === "NT" ? "Greek" : "Hebrew"}
        </div>
        <h1 className="serif mt-2 text-[2rem] leading-[1.05] tracking-tight text-ink font-semibold">
          {book.name}{" "}
          <span className="text-ink-muted font-normal">{chapNum}</span>
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[0.8125rem] text-ink-muted">
          <Link
            href={`/${book.slug}/${chapNum}`}
            className="hover:text-accent"
          >
            ← Read the chapter
          </Link>
          <span className="text-rule-strong">·</span>
          <Link
            href={`/compare/${book.slug}/${chapNum}`}
            className="hover:text-accent"
          >
            Compare translations
          </Link>
        </div>
      </div>

      {verseNumbers.length === 0 ? (
        <NoData book={book} />
      ) : (
        <div className="space-y-12">
          {verseNumbers.map((n) => (
            <VerseSection
              key={n}
              verse={n}
              words={wordsByVerse[n]}
              isNT={book.testament === "NT"}
            />
          ))}
        </div>
      )}

      <p className="mt-16 pt-6 border-t border-rule text-[0.75rem] text-ink-muted max-w-[64ch]">
        Data from STEPBible (CC&nbsp;BY 4.0) by Tyndale House Cambridge.{" "}
        <Link href="/sources" className="text-accent hover:underline">
          See full attribution
        </Link>
        .
      </p>
    </div>
  );
}

function VerseSection({
  verse,
  words,
  isNT,
}: {
  verse: number;
  words: import("@/lib/bible/word-study").WordEntry[];
  isNT: boolean;
}) {
  return (
    <section id={`v${verse}`}>
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-3">
        Verse {verse}
      </div>
      <div className="border-t border-rule">
        {/* Header row — only renders at md+ where the 6-col grid is comfortable */}
        <div className="hidden md:grid grid-cols-[2.5rem_2.25fr_1.5fr_2.5fr_1.75fr_1fr] gap-x-4 py-2 text-[0.625rem] uppercase tracking-[0.16em] text-ink-subtle font-medium border-b border-rule">
          <div>#</div>
          <div>{isNT ? "Greek" : "Hebrew"} · Transliteration</div>
          <div>Gloss</div>
          <div>Lemma · Dictionary form</div>
          <div>Strong's</div>
          <div>Morph</div>
        </div>
        {words.map((w, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 md:grid-cols-[2.5rem_2.25fr_1.5fr_2.5fr_1.75fr_1fr] gap-x-4 py-3 border-b border-rule items-baseline text-[0.8125rem]"
          >
            {/* Mobile: stacked card. Desktop: row. */}
            <div className="md:hidden flex items-baseline justify-between gap-3 mb-1">
              <span className="font-mono text-[1.125rem] text-ink" dir={w.hebrew ? "rtl" : "ltr"}>
                {w.greek ?? w.hebrew}
              </span>
              <span className="font-mono text-[0.625rem] text-ink-subtle tabular-nums">
                {String(idx + 1).padStart(2, "0")} · {w.strongs}
              </span>
            </div>
            <div className="md:hidden font-mono text-[0.75rem] text-ink-muted italic mb-1.5">
              {w.translit}
            </div>
            <div className="md:hidden serif italic text-ink leading-6 mb-1.5">
              {w.gloss}
            </div>
            <div className="md:hidden text-[0.75rem] text-ink-muted mb-0.5">
              <span className="font-mono text-ink">{w.lemma}</span>
              {w.lemmaGloss && <span> · {w.lemmaGloss}</span>}
            </div>
            <div className="md:hidden font-mono text-[0.625rem] text-ink-subtle">
              {w.morph}
            </div>

            {/* Desktop columns */}
            <div className="hidden md:block font-mono text-[0.6875rem] text-ink-subtle tabular-nums">
              {String(idx + 1).padStart(2, "0")}
            </div>
            <div className="hidden md:block">
              <span
                className="font-mono text-[1.0625rem] text-ink"
                dir={w.hebrew ? "rtl" : "ltr"}
              >
                {w.greek ?? w.hebrew}
              </span>
              <div className="font-mono text-[0.6875rem] text-ink-muted italic">
                {w.translit}
              </div>
            </div>
            <div className="hidden md:block serif italic text-ink leading-5">
              {w.gloss}
            </div>
            <div className="hidden md:block">
              <span className="font-mono text-[0.9375rem] text-ink">
                {w.lemma}
              </span>
              {w.lemmaGloss && (
                <div className="text-[0.6875rem] text-ink-muted">
                  {w.lemmaGloss}
                </div>
              )}
            </div>
            <div className="hidden md:block font-mono text-[0.75rem] text-ink-muted tabular-nums">
              {w.strongs}
            </div>
            <div className="hidden md:block font-mono text-[0.6875rem] text-ink-muted">
              {w.morph}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function NoData({ book }: { book: CanonicalBook }) {
  return (
    <div className="border border-rule p-8 max-w-[640px]">
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
        Coming soon
      </div>
      <h2 className="serif mt-2 text-[1.25rem] font-semibold text-ink">
        {book.testament === "OT"
          ? "Hebrew word study"
          : "Greek word study"}{" "}
        for {book.name} isn&rsquo;t loaded yet.
      </h2>
      <p className="mt-3 text-[0.9375rem] leading-6 text-ink-muted">
        The Greek New Testament (TAGNT) is integrated and the Hebrew Old
        Testament (TAHOT) is on the way. In the meantime, the {""}
        <Link href="/word-study" className="text-accent hover:underline">
          translation debates index
        </Link>{" "}
        covers the most-contested terms with full original-language
        context.
      </p>
    </div>
  );
}
