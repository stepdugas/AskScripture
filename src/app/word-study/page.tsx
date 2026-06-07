import Link from "next/link";
import type { Metadata } from "next";
import { BIAS_FLAGS } from "@/data/bias-flags";
import { bookBySlug } from "@/lib/bible/books";

export const metadata: Metadata = {
  title: "Translation debates",
  description:
    "An editorial index of contested translation choices — arsenokoitai, kephalē, almah, monogenēs, Junia, ezer, gehenna and more. Each entry is sourced from BDB / HALOT / BDAG / LSJ plus monograph-level scholarship.",
};

const TAG_LABELS: Record<string, string> = {
  gender: "Gender",
  sexuality: "Sexuality",
  creation: "Creation",
  afterlife: "Afterlife",
  atonement: "Atonement",
  authority: "Authority",
  slavery: "Slavery",
  christology: "Christology",
  messianic: "Messianic",
};

export default function WordStudyIndex() {
  // Sort by canonical book order, then chapter, then verse
  const sorted = [...BIAS_FLAGS].sort((a, b) => {
    const ao = bookBySlug(a.bookSlug)?.order ?? 999;
    const bo = bookBySlug(b.bookSlug)?.order ?? 999;
    if (ao !== bo) return ao - bo;
    if (a.chapter !== b.chapter) return a.chapter - b.chapter;
    return a.verses[0] - b.verses[0];
  });

  return (
    <>
    <div className="mx-auto max-w-[1320px] px-6 lg:px-10 pt-16 pb-24">
          <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 mb-12">
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
            {/* Editorial standard — short, footnoted, inoculates against "you're
                cherry-picking" criticism on day one. */}
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

          <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 border-t border-rule pt-6">
            <aside className="hidden lg:block col-span-3">
              <div className="sticky top-6">
                <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-3">
                  Browse by topic
                </div>
                <ul className="space-y-1.5 text-[0.875rem]">
                  {Object.entries(TAG_LABELS).map(([tag, label]) => {
                    const count = BIAS_FLAGS.filter((f) =>
                      f.tags.includes(tag as never),
                    ).length;
                    if (count === 0) return null;
                    return (
                      <li
                        key={tag}
                        className="flex items-baseline justify-between text-ink-muted"
                      >
                        <span>{label}</span>
                        <span className="font-mono text-[0.6875rem] text-ink-subtle">
                          {count}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>

            <ol className="col-span-12 lg:col-span-9 divide-y divide-rule">
              {sorted.map((flag, idx) => {
                const book = bookBySlug(flag.bookSlug);
                return (
                  <li key={flag.id} className="py-6">
                    <Link href={`/word-study/${flag.id}`} className="block group">
                      <div className="grid grid-cols-12 gap-x-6">
                        <div className="col-span-1 font-mono text-[0.6875rem] text-ink-subtle pt-1">
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        <div className="col-span-11">
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <span className="font-mono text-[0.75rem] text-ink-muted">
                              {book?.abbr ?? flag.bookSlug} {flag.chapter}:
                              {flag.verses.join(",")}
                            </span>
                            <span className="font-mono text-[0.8125rem] text-flag">
                              {flag.script}
                            </span>
                            <span className="font-mono text-[0.6875rem] text-ink-subtle">
                              {flag.term}
                            </span>
                          </div>
                          <h2 className="serif mt-2 text-[1.25rem] leading-snug text-ink font-semibold group-hover:text-accent transition-colors">
                            {flag.headline}
                          </h2>
                          <p className="mt-2 text-[0.9375rem] leading-6 text-ink-muted max-w-[68ch]">
                            {flag.summary}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
    </>
  );
}
