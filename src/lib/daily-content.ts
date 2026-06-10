import { dailyVerse, type DailyVerse } from "@/data/daily-verses";
import { parseRef } from "@/lib/bible/parse-ref";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getAnthropic, DAILY_MODEL } from "@/lib/anthropic";

export type DailyKind = "devotional" | "family" | "sermon" | "story";

export const DAILY_KINDS: DailyKind[] = [
  "devotional",
  "family",
  "sermon",
  "story",
];

const KIND_PROMPTS: Record<DailyKind, string> = {
  devotional: `You are writing a personal devotional for an adult reader. Use the passage as the core text. Structure:
1) Open with a single specific image or phrase from the passage.
2) Spend 2-3 paragraphs unpacking what is actually happening in the text, in plain language.
3) Make one honest connection to the reader's life — without inventing personal details.
4) Close with one open question to sit with.
Length: 350-500 words. No emojis. Avoid Christian jargon a non-churchgoer wouldn't recognize. Do not insert Jesus into Old Testament passages where he is not the subject. Christological readings are a legitimate move within the Christian tradition, but if you make one, name it as such ("the Christian tradition has read this as...") rather than smuggling it into the plain sense of the text.`,
  family: `You are writing a family devotional for parents to read with children ages 6-12. Structure:
- A short retelling of the passage (4-7 sentences, sensory and concrete).
- Two discussion questions ranked easy-to-harder.
- One small "try this at home" action that takes less than 10 minutes.
Length: 300-450 words. Honest about hard parts of the passage. Do not insert Jesus into Old Testament passages where he isn't the subject.`,
  sermon: `You are writing a preaching outline for a 25-30 minute sermon. Structure:
- TITLE
- BIG IDEA (one sentence)
- OPENING (illustration or hook — not a joke)
- EXEGESIS: 3-4 numbered moves, each with the verses they cover.
- APPLICATION: 2-3 concrete actions.
- CLOSING IMAGE (specific, sensory)
Length: 500-700 words. Avoid filler.`,
  story: `Retell the passage as a cinematic narrative. Stay inside the text.
- Open in medias res when natural.
- Present tense.
- Sensory detail specific to the period.
- The internal life of the characters: what they are watching, what they are not saying.
- Close with a still, specific image rather than a moral.
Length: 600-900 words. Plain prose, no headings.`,
};

const COMMON_HARD_RULES = `\n\nHARD RULES: Do not invent verse references. Do not pad with platitudes. If the passage is difficult, do not paper over it.`;

/**
 * Look up today's published shared content from Supabase.
 * Returns null if not yet generated (cron hasn't fired or migration not run).
 */
export async function readDailyContent(
  kind: DailyKind,
  day: string = new Date().toISOString().slice(0, 10),
): Promise<{ content: string; ref: string; day: string } | null> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("daily_content")
    .select("content, ref, day")
    .eq("day", day)
    .eq("kind", kind)
    .maybeSingle();
  return data ?? null;
}

/**
 * Generate today's shared content for a given kind, store it, return it.
 * Returns null if Anthropic isn't configured or generation failed.
 *
 * Idempotency: relies on the (day, kind) primary key. The first writer wins;
 * a race-losing caller's INSERT fails harmlessly and they read back the winner.
 */
export async function generateAndStoreDailyContent(
  kind: DailyKind,
  day: string = new Date().toISOString().slice(0, 10),
): Promise<{ content: string; ref: string } | null> {
  const verse = pickDailyVerse(day);
  const passageText = await fetchPassageText(verse);
  if (!passageText) return null;

  const anthropic = getAnthropic();
  if (!anthropic) return null;

  const result = await anthropic.messages.create({
    model: DAILY_MODEL,
    max_tokens: 2048,
    system: KIND_PROMPTS[kind] + COMMON_HARD_RULES,
    messages: [
      {
        role: "user",
        content: `Passage: ${verse.ref}\n\nText:\n${passageText}\n\nWrite the ${kind} now.`,
      },
    ],
  });

  const content = result.content
    .map((c) => (c.type === "text" ? c.text : ""))
    .join("");

  // Write — service role bypasses RLS. Race-loser will hit unique key and we
  // re-read the winner.
  const admin = getSupabaseAdminClient();
  if (admin) {
    const { error } = await admin.from("daily_content").insert({
      day,
      kind,
      ref: verse.ref,
      content,
    });
    if (error) {
      const existing = await readDailyContent(kind, day);
      if (existing) return { content: existing.content, ref: existing.ref };
    }
  }

  return { content, ref: verse.ref };
}

function pickDailyVerse(day: string): DailyVerse {
  return dailyVerse(new Date(`${day}T00:00:00Z`));
}

async function fetchPassageText(verse: DailyVerse): Promise<string | null> {
  const parsed = parseRef(verse.ref);
  if (!parsed) return null;
  try {
    const res = await fetch(
      `https://bible.helloao.org/api/BSB/${parsed.book.id}/${parsed.chapter}.json`,
      {
        cache: "force-cache",
        // Hard timeout — don't let a slow upstream stall the cron + a Claude call.
        signal: AbortSignal.timeout(8000),
      },
    );
    const data = await res.json();
    const verses: { number: number; text: string }[] = [];
    for (const c of data.chapter?.content ?? []) {
      if (c.type !== "verse") continue;
      const text = (c.content ?? [])
        .map((x: unknown) =>
          typeof x === "string"
            ? x
            : x && typeof x === "object" && "text" in x
              ? String((x as { text?: string }).text ?? "")
              : "",
        )
        .join("");
      verses.push({ number: c.number, text });
    }
    const startV = parsed.verseStart ?? 1;
    const endV =
      parsed.verseEnd ?? parsed.verseStart ?? verses[verses.length - 1]?.number ?? 1;
    const slice = verses.filter((v) => v.number >= startV && v.number <= endV);
    return slice.map((v) => `${v.number} ${v.text}`).join(" ");
  } catch {
    return null;
  }
}

export type { DailyVerse };
