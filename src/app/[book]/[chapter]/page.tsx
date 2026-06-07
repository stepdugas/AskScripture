import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { ScriptureRenderer } from "@/components/scripture-renderer";
import { InteractiveScripture } from "@/components/interactive-scripture";
import { RecordRead } from "@/components/record-read";
import { ChapterNav } from "@/components/chapter-nav";
import { StudyPanel } from "@/components/study-panel";
import { TranslationSwitcher } from "@/components/translation-switcher";
import { AudioPlayer } from "@/components/audio-player";
import { MobileReaderToolbar } from "@/components/mobile-reader-toolbar";
import { ChapterReaderSkeleton } from "@/components/skeletons";
import { bookBySlug, type CanonicalBook } from "@/lib/bible/books";
import { getChapter } from "@/lib/bible/api";
import {
  DEFAULT_TRANSLATION_ID,
  getTranslationOrDefault,
} from "@/lib/bible/translations";

type Params = { book: string; chapter: string };
type Search = { t?: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { book: bookSlug, chapter } = await params;
  const book = bookBySlug(bookSlug);
  if (!book) return {};
  const chapNum = parseInt(chapter, 10);
  return {
    title: `${book.name} ${chapNum}`,
    description: `${book.name} chapter ${chapNum} with side-by-side translations, original-language word studies, cross-references, and historical context. From AskScripture.`,
    alternates: {
      canonical: `/${book.slug}/${chapNum}`,
    },
    openGraph: {
      title: `${book.name} ${chapNum}`,
      description: `Read ${book.name} ${chapNum} with study tools.`,
    },
  };
}

export default function ChapterPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  return (
    <Suspense fallback={<ChapterReaderSkeleton />}>
          <ChapterContent params={params} searchParams={searchParams} />
        </Suspense>
  );
}

async function ChapterContent({
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

  const translation = getTranslationOrDefault(sp.t ?? DEFAULT_TRANSLATION_ID);
  const data = await getChapter(translation.id, book.id, chapNum);

  const prevHref = chapNum > 1 ? `/${book.slug}/${chapNum - 1}` : null;
  const nextHref =
    chapNum < book.chapters ? `/${book.slug}/${chapNum + 1}` : null;

  return (
    <>
    <div className="mx-auto max-w-[1320px] px-6 lg:px-10 pt-10 pb-20">
      <ReferenceBar
        book={book}
        chapter={chapNum}
        translationShort={data.translation.shortName ?? data.translation.id}
      />

      <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10">
        <aside className="hidden lg:block col-span-2">
          <div className="sticky top-6">
            <ChapterNav book={book} currentChapter={chapNum} />
          </div>
        </aside>

        <article className="col-span-12 lg:col-span-7 pb-20 lg:pb-0">
          <RecordRead bookSlug={book.slug} chapter={chapNum} />
          <AudioPlayer
            bookId={book.id}
            chapter={chapNum}
            bookName={book.name}
          />
          <InteractiveScripture
            bookSlug={book.slug}
            chapter={chapNum}
          >
            <ScriptureRenderer content={data.chapter.content} />
          </InteractiveScripture>

          {data.chapter.footnotes.length > 0 && (
            <section className="mt-12 pt-6 border-t border-rule">
              <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-4">
                Footnotes
              </div>
              <ol className="space-y-2 text-[0.8125rem] leading-6 text-ink-muted">
                {data.chapter.footnotes.map((fn) => (
                  <li
                    key={fn.noteId}
                    className="grid grid-cols-[3.5rem_1fr] gap-x-3"
                  >
                    <span className="tabular-nums text-ink-subtle">
                      {fn.reference
                        ? `${fn.reference.chapter}:${fn.reference.verse}`
                        : "—"}
                    </span>
                    <span>{fn.text}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <nav
            aria-label="Chapter navigation"
            className="mt-16 pt-6 border-t border-rule flex items-center justify-between text-[0.8125rem]"
          >
            {prevHref ? (
              <Link
                href={prevHref}
                className="inline-flex items-center gap-2 text-ink-muted hover:text-ink transition-colors"
              >
                <span className="text-ink-subtle">←</span>
                <span>
                  {book.name} {chapNum - 1}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {nextHref ? (
              <Link
                href={nextHref}
                className="inline-flex items-center gap-2 text-ink-muted hover:text-ink transition-colors"
              >
                <span>
                  {book.name} {chapNum + 1}
                </span>
                <span className="text-ink-subtle">→</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </article>

        <aside className="hidden lg:block col-span-3">
          <div className="sticky top-6">
            <StudyPanel
              bookSlug={book.slug}
              bookName={book.name}
              chapter={chapNum}
              translationId={translation.id}
            />
          </div>
        </aside>
      </div>

      <MobileReaderToolbar
        bookSlug={book.slug}
        bookName={book.name}
        chapter={chapNum}
        translationId={translation.id}
        totalChapters={book.chapters}
      />
    </div>
    </>
  );
}

function ReferenceBar({
  book,
  chapter,
  translationShort,
}: {
  book: CanonicalBook;
  chapter: number;
  translationShort: string;
}) {
  return (
    <div className="hairline pb-4 mb-10 grid grid-cols-12 gap-6 items-end">
      <div className="col-span-12 lg:col-span-7 lg:col-start-3">
        <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
          {book.testament === "OT" ? "Old Testament" : "New Testament"}
          <span className="mx-2 text-rule-strong">/</span>
          {book.section}
        </div>
        <h1 className="serif mt-1.5 text-[2.25rem] leading-[1.05] tracking-tight text-ink font-semibold">
          {book.name}{" "}
          <span className="text-ink-muted font-normal">{chapter}</span>
        </h1>
      </div>
      <div className="hidden lg:flex col-span-3 lg:col-start-10 justify-end">
        <TranslationSwitcher current={translationShort} align="right" />
      </div>
    </div>
  );
}

// Editorial skeleton is shared from components/skeletons.tsx
// (the local one used `rounded-sm` which violates the system).
