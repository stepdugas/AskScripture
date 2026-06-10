import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { BIAS_FLAGS } from "@/data/bias-flags";
import { bookBySlug } from "@/lib/bible/books";
import { GenericPageSkeleton } from "@/components/skeletons";

export const metadata: Metadata = {
  title: "Today's translation debate",
  description:
    "One contested Bible word, one debate, every day. arsenokoitai, kephalē, almah, gehenna, shalom — a new word study every day, free for everyone.",
};

/**
 * Pick today's contested-word entry by deterministic day-of-year rotation.
 * Same day, same word for everyone — no randomness, no AI cost.
 */
function todayFlag(d: Date) {
  const start = Date.UTC(d.getUTCFullYear(), 0, 0);
  const now = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const dayOfYear = Math.floor((now - start) / 86400000);
  return BIAS_FLAGS[dayOfYear % BIAS_FLAGS.length];
}

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

export default function TodayPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<GenericPageSkeleton />}>
      <Content searchParams={searchParams} />
    </Suspense>
  );
}

async function Content({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Awaiting searchParams anchors this component to request time, which
  // unblocks `new Date()` under cacheComponents.
  await searchParams;
  const flag = todayFlag(new Date());
  const book = bookBySlug(flag.bookSlug);
  const passageRef = `${book?.name ?? flag.bookSlug} ${flag.chapter}:${flag.verses.join(",")}`;
  const passageHref = `/${flag.bookSlug}/${flag.chapter}`;

  return (
    <div className="mx-auto max-w-[1100px] px-6 lg:px-10 pt-16 pb-24">
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
        Today's translation debate · Free for everyone
      </div>
      <h1 className="serif mt-3 text-[2.75rem] leading-[1.05] tracking-tight text-ink font-semibold max-w-[24ch]">
        {flag.headline}
      </h1>

      <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <Link
          href={passageHref}
          className="font-mono text-[0.875rem] text-ink-muted hover:text-accent"
        >
          {passageRef}
        </Link>
        <span className="font-mono text-[1rem] text-flag">{flag.script}</span>
        <span className="font-mono text-[0.75rem] text-ink-subtle">
          {flag.term} · {flag.language}
        </span>
      </div>

      <div className="mt-12 grid grid-cols-12 gap-x-6 lg:gap-x-10 border-t border-rule pt-10">
        <div className="col-span-12 lg:col-span-8">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            What's at stake
          </div>
          <p className="serif mt-3 text-[1.125rem] leading-[1.75] text-ink">
            {flag.summary}
          </p>

          <div className="mt-10 text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            The debate
          </div>
          <div className="serif mt-3 text-[1rem] leading-[1.85] text-ink space-y-4">
            {flag.body.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`/word-study/${flag.id}`}
              className="inline-flex h-10 items-center px-4 bg-accent text-paper text-[0.8125rem] font-medium hover:bg-accent-2 transition-colors"
            >
              Read the full entry →
            </Link>
            <Link
              href={passageHref}
              className="inline-flex h-10 items-center px-4 border border-rule-strong text-ink text-[0.8125rem] font-medium hover:border-accent hover:text-accent transition-colors"
            >
              Read {passageRef} in context
            </Link>
          </div>
        </div>

        <aside className="col-span-12 lg:col-span-4 lg:pl-2">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            How translations render it
          </div>
          <ul className="mt-3 divide-y divide-rule">
            {flag.renderings.map((r, i) => (
              <li key={i} className="py-3">
                <div className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
                  {r.translation}
                </div>
                <p className="serif mt-1 text-[0.9375rem] leading-6 text-ink">
                  "{r.text}"
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-8 text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            Tags
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {flag.tags.map((t) => (
              <span
                key={t}
                className="font-mono text-[0.6875rem] text-ink-muted bg-paper-2 px-2 py-1"
              >
                {TAG_LABELS[t] ?? t}
              </span>
            ))}
          </div>
        </aside>
      </div>

      <p className="mt-16 pt-6 border-t border-rule text-[0.75rem] text-ink-muted max-w-[68ch]">
        A new translation debate every day. No login. No paywall. Browse the{" "}
        <Link href="/word-study" className="text-accent hover:underline">
          full index
        </Link>{" "}
        of contested Bible words, or{" "}
        <Link href="/pricing" className="text-accent hover:underline">
          go Pro
        </Link>{" "}
        for unlimited AI study chat and custom passage generation.
      </p>
    </div>
  );
}
