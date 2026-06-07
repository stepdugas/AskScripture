/**
 * Curated list of free / public-domain English translations on HelloAO.
 * IDs verified against /api/available_translations.json on 2026-06-06.
 *
 * Only translations covering the full Protestant 66-book canon are included.
 * Specialty translations (JPS Tanakh, Septuagints, NT-only critical editions)
 * can be added later.
 */

export type TranslationLens =
  | "ecumenical"
  | "evangelical"
  | "literal"
  | "traditional"
  | "paraphrase"
  | "academic";

export type FreeTranslation = {
  id: string;
  shortName: string;
  name: string;
  year?: number;
  lens: TranslationLens;
  blurb: string;
};

export const FREE_TRANSLATIONS: FreeTranslation[] = [
  {
    id: "BSB",
    shortName: "BSB",
    name: "Berean Standard Bible",
    year: 2022,
    lens: "literal",
    blurb: "Public-domain modern literal translation. Aims for clarity without paraphrase.",
  },
  {
    id: "ENGWEBP",
    shortName: "WEB",
    name: "World English Bible",
    year: 2000,
    lens: "ecumenical",
    blurb: "Public-domain modern English revision of the ASV. Widely used as a free baseline.",
  },
  {
    id: "eng_net",
    shortName: "NET",
    name: "NET Bible",
    year: 2005,
    lens: "academic",
    blurb: "Modern translation with 60,000+ translator notes — useful for tracing decisions.",
  },
  {
    id: "eng_lsv",
    shortName: "LSV",
    name: "Literal Standard Version",
    year: 2020,
    lens: "literal",
    blurb: "Hyper-literal modern revision of YLT. Preserves Hebrew tense and word order.",
  },
  {
    id: "eng_kjv",
    shortName: "KJV",
    name: "King James Version",
    year: 1611,
    lens: "traditional",
    blurb: "The 1611 translation; historically dominant. Earlier English; reflects 17th-c. choices.",
  },
  {
    id: "eng_asv",
    shortName: "ASV",
    name: "American Standard Version",
    year: 1901,
    lens: "literal",
    blurb: "The American revision of the Revised Version; rigorously literal.",
  },
  {
    id: "eng_gnv",
    shortName: "GNV",
    name: "Geneva Bible",
    year: 1599,
    lens: "traditional",
    blurb: "The Reformation-era English Bible. Preceded the KJV by 51 years.",
  },
  {
    id: "eng_ylt",
    shortName: "YLT",
    name: "Young's Literal Translation",
    year: 1862,
    lens: "literal",
    blurb: "Robert Young's wooden-literal translation. Preserves Hebrew/Greek tense closely.",
  },
  {
    id: "eng_dby",
    shortName: "DBY",
    name: "Darby Translation",
    year: 1890,
    lens: "literal",
    blurb: "J. N. Darby's careful literal translation, with extensive footnotes.",
  },
  {
    id: "eng_bbe",
    shortName: "BBE",
    name: "Bible in Basic English",
    year: 1965,
    lens: "paraphrase",
    blurb: "Uses ~1,000 common words. Helpful for simplified reading and ESL contexts.",
  },
];

export const TRANSLATION_BY_ID = new Map(
  FREE_TRANSLATIONS.map((t) => [t.id, t]),
);

export const DEFAULT_TRANSLATION_ID = "BSB";

export function getTranslation(id: string): FreeTranslation | undefined {
  return TRANSLATION_BY_ID.get(id);
}

export function getTranslationOrDefault(
  id: string | undefined | null,
): FreeTranslation {
  // `id && lookup` would short-circuit to the empty string when id is "" — pick
  // the lookup before the fallback so we always return a FreeTranslation.
  const found = id ? TRANSLATION_BY_ID.get(id) : undefined;
  return found ?? TRANSLATION_BY_ID.get(DEFAULT_TRANSLATION_ID)!;
}
