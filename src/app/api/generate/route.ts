import { z } from "zod";
import { env } from "@/lib/env";
import { gateCustomGenerate } from "@/lib/usage/check";
import { getAnthropic, MODELS } from "@/lib/anthropic";

const KIND_PROMPTS: Record<string, string> = {
  devotional: `You are writing a personal devotional for an adult reader. Use the passage the user provides as the core text. Structure:
1) Open with a single specific image or phrase from the passage (not a generic hook).
2) Spend 2-3 paragraphs unpacking what is actually happening in the text, in plain language.
3) Make one honest connection to the reader's life — without inventing details about them.
4) Close with one open question to sit with.
Length: 350-500 words. No emojis. No "in conclusion." Avoid Christian jargon a non-churchgoer wouldn't recognize.`,
  family: `You are writing a family devotional for parents to read with children ages 6-12. Structure:
- A short retelling of the passage (4-7 sentences, sensory and concrete).
- Two discussion questions ranked easy-to-harder.
- One small "try this at home" action that takes less than 10 minutes.
Length: 300-450 words. No condescension. Honest about hard parts of the passage. Do not insert Jesus into Old Testament passages where he isn't the subject.`,
  sermon: `You are writing a preaching outline for a 25-30 minute sermon. Structure:
- TITLE
- BIG IDEA (one sentence, the through-line)
- OPENING (illustration or hook — not a joke)
- EXEGESIS: 3-4 numbered moves, each with the verses they cover and a 2-3 sentence summary of what the move shows.
- APPLICATION: 2-3 concrete actions the congregation could actually take this week.
- CLOSING IMAGE (specific, sensory)
Length: 500-700 words. Avoid filler. Cite Greek or Hebrew only if it matters for the move.`,
  story: `You are retelling the passage as a cinematic narrative. Stay inside the text — do not invent events that contradict it. You may give characters plausible interiority and motion the text does not spell out.

- Open in medias res when natural.
- Present tense.
- Sensory detail: light, weather, smell, the temperature of stone, the texture of cloth. Be specific to the period — first-century Galilee, ancient Egypt, exilic Babylon.
- The internal life of the characters: what they are watching, what they are not saying.
- Pace varies: linger on a single moment, then jump.
- Close with a still, specific image rather than a moral.

Length: 600-900 words. Plain prose, no headings. No moralizing.`,
};

const BodySchema = z.object({
  kind: z.enum(["devotional", "family", "sermon", "story"]),
  passage: z.string().min(1).max(120),
  passageText: z.string().min(1).max(20000),
  lens: z.string().optional(),
  denomination: z.string().optional(),
});

export async function POST(req: Request) {
  if (!env.anthropicApiKey) {
    return new Response(
      JSON.stringify({
        error: "ANTHROPIC_API_KEY is not configured on the server.",
      }),
      { status: 503, headers: { "content-type": "application/json" } },
    );
  }

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Invalid request", details: String(e) }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  // Custom-passage generation is Pro-only. Free + anonymous users get 402.
  // Today's shared content is served via /today (one generation per day total).
  const blocked = await gateCustomGenerate();
  if (blocked) return blocked;

  const lensNote =
    body.lens && body.lens !== "none"
      ? `\n\nReader's theological lens: ${body.lens}.`
      : "";
  const denomNote =
    body.denomination && body.denomination !== "none"
      ? ` Denominational context: ${body.denomination}.`
      : "";

  const system =
    KIND_PROMPTS[body.kind] +
    lensNote +
    denomNote +
    "\n\nHARD RULES: Do not invent verse references. Do not pad with platitudes. If the passage is difficult, do not paper over it.";

  const user = `Passage: ${body.passage}\n\nText:\n${body.passageText}\n\nWrite the ${body.kind} now.`;

  const anthropic = getAnthropic();
  if (!anthropic) {
    return new Response(
      JSON.stringify({ error: "Anthropic client unavailable." }),
      { status: 503, headers: { "content-type": "application/json" } },
    );
  }

  // Pro/Lifetime/Admin only past gateCustomGenerate — give them Sonnet.
  const stream = anthropic.messages.stream({
    model: MODELS.sonnet,
    max_tokens: 2048,
    system,
    messages: [{ role: "user", content: user }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        const safeMsg =
          process.env.NODE_ENV === "production"
            ? "(stream error — try again)"
            : err instanceof Error
              ? err.message
              : String(err);
        controller.enqueue(encoder.encode(`\n\n[Stream error] ${safeMsg}`));
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
