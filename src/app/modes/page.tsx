import Link from "next/link";
import type { Metadata } from "next";
import { MODE_LIST } from "@/lib/chat/modes";

export const metadata: Metadata = {
  title: "Study modes",
  description:
    "Six modes for the AskScripture study chat — Objective, Scholarly, Devotional, Affirming, Storytelling, and Kids — with the editorial position behind each.",
};

const MODE_NOTES: Record<
  string,
  { detail: string; sample: string }
> = {
  objective: {
    detail:
      "The default. Treats every passage as a contested scholarly question. Names the major readings — historical-critical, literary, theological — without choosing among them.",
    sample:
      "Romans 5: how do Reformed and patristic readers each handle “in Adam all sinned”?",
  },
  scholarly: {
    detail:
      "Graduate-seminar register. Source/form/redaction criticism. Authorship debates. ANE and Greco-Roman parallels. Technical terminology, defined on first use.",
    sample:
      "What's the Sitz im Leben of the Beatitudes? How do Matt 5 and Luke 6 reflect different redactional priorities?",
  },
  devotional: {
    detail:
      "Personal and reflective. Grounded in the passage's actual language. One honest question at the end — not a closed moral.",
    sample: "What's Psalm 23 asking me to do about fear?",
  },
  affirming: {
    detail:
      "Foregrounds inclusive scholarship on contested texts — LGBTQ+ readings (arsenokoitai, malakoi, pais), women in leadership (Junia, Phoebe, kephalē), and historically marginalized readings. Cites Vines, Brownson, McLaughlin, Wright on women, and the surrounding literature. Names the traditional reading exists; doesn't weaken the affirming case to seem balanced.",
    sample:
      "What's the scholarly case for reading arsenokoitai in 1 Cor 6:9 as exploitative pederasty rather than “homosexuals”?",
  },
  story: {
    detail:
      "Cinematic retelling — sensory detail, present tense, characters with plausible interiority. Stays inside what the text says. Closes with a still image, not a moral.",
    sample:
      "Retell the Emmaus road conversation from the disciples' point of view.",
  },
  kids: {
    detail:
      "For parents reading with children aged 6 to 11. Short sentences. Honest about difficulty. One discussion question. No condescension; no inserting Jesus into Old Testament passages where he isn't the subject.",
    sample:
      "Tell my 8-year-old about Joseph forgiving his brothers in Genesis 50.",
  },
};

export default function ModesPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 lg:px-10 pt-16 pb-24">
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
        Study chat · Modes
      </div>
      <h1 className="serif mt-3 text-[2.75rem] leading-[1.05] tracking-tight text-ink font-semibold">
        The same text, six framings.
      </h1>
      <p className="mt-5 text-[1rem] leading-7 text-ink-muted max-w-[58ch]">
        Each mode changes how the AI answers without changing what the
        passage is. Pick the one you want explicitly; don't let a default
        choose for you.
      </p>

      <div className="mt-12 border-t border-rule">
        {MODE_LIST.map((mode) => {
          const note = MODE_NOTES[mode.id];
          return (
            <section
              key={mode.id}
              className="grid grid-cols-12 gap-x-6 lg:gap-x-10 py-10 border-b border-rule"
            >
              <div className="col-span-12 md:col-span-3">
                <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
                  Mode
                </div>
                <h2 className="serif mt-2 text-[1.75rem] leading-tight font-semibold text-ink">
                  {mode.label}
                </h2>
                <p className="mt-2 text-[0.8125rem] leading-6 text-ink-muted">
                  {mode.oneLine}
                </p>
              </div>
              <div className="col-span-12 md:col-span-9 md:pl-4">
                <p className="serif text-[1.0625rem] leading-[1.75] text-ink">
                  {note.detail}
                </p>
                <div className="mt-5 grid grid-cols-[5.5rem_1fr] gap-x-4 items-baseline border-l-2 border-accent pl-4">
                  <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium pt-1.5">
                    Try
                  </div>
                  <p className="serif italic text-[0.9375rem] text-ink-muted leading-6">
                    “{note.sample}”
                  </p>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-3">
        <Link
          href="/chat"
          className="inline-flex h-11 items-center px-5 bg-accent text-paper text-[0.875rem] font-medium hover:bg-accent-2 transition-colors"
        >
          Open the study chat
        </Link>
        <Link
          href="/settings"
          className="inline-flex h-11 items-center px-5 border border-rule-strong text-ink text-[0.875rem] font-medium hover:bg-paper-2 transition-colors"
        >
          Set your default mode
        </Link>
      </div>

      <p className="mt-12 text-[0.8125rem] text-ink-muted max-w-[64ch]">
        System prompts for each mode live in{" "}
        <code className="font-mono">src/lib/chat/modes.ts</code> in the
        repo. Hard rules apply to every mode — no inventing references, no
        denominational agenda, no platitudes.{" "}
        <Link href="/method" className="text-accent hover:underline">
          See the methodology
        </Link>
        .
      </p>
    </div>
  );
}
