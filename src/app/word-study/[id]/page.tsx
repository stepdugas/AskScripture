import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BIAS_FLAGS, getFlagById } from "@/data/bias-flags";
import { bookBySlug } from "@/lib/bible/books";

type Params = { id: string };

export async function generateStaticParams() {
  return BIAS_FLAGS.map((f) => ({ id: f.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { id } = await params;
  const flag = getFlagById(id);
  if (!flag) return {};
  return {
    title: flag.headline,
    description: flag.summary,
  };
}

export default async function WordStudyDetail({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const flag = getFlagById(id);
  if (!flag) notFound();
  const book = bookBySlug(flag.bookSlug);

  return (
    <>
    <article className="mx-auto max-w-[860px] px-6 lg:px-10 pt-12 pb-24">
          {/* Eyebrow */}
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            <Link href="/word-study" className="hover:text-ink">
              Translation debates
            </Link>
            <span className="mx-2 text-rule-strong">/</span>
            {book?.section}
          </div>

          {/* Headline + script */}
          <div className="mt-4 grid grid-cols-12 gap-x-6 items-start">
            <div className="col-span-12 md:col-span-9">
              <h1 className="serif text-[2.25rem] leading-[1.1] tracking-tight text-ink font-semibold">
                {flag.headline}
              </h1>
              <p className="mt-4 text-[1.0625rem] leading-7 text-ink-muted">
                {flag.summary}
              </p>
            </div>
            <aside className="col-span-12 md:col-span-3 md:pt-2">
              <div className="border-l-2 border-flag pl-4">
                <div className="font-mono text-[1.25rem] text-ink leading-none">
                  {flag.script}
                </div>
                <div className="mt-1 font-mono text-[0.8125rem] text-ink-muted">
                  {flag.term}
                </div>
                <div className="mt-0.5 text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle">
                  {flag.language}
                </div>
              </div>
            </aside>
          </div>

          {/* Body */}
          <section className="mt-12">
            <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-4">
              The debate
            </div>
            <div className="serif text-[1.0625rem] leading-[1.75] text-ink whitespace-pre-line">
              {flag.body}
            </div>
          </section>

          {/* Renderings table */}
          <section className="mt-14">
            <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-4">
              How translations render it
            </div>
            <div className="border-t border-rule">
              {flag.renderings.map((r) => (
                <div
                  key={r.translation}
                  className="grid grid-cols-[6rem_1fr] gap-x-6 py-3 border-b border-rule"
                >
                  <div className="font-mono text-[0.8125rem] text-ink-muted tabular-nums">
                    {r.translation}
                  </div>
                  <div className="serif text-[1rem] text-ink leading-7">
                    “{r.text}”
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Open in reader */}
          <section className="mt-14 pt-8 border-t border-rule">
            <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-3">
              Read in context
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${flag.bookSlug}/${flag.chapter}#v${flag.verses[0]}`}
                className="inline-flex h-10 items-center px-4 bg-accent text-paper text-[0.8125rem] font-medium tracking-wide hover:bg-accent-2 transition-colors"
              >
                {book?.name} {flag.chapter}:{flag.verses.join(",")}
              </Link>
              <Link
                href={`/compare/${flag.bookSlug}/${flag.chapter}`}
                className="inline-flex h-10 items-center px-4 border border-rule-strong text-ink text-[0.8125rem] hover:bg-paper-2 transition-colors"
              >
                Compare translations side by side
              </Link>
            </div>
          </section>

          {/* Tags */}
          {flag.tags.length > 0 && (
            <section className="mt-12 flex flex-wrap items-center gap-2">
              <span className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mr-1">
                Topics
              </span>
              {flag.tags.map((t) => (
                <span
                  key={t}
                  className="text-[0.6875rem] font-mono text-ink-muted border border-rule px-2 py-0.5"
                >
                  {t}
                </span>
              ))}
            </section>
          )}
        </article>
    </>
  );
}
