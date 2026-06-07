#!/usr/bin/env node
/**
 * Parse STEPBible TAHOT (Hebrew OT) into per-book/chapter JSON.
 *
 * Source format (tab-separated; some columns vary in count):
 *   Gen.1.1#01=L   בְּ/רֵאשִׁ֖ית   be./re.Shit   in/ beginning   H9003/{H7225G}   HR/Ncfsa  ...  H9003=ב=in/{H7225G=רֵאשִׁית=: beginning»first:1_beginning}
 *
 * Output: src/data/word-study/{slug}.json
 *   { "1": { "1": [{ hebrew, translit, gloss, strongs, morph, lemma, lemmaGloss }, ...], ... } }
 *
 * Run: node scripts/build-tahot.mjs
 */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC_FILES = [
  "data/raw/tahot-gen-deu.txt",
  "data/raw/tahot-jos-est.txt",
  "data/raw/tahot-job-sng.txt",
  "data/raw/tahot-isa-mal.txt",
].map((f) => path.join(ROOT, f));
const OUT = path.join(ROOT, "src/data/word-study");

// STEPBible OT book codes -> canonical slug
const STEP_TO_SLUG = {
  Gen: "genesis", Exo: "exodus", Lev: "leviticus", Num: "numbers", Deu: "deuteronomy",
  Jos: "joshua", Jdg: "judges", Rut: "ruth",
  "1Sa": "1-samuel", "2Sa": "2-samuel",
  "1Ki": "1-kings", "2Ki": "2-kings",
  "1Ch": "1-chronicles", "2Ch": "2-chronicles",
  Ezr: "ezra", Neh: "nehemiah", Est: "esther",
  Job: "job", Psa: "psalms", Pro: "proverbs", Ecc: "ecclesiastes", Sng: "song-of-songs",
  Isa: "isaiah", Jer: "jeremiah", Lam: "lamentations",
  Eze: "ezekiel", Ezk: "ezekiel", Dan: "daniel",
  Hos: "hosea", Joe: "joel", Jol: "joel", Amo: "amos", Oba: "obadiah", Jon: "jonah",
  Mic: "micah", Nah: "nahum", Nam: "nahum", Hab: "habakkuk", Zep: "zephaniah",
  Hag: "haggai", Zec: "zechariah", Mal: "malachi",
};

const REF_PATTERN = /^([1-3]?[A-Za-z]+)\.(\d+)\.(\d+)#(\d+)/;

// Match the LAST lemma=meaning chunk in the column (handles both `{H1234=word=meaning}` and `H9003=ב=in`)
const LEMMA_CHUNK = /\{?(H\d+[A-Za-z]?)=([֐-׿‍]+)=([^}/]+)\}?/g;

function parseLine(line) {
  if (!line || line.length < 10) return null;
  const parts = line.split("\t");
  if (parts.length < 5) return null;

  const ref = parts[0];
  const refMatch = REF_PATTERN.exec(ref);
  if (!refMatch) return null;
  const [, bookCode, chapStr, verseStr] = refMatch;
  const slug = STEP_TO_SLUG[bookCode];
  if (!slug) return null;

  const hebrew = (parts[1] ?? "").trim();
  const translit = (parts[2] ?? "").trim();
  const gloss = (parts[3] ?? "").trim();
  const strongsRaw = (parts[4] ?? "").trim();
  const morphRaw = (parts[5] ?? "").trim();

  // Strongs: take the LAST H#### (after any prefix splits like H9003/{H7225G})
  const strongsMatches = strongsRaw.match(/H\d+[A-Za-z]?/g) ?? [];
  const strongs = strongsMatches[strongsMatches.length - 1] ?? strongsRaw;

  // Morph: same — take the last segment after any /
  const morphParts = morphRaw.split("/");
  const morph = morphParts[morphParts.length - 1];

  // Lemma: scan all columns for the last lemma chunk
  let lemma = "";
  let lemmaGloss = "";
  for (const part of parts.slice(7).reverse()) {
    LEMMA_CHUNK.lastIndex = 0;
    let lastMatch = null;
    let m;
    while ((m = LEMMA_CHUNK.exec(part)) !== null) lastMatch = m;
    if (lastMatch) {
      lemma = lastMatch[2];
      // Clean gloss: trim leading punctuation, take pre-`»` part
      lemmaGloss = lastMatch[3]
        .replace(/^[:\s]+/, "")
        .split("»")[0]
        .split(":")[0]
        .trim();
      break;
    }
  }

  return {
    slug,
    chap: parseInt(chapStr, 10),
    verse: parseInt(verseStr, 10),
    word: { hebrew, translit, gloss, strongs, morph, lemma, lemmaGloss },
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
  `Parsed ${total} Hebrew words (${skipped} non-data lines skipped) across ${bookCount} books`,
);
console.log(`Output: ${OUT} (+${(totalSize / 1024 / 1024).toFixed(1)}MB)`);
