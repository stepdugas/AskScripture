/**
 * Canonical Protestant 66-book order with HelloAO API IDs.
 * Sections follow standard scholarly groupings (Pentateuch, Wisdom, Major/Minor Prophets,
 * Gospels, Pauline epistles, General epistles).
 */

export type BookSection =
  | "Pentateuch"
  | "History"
  | "Wisdom"
  | "Major Prophets"
  | "Minor Prophets"
  | "Gospels"
  | "Acts"
  | "Pauline Epistles"
  | "General Epistles"
  | "Apocalypse";

export type Testament = "OT" | "NT";

export type CanonicalBook = {
  /** HelloAO API book id (USFM-style abbreviation, e.g. "GEN", "1CO") */
  id: string;
  /** Display name */
  name: string;
  /** URL slug (lowercase, hyphenated) */
  slug: string;
  /** Common abbreviation for compact display ("Gen", "1 Cor") */
  abbr: string;
  order: number;
  chapters: number;
  testament: Testament;
  section: BookSection;
};

export const BOOKS: CanonicalBook[] = [
  // Pentateuch
  { id: "GEN", name: "Genesis", slug: "genesis", abbr: "Gen", order: 1, chapters: 50, testament: "OT", section: "Pentateuch" },
  { id: "EXO", name: "Exodus", slug: "exodus", abbr: "Exod", order: 2, chapters: 40, testament: "OT", section: "Pentateuch" },
  { id: "LEV", name: "Leviticus", slug: "leviticus", abbr: "Lev", order: 3, chapters: 27, testament: "OT", section: "Pentateuch" },
  { id: "NUM", name: "Numbers", slug: "numbers", abbr: "Num", order: 4, chapters: 36, testament: "OT", section: "Pentateuch" },
  { id: "DEU", name: "Deuteronomy", slug: "deuteronomy", abbr: "Deut", order: 5, chapters: 34, testament: "OT", section: "Pentateuch" },
  // History
  { id: "JOS", name: "Joshua", slug: "joshua", abbr: "Josh", order: 6, chapters: 24, testament: "OT", section: "History" },
  { id: "JDG", name: "Judges", slug: "judges", abbr: "Judg", order: 7, chapters: 21, testament: "OT", section: "History" },
  { id: "RUT", name: "Ruth", slug: "ruth", abbr: "Ruth", order: 8, chapters: 4, testament: "OT", section: "History" },
  { id: "1SA", name: "1 Samuel", slug: "1-samuel", abbr: "1 Sam", order: 9, chapters: 31, testament: "OT", section: "History" },
  { id: "2SA", name: "2 Samuel", slug: "2-samuel", abbr: "2 Sam", order: 10, chapters: 24, testament: "OT", section: "History" },
  { id: "1KI", name: "1 Kings", slug: "1-kings", abbr: "1 Kgs", order: 11, chapters: 22, testament: "OT", section: "History" },
  { id: "2KI", name: "2 Kings", slug: "2-kings", abbr: "2 Kgs", order: 12, chapters: 25, testament: "OT", section: "History" },
  { id: "1CH", name: "1 Chronicles", slug: "1-chronicles", abbr: "1 Chr", order: 13, chapters: 29, testament: "OT", section: "History" },
  { id: "2CH", name: "2 Chronicles", slug: "2-chronicles", abbr: "2 Chr", order: 14, chapters: 36, testament: "OT", section: "History" },
  { id: "EZR", name: "Ezra", slug: "ezra", abbr: "Ezra", order: 15, chapters: 10, testament: "OT", section: "History" },
  { id: "NEH", name: "Nehemiah", slug: "nehemiah", abbr: "Neh", order: 16, chapters: 13, testament: "OT", section: "History" },
  { id: "EST", name: "Esther", slug: "esther", abbr: "Esth", order: 17, chapters: 10, testament: "OT", section: "History" },
  // Wisdom
  { id: "JOB", name: "Job", slug: "job", abbr: "Job", order: 18, chapters: 42, testament: "OT", section: "Wisdom" },
  { id: "PSA", name: "Psalms", slug: "psalms", abbr: "Ps", order: 19, chapters: 150, testament: "OT", section: "Wisdom" },
  { id: "PRO", name: "Proverbs", slug: "proverbs", abbr: "Prov", order: 20, chapters: 31, testament: "OT", section: "Wisdom" },
  { id: "ECC", name: "Ecclesiastes", slug: "ecclesiastes", abbr: "Eccl", order: 21, chapters: 12, testament: "OT", section: "Wisdom" },
  { id: "SNG", name: "Song of Songs", slug: "song-of-songs", abbr: "Song", order: 22, chapters: 8, testament: "OT", section: "Wisdom" },
  // Major Prophets
  { id: "ISA", name: "Isaiah", slug: "isaiah", abbr: "Isa", order: 23, chapters: 66, testament: "OT", section: "Major Prophets" },
  { id: "JER", name: "Jeremiah", slug: "jeremiah", abbr: "Jer", order: 24, chapters: 52, testament: "OT", section: "Major Prophets" },
  { id: "LAM", name: "Lamentations", slug: "lamentations", abbr: "Lam", order: 25, chapters: 5, testament: "OT", section: "Major Prophets" },
  { id: "EZK", name: "Ezekiel", slug: "ezekiel", abbr: "Ezek", order: 26, chapters: 48, testament: "OT", section: "Major Prophets" },
  { id: "DAN", name: "Daniel", slug: "daniel", abbr: "Dan", order: 27, chapters: 12, testament: "OT", section: "Major Prophets" },
  // Minor Prophets
  { id: "HOS", name: "Hosea", slug: "hosea", abbr: "Hos", order: 28, chapters: 14, testament: "OT", section: "Minor Prophets" },
  { id: "JOL", name: "Joel", slug: "joel", abbr: "Joel", order: 29, chapters: 3, testament: "OT", section: "Minor Prophets" },
  { id: "AMO", name: "Amos", slug: "amos", abbr: "Amos", order: 30, chapters: 9, testament: "OT", section: "Minor Prophets" },
  { id: "OBA", name: "Obadiah", slug: "obadiah", abbr: "Obad", order: 31, chapters: 1, testament: "OT", section: "Minor Prophets" },
  { id: "JON", name: "Jonah", slug: "jonah", abbr: "Jonah", order: 32, chapters: 4, testament: "OT", section: "Minor Prophets" },
  { id: "MIC", name: "Micah", slug: "micah", abbr: "Mic", order: 33, chapters: 7, testament: "OT", section: "Minor Prophets" },
  { id: "NAM", name: "Nahum", slug: "nahum", abbr: "Nah", order: 34, chapters: 3, testament: "OT", section: "Minor Prophets" },
  { id: "HAB", name: "Habakkuk", slug: "habakkuk", abbr: "Hab", order: 35, chapters: 3, testament: "OT", section: "Minor Prophets" },
  { id: "ZEP", name: "Zephaniah", slug: "zephaniah", abbr: "Zeph", order: 36, chapters: 3, testament: "OT", section: "Minor Prophets" },
  { id: "HAG", name: "Haggai", slug: "haggai", abbr: "Hag", order: 37, chapters: 2, testament: "OT", section: "Minor Prophets" },
  { id: "ZEC", name: "Zechariah", slug: "zechariah", abbr: "Zech", order: 38, chapters: 14, testament: "OT", section: "Minor Prophets" },
  { id: "MAL", name: "Malachi", slug: "malachi", abbr: "Mal", order: 39, chapters: 4, testament: "OT", section: "Minor Prophets" },
  // Gospels
  { id: "MAT", name: "Matthew", slug: "matthew", abbr: "Matt", order: 40, chapters: 28, testament: "NT", section: "Gospels" },
  { id: "MRK", name: "Mark", slug: "mark", abbr: "Mark", order: 41, chapters: 16, testament: "NT", section: "Gospels" },
  { id: "LUK", name: "Luke", slug: "luke", abbr: "Luke", order: 42, chapters: 24, testament: "NT", section: "Gospels" },
  { id: "JHN", name: "John", slug: "john", abbr: "John", order: 43, chapters: 21, testament: "NT", section: "Gospels" },
  // Acts
  { id: "ACT", name: "Acts", slug: "acts", abbr: "Acts", order: 44, chapters: 28, testament: "NT", section: "Acts" },
  // Pauline
  { id: "ROM", name: "Romans", slug: "romans", abbr: "Rom", order: 45, chapters: 16, testament: "NT", section: "Pauline Epistles" },
  { id: "1CO", name: "1 Corinthians", slug: "1-corinthians", abbr: "1 Cor", order: 46, chapters: 16, testament: "NT", section: "Pauline Epistles" },
  { id: "2CO", name: "2 Corinthians", slug: "2-corinthians", abbr: "2 Cor", order: 47, chapters: 13, testament: "NT", section: "Pauline Epistles" },
  { id: "GAL", name: "Galatians", slug: "galatians", abbr: "Gal", order: 48, chapters: 6, testament: "NT", section: "Pauline Epistles" },
  { id: "EPH", name: "Ephesians", slug: "ephesians", abbr: "Eph", order: 49, chapters: 6, testament: "NT", section: "Pauline Epistles" },
  { id: "PHP", name: "Philippians", slug: "philippians", abbr: "Phil", order: 50, chapters: 4, testament: "NT", section: "Pauline Epistles" },
  { id: "COL", name: "Colossians", slug: "colossians", abbr: "Col", order: 51, chapters: 4, testament: "NT", section: "Pauline Epistles" },
  { id: "1TH", name: "1 Thessalonians", slug: "1-thessalonians", abbr: "1 Thess", order: 52, chapters: 5, testament: "NT", section: "Pauline Epistles" },
  { id: "2TH", name: "2 Thessalonians", slug: "2-thessalonians", abbr: "2 Thess", order: 53, chapters: 3, testament: "NT", section: "Pauline Epistles" },
  { id: "1TI", name: "1 Timothy", slug: "1-timothy", abbr: "1 Tim", order: 54, chapters: 6, testament: "NT", section: "Pauline Epistles" },
  { id: "2TI", name: "2 Timothy", slug: "2-timothy", abbr: "2 Tim", order: 55, chapters: 4, testament: "NT", section: "Pauline Epistles" },
  { id: "TIT", name: "Titus", slug: "titus", abbr: "Titus", order: 56, chapters: 3, testament: "NT", section: "Pauline Epistles" },
  { id: "PHM", name: "Philemon", slug: "philemon", abbr: "Phlm", order: 57, chapters: 1, testament: "NT", section: "Pauline Epistles" },
  // General
  { id: "HEB", name: "Hebrews", slug: "hebrews", abbr: "Heb", order: 58, chapters: 13, testament: "NT", section: "General Epistles" },
  { id: "JAS", name: "James", slug: "james", abbr: "Jas", order: 59, chapters: 5, testament: "NT", section: "General Epistles" },
  { id: "1PE", name: "1 Peter", slug: "1-peter", abbr: "1 Pet", order: 60, chapters: 5, testament: "NT", section: "General Epistles" },
  { id: "2PE", name: "2 Peter", slug: "2-peter", abbr: "2 Pet", order: 61, chapters: 3, testament: "NT", section: "General Epistles" },
  { id: "1JN", name: "1 John", slug: "1-john", abbr: "1 John", order: 62, chapters: 5, testament: "NT", section: "General Epistles" },
  { id: "2JN", name: "2 John", slug: "2-john", abbr: "2 John", order: 63, chapters: 1, testament: "NT", section: "General Epistles" },
  { id: "3JN", name: "3 John", slug: "3-john", abbr: "3 John", order: 64, chapters: 1, testament: "NT", section: "General Epistles" },
  { id: "JUD", name: "Jude", slug: "jude", abbr: "Jude", order: 65, chapters: 1, testament: "NT", section: "General Epistles" },
  // Apocalypse
  { id: "REV", name: "Revelation", slug: "revelation", abbr: "Rev", order: 66, chapters: 22, testament: "NT", section: "Apocalypse" },
];

export const SECTIONS_OT: BookSection[] = [
  "Pentateuch",
  "History",
  "Wisdom",
  "Major Prophets",
  "Minor Prophets",
];

export const SECTIONS_NT: BookSection[] = [
  "Gospels",
  "Acts",
  "Pauline Epistles",
  "General Epistles",
  "Apocalypse",
];

const BY_SLUG = new Map(BOOKS.map((b) => [b.slug, b]));
const BY_ID = new Map(BOOKS.map((b) => [b.id, b]));

export function bookBySlug(slug: string): CanonicalBook | undefined {
  return BY_SLUG.get(slug);
}

export function bookById(id: string): CanonicalBook | undefined {
  return BY_ID.get(id);
}

export function booksInSection(section: BookSection): CanonicalBook[] {
  return BOOKS.filter((b) => b.section === section);
}
