import { z } from "zod";
import { env } from "@/lib/env";
import { getMode } from "@/lib/chat/modes";
import { gateChat } from "@/lib/usage/check";
import { getAnthropic, modelFor } from "@/lib/anthropic";
import { getCurrentUser } from "@/lib/auth/user";

const BodySchema = z.object({
  mode: z.string().optional(),
  passage: z.string().optional(),
  translationId: z.string().optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(8000),
      }),
    )
    .min(1)
    .max(40),
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
      JSON.stringify({ error: "Invalid request body.", details: String(e) }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  // Freemium gate — anonymous 3/day, free 8/day & 120/month, Pro unlimited
  const blocked = await gateChat(req);
  if (blocked) return blocked;

  const mode = getMode(body.mode);
  const passageNote = body.passage
    ? `\n\nThe reader is currently on: ${body.passage}${
        body.translationId ? ` (${body.translationId})` : ""
      }. Treat that passage as the context unless the user names a different one.`
    : "";

  const system = mode.systemPrompt + passageNote;

  // Model selection: Haiku for free, Sonnet for Pro / Lifetime / Admin
  const user = await getCurrentUser();
  const model = modelFor(user);

  const anthropic = getAnthropic();
  if (!anthropic) {
    return new Response(
      JSON.stringify({ error: "Anthropic client unavailable." }),
      { status: 503, headers: { "content-type": "application/json" } },
    );
  }

  const stream = anthropic.messages.stream({
    model,
    max_tokens: 2048,
    system,
    messages: body.messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
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
            ? "(stream error)"
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
      "x-as-model": model,
    },
  });
}
