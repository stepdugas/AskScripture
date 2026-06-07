import { BOOKS, type CanonicalBook } from "./books";

/**
 * Parse a freeform reference like:
 *   "John 3:16"
 *   "Rom 8:28-30"
 *   "1 Cor 13"
 *   "Genesis 1:1-3"
 *   "Ps 23"
 *   "1 jn 4:8"
 *
 * Returns a route + scroll target the reader page can use.
 */

export type ParsedRef = {
  book: CanonicalBook;
  chapter: number;
  verseStart: number | null;
  verseEnd: number | null;
};

// Build a normalized lookup of book name variants -> canonical book.
const BOOK_LOOKUP = (() => {
  const map = new Map<string, CanonicalBook>();
  const norm = (s: string) => s.toLowerCase().replace(/[\s.]/g, "");
  for (const b of BOOKS) {
    map.set(norm(b.name), b);
    map.set(norm(b.abbr), b);
    map.set(norm(b.slug.replace(/-/g, "")), b);
  }
  // Common variants/aliases
  const aliases: Record<string, string> = {
    psalm: "Psalms",
    psa: "Psalms",
    pss: "Psalms",
    prv: "Proverbs",
    can: "Song of Songs",
    canticles: "Song of Songs",
    songofsolomon: "Song of Songs",
    sos: "Song of Songs",
    eccle: "Ecclesiastes",
    qoh: "Ecclesiastes",
    qohelet: "Ecclesiastes",
    ecclesiast: "Ecclesiastes",
    obad: "Obadiah",
    nahm: "Nahum",
    hab: "Habakkuk",
    zeph: "Zephaniah",
    hag: "Haggai",
    zech: "Zechariah",
    mal: "Malachi",
    mt: "Matthew",
    mk: "Mark",
    lk: "Luke",
    jn: "John",
    ac: "Acts",
    rm: "Romans",
    co1: "1 Corinthians",
    co2: "2 Corinthians",
    cor1: "1 Corinthians",
    cor2: "2 Corinthians",
    gal: "Galatians",
    eph: "Ephesians",
    phil: "Philippians",
    php: "Philippians",
    col: "Colossians",
    th1: "1 Thessalonians",
    th2: "2 Thessalonians",
    thess1: "1 Thessalonians",
    thess2: "2 Thessalonians",
    tim1: "1 Timothy",
    tim2: "2 Timothy",
    phlm: "Philemon",
    phm: "Philemon",
    heb: "Hebrews",
    jas: "James",
    jms: "James",
    pet1: "1 Peter",
    pet2: "2 Peter",
    jn1: "1 John",
    jn2: "2 John",
    jn3: "3 John",
    jude: "Jude",
    rev: "Revelation",
    apoc: "Revelation",
    revelations: "Revelation",
  };
  for (const [alias, name] of Object.entries(aliases)) {
    const b = BOOKS.find((book) => book.name === name);
    if (b) map.set(norm(alias), b);
  }
  return map;
})();

/**
 * Find the longest matching book name prefix in the input.
 * Returns the book and the remaining string (with the matched prefix removed).
 */
function matchBookPrefix(input: string): { book: CanonicalBook; rest: string } | null {
  // Normalize for matching but preserve the original for slicing
  const trimmed = input.trim();

  // Try increasingly shorter prefixes — start with up to 4 tokens (e.g. "Song of Songs 1:1")
  // Build tokens preserving original spacing
  const tokens = trimmed.split(/\s+/);
  for (let take = Math.min(4, tokens.length); take >= 1; take--) {
    const prefix = tokens.slice(0, take).join(" ");
    const norm = prefix.toLowerCase().replace(/[\s.]/g, "");
    const book = BOOK_LOOKUP.get(norm);
    if (book) {
      const rest = tokens.slice(take).join(" ");
      return { book, rest };
    }
  }
  return null;
}

export function parseRef(input: string): ParsedRef | null {
  if (!input || !input.trim()) return null;
  const matched = matchBookPrefix(input);
  if (!matched) return null;
  const { book, rest } = matched;

  if (!rest) {
    return { book, chapter: 1, verseStart: null, verseEnd: null };
  }

  // Now rest should look like "3:16" / "8:28-30" / "13" / "1:1-3"
  const m = rest.match(/^(\d+)(?:[:.](\d+)(?:\s*-\s*(\d+))?)?$/);
  if (!m) return null;
  const chapter = parseInt(m[1], 10);
  if (chapter < 1 || chapter > book.chapters) return null;
  const verseStart = m[2] ? parseInt(m[2], 10) : null;
  const verseEnd = m[3] ? parseInt(m[3], 10) : null;
  if (verseEnd !== null && verseStart !== null && verseEnd < verseStart) {
    return null;
  }
  return { book, chapter, verseStart, verseEnd };
}

export function refToHref(ref: ParsedRef): string {
  const base = `/${ref.book.slug}/${ref.chapter}`;
  return ref.verseStart ? `${base}#v${ref.verseStart}` : base;
}

export function refToString(ref: ParsedRef): string {
  let s = `${ref.book.name} ${ref.chapter}`;
  if (ref.verseStart) {
    s += `:${ref.verseStart}`;
    if (ref.verseEnd) s += `-${ref.verseEnd}`;
  }
  return s;
}
