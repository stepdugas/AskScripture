/**
 * Types and shapes for user-generated data.
 * Storage adapter is abstract so we can swap localStorage → Supabase later
 * without touching call sites.
 */

export type VerseRef = {
  bookSlug: string;
  chapter: number;
  verse: number;
};

export type Note = {
  id: string;
  ref: VerseRef;
  text: string;
  createdAt: number;
  updatedAt: number;
};

export type HighlightColor =
  | "navy"
  | "ochre"
  | "olive"
  | "rust"
  // Pro-only colors below
  | "sky"
  | "sage"
  | "coral"
  | "plum"
  | "violet";

export type Highlight = {
  id: string;
  ref: VerseRef;
  /** color hint — palette keys, not raw colors */
  color: HighlightColor;
  createdAt: number;
};

export const PRO_HIGHLIGHT_COLORS: HighlightColor[] = [
  "sky",
  "sage",
  "coral",
  "plum",
  "violet",
];

export function isProColor(color: HighlightColor): boolean {
  return PRO_HIGHLIGHT_COLORS.includes(color);
}

export type Bookmark = {
  id: string;
  ref: VerseRef;
  label?: string;
  createdAt: number;
};

export type ReadingProgress = {
  /** ISO date string, YYYY-MM-DD */
  date: string;
  ref: VerseRef;
};

export type StreakState = {
  /** Last day the user read, YYYY-MM-DD */
  lastRead: string | null;
  /** Current consecutive-day streak */
  current: number;
  /** Best streak ever */
  best: number;
};

export const HIGHLIGHT_COLORS: Record<
  HighlightColor,
  { bg: string; ring: string; label: string }
> = {
  navy: { bg: "bg-accent/10", ring: "ring-accent/30", label: "Insight" },
  ochre: { bg: "bg-[#C99B33]/15", ring: "ring-[#C99B33]/40", label: "Question" },
  olive: { bg: "bg-[#6B8A3A]/15", ring: "ring-[#6B8A3A]/40", label: "Promise" },
  rust: { bg: "bg-flag/15", ring: "ring-flag/40", label: "Difficulty" },
  // Pro-only
  sky: { bg: "bg-[#4A90A4]/15", ring: "ring-[#4A90A4]/40", label: "Hope" },
  sage: { bg: "bg-[#8FA68E]/18", ring: "ring-[#8FA68E]/40", label: "Wisdom" },
  coral: { bg: "bg-[#D77A6B]/15", ring: "ring-[#D77A6B]/40", label: "Joy" },
  plum: { bg: "bg-[#7B5C7E]/18", ring: "ring-[#7B5C7E]/40", label: "Lament" },
  violet: { bg: "bg-[#6B6BA3]/18", ring: "ring-[#6B6BA3]/40", label: "Mystery" },
};
