/**
 * A rotating set of passages for the daily-verse feature.
 * Index = (day-of-year + simple offset) % VERSES.length.
 * No randomness — same day shows the same verse to everyone, which is the point.
 */

export type DailyVerse = {
  ref: string;
  /** A short editorial framing — what to look for. Not a "thought for the day." */
  note: string;
};

export const DAILY_VERSES: DailyVerse[] = [
  { ref: "Genesis 1:1", note: "The opening line. Notice it starts with action, not a doctrine." },
  { ref: "Psalm 1", note: "Read the whole psalm; it's only six verses." },
  { ref: "Psalm 23", note: "The shepherd metaphor — note the shift from third person to second in verse 4." },
  { ref: "Psalm 46", note: "The psalm that gave Luther \"A Mighty Fortress.\"" },
  { ref: "Psalm 51", note: "David's confession after the Bathsheba episode. Don't skip the title." },
  { ref: "Psalm 90", note: "Attributed to Moses. The oldest psalm." },
  { ref: "Psalm 103", note: "Catalog of mercies. Watch the parallelism." },
  { ref: "Psalm 121", note: "A pilgrim song — sung on the way up to Jerusalem." },
  { ref: "Psalm 139", note: "The intimate knowing — and the unsettling verses 19-22." },
  { ref: "Psalm 150", note: "The last psalm: all instruments, all breath." },
  { ref: "Proverbs 3", note: "Trust in the LORD with all your heart — the chapter, not just verse 5." },
  { ref: "Ecclesiastes 3", note: "A time for everything. The most cited passage; read it slowly." },
  { ref: "Isaiah 6", note: "Isaiah's commissioning. The seraphim, the coal, the voice." },
  { ref: "Isaiah 40", note: "Comfort, comfort my people. The chapter that opens Handel's Messiah." },
  { ref: "Isaiah 53", note: "The Suffering Servant — read it as both Jewish and Christian readers have." },
  { ref: "Isaiah 55", note: "Come to the waters. An invitation, not a demand." },
  { ref: "Jeremiah 29:11", note: "Read the surrounding chapter. The verse is to exiles, not graduates." },
  { ref: "Lamentations 3", note: "The middle of grief: \"His mercies are new every morning\" — verse 22." },
  { ref: "Daniel 3", note: "The fiery furnace. \"But if not\" (v. 18) is the line that lands." },
  { ref: "Micah 6:8", note: "What does the Lord require? Read 6:6-8 as one breath." },
  { ref: "Habakkuk 3", note: "Habakkuk's hymn. Ends with the line that lasts." },
  { ref: "Matthew 5", note: "The Beatitudes. Notice who is called blessed." },
  { ref: "Matthew 6", note: "The Lord's Prayer and the warning not to perform piety." },
  { ref: "Matthew 11:28-30", note: "The yoke metaphor. Yokes were for two oxen, not one." },
  { ref: "Matthew 25:31-46", note: "The sheep and the goats. Read for who gets in." },
  { ref: "Mark 12:28-34", note: "The greatest commandment. Note the scribe agrees with Jesus." },
  { ref: "Luke 4", note: "Jesus's inaugural sermon at Nazareth. The crowd's reaction is the point." },
  { ref: "Luke 10", note: "The Good Samaritan. The lawyer's question is sharper than it sounds." },
  { ref: "Luke 15", note: "Three parables of loss. The third doesn't end where you remember." },
  { ref: "Luke 24", note: "The Emmaus road. The unrecognized stranger and the breaking of bread." },
  { ref: "John 1", note: "The Word made flesh. Read the prologue (vv. 1-18) as a unit." },
  { ref: "John 3", note: "Nicodemus by night. Verse 16 was a footnote until the 20th century." },
  { ref: "John 14", note: "The Last Discourse begins. \"In my Father's house are many rooms.\"" },
  { ref: "John 15", note: "The vine and the branches. An image of mutual indwelling." },
  { ref: "John 17", note: "Jesus's high-priestly prayer — the longest recorded prayer of Jesus." },
  { ref: "John 20", note: "The empty tomb. Mary thinks he's the gardener." },
  { ref: "Acts 2", note: "Pentecost. Notice the list of languages — Babel reversed." },
  { ref: "Romans 5", note: "Justification's consequences. Read for the chain in verses 3-5." },
  { ref: "Romans 8", note: "Paul's central chapter. \"No condemnation\" → \"nothing can separate.\"" },
  { ref: "Romans 12", note: "Living sacrifice. Note the practical list that follows." },
  { ref: "1 Corinthians 13", note: "Love. Read in context — Paul is correcting the Corinthians, not officiating a wedding." },
  { ref: "2 Corinthians 4", note: "Treasure in clay jars. Suffering and glory inside the same chapter." },
  { ref: "Galatians 3:28", note: "The neither-nor passage. Read for what it actually claims." },
  { ref: "Ephesians 2", note: "Made alive together. Verses 8-10 belong with the rest of the chapter." },
  { ref: "Ephesians 3:14-21", note: "Paul's prayer. The geometry — breadth, length, height, depth." },
  { ref: "Philippians 2", note: "The Christ hymn. Almost certainly older than the letter quoting it." },
  { ref: "Philippians 4", note: "Rejoice always. Read for verse 8 — what to keep your mind on." },
  { ref: "Colossians 3", note: "The new self. Note the ethnic and class lines erased in verse 11." },
  { ref: "Hebrews 11", note: "The faith chapter. A list of people who didn't see the promise." },
  { ref: "Hebrews 12:1-3", note: "Surrounded by witnesses. The race image continues from chapter 11." },
  { ref: "James 1", note: "Trials, testing, doing not just hearing. James is sharper than people remember." },
  { ref: "1 Peter 2", note: "Living stones, royal priesthood. A new identity built into a structure." },
  { ref: "1 John 4", note: "God is love. Note what John means by it — verses 7-21 define the term." },
  { ref: "Revelation 21", note: "The new heaven and earth. \"Behold, I make all things new.\"" },
  { ref: "Revelation 22", note: "The river of life. The final invitation: \"Come.\"" },
];

function dayOfYear(d = new Date()): number {
  const start = Date.UTC(d.getUTCFullYear(), 0, 0);
  const now = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return Math.floor((now - start) / 86400000);
}

export function dailyVerse(d = new Date()): DailyVerse {
  const idx = dayOfYear(d) % DAILY_VERSES.length;
  return DAILY_VERSES[idx];
}
