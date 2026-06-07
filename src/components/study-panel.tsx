import Link from "next/link";
import { getFlagsForChapter, type BiasFlag } from "@/data/bias-flags";
import { getCrossRefsForChapter, formatCrossRef, refHref } from "@/lib/bible/cross-refs";
import { eraForBook } from "@/data/timeline";
import { AskAiButton } from "./ask-ai-button";

type Props = {
  bookSlug: string;
  bookName: string;
  chapter: number;
  translationId: string;
};

export async function StudyPanel({
  bookSlug,
  bookName,
  chapter,
  translationId,
}: Props) {
  const flags = getFlagsForChapter(bookSlug, chapter);
  const crossRefsByVerse = await getCrossRefsForChapter(bookSlug, chapter);

  // Top 8 cross-refs across the chapter by votes
  const allRefs: { verse: number; ref: ReturnType<typeof formatCrossRef> extends string ? import("@/lib/bible/cross-refs").CrossRef : never }[] = [];
  for (const [verseStr, refs] of Object.entries(crossRefsByVerse)) {
    const verse = parseInt(verseStr, 10);
    for (const r of refs) {
      allRefs.push({ verse, ref: r });
    }
  }
  const topRefs = allRefs.sort((a, b) => b.ref.votes - a.ref.votes).slice(0, 8);
  const era = eraForBook(bookSlug);
  const refQuery = encodeURIComponent(`${bookName} ${chapter}`);

  return (
    <div className="space-y-8">
      <AskAiButton
        passage={`${bookName} ${chapter}`}
        translationId={translationId}
      />

      {era && (
        <section>
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-2">
            Historical era
          </div>
          <Link
            href={`/timeline#${era.id}`}
            className="block group"
          >
            <div className="font-mono text-[0.6875rem] text-ink-muted">
              {era.range}
            </div>
            <div className="serif text-[0.9375rem] text-ink group-hover:text-accent transition-colors mt-0.5">
              {era.label}
            </div>
          </Link>
        </section>
      )}

      {flags.length > 0 && (
        <FlagsSection flags={flags} bookSlug={bookSlug} chapter={chapter} />
      )}

      {topRefs.length > 0 && (
        <section>
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-3">
            Cross-references
          </div>
          <ul className="space-y-1.5">
            {topRefs.map((r, idx) => (
              <li
                key={`${idx}-${r.ref.slug}-${r.ref.chap}-${r.ref.verse}`}
                className="grid grid-cols-[2rem_1fr] gap-x-3 text-[0.8125rem] items-baseline"
              >
                <a
                  href={`#v${r.verse}`}
                  className="font-mono text-[0.6875rem] text-ink-subtle hover:text-ink tabular-nums"
                >
                  v{r.verse}
                </a>
                <Link
                  href={refHref(r.ref)}
                  className="text-ink-muted hover:text-accent transition-colors"
                >
                  {formatCrossRef(r.ref)}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={`/cross-references/${bookSlug}/${chapter}`}
            className="mt-3 inline-block text-[0.75rem] text-ink-muted hover:text-accent transition-colors"
          >
            All cross-references &rarr;
          </Link>
        </section>
      )}

      <section>
        <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-3">
          Compare translations
        </div>
        <Link
          href={`/compare/${bookSlug}/${chapter}`}
          className="block text-[0.875rem] text-ink hover:text-accent transition-colors"
        >
          Open side-by-side &rarr;
        </Link>
        <p className="mt-1.5 text-[0.75rem] leading-5 text-ink-muted">
          See {bookName} {chapter} across {""}
          eight free translations with word-level differences highlighted.
        </p>
      </section>

      <section>
        <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-3">
          Generate
        </div>
        <ul className="space-y-2 text-[0.8125rem]">
          <li>
            <Link
              href={`/story/${bookSlug}/${chapter}`}
              className="text-ink hover:text-accent transition-colors"
            >
              Story mode &rarr;
            </Link>
          </li>
          <li>
            <Link
              href={`/generate/devotional?ref=${refQuery}`}
              className="text-ink hover:text-accent transition-colors"
            >
              Personal devotional &rarr;
            </Link>
          </li>
          <li>
            <Link
              href={`/generate/family?ref=${refQuery}`}
              className="text-ink hover:text-accent transition-colors"
            >
              Family devotional &rarr;
            </Link>
          </li>
          <li>
            <Link
              href={`/generate/sermon?ref=${refQuery}`}
              className="text-ink hover:text-accent transition-colors"
            >
              Sermon outline &rarr;
            </Link>
          </li>
        </ul>
      </section>

      <section>
        <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-3">
          Share
        </div>
        <ul className="space-y-2 text-[0.8125rem]">
          <li>
            <Link
              href={`/card?ref=${refQuery}&t=${translationId}`}
              className="text-ink hover:text-accent transition-colors"
            >
              Make a quote card &rarr;
            </Link>
          </li>
          <li>
            <Link
              href={`/print/devotional?ref=${refQuery}`}
              className="text-ink hover:text-accent transition-colors"
            >
              Print-ready devotional &rarr;
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}

function FlagsSection({
  flags,
  bookSlug,
  chapter,
}: {
  flags: BiasFlag[];
  bookSlug: string;
  chapter: number;
}) {
  return (
    <section>
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-3 flex items-center gap-2">
        Translation notes
        <span className="font-mono text-[0.625rem] bg-flag/15 text-flag px-1.5 py-0.5 tracking-normal">
          {flags.length}
        </span>
      </div>
      <ul className="space-y-3">
        {flags.map((f) => (
          <li key={f.id}>
            <Link
              href={`/word-study/${f.id}`}
              className="block group"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[0.6875rem] text-flag tabular-nums">
                  v{f.verses[0]}
                </span>
                <span className="font-mono text-[0.75rem] text-ink-muted">
                  {f.script}
                </span>
              </div>
              <p className="text-[0.8125rem] text-ink leading-snug group-hover:text-accent transition-colors mt-0.5">
                {f.headline}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/word-study"
        className="mt-3 inline-block text-[0.75rem] text-ink-muted hover:text-accent transition-colors"
      >
        All translation debates &rarr;
      </Link>
    </section>
  );
}

export type { Props as StudyPanelProps };
