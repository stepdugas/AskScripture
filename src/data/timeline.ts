/**
 * Curated biblical timeline.
 *
 * Dates follow consensus scholarship — where scholarship genuinely disagrees
 * we use the conventional date and note the debate in the description.
 * "BCE" is used for Before Common Era; "CE" for Common Era (= BC/AD).
 *
 * Each era maps to the canonical books written about or during it. The
 * per-chapter badge logic in `eraForBook()` returns the most relevant era.
 */

export type Era = {
  id: string;
  label: string;
  range: string;
  startYearApprox: number; // negative = BCE
  endYearApprox: number;
  blurb: string;
  /** book slugs whose narrative is set in this era */
  bookSlugs: string[];
};

export const ERAS: Era[] = [
  {
    id: "primeval",
    label: "Primeval narratives",
    range: "Unknown · Genesis 1-11",
    startYearApprox: -3000,
    endYearApprox: -2100,
    blurb:
      "Creation, the flood, Babel. These chapters are not history in the modern sense; the writers are doing theology with the imagery of the ancient Near East.",
    bookSlugs: [],
  },
  {
    id: "patriarchs",
    label: "Patriarchs",
    range: "~2100-1800 BCE",
    startYearApprox: -2100,
    endYearApprox: -1800,
    blurb:
      "Abraham, Isaac, Jacob, Joseph. The covenant promise is announced. Dates are conventional; the historicity of the patriarchs is contested in modern scholarship.",
    bookSlugs: ["genesis"],
  },
  {
    id: "exodus-wilderness",
    label: "Exodus and wilderness",
    range: "~1450 or ~1250 BCE",
    startYearApprox: -1250,
    endYearApprox: -1200,
    blurb:
      "Moses, the Exodus from Egypt, Sinai, the 40 years in the wilderness. Two dating schools: the early-date (15th c.) and the more widely held late-date (13th c.).",
    bookSlugs: ["exodus", "leviticus", "numbers", "deuteronomy"],
  },
  {
    id: "conquest-judges",
    label: "Conquest and judges",
    range: "~1200-1050 BCE",
    startYearApprox: -1200,
    endYearApprox: -1050,
    blurb:
      "Joshua, then a loose tribal confederation under regional 'judges.' Archaeology suggests a gradual settlement rather than a swift conquest.",
    bookSlugs: ["joshua", "judges", "ruth"],
  },
  {
    id: "united-monarchy",
    label: "United monarchy",
    range: "~1050-930 BCE",
    startYearApprox: -1050,
    endYearApprox: -930,
    blurb:
      "Saul, David, Solomon. The first temple is built under Solomon. The extent of David's actual kingdom is debated.",
    bookSlugs: ["1-samuel", "2-samuel", "1-chronicles"],
  },
  {
    id: "divided-kingdom",
    label: "Divided kingdom",
    range: "~930-586 BCE",
    startYearApprox: -930,
    endYearApprox: -586,
    blurb:
      "Israel (north) and Judah (south) as two kingdoms. The pre-exilic prophets write during this period. Israel falls to Assyria in 722; Judah falls to Babylon in 586.",
    bookSlugs: [
      "1-kings",
      "2-kings",
      "2-chronicles",
      "isaiah",
      "jeremiah",
      "hosea",
      "amos",
      "obadiah",
      "jonah",
      "micah",
      "nahum",
      "habakkuk",
      "zephaniah",
    ],
  },
  {
    id: "exile",
    label: "Babylonian exile",
    range: "586-538 BCE",
    startYearApprox: -586,
    endYearApprox: -538,
    blurb:
      "Judah's elite are deported to Babylon. The Torah reaches something like its final form during this period. Ezekiel and Daniel are set here; Lamentations grieves the destroyed Jerusalem.",
    bookSlugs: ["lamentations", "ezekiel", "daniel"],
  },
  {
    id: "second-temple",
    label: "Return and second temple",
    range: "538 BCE - 70 CE",
    startYearApprox: -538,
    endYearApprox: 70,
    blurb:
      "Cyrus's edict allows return; the second temple is rebuilt. The post-exilic prophets write. The intertestamental period sees the rise of Hellenism, Maccabean revolt, Roman occupation.",
    bookSlugs: [
      "ezra",
      "nehemiah",
      "esther",
      "haggai",
      "zechariah",
      "malachi",
      "joel",
    ],
  },
  {
    id: "wisdom-poetry",
    label: "Wisdom and poetry (varied)",
    range: "various, ~1000-300 BCE",
    startYearApprox: -1000,
    endYearApprox: -300,
    blurb:
      "Job, Psalms, Proverbs, Ecclesiastes, Song of Songs span many centuries. Most psalms cluster around the monarchy; Job and Ecclesiastes resist easy dating.",
    bookSlugs: ["job", "psalms", "proverbs", "ecclesiastes", "song-of-songs"],
  },
  {
    id: "jesus",
    label: "Life of Jesus",
    range: "~4 BCE - 30 CE",
    startYearApprox: -4,
    endYearApprox: 30,
    blurb:
      "Jesus is born during the reign of Herod the Great (d. 4 BCE), executed under Pontius Pilate. The Gospels are written ~30-65 years later from earlier oral and written sources.",
    bookSlugs: ["matthew", "mark", "luke", "john"],
  },
  {
    id: "early-church",
    label: "Early church",
    range: "~30-95 CE",
    startYearApprox: 30,
    endYearApprox: 95,
    blurb:
      "Acts narrates ~30 years of post-resurrection mission. Paul's letters are mostly from the 50s. The general epistles and Revelation are later in the first century.",
    bookSlugs: [
      "acts",
      "romans",
      "1-corinthians",
      "2-corinthians",
      "galatians",
      "ephesians",
      "philippians",
      "colossians",
      "1-thessalonians",
      "2-thessalonians",
      "1-timothy",
      "2-timothy",
      "titus",
      "philemon",
      "hebrews",
      "james",
      "1-peter",
      "2-peter",
      "1-john",
      "2-john",
      "3-john",
      "jude",
      "revelation",
    ],
  },
];

const BOOK_TO_ERA = new Map<string, Era>();
for (const era of ERAS) {
  for (const slug of era.bookSlugs) {
    if (!BOOK_TO_ERA.has(slug)) BOOK_TO_ERA.set(slug, era);
  }
}

export function eraForBook(bookSlug: string): Era | undefined {
  return BOOK_TO_ERA.get(bookSlug);
}

export function eraById(id: string): Era | undefined {
  return ERAS.find((e) => e.id === id);
}
