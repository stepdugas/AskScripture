import { cacheLife } from "next/cache";
import type { CanonicalBook } from "./books";
import { bookBySlug } from "./books";

export type CrossRef = {
  slug: string;
  chap: number;
  verse: number;
  endVerse: number | null;
  votes: number;
};

type BookCrossRefs = Record<string, Record<string, CrossRef[]>>;

/**
 * Loaded lazily so individual chapter routes don't drag in the whole dataset.
 * `'use cache'` memoizes per book slug.
 */
export async function loadBookCrossRefs(
  bookSlug: string,
): Promise<BookCrossRefs | null> {
  "use cache";
  cacheLife("weeks");
  try {
    const data = await import(`@/data/cross-refs/${bookSlug}.json`);
    return data.default as BookCrossRefs;
  } catch {
    return null;
  }
}

export async function getCrossRefsForChapter(
  bookSlug: string,
  chapter: number,
): Promise<Record<number, CrossRef[]>> {
  const all = await loadBookCrossRefs(bookSlug);
  if (!all) return {};
  return (all[String(chapter)] ?? {}) as unknown as Record<number, CrossRef[]>;
}

export async function getCrossRefsForVerse(
  bookSlug: string,
  chapter: number,
  verse: number,
): Promise<CrossRef[]> {
  const chap = await getCrossRefsForChapter(bookSlug, chapter);
  return chap[verse] ?? [];
}

export function formatCrossRef(ref: CrossRef): string {
  const book = bookBySlug(ref.slug);
  const name = book?.abbr ?? ref.slug;
  if (ref.endVerse && ref.endVerse !== ref.verse) {
    return `${name} ${ref.chap}:${ref.verse}–${ref.endVerse}`;
  }
  return `${name} ${ref.chap}:${ref.verse}`;
}

export function refHref(ref: CrossRef): string {
  return `/${ref.slug}/${ref.chap}#v${ref.verse}`;
}

export type { CanonicalBook };
