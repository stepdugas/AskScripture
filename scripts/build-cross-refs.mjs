#!/usr/bin/env node
/**
 * Convert OpenBible.info cross_references.txt (OSIS refs with vote counts)
 * into per-book JSON keyed by chapter, then verse.
 *
 * Output: src/data/cross-refs/{slug}.json
 *   { "1": { "1": [{ ref: "Ps.148.4-Ps.148.5", votes: 58 }, ...], ... }, ... }
 *
 * Run: node scripts/build-cross-refs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "data/raw/cross_references.txt");
const OUT = path.join(ROOT, "src/data/cross-refs");

// OSIS book id -> our canonical slug
const OSIS_TO_SLUG = {
  Gen: "genesis", Exod: "exodus", Lev: "leviticus", Num: "numbers", Deut: "deuteronomy",
  Josh: "joshua", Judg: "judges", Ruth: "ruth",
  "1Sam": "1-samuel", "2Sam": "2-samuel", "1Kgs": "1-kings", "2Kgs": "2-kings",
  "1Chr": "1-chronicles", "2Chr": "2-chronicles",
  Ezra: "ezra", Neh: "nehemiah", Esth: "esther",
  Job: "job", Ps: "psalms", Prov: "proverbs", Eccl: "ecclesiastes", Song: "song-of-songs",
  Isa: "isaiah", Jer: "jeremiah", Lam: "lamentations", Ezek: "ezekiel", Dan: "daniel",
  Hos: "hosea", Joel: "joel", Amos: "amos", Obad: "obadiah", Jonah: "jonah",
  Mic: "micah", Nah: "nahum", Hab: "habakkuk", Zeph: "zephaniah",
  Hag: "haggai", Zech: "zechariah", Mal: "malachi",
  Matt: "matthew", Mark: "mark", Luke: "luke", John: "john", Acts: "acts",
  Rom: "romans", "1Cor": "1-corinthians", "2Cor": "2-corinthians",
  Gal: "galatians", Eph: "ephesians", Phil: "philippians", Col: "colossians",
  "1Thess": "1-thessalonians", "2Thess": "2-thessalonians",
  "1Tim": "1-timothy", "2Tim": "2-timothy", Titus: "titus", Phlm: "philemon",
  Heb: "hebrews", Jas: "james",
  "1Pet": "1-peter", "2Pet": "2-peter",
  "1John": "1-john", "2John": "2-john", "3John": "3-john",
  Jude: "jude", Rev: "revelation",
};

// Parse a single OSIS reference like "Ps.148.4" or "Ps.148.4-Ps.148.5"
function parseOsis(ref) {
  const dash = ref.indexOf("-");
  const head = dash === -1 ? ref : ref.slice(0, dash);
  const m = head.match(/^([1-3]?[A-Za-z]+)\.(\d+)\.(\d+)$/);
  if (!m) return null;
  const [, book, chap, verse] = m;
  return { book, chap: parseInt(chap, 10), verse: parseInt(verse, 10) };
}

function osisToHuman(ref) {
  const dash = ref.indexOf("-");
  const head = dash === -1 ? ref : ref.slice(0, dash);
  const tail = dash === -1 ? null : ref.slice(dash + 1);
  const h = parseOsis(head);
  if (!h) return null;
  const slug = OSIS_TO_SLUG[h.book];
  if (!slug) return null;
  // Use book.commonName lookup later if needed — for now just store slug+chap+verse
  if (!tail) {
    return { slug, chap: h.chap, verse: h.verse, endVerse: null };
  }
  const t = parseOsis(tail);
  if (!t || t.book !== h.book || t.chap !== h.chap) {
    // Cross-chapter or cross-book ranges — collapse to start verse
    return { slug, chap: h.chap, verse: h.verse, endVerse: null };
  }
  return { slug, chap: h.chap, verse: h.verse, endVerse: t.verse };
}

console.log("Reading", SRC);
const raw = fs.readFileSync(SRC, "utf8");
const lines = raw.split("\n");

// Aggregate: byBook[slug][chap][verse] = [{ slug, chap, verse, endVerse, votes }, ...]
const byBook = {};

let total = 0;
let skipped = 0;

for (const line of lines) {
  if (!line || line.startsWith("From Verse") || line.startsWith("#")) continue;
  const [from, to, votesStr] = line.split("\t");
  const votes = parseInt(votesStr, 10);
  if (!from || !to || isNaN(votes)) {
    skipped++;
    continue;
  }
  // Drop low-confidence entries (the file already filters but be safe)
  if (votes < -5) {
    skipped++;
    continue;
  }
  const fromParsed = parseOsis(from);
  if (!fromParsed) {
    skipped++;
    continue;
  }
  const slug = OSIS_TO_SLUG[fromParsed.book];
  if (!slug) {
    skipped++;
    continue;
  }
  const target = osisToHuman(to);
  if (!target) {
    skipped++;
    continue;
  }
  byBook[slug] ||= {};
  byBook[slug][fromParsed.chap] ||= {};
  byBook[slug][fromParsed.chap][fromParsed.verse] ||= [];
  byBook[slug][fromParsed.chap][fromParsed.verse].push({
    slug: target.slug,
    chap: target.chap,
    verse: target.verse,
    endVerse: target.endVerse,
    votes,
  });
  total++;
}

// Sort each verse's references by votes descending
for (const slug of Object.keys(byBook)) {
  for (const chap of Object.keys(byBook[slug])) {
    for (const verse of Object.keys(byBook[slug][chap])) {
      byBook[slug][chap][verse].sort((a, b) => b.votes - a.votes);
    }
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

console.log(`Parsed ${total} refs (${skipped} skipped) across ${bookCount} books`);
console.log(`Output: ${OUT} (~${(totalSize / 1024 / 1024).toFixed(1)}MB total)`);
