import { cacheLife } from "next/cache";
import { bookBySlug } from "./books";

export type SearchHit = {
  bookSlug: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  /** HTML-ready text with <mark> tags around matched terms */
  highlighted: string;
  score: number;
};

type FlatVerse = [string, number, number, string]; // [bookSlug, chapter, verse, text]

async function loadVerses(): Promise<FlatVerse[]> {
  "use cache";
  cacheLife("weeks");
  const data = await import("@/data/search/verses.json");
  return data.default as FlatVerse[];
}

const STOPWORDS = new Set([
  "the", "and", "of", "to", "in", "a", "is", "for", "on", "with",
  "as", "by", "at", "that", "it", "be", "this", "you", "he", "she",
  "they", "we", "i", "but", "or", "so", "if", "an",
]);

function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .split(/[^a-z0-9'’-]+/)
    .filter((w) => w.length > 0 && !STOPWORDS.has(w));
}

function highlight(text: string, terms: string[]): string {
  if (terms.length === 0) return escape(text);
  const pattern = new RegExp(
    `\\b(${terms.map((t) => t.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")).join("|")})\\b`,
    "gi",
  );
  return escape(text).replace(pattern, "<mark>$1</mark>");
}

function escape(s: string) {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);
}

/**
 * Substring + AND-of-tokens scoring. Each token contributes +1; exact phrase
 * match contributes +5. Cap to `limit` results, sorted by score desc.
 */
export async function searchVerses(
  query: string,
  limit = 50,
): Promise<{ hits: SearchHit[]; total: number; tokens: string[] }> {
  const tokens = tokenize(query);
  if (tokens.length === 0) return { hits: [], total: 0, tokens };

  const phrase = query.trim().toLowerCase();
  const verses = await loadVerses();
  const out: SearchHit[] = [];

  for (const [slug, chapter, verse, text] of verses) {
    const lower = text.toLowerCase();
    let score = 0;
    let allTokens = true;
    for (const t of tokens) {
      if (lower.includes(t)) score += 1;
      else {
        allTokens = false;
        break;
      }
    }
    if (!allTokens) continue;
    if (phrase.length > 4 && lower.includes(phrase)) score += 5;
    const book = bookBySlug(slug);
    out.push({
      bookSlug: slug,
      bookName: book?.name ?? slug,
      chapter,
      verse,
      text,
      highlighted: highlight(text, tokens),
      score,
    });
  }

  out.sort((a, b) => b.score - a.score);
  return { hits: out.slice(0, limit), total: out.length, tokens };
}
