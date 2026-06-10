import Link from "next/link";
import { Suspense } from "react";
import { BookIndex } from "@/components/book-index";
import { ReferenceSearch } from "@/components/reference-search";
import { BIAS_FLAGS } from "@/data/bias-flags";
import { bookBySlug } from "@/lib/bible/books";
import { GenericPageSkeleton } from "@/components/skeletons";

export default function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <>
      {/* Hero — editorial two-column */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-20 lg:py-28">
          <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10">
            <div className="col-span-12 lg:col-span-6">
              <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
                A study tool, not a sermon
              </div>
              <h1 className="serif mt-4 text-[2.75rem] lg:text-[3.5rem] leading-[1.02] tracking-tight text-ink font-semibold">
                Read the Bible with context,
                <br />
                not commentary.
              </h1>
              <p className="mt-6 text-[1.0625rem] leading-7 text-ink-muted max-w-[44ch]">
                AskScripture sets every passage next to its translations, its
                original-language words, and its historical setting. You
                decide what it means.
              </p>
              <div className="mt-8 max-w-[480px]">
                <ReferenceSearch />
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem] text-ink-muted">
                <span className="text-ink-subtle">Try:</span>
                <Link href="/john/3" className="hover:text-accent">
                  John 3
                </Link>
                <Link href="/psalms/23" className="hover:text-accent">
                  Psalm 23
                </Link>
                <Link href="/romans/8" className="hover:text-accent">
                  Romans 8
                </Link>
                <Link href="/word-study" className="hover:text-accent">
                  Translation debates
                </Link>
              </div>
            </div>
            <div className="hidden lg:block col-span-5 col-start-8">
              <SamplePassage />
            </div>
          </div>
        </div>
      </section>

      {/* Today's translation debate — the wedge, made visible */}
      <Suspense fallback={null}>
        <TodayDebateBand searchParams={searchParams} />
      </Suspense>

      {/* Capabilities — editorial 3-col grid */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-20">
          <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 mb-12 items-end">
            <h2 className="col-span-12 lg:col-span-6 serif text-[2rem] leading-tight tracking-tight text-ink font-semibold">
              What's on the page.
            </h2>
            <p className="col-span-12 lg:col-span-5 lg:col-start-8 text-[0.9375rem] leading-6 text-ink-muted">
              Every chapter view brings the tools that scholars use into the
              margins of an ordinary read-through.
            </p>
          </div>
          <div className="grid grid-cols-12 gap-x-6 gap-y-12 lg:gap-x-10">
            <Capability
              index="01"
              title="Side-by-side translations"
              body="Compare any two of ten free translations line by line. Differences are diffed inline so you can see exactly where translators diverged."
              href="/compare/john/1"
            />
            <Capability
              index="02"
              title="Translation debates"
              body="Where a translation makes a contested theological choice — arsenokoitai, kephalē, almah, monogenēs — a marker opens the full debate."
              href="/word-study"
            />
            <Capability
              index="03"
              title="Cross-references"
              body="340,000 cross-references from the Treasury of Scripture Knowledge, weighted by community votes."
              href="/genesis/1"
            />
            <Capability
              index="04"
              title="Study chat"
              body="Six modes — Objective, Scholarly, Devotional, Affirming, Storytelling, and Kids — let you choose how an answer is framed."
              href="/chat"
            />
            <Capability
              index="05"
              title="Generated content"
              body="Personal devotionals, family devotionals, and sermon outlines from any passage, written to your preferences."
              href="/generate/devotional"
            />
            <Capability
              index="06"
              title="Reading plans"
              body="Curated plans paced for actual reading — Gospels in 30 days, Romans in 14, Torah foundations, Wisdom literature."
              href="/plans"
            />
          </div>
        </div>
      </section>

      {/* Who this is for */}
      <section className="border-b border-rule bg-paper-2">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-20">
          <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 mb-12 items-end">
            <h2 className="col-span-12 lg:col-span-6 serif text-[2rem] leading-tight tracking-tight text-ink font-semibold">
              Built for honest readers.
            </h2>
            <p className="col-span-12 lg:col-span-5 lg:col-start-8 text-[0.9375rem] leading-6 text-ink-muted">
              Bible apps mostly come with an angle. This one shows you the
              seam between the text and the interpretation, then steps back.
            </p>
          </div>
          <div className="grid grid-cols-12 gap-x-6 gap-y-10 lg:gap-x-10">
            <Audience
              title="People who left church but not the text"
              body="Read without a worship band, a sales pitch, or a pastor's framing. The Hebrew and Greek are right there. Decide what you believe on your own time."
            />
            <Audience
              title="LGBTQ+ Christians"
              body="The clobber passages, in the original language, with the actual scholarly debate — arsenokoitai, malakoi, kephalē, Junia. No softening. No agenda-pushing in either direction."
            />
            <Audience
              title="Pastors who want honest exegesis"
              body="Sermon outlines, generated content, and lexical sourcing that doesn't presuppose your denomination. Mainline, affirming, evangelical, or none of the above."
            />
            <Audience
              title="Parents who want a family devotional that doesn't lie"
              body="Family mode is honest about the hard parts and does not insert Jesus into Old Testament passages where he isn't the subject. Built for kids and the adults reading with them."
            />
          </div>
        </div>
      </section>

      {/* What you get — Free vs Pro */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-20">
          <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 mb-12 items-end">
            <h2 className="col-span-12 lg:col-span-6 serif text-[2rem] leading-tight tracking-tight text-ink font-semibold">
              What you get.
            </h2>
            <p className="col-span-12 lg:col-span-5 lg:col-start-8 text-[0.9375rem] leading-6 text-ink-muted">
              Most of the tool is free, forever, with no signup. Pro lifts
              the daily AI caps and unlocks custom generation from any
              passage.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 gap-y-10">
            <div className="col-span-12 lg:col-span-6 border border-rule p-8">
              <div className="flex items-baseline justify-between">
                <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
                  Free
                </div>
                <div className="font-mono text-[0.6875rem] text-ink-subtle">
                  $0 / forever
                </div>
              </div>
              <h3 className="serif mt-2 text-[1.5rem] leading-tight text-ink font-semibold">
                Read carefully.
              </h3>
              <ul className="mt-6 space-y-3 text-[0.9375rem] leading-6 text-ink">
                <Bullet>10 free Bible translations (BSB, KJV, NET, WEB, more)</Bullet>
                <Bullet>Side-by-side comparison with word-level diff</Bullet>
                <Bullet>Greek + Hebrew word study (425k tagged words)</Bullet>
                <Bullet>33 translation debates — arsenokoitai, kephalē, almah, Junia, gehenna, shalom and more</Bullet>
                <Bullet>340,000 cross-references per chapter</Bullet>
                <Bullet>5 curated reading plans + progress tracking</Bullet>
                <Bullet>Today's translation debate — a new contested word every day</Bullet>
                <Bullet>AI study chat — 8 messages/day signed in, 6 lenses to choose from</Bullet>
                <Bullet>Notes, highlights, bookmarks, streaks</Bullet>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/signin"
                  className="inline-flex h-10 items-center px-4 border border-rule-strong text-[0.8125rem] text-ink hover:border-accent hover:text-accent transition-colors"
                >
                  Sign in →
                </Link>
                <Link
                  href="/genesis/1"
                  className="inline-flex h-10 items-center text-[0.8125rem] text-ink-muted hover:text-accent transition-colors"
                >
                  Start reading without an account
                </Link>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-6 border-2 border-accent p-8 bg-paper">
              <div className="flex items-baseline justify-between">
                <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-accent font-medium">
                  Pro
                </div>
                <div className="font-mono text-[0.6875rem] text-accent">
                  $5 / month
                </div>
              </div>
              <h3 className="serif mt-2 text-[1.5rem] leading-tight text-ink font-semibold">
                Everything free, plus.
              </h3>
              <ul className="mt-6 space-y-3 text-[0.9375rem] leading-6 text-ink">
                <Bullet>
                  <strong className="font-semibold">Unlimited AI chat</strong> — no daily caps
                </Bullet>
                <Bullet>
                  <strong className="font-semibold">A smarter model</strong> — Pro uses Claude Sonnet 4.6 instead of Haiku 4.5; meaningfully better answers on hard passages
                </Bullet>
                <Bullet>
                  <strong className="font-semibold">Generate from any passage</strong> — personal devotional, family devotional, sermon outline, or cinematic story from any chapter you pick (free users only see today's shared one)
                </Bullet>
                <Bullet>Priority email support</Bullet>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/pricing"
                  className="inline-flex h-10 items-center px-4 bg-accent text-paper text-[0.8125rem] font-medium hover:bg-accent-2 transition-colors"
                >
                  Start Pro →
                </Link>
                <Link
                  href="/support"
                  className="inline-flex h-10 items-center text-[0.8125rem] text-ink-muted hover:text-accent transition-colors"
                >
                  Or send a donation
                </Link>
              </div>
              <p className="mt-6 text-[0.75rem] leading-5 text-ink-muted italic">
                Early users grandfathered free. If you sign up in the first
                90 days, you stay free forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Book index */}
      <section>
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-20">
          <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 mb-12 items-end">
            <h2 className="col-span-12 lg:col-span-6 serif text-[2rem] leading-tight tracking-tight text-ink font-semibold">
              Begin anywhere.
            </h2>
            <p className="col-span-12 lg:col-span-5 lg:col-start-8 text-[0.9375rem] leading-6 text-ink-muted">
              Sixty-six books, grouped the way scholars group them. Pick one.
            </p>
          </div>
          <BookIndex />
        </div>
      </section>
    </>
  );
}

