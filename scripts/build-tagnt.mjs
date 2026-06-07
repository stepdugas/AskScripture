#!/usr/bin/env node
/**
 * Parse STEPBible TAGNT (Greek NT) into per-book/chapter JSON.
 *
 * Source format (tab-separated, with leading metadata lines we skip):
 *   Mat.1.1#01=NKO   Βίβλος (Biblos)   [The] book   G0976=N-NSF   βίβλος=book   editions ...
 *
 * Output: src/data/word-study/{slug}.json
 *   { "1": { "1": [{ greek, translit, gloss, strongs, morph, lemma, lemmaGloss }, ...], ... }, ... }
 *
 * Run: node scripts/build-tagnt.mjs
 */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC_FILES = [
  path.join(ROOT, "data/raw/tagnt-mat-jhn.txt"),
  path.join(ROOT, "data/raw/tagnt-act-rev.txt"),
];
const OUT = path.join(ROOT, "src/data/word-study");

// STEPBible book codes -> our canonical slug
const STEP_TO_SLUG = {
  Mat: "matthew", Mrk: "mark", Luk: "luke", Jhn: "john",
  Act: "acts", Rom: "romans",
  "1Co": "1-corinthians", "2Co": "2-corinthians",
  Gal: "galatians", Eph: "ephesians",
  Phi: "philippians", Php: "philippians", Col: "colossians",
  "1Th": "1-thessalonians", "2Th": "2-thessalonians",
  "1Ti": "1-timothy", "2Ti": "2-timothy",
  Tit: "titus", Phm: "philemon",
  Heb: "hebrews", Jas: "james",
  "1Pe": "1-peter", "2Pe": "2-peter",
  "1Jn": "1-john", "2Jn": "2-john", "3Jn": "3-john",
  Jud: "jude", Rev: "revelation",
};

// Pattern: "Mat.1.1#01=NKO" → book="Mat", chap=1, verse=1, idx=01
const REF_PATTERN = /^([1-3]?[A-Za-z]+)\.(\d+)\.(\d+)#(\d+)/;
// Pattern: "Βίβλος (Biblos)" → greek="Βίβλος", translit="Biblos"
const WORD_PATTERN = /^(.+?)\s*\(([^)]+)\)\s*$/;
// Strongs+morph: "G0976=N-NSF"
const STRONGS_PATTERN = /^(G\d+[a-zA-Z]?)=(.+)$/;

// Parse one line; returns { slug, chap, verse, word } or null
function parseLine(line) {
  if (!line || !line.startsWith) return null;
  const parts = line.split("\t");
  if (parts.length < 5) return null;

  const ref = parts[0];
  const refMatch = REF_PATTERN.exec(ref);
  if (!refMatch) return null;
  const [, bookCode, chapStr, verseStr] = refMatch;
  const slug = STEP_TO_SLUG[bookCode];
  if (!slug) return null;

  // Field 1: "Βίβλος (Biblos)"
  const wordRaw = parts[1].trim();
  const wordMatch = WORD_PATTERN.exec(wordRaw);
  const greek = wordMatch ? wordMatch[1].trim() : wordRaw;
  const translit = wordMatch ? wordMatch[2].trim() : "";

  // Field 2: English gloss
  const gloss = (parts[2] ?? "").trim();

  // Field 3: "G0976=N-NSF"
  const strongsRaw = (parts[3] ?? "").trim();
  const sMatch = STRONGS_PATTERN.exec(strongsRaw);
  const strongs = sMatch ? sMatch[1] : strongsRaw;
  const morph = sMatch ? sMatch[2] : "";

  // Field 4: "βίβλος=book"
  const lemmaRaw = (parts[4] ?? "").trim();
  const lemmaParts = lemmaRaw.split("=");
  const lemma = lemmaParts[0]?.trim() ?? "";
  const lemmaGloss = lemmaParts.slice(1).join("=").trim();

  return {
    slug,
    chap: parseInt(chapStr, 10),
    verse: parseInt(verseStr, 10),
    word: { greek, translit, gloss, strongs, morph, lemma, lemmaGloss },
  };
}

const byBook = {};
let total = 0;
let skipped = 0;

for (const src of SRC_FILES) {
  console.log("Reading", path.basename(src));
  const raw = fs.readFileSync(src, "utf8");
  const lines = raw.split("\n");
  for (const line of lines) {
    const parsed = parseLine(line);
    if (!parsed) {
      skipped++;
      continue;
    }
    byBook[parsed.slug] ||= {};
    byBook[parsed.slug][parsed.chap] ||= {};
    byBook[parsed.slug][parsed.chap][parsed.verse] ||= [];
    byBook[parsed.slug][parsed.chap][parsed.verse].push(parsed.word);
    total++;
  }
}

fs.mkdirSync(OUT, { recursive: true });
let bookCount = 0;
let totalSize = 0;
for (const slug of Object.keys(byBook)) {
  const file = path.join(OUT, `${slug}.json`);
  const json = JSON.stringify(byBook[slug]);
  fs.writeFileSync(file, json);
  totalSize += json.length;
  bookCount++;
}

console.log(
  `Parsed ${total} words (${skipped} non-data lines skipped) across ${bookCount} books`,
);
console.log(`Output: ${OUT} (~${(totalSize / 1024 / 1024).toFixed(1)}MB)`);
