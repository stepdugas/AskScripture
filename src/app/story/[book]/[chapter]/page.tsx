import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { bookBySlug } from "@/lib/bible/books";
import { StoryClient } from "./story-client";
import { GenericPageSkeleton } from "@/components/skeletons";

type Params = { book: string; chapter: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { book: bookSlug, chapter } = await params;
  const book = bookBySlug(bookSlug);
  if (!book) return {};
  const chapNum = parseInt(chapter, 10);
  return {
    title: `${book.name} ${chapNum} · Story mode`,
    description: `A cinematic retelling of ${book.name} ${chapNum}.`,
  };
}

export default function StoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  return (
    <Suspense fallback={<GenericPageSkeleton />}>
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

  return (
    <article className="mx-auto max-w-[760px] px-6 lg:px-10 pt-16 pb-24">
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
        Story mode
        <span className="mx-2 text-rule-strong">/</span>
        {book.testament === "OT" ? "Old Testament" : "New Testament"}
      </div>
      <h1 className="serif mt-3 text-[2.75rem] leading-[1.05] tracking-tight text-ink font-semibold">
        {book.name}{" "}
        <span className="text-ink-muted font-normal">{chapNum}</span>
      </h1>
      <p className="mt-4 text-[0.9375rem] leading-6 text-ink-muted max-w-[58ch]">
        A cinematic retelling — sensory, present-tense, with the characters
        treated as people. Stays inside what the text says.
      </p>
      <div className="mt-6 flex items-center gap-3 text-[0.8125rem]">
        <Link
          href={`/${book.slug}/${chapNum}`}
          className="text-ink-muted hover:text-accent"
        >
          ← Read the chapter
        </Link>
        <span className="text-rule-strong">·</span>
        <Link
          href={`/compare/${book.slug}/${chapNum}`}
          className="text-ink-muted hover:text-accent"
        >
          Compare translations
        </Link>
      </div>

      <div className="mt-10 pt-8 border-t border-rule">
        <StoryClient
          bookSlug={book.slug}
          bookId={book.id}
          bookName={book.name}
          chapter={chapNum}
        />
      </div>
    </article>
  );
}
