export type Translation = {
  id: string;
  name: string;
  shortName?: string;
  englishName: string;
  language: string;
  languageName?: string;
  languageEnglishName?: string;
  textDirection: "ltr" | "rtl";
  website?: string;
  licenseUrl?: string;
  numberOfBooks: number;
  totalNumberOfChapters: number;
  totalNumberOfVerses: number;
};

export type Book = {
  id: string;
  translationId: string;
  name: string;
  commonName: string;
  title: string;
  order: number;
  numberOfChapters: number;
  firstChapterNumber: number;
  lastChapterNumber: number;
  firstChapterApiLink: string;
  lastChapterApiLink: string;
  totalNumberOfVerses: number;
};

export type InlineText = {
  text?: string;
  noteId?: number;
  lineBreak?: boolean;
  poem?: number;
  wordsOfJesus?: boolean;
};

export type InlineContent = string | InlineText;

export type VerseItem = {
  type: "verse";
  number: number;
  content: InlineContent[];
};

export type HeadingItem = {
  type: "heading";
  content: string[];
};

export type LineBreakItem = {
  type: "line_break";
};

export type HebrewSubtitleItem = {
  type: "hebrew_subtitle";
  content: InlineContent[];
};

export type ChapterContentItem =
  | VerseItem
  | HeadingItem
  | LineBreakItem
  | HebrewSubtitleItem;

export type Footnote = {
  noteId: number;
  caller: string;
  text: string;
  reference?: { chapter: number; verse: number };
};

export type Chapter = {
  number: number;
  content: ChapterContentItem[];
  footnotes: Footnote[];
};

export type ChapterResponse = {
  translation: Translation;
  book: Book;
  chapter: Chapter;
  nextChapterApiLink: string | null;
  previousChapterApiLink: string | null;
  numberOfVerses: number;
};
