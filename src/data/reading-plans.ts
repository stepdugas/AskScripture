/**
 * Curated reading plans.
 * Each plan is a list of daily entries; each entry has 1+ passage refs.
 * No external dependency — the plan progresses by date offset from start.
 */

export type PlanDay = {
  day: number;
  refs: string[];
  /** Optional one-line theme */
  theme?: string;
};

export type ReadingPlan = {
  id: string;
  title: string;
  blurb: string;
  duration: string;
  intensity: "light" | "medium" | "deep";
  days: PlanDay[];
};

export const READING_PLANS: ReadingPlan[] = [
  {
    id: "gospels-30",
    title: "The Four Gospels in 30 Days",
    blurb:
      "All four Gospels at a steady, readable pace. Same events, four perspectives — you start noticing what each writer chose to keep and what they left out.",
    duration: "30 days · ~15 min/day",
    intensity: "medium",
    days: [
      { day: 1, refs: ["Matthew 1", "Matthew 2"], theme: "Genealogy and infancy" },
      { day: 2, refs: ["Matthew 3", "Matthew 4"] },
      { day: 3, refs: ["Matthew 5"], theme: "The Sermon on the Mount, part 1" },
      { day: 4, refs: ["Matthew 6", "Matthew 7"] },
      { day: 5, refs: ["Matthew 8", "Matthew 9"] },
      { day: 6, refs: ["Matthew 10", "Matthew 11"] },
      { day: 7, refs: ["Matthew 12", "Matthew 13"] },
      { day: 8, refs: ["Matthew 14", "Matthew 15"] },
      { day: 9, refs: ["Matthew 16", "Matthew 17", "Matthew 18"] },
      { day: 10, refs: ["Matthew 19", "Matthew 20"] },
      { day: 11, refs: ["Matthew 21", "Matthew 22"] },
      { day: 12, refs: ["Matthew 23", "Matthew 24"] },
      { day: 13, refs: ["Matthew 25"] },
      { day: 14, refs: ["Matthew 26"] },
      { day: 15, refs: ["Matthew 27", "Matthew 28"] },
      { day: 16, refs: ["Mark 1", "Mark 2"], theme: "Begin Mark" },
      { day: 17, refs: ["Mark 3", "Mark 4", "Mark 5"] },
      { day: 18, refs: ["Mark 6", "Mark 7", "Mark 8"] },
      { day: 19, refs: ["Mark 9", "Mark 10"] },
      { day: 20, refs: ["Mark 11", "Mark 12", "Mark 13"] },
      { day: 21, refs: ["Mark 14", "Mark 15", "Mark 16"] },
      { day: 22, refs: ["Luke 1", "Luke 2"], theme: "Luke's infancy account" },
      { day: 23, refs: ["Luke 3", "Luke 4", "Luke 5"] },
      { day: 24, refs: ["Luke 6", "Luke 7", "Luke 8"] },
      { day: 25, refs: ["Luke 9", "Luke 10", "Luke 11"] },
      { day: 26, refs: ["Luke 12", "Luke 13", "Luke 14"] },
      { day: 27, refs: ["Luke 15", "Luke 16", "Luke 17", "Luke 18"] },
      { day: 28, refs: ["Luke 19", "Luke 20", "Luke 21"] },
      { day: 29, refs: ["Luke 22", "Luke 23", "Luke 24"] },
      { day: 30, refs: ["John 1"], theme: "John's prologue — read alone" },
    ],
  },
  {
    id: "psalms-50",
    title: "Through the Psalms",
    blurb:
      "Three psalms a day plus the whole of Psalm 119 broken across a week. Pace varies because the psalms vary.",
    duration: "50 days · ~10 min/day",
    intensity: "light",
    days: Array.from({ length: 50 }, (_, i) => ({
      day: i + 1,
      refs: psalmsForDay(i + 1),
    })),
  },
  {
    id: "romans-14",
    title: "Romans in 14 Days",
    blurb:
      "Paul's most carefully argued letter, in two-week chunks. Includes notes on the contested terms (pistis Christou, sarx, dikaiosynē).",
    duration: "14 days · ~20 min/day",
    intensity: "deep",
    days: [
      { day: 1, refs: ["Romans 1"], theme: "Greeting & thesis" },
      { day: 2, refs: ["Romans 2"] },
      { day: 3, refs: ["Romans 3"] },
      { day: 4, refs: ["Romans 4"] },
      { day: 5, refs: ["Romans 5"] },
      { day: 6, refs: ["Romans 6"] },
      { day: 7, refs: ["Romans 7"] },
      { day: 8, refs: ["Romans 8"], theme: "The central chapter" },
      { day: 9, refs: ["Romans 9"] },
      { day: 10, refs: ["Romans 10"] },
      { day: 11, refs: ["Romans 11"] },
      { day: 12, refs: ["Romans 12"] },
      { day: 13, refs: ["Romans 13", "Romans 14"] },
      { day: 14, refs: ["Romans 15", "Romans 16"] },
    ],
  },
  {
    id: "wisdom-21",
    title: "Wisdom Literature: 3 Weeks",
    blurb:
      "Proverbs, Ecclesiastes, and Job sampled across 21 days. The two halves of biblical wisdom — confident order and unsettled questioning — set side by side.",
    duration: "21 days · ~15 min/day",
    intensity: "medium",
    days: [
      { day: 1, refs: ["Proverbs 1"] },
      { day: 2, refs: ["Proverbs 3", "Proverbs 4"] },
      { day: 3, refs: ["Proverbs 8", "Proverbs 9"] },
      { day: 4, refs: ["Proverbs 10", "Proverbs 11"] },
      { day: 5, refs: ["Proverbs 15", "Proverbs 16"] },
      { day: 6, refs: ["Proverbs 22", "Proverbs 23"] },
      { day: 7, refs: ["Proverbs 30", "Proverbs 31"] },
      { day: 8, refs: ["Ecclesiastes 1"], theme: "“Vanity of vanities”" },
      { day: 9, refs: ["Ecclesiastes 2"] },
      { day: 10, refs: ["Ecclesiastes 3", "Ecclesiastes 4"] },
      { day: 11, refs: ["Ecclesiastes 5", "Ecclesiastes 6"] },
      { day: 12, refs: ["Ecclesiastes 7", "Ecclesiastes 8"] },
      { day: 13, refs: ["Ecclesiastes 9", "Ecclesiastes 10"] },
      { day: 14, refs: ["Ecclesiastes 11", "Ecclesiastes 12"] },
      { day: 15, refs: ["Job 1", "Job 2"], theme: "The setup" },
      { day: 16, refs: ["Job 3"], theme: "Job breaks his silence" },
      { day: 17, refs: ["Job 13", "Job 14"] },
      { day: 18, refs: ["Job 19"] },
      { day: 19, refs: ["Job 28"], theme: "Where is wisdom found?" },
      { day: 20, refs: ["Job 38", "Job 39"], theme: "God speaks from the whirlwind" },
      { day: 21, refs: ["Job 40", "Job 41", "Job 42"] },
    ],
  },
  {
    id: "torah-foundations",
    title: "Torah Foundations",
    blurb:
      "Selected key chapters from Genesis through Deuteronomy. Not the whole Torah — the through-line.",
    duration: "20 days · ~15 min/day",
    intensity: "medium",
    days: [
      { day: 1, refs: ["Genesis 1", "Genesis 2"] },
      { day: 2, refs: ["Genesis 3"] },
      { day: 3, refs: ["Genesis 6", "Genesis 7", "Genesis 8"] },
      { day: 4, refs: ["Genesis 12", "Genesis 15"] },
      { day: 5, refs: ["Genesis 17", "Genesis 18"] },
      { day: 6, refs: ["Genesis 22"], theme: "The Akedah" },
      { day: 7, refs: ["Genesis 28", "Genesis 32"] },
      { day: 8, refs: ["Genesis 37", "Genesis 39"] },
      { day: 9, refs: ["Genesis 45", "Genesis 50"] },
      { day: 10, refs: ["Exodus 1", "Exodus 2"] },
      { day: 11, refs: ["Exodus 3", "Exodus 4"] },
      { day: 12, refs: ["Exodus 12"], theme: "Passover" },
      { day: 13, refs: ["Exodus 14", "Exodus 15"] },
      { day: 14, refs: ["Exodus 19", "Exodus 20"] },
      { day: 15, refs: ["Exodus 32", "Exodus 33", "Exodus 34"] },
      { day: 16, refs: ["Leviticus 16", "Leviticus 19"] },
      { day: 17, refs: ["Numbers 11", "Numbers 13", "Numbers 14"] },
      { day: 18, refs: ["Deuteronomy 5", "Deuteronomy 6"] },
      { day: 19, refs: ["Deuteronomy 30"] },
      { day: 20, refs: ["Deuteronomy 34"] },
    ],
  },
];

function psalmsForDay(n: number): string[] {
  // First 49 days: 3 psalms each. Day 50: Psalm 150 alone.
  if (n === 50) return ["Psalm 150"];
  const start = (n - 1) * 3 + 1;
  return [1, 2, 3].map((i) => `Psalm ${start + i - 1}`).filter((r) => {
    const num = parseInt(r.replace("Psalm ", ""), 10);
    return num <= 150;
  });
}

export function getPlan(id: string): ReadingPlan | undefined {
  return READING_PLANS.find((p) => p.id === id);
}
