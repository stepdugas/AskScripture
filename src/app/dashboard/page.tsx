"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UsageMeter } from "@/components/usage-meter";
import {
  getBookmarks,
  getNotes,
  getProgress,
  getStreak,
  getHighlights,
} from "@/lib/storage/local";
import { bookBySlug } from "@/lib/bible/books";
import { dailyVerse } from "@/data/daily-verses";
import { parseRef, refToHref } from "@/lib/bible/parse-ref";
import { READING_PLANS } from "@/data/reading-plans";

export default function Dashboard() {
  const [state, setState] = useState({
    streak: { current: 0, best: 0, lastRead: null as string | null },
    notes: 0,
    highlights: 0,
    bookmarks: 0,
    progress: null as { ref: { bookSlug: string; chapter: number } } | null,
    recentNotes: [] as ReturnType<typeof getNotes>,
  });

  useEffect(() => {
    const notes = getNotes();
    setState({
      streak: getStreak(),
      notes: notes.length,
      highlights: getHighlights().length,
      bookmarks: getBookmarks().length,
      progress: getProgress(),
      recentNotes: notes.slice(0, 3),
    });
  }, []);

  const lastBook =
    state.progress?.ref.bookSlug && bookBySlug(state.progress.ref.bookSlug);

  // Compute today's verse client-side so Next 16's "no current time in client
  // components" rule isn't violated. Renders an empty card until mounted.
  const [today, setToday] = useState<ReturnType<typeof dailyVerse> | null>(null);
  useEffect(() => {
    setToday(dailyVerse());
  }, []);
  const todayParsed = today ? parseRef(today.ref) : null;

  return (
    <>
    <div className="mx-auto max-w-[1320px] px-6 lg:px-10 pt-12 pb-24">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            Home
          </div>
          <h1 className="serif mt-3 text-[2.5rem] leading-[1.05] tracking-tight text-ink font-semibold">
            Today's study.
          </h1>

          <div className="mt-10 grid grid-cols-12 gap-x-6 lg:gap-x-10 gap-y-10">
            {/* Daily verse — large editorial card */}
            <section className="col-span-12 lg:col-span-8 border-l-2 border-accent pl-6 py-2">
              <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
                Today
                <span className="mx-2 text-rule-strong">/</span>
                {todayParsed?.book.section ?? "Daily passage"}
              </div>
              <h2 className="serif mt-2 text-[2rem] leading-tight tracking-tight text-ink font-semibold">
                {today?.ref ?? " "}
              </h2>
              <p className="mt-3 serif text-[1.0625rem] leading-7 text-ink-muted max-w-[60ch]">
                {today?.note ?? " "}
              </p>
              {todayParsed && today && (
                <Link
                  href={refToHref(todayParsed)}
                  className="mt-5 inline-flex h-10 items-center px-4 bg-accent text-paper text-[0.8125rem] font-medium hover:bg-accent-2 transition-colors"
                >
                  Read {today.ref} &rarr;
                </Link>
              )}
            </section>

            {/* Usage meter */}
            <aside className="col-span-12 lg:col-span-4">
              <UsageMeter />
            </aside>
          </div>

          {/* Pick up where you left off */}
          <section className="mt-14">
            <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-4">
              Pick up where you left off
            </div>
            <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 gap-y-6">
              {state.progress && lastBook ? (
                <Link
                  href={`/${lastBook.slug}/${state.progress.ref.chapter}`}
                  className="col-span-12 md:col-span-6 group block border border-rule p-6 hover:border-rule-strong transition-colors"
                >
                  <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
                    Last read
                  </div>
                  <h3 className="serif mt-2 text-[1.5rem] font-semibold text-ink group-hover:text-accent transition-colors">
                    {lastBook.name} {state.progress.ref.chapter} &rarr;
                  </h3>
                  <p className="mt-2 text-[0.875rem] text-ink-muted leading-6">
                    Continue from where you stopped.
                  </p>
                </Link>
              ) : (
                <Link
                  href="/genesis/1"
                  className="col-span-12 md:col-span-6 group block border border-rule p-6 hover:border-rule-strong transition-colors"
                >
                  <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
                    Start
                  </div>
                  <h3 className="serif mt-2 text-[1.5rem] font-semibold text-ink group-hover:text-accent transition-colors">
                    Genesis 1 &rarr;
                  </h3>
                  <p className="mt-2 text-[0.875rem] text-ink-muted leading-6">
                    Begin at the beginning.
                  </p>
                </Link>
              )}

              <Link
                href={`/plans/${READING_PLANS[0].id}`}
                className="col-span-12 md:col-span-6 group block border border-rule p-6 hover:border-rule-strong transition-colors"
              >
                <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
                  Reading plan
                </div>
                <h3 className="serif mt-2 text-[1.5rem] font-semibold text-ink group-hover:text-accent transition-colors">
                  {READING_PLANS[0].title} &rarr;
                </h3>
                <p className="mt-2 text-[0.875rem] text-ink-muted leading-6">
                  {READING_PLANS[0].duration}
                </p>
              </Link>
            </div>
          </section>

          {/* Stats */}
          <section className="mt-14">
            <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-4">
              Your study
            </div>
            <div className="grid grid-cols-12 gap-6 lg:gap-10">
              <Stat label="Current streak" value={state.streak.current} unit="days" />
              <Stat label="Best streak" value={state.streak.best} unit="days" />
              <Stat label="Notes" value={state.notes} />
              <Stat label="Highlights" value={state.highlights} />
              <Stat label="Bookmarks" value={state.bookmarks} />
            </div>
          </section>

          {/* Recent notes */}
          {state.recentNotes.length > 0 && (
            <section className="mt-14">
              <div className="flex items-baseline justify-between mb-4">
                <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
                  Recent notes
                </div>
                <Link
                  href="/notes"
                  className="text-[0.75rem] text-ink-muted hover:text-accent"
                >
                  All notes &rarr;
                </Link>
              </div>
              <ul className="divide-y divide-rule border-y border-rule">
                {state.recentNotes.map((n) => {
                  const book = bookBySlug(n.ref.bookSlug);
                  return (
                    <li key={n.id} className="py-4">
                      <Link
                        href={`/${n.ref.bookSlug}/${n.ref.chapter}#v${n.ref.verse}`}
                        className="block group"
                      >
                        <div className="font-mono text-[0.6875rem] text-ink-muted">
                          {book?.abbr ?? n.ref.bookSlug} {n.ref.chapter}:{n.ref.verse}
                        </div>
                        <p className="mt-1.5 serif text-[1rem] text-ink line-clamp-2 group-hover:text-accent transition-colors">
                          {n.text}
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* Quick links */}
          <section className="mt-14 grid grid-cols-12 gap-6 lg:gap-10">
            <Tile
              eyebrow="Compare"
              title="Side-by-side translations"
              href="/compare/john/3"
              body="John 3 across two free translations with word-level differences."
            />
            <Tile
              eyebrow="Word study"
              title="Translation debates"
              href="/word-study"
              body="Eighteen contested terms — arsenokoitai, kephalē, almah, monogenēs…"
            />
            <Tile
              eyebrow="Generate"
              title="Devotional or sermon"
              href="/generate/devotional"
              body="From any passage, in your preferred lens and denomination."
            />
          </section>
        </div>
    </>
  );
}

function Stat({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit?: string;
}) {
  return (
    <div className="col-span-6 md:col-span-4 lg:col-span-2 border-l border-rule pl-4">
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
        {label}
      </div>
      <div className="serif mt-1.5 text-[2rem] leading-none tracking-tight text-ink font-semibold tabular-nums">
        {value}
        {unit && (
          <span className="ml-1.5 text-[0.875rem] text-ink-muted font-normal">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function Tile({
  eyebrow,
  title,
  body,
  href,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="col-span-12 md:col-span-6 lg:col-span-4 group block border border-rule p-6 hover:border-rule-strong transition-colors"
    >
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
        {eyebrow}
      </div>
      <h3 className="serif mt-2 text-[1.25rem] font-semibold text-ink group-hover:text-accent transition-colors">
        {title} &rarr;
      </h3>
      <p className="mt-2 text-[0.875rem] text-ink-muted leading-6">{body}</p>
    </Link>
  );
}