async function TodayDebateBand({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParams;
  const flag = todayFlag(new Date());
  const book = bookBySlug(flag.bookSlug);
  const passageRef = `${book?.abbr ?? flag.bookSlug} ${flag.chapter}:${flag.verses.join(",")}`;

  return (
    <section className="border-b border-rule bg-paper-2">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-16">
        <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 items-start">
          <div className="col-span-12 lg:col-span-3">
            <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
              Today's translation debate
            </div>
            <p className="mt-3 text-[0.8125rem] leading-6 text-ink-muted max-w-[28ch]">
              One contested Bible word, one debate, every day. Free for
              everyone.
            </p>
            <Link
              href="/today"
              className="mt-5 inline-flex h-9 items-center px-4 border border-rule-strong text-[0.75rem] text-ink hover:border-accent hover:text-accent transition-colors"
            >
              See today's →
            </Link>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3">
              <Link
                href={`/${flag.bookSlug}/${flag.chapter}`}
                className="font-mono text-[0.75rem] text-ink-muted hover:text-accent"
              >
                {passageRef}
              </Link>
              <span className="font-mono text-[1rem] text-flag">
                {flag.script}
              </span>
              <span className="font-mono text-[0.6875rem] text-ink-subtle">
                {flag.term} · {flag.language}
              </span>
            </div>
            <Link
              href={`/word-study/${flag.id}`}
              className="block group"
            >
              <h2 className="serif text-[1.75rem] lg:text-[2rem] leading-tight tracking-tight text-ink font-semibold group-hover:text-accent transition-colors max-w-[30ch]">
                {flag.headline}
              </h2>
              <p className="mt-4 serif text-[1rem] leading-[1.75] text-ink-muted max-w-[68ch]">
                {flag.summary}
              </p>
              <span className="mt-4 inline-block text-[0.8125rem] text-accent">
                Read the debate →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function todayFlag(d: Date) {
  const start = Date.UTC(d.getUTCFullYear(), 0, 0);
  const now = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const dayOfYear = Math.floor((now - start) / 86400000);
  return BIAS_FLAGS[dayOfYear % BIAS_FLAGS.length];
}

function Capability({
  index,
  title,
  body,
  href,
}: {
  index: string;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="col-span-12 md:col-span-6 lg:col-span-4 group block"
    >
      <div className="grid grid-cols-[2.25rem_1fr] gap-x-3 items-baseline">
        <div className="font-mono text-[0.6875rem] text-ink-subtle tabular-nums pt-1">
          {index}
        </div>
        <div>
          <h3 className="serif text-[1.125rem] font-semibold text-ink leading-snug group-hover:text-accent transition-colors">
            {title} &rarr;
          </h3>
          <p className="mt-2 text-[0.9375rem] leading-6 text-ink-muted">
            {body}
          </p>
        </div>
      </div>
    </Link>
  );
}

function Audience({ title, body }: { title: string; body: string }) {
  return (
    <div className="col-span-12 md:col-span-6">
      <div className="border-l-2 border-accent pl-5">
        <h3 className="serif text-[1.125rem] leading-snug text-ink font-semibold max-w-[36ch]">
          {title}
        </h3>
        <p className="mt-3 text-[0.9375rem] leading-7 text-ink-muted max-w-[58ch]">
          {body}
        </p>
      </div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[1rem_1fr] gap-x-3 items-start">
      <span className="font-mono text-[0.75rem] text-ink-subtle leading-6">
        ·
      </span>
      <span>{children}</span>
    </li>
  );
}

function SamplePassage() {
  return (
    <div className="border-l-2 border-accent pl-6 py-2">
      <div className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle">
        John 1:1 · Three translations
      </div>
      <div className="mt-4 space-y-5">
        <Sample
          label="BSB"
          text="In the beginning was the Word, and the Word was with God, and the Word was God."
        />
        <Sample
          label="WEB"
          text="In the beginning was the Word, and the Word was with God, and the Word was God."
        />
        <Sample
          label="Greek"
          text="ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν, καὶ θεὸς ἦν ὁ λόγος."
          mono
        />
      </div>
    </div>
  );
}

function Sample({
  label,
  text,
  mono = false,
}: {
  label: string;
  text: string;
  mono?: boolean;
}) {
  return (
    <div className="grid grid-cols-[3rem_1fr] gap-x-4 items-baseline">
      <div className="font-mono text-[0.6875rem] text-ink-subtle pt-1">
        {label}
      </div>
      <p
        className={
          mono
            ? "font-mono text-[0.9375rem] leading-6 text-ink"
            : "serif text-[1rem] leading-6 text-ink"
        }
      >
        {text}
      </p>
    </div>
  );
}
