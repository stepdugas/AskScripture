import type { Metadata } from "next";
import { BIAS_FLAGS } from "@/data/bias-flags";
import { WordStudyClient } from "./word-study-client";

export const metadata: Metadata = {
  title:
    "Translation debates: arsenokoitai, kephalē, almah, Junia & contested Bible words",
  description:
    "An honest index of contested Bible translation choices — arsenokoitai, malakoi, kephalē, almah, monogenēs, Junia, ezer kenegdo, gehenna, aiōnios, doulos, hilastērion, porneia, chesed, shalom and more. Each entry sourced from BDB / HALOT / BDAG / LSJ plus monograph-level scholarship. No agenda — just the seam between the Hebrew/Greek and the English.",
  keywords: [
    "arsenokoitai",
    "kephalē",
    "Junia",
    "almah",
    "gehenna",
    "monogenēs",
    "translation debates",
    "affirming Bible study",
    "inclusive Bible",
    "Bible translation bias",
    "original Greek Hebrew",
    "contested Bible passages",
  ],
  openGraph: {
    title: "Translation debates — where translators have made choices for you",
    description:
      "arsenokoitai, kephalē, almah, Junia, gehenna and more. An honest, sourced index of contested Bible translation choices.",
  },
};

export default function WordStudyIndex() {
  return (
    <div className="mx-auto max-w-[1320px] px-6 lg:px-10 pt-16 pb-24">
      <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 mb-2">
        <div className="col-span-12 lg:col-span-7">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            Translation debates
          </div>
          <h1 className="serif mt-3 text-[2.75rem] leading-[1.05] tracking-tight text-ink font-semibold">
            Where translators have made choices for you.
          </h1>
          <p className="mt-5 text-[1rem] leading-7 text-ink-muted max-w-[58ch]">
            An index of well-documented translation debates — passages where
            English versions diverge because of a real ambiguity in the
            Hebrew or Greek. Each entry names the underlying term, the
            debate, and what the major translations did with it.
          </p>
        </div>
        <aside className="col-span-12 lg:col-span-5 lg:col-start-8 lg:pt-2">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            Editorial standard
          </div>
          <p className="mt-2 text-[0.8125rem] leading-6 text-ink-muted max-w-[44ch]">
            Each entry is sourced from BDB or HALOT (Hebrew), BDAG or LSJ
            (Greek), and a monograph-level study on the specific term.
            We include a debate here only when standard reference
            lexicons disagree, when a major modern translation departs
            from earlier consensus, or when peer-reviewed scholarship in
            the last 30 years has shifted the question. Not every
            contested verse is here; not every verse here is settled.
          </p>
        </aside>
      </div>

      <WordStudyClient flags={BIAS_FLAGS} />
    </div>
  );
}
