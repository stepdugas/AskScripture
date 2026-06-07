import { cacheLife } from "next/cache";

export type WordEntry = {
  /** Original-language word in Greek or Hebrew script */
  greek?: string;
  hebrew?: string;
  /** Latin-letter transliteration */
  translit: string;
  /** English contextual gloss for this occurrence */
  gloss: string;
  /** Strong's number with disambiguator suffix where present */
  strongs: string;
  /** Morphological parsing code */
  morph: string;
  /** Dictionary form of the word */
  lemma: string;
  /** Dictionary-form gloss */
  lemmaGloss: string;
};

type ChapterMap = Record<string, Record<string, WordEntry[]>>;

/**
 * Load per-book word-study data. Returns null if the book has no data
 * (e.g. Old Testament books before TAHOT is integrated).
 */
export async function loadBookWords(
  bookSlug: string,
): Promise<ChapterMap | null> {
  "use cache";
  cacheLife("weeks");
  try {
    const data = await import(`@/data/word-study/${bookSlug}.json`);
    return data.default as ChapterMap;
  } catch {
    return null;
  }
}

export async function getWordsForChapter(
  bookSlug: string,
  chapter: number,
): Promise<Record<number, WordEntry[]>> {
  const all = await loadBookWords(bookSlug);
  if (!all) return {};
  return (all[String(chapter)] ?? {}) as unknown as Record<number, WordEntry[]>;
}
