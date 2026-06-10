import Link from "next/link";
import { Suspense } from "react";
import { BookIndex } from "@/components/book-index";
import { ReferenceSearch } from "@/components/reference-search";
import { BIAS_FLAGS } from "@/data/bias-flags";
import { bookBySlug } from "@/lib/bible/books";

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
                For close readers
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

      {/* What you get — Free vs Pro */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-20">
          <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 mb-12 items-end">
            <h2 className="col-span-12 lg:col-span-6 serif text-[2rem] leading-tight tracking-tight text-ink font-semibold">
              What you get.
            </h2>
            <p className="col-span-12 lg:col-span-5 lg:col-start-8 text-[0.9375rem] leading-6 text-ink-muted">
              Most of the tool is free, forever, with no signup. Pro is the
              full study companion — your private Bible scholar, on call.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 gap-y-10">
            <div className="col-span-12 lg:col-span-6 border border-rule p-8 bg-paper">
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
              <p className="mt-3 text-[0.875rem] leading-6 text-ink-muted">
                The whole reading and study surface — no signup required.
              </p>
              <ul className="mt-6 space-y-3 text-[0.9375rem] leading-6 text-ink">
                <Bullet>10 free Bible translations (BSB, KJV, NET, WEB, and more)</Bullet>
                <Bullet>Side-by-side compare with word-level diff</Bullet>
                <Bullet>Greek + Hebrew word study — 425,000 tagged words</Bullet>
                <Bullet>33 translation debates — arsenokoitai, kephalē, almah, Junia, gehenna, shalom and more</Bullet>
                <Bullet>340,000 cross-references per chapter</Bullet>
                <Bullet>Today's translation debate — a new contested word every day</Bullet>
                <Bullet>5 curated reading plans with progress tracking</Bullet>
                <Bullet>Study Chat — 8 messages a day when signed in, with six tuned lenses</Bullet>
                <Bullet>Notes, highlights, bookmarks, streaks — synced when signed in</Bullet>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/genesis/1"
                  className="inline-flex h-10 items-center px-4 border border-rule-strong text-[0.8125rem] text-ink hover:border-accent hover:text-accent transition-colors"
                >
                  Start reading →
                </Link>
                <Link
                  href="/signin"
                  className="inline-flex h-10 items-center text-[0.8125rem] text-ink-muted hover:text-accent transition-colors"
                >
                  Or sign in to sync
                </Link>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-6 border-2 border-accent p-8 bg-paper relative">
              <div className="absolute -top-3 left-8 bg-accent text-paper text-[0.625rem] uppercase tracking-[0.16em] font-medium px-2.5 py-1">
                Most flexible
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-accent font-medium">
                  Pro
                </div>
                <div className="font-mono text-[0.6875rem] text-accent">
                  $5 / month
                </div>
              </div>
              <h3 className="serif mt-2 text-[1.5rem] leading-tight text-ink font-semibold">
                Everything free, plus the study companion.
              </h3>
              <p className="mt-3 text-[0.875rem] leading-6 text-ink-muted">
                Less than a paperback. More than a chatbot.
              </p>
              <ul className="mt-6 space-y-4 text-[0.9375rem] leading-6 text-ink">
                <Bullet>
                  <strong className="font-semibold">Unlimited Study Chat</strong>
                  {" — "}six lenses tuned for honest Bible reading
                  (Scholarly, Devotional, Affirming, Objective, Storytelling,
                  Kids). Not a generic chatbot — it knows the passage you're
                  on, the contested words in it, and the tradition you
                  belong to.
                </Bullet>
                <Bullet>
                  <strong className="font-semibold">Generate from any passage</strong>
                  {" — "}on demand: a personal devotional, a family devotional
                  for kids ages 6-12, a 25-30 minute sermon outline, or a
                  cinematic retelling. Pick any chapter; get the kind you
                  want, in the voice you want.
                </Bullet>
                <Bullet>
                  <strong className="font-semibold">Deeper answers</strong>
                  {" — "}Pro responses do the long read. Cross-references,
                  scholarly debate, original-language nuance. Free is for
                  quick takes; Pro is for the questions worth sitting with.
                </Bullet>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/pricing"
                  className="inline-flex h-10 items-center px-4 bg-accent text-paper text-[0.8125rem] font-medium hover:bg-accent-2 transition-colors"
                >
                  Start Pro · $5 / mo →
                </Link>
                <Link
                  href="/support"
                  className="inline-flex h-10 items-center text-[0.8125rem] text-ink-muted hover:text-accent transition-colors"
                >
                  Or send a one-time donation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's on the page — richer mockups, not a list */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-20">
          <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 mb-14 items-end">
            <h2 className="col-span-12 lg:col-span-6 serif text-[2rem] leading-tight tracking-tight text-ink font-semibold">
              What's on the page.
            </h2>
            <p className="col-span-12 lg:col-span-5 lg:col-start-8 text-[0.9375rem] leading-6 text-ink-muted">
              Every chapter view brings the tools that scholars use into the
              margins of an ordinary read-through.
            </p>
          </div>

          {/* Feature 1 + 2 — side by side */}
          <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 gap-y-14 mb-14">
            <FeatureBlock
              index="01"
              title="Translation debates"
              href="/word-study"
              body="Where translators have made a contested theological choice — almah, arsenokoitai, kephalē, monogenēs — a marker opens the full debate, sourced from BDB / BDAG / LSJ and monograph-level scholarship."
            >
              <DebateMockup />
            </FeatureBlock>
            <FeatureBlock
              index="02"
              title="Greek and Hebrew word study"
              href="/words/john/1"
              body="425,000 tagged words across the whole Hebrew Bible and Greek New Testament. Tap any verse, see the original language with morphology and a short gloss."
            >
              <WordStudyMockup />
            </FeatureBlock>
          </div>

          {/* Feature 3 + 4 — side by side */}
          <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 gap-y-14 mb-14">
            <FeatureBlock
              index="03"
              title="Side-by-side translations"
              href="/compare/genesis/1"
              body="Compare any two of ten free translations with a word-level diff. See exactly where the KJV and BSB and NET diverge, and follow the trail to why."
            >
              <CompareMockup />
            </FeatureBlock>
            <FeatureBlock
              index="04"
              title="Study Chat — six lenses"
              href="/chat"
              body="Ask a question and pick the voice — Scholarly, Devotional, Affirming, Objective, Storytelling, or Kids. The same passage, framed however you need it framed."
            >
              <ChatMockup />
            </FeatureBlock>
          </div>

          {/* Feature 5 + 6 — side by side */}
          <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 gap-y-14">
            <FeatureBlock
              index="05"
              title="Generate from any passage"
              href="/generate/devotional"
              body="A personal devotional, family devotional, sermon outline, or cinematic story — written from any chapter you pick, in your tradition, at the length you want."
            >
              <GenerateMockup />
            </FeatureBlock>
            <FeatureBlock
              index="06"
              title="Reading plans + cross-references"
              href="/plans"
              body="Five curated plans paced for actual reading — Gospels in 30 days, Romans in 14. 340,000 cross-references stream into the margin as you read."
            >
              <PlansMockup />
            </FeatureBlock>
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

function FeatureBlock({
  index,
  title,
  body,
  href,
  children,
}: {
  index: string;
  title: string;
  body: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div className="col-span-12 lg:col-span-6 grid grid-cols-12 gap-x-4 lg:gap-x-6 items-start">
      <div className="col-span-12 md:col-span-5">
        <div className="font-mono text-[0.6875rem] text-ink-subtle tabular-nums">
          {index}
        </div>
        <h3 className="serif mt-2 text-[1.25rem] font-semibold text-ink leading-snug">
          {title}
        </h3>
        <p className="mt-3 text-[0.9375rem] leading-6 text-ink-muted">
          {body}
        </p>
        <Link
          href={href}
          className="mt-4 inline-block text-[0.8125rem] text-accent hover:underline"
        >
          See it →
        </Link>
      </div>
      <div className="col-span-12 md:col-span-7 mt-6 md:mt-0">
        <div className="border border-rule p-5 bg-paper-2/60 min-h-[12rem]">
          {children}
        </div>
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

/* ---------- Editorial feature mockups (no PNGs, all typography) ---------- */

function DebateMockup() {
  return (
    <div>
      <div className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle">
        Isaiah 7:14 · עַלְמָה · almah
      </div>
      <p className="serif mt-2 text-[0.9375rem] leading-6 text-ink font-semibold">
        "Virgin" or "young woman"?
      </p>
      <p className="serif mt-2 text-[0.8125rem] leading-6 text-ink-muted">
        Hebrew almah names a young woman of marriageable age — sexual status
        is not part of its lexical core. The Greek Septuagint chose parthenos,
        which Matthew 1:23 quotes.
      </p>
      <div className="mt-3 grid grid-cols-[3rem_1fr] gap-x-2 gap-y-1 text-[0.75rem]">
        <span className="font-mono text-ink-subtle">BSB</span>
        <span className="text-ink">the virgin will be with child</span>
        <span className="font-mono text-ink-subtle">JPS</span>
        <span className="text-ink">the young woman is with child</span>
      </div>
    </div>
  );
}

function WordStudyMockup() {
  return (
    <div>
      <div className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle">
        John 1:1 · word study
      </div>
      <div className="mt-3 grid grid-cols-[1.5rem_1fr] gap-x-2 gap-y-1.5 items-baseline text-[0.8125rem]">
        <sup className="text-[0.625rem] font-mono text-ink-subtle">1</sup>
        <div>
          <span className="font-mono text-flag text-[0.9375rem]">λόγος</span>
          <span className="text-ink-muted ml-2">logos · noun, masc, sg</span>
          <div className="serif text-ink-muted mt-0.5 text-[0.75rem]">
            "word, reason, account, ordering principle"
          </div>
        </div>
        <sup className="text-[0.625rem] font-mono text-ink-subtle">2</sup>
        <div>
          <span className="font-mono text-flag text-[0.9375rem]">ἀρχῇ</span>
          <span className="text-ink-muted ml-2">archē · dat, sg</span>
          <div className="serif text-ink-muted mt-0.5 text-[0.75rem]">
            "beginning, origin, first principle"
          </div>
        </div>
      </div>
    </div>
  );
}

function CompareMockup() {
  return (
    <div>
      <div className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle">
        Romans 12:1 · BSB vs KJV
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-3 text-[0.75rem]">
        <div>
          <div className="font-mono text-ink-subtle text-[0.625rem] mb-1">
            BSB
          </div>
          <p className="serif leading-6 text-ink">
            <sup className="text-[0.5rem] font-mono">1</sup>{" "}
            offer your bodies as a{" "}
            <span className="bg-accent/10 text-accent px-0.5">living sacrifice</span>
            , holy and pleasing to God
          </p>
        </div>
        <div>
          <div className="font-mono text-ink-subtle text-[0.625rem] mb-1">
            KJV
          </div>
          <p className="serif leading-6 text-ink">
            <sup className="text-[0.5rem] font-mono">1</sup>{" "}
            present your bodies a{" "}
            <span className="bg-flag/10 text-flag px-0.5">living sacrifice</span>
            , holy, acceptable unto God
          </p>
        </div>
      </div>
    </div>
  );
}

function ChatMockup() {
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {["Objective", "Scholarly", "Devotional", "Affirming", "Story", "Kids"].map(
          (mode, i) => (
            <span
              key={mode}
              className={
                "font-mono text-[0.625rem] uppercase tracking-[0.12em] px-2 py-0.5 " +
                (i === 3
                  ? "bg-accent text-paper"
                  : "border border-rule-strong text-ink-muted")
              }
            >
              {mode}
            </span>
          ),
        )}
      </div>
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
        You · 1 Cor 6:9
      </div>
      <p className="serif mt-1 text-[0.8125rem] leading-5 text-ink">
        What's the affirming reading of arsenokoitai here?
      </p>
      <div className="mt-3 text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
        AskScripture · Affirming
      </div>
      <p className="serif mt-1 text-[0.8125rem] leading-5 text-ink-muted">
        Arsenokoitēs is a rare compound — Paul or someone in his circle may
        have coined it, drawing on Leviticus 18:22 LXX. Brownson and Loader
        argue it targets a specific…
      </p>
    </div>
  );
}

function GenerateMockup() {
  return (
    <div>
      <div className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle">
        Generate · Romans 8
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-[0.75rem]">
        <button
          type="button"
          className="border border-rule-strong px-2.5 py-1.5 text-left text-ink"
          tabIndex={-1}
        >
          <div className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-subtle">
            Personal
          </div>
          <div className="serif mt-0.5">Devotional</div>
        </button>
        <button
          type="button"
          className="border border-rule-strong px-2.5 py-1.5 text-left text-ink"
          tabIndex={-1}
        >
          <div className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-subtle">
            For kids 6-12
          </div>
          <div className="serif mt-0.5">Family devotional</div>
        </button>
        <button
          type="button"
          className="border border-rule-strong px-2.5 py-1.5 text-left text-ink"
          tabIndex={-1}
        >
          <div className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-subtle">
            25-30 min
          </div>
          <div className="serif mt-0.5">Sermon outline</div>
        </button>
        <button
          type="button"
          className="border-2 border-accent px-2.5 py-1.5 text-left text-ink bg-paper"
          tabIndex={-1}
        >
          <div className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-accent">
            Cinematic
          </div>
          <div className="serif mt-0.5">Story retelling</div>
        </button>
      </div>
    </div>
  );
}

function PlansMockup() {
  return (
    <div>
      <div className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle">
        Reading plans
      </div>
      <ul className="mt-3 space-y-2.5 text-[0.8125rem]">
        {[
          { title: "Gospels in 30 days", progress: 60 },
          { title: "Psalms in 50 days", progress: 24 },
          { title: "Romans in 14 days", progress: 0 },
        ].map((p) => (
          <li key={p.title}>
            <div className="flex items-baseline justify-between">
              <span className="serif text-ink">{p.title}</span>
              <span className="font-mono text-[0.625rem] text-ink-subtle">
                {p.progress}%
              </span>
            </div>
            <div className="mt-1 h-1 bg-rule">
              <div
                className="h-full bg-accent"
                style={{ width: `${p.progress}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
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
