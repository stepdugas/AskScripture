#!/usr/bin/env node
/**
 * Build a flat verse list and an inverted word index from BSB complete.
 *
 * Outputs:
 *   src/data/search/verses.json  — flat array: ["genesis|1|1|In the beginning..."]
 *   (We rely on substring scan rather than a heavy inverted index; the
 *    full verse list is ~5MB minified and search is fast at this size.)
 *
 * Run: node scripts/build-search-index.mjs
 */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "data/raw/bsb-complete.json");
const OUT_DIR = path.join(ROOT, "src/data/search");

// HelloAO book id → our canonical slug
const ID_TO_SLUG = {
  GEN: "genesis", EXO: "exodus", LEV: "leviticus", NUM: "numbers", DEU: "deuteronomy",
  JOS: "joshua", JDG: "judges", RUT: "ruth",
  "1SA": "1-samuel", "2SA": "2-samuel", "1KI": "1-kings", "2KI": "2-kings",
  "1CH": "1-chronicles", "2CH": "2-chronicles",
  EZR: "ezra", NEH: "nehemiah", EST: "esther",
  JOB: "job", PSA: "psalms", PRO: "proverbs", ECC: "ecclesiastes", SNG: "song-of-songs",
  ISA: "isaiah", JER: "jeremiah", LAM: "lamentations", EZK: "ezekiel", DAN: "daniel",
  HOS: "hosea", JOL: "joel", AMO: "amos", OBA: "obadiah", JON: "jonah",
  MIC: "micah", NAM: "nahum", HAB: "habakkuk", ZEP: "zephaniah",
  HAG: "haggai", ZEC: "zechariah", MAL: "malachi",
  MAT: "matthew", MRK: "mark", LUK: "luke", JHN: "john",
  ACT: "acts", ROM: "romans",
  "1CO": "1-corinthians", "2CO": "2-corinthians",
  GAL: "galatians", EPH: "ephesians",
  PHP: "philippians", COL: "colossians",
  "1TH": "1-thessalonians", "2TH": "2-thessalonians",
  "1TI": "1-timothy", "2TI": "2-timothy",
  TIT: "titus", PHM: "philemon",
  HEB: "hebrews", JAS: "james",
  "1PE": "1-peter", "2PE": "2-peter",
  "1JN": "1-john", "2JN": "2-john", "3JN": "3-john",
  JUD: "jude", REV: "revelation",
};

console.log("Reading BSB complete…");
const raw = fs.readFileSync(SRC, "utf8");
const data = JSON.parse(raw);

const verses = [];
let chapNum = 0;

for (const book of data.books) {
  const slug = ID_TO_SLUG[book.id];
  if (!slug) {
    console.warn(`Skipping unknown book id ${book.id}`);
    continue;
  }
  for (const chapterWrapper of book.chapters) {
    chapNum++;
    const inner = chapterWrapper.chapter ?? chapterWrapper;
    const chap = inner.number ?? chapNum;
    for (const item of inner.content ?? []) {
      if (item.type !== "verse") continue;
      const text = (item.content ?? [])
        .map((x) =>
          typeof x === "string"
            ? x
            : x && typeof x === "object" && "text" in x
              ? x.text ?? ""
              : "",
        )
        .join("")
        .replace(/\s+/g, " ")
        .trim();
      if (!text) continue;
      verses.push([slug, chap, item.number, text]);
    }
  }
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const outPath = path.join(OUT_DIR, "verses.json");
const json = JSON.stringify(verses);
fs.writeFileSync(outPath, json);

console.log(
  `Verses: ${verses.length} across ${chapNum} chapters · output ${(json.length / 1024 / 1024).toFixed(1)}MB → ${outPath}`,
);
