import Link from "next/link";
import { BookIndex } from "@/components/book-index";
import { ReferenceSearch } from "@/components/reference-search";

export default function HomePage() {
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

      {/* What you get — Free vs Pro */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-20">
          <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 mb-12 items-end">
            <h2 className="col-span-12 lg:col-span-6 serif text-[2rem] leading-tight tracking-tight text-ink font-semibold">
              What you get.
            </h2>
            <p className="col-span-12 lg:col-span-5 lg:col-start-8 text-[0.9375rem] leading-6 text-ink-muted">
              The reading and study surface is free, forever. Pro is the full
              study companion — your private Bible scholar, on call.
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
                Read the whole Bible.
              </h3>
              <p className="mt-3 text-[0.875rem] leading-6 text-ink-muted">
                No signup required to read, compare, or study any passage.
              </p>
              <ul className="mt-6 space-y-4 text-[0.9375rem] leading-6 text-ink">
                <GroupedBullet
                  title="The whole Bible"
                  body="10 free translations, side-by-side compare with word-level diff, 340,000 cross-references."
                />
                <GroupedBullet
                  title="Original language study"
                  body="Greek + Hebrew word study with 425,000 tagged words, plus 33 translation debates (arsenokoitai, kephalē, almah, Junia, gehenna, shalom)."
                />
                <GroupedBullet
                  title="Daily content"
                  body="A new translation debate every day, five curated reading plans with progress tracking."
                />
                <GroupedBullet
                  title="Study Chat"
                  body="Eight messages a day signed in, with six tuned lenses — Objective, Scholarly, Devotional, Affirming, Storytelling, Kids."
                />
                <GroupedBullet
                  title="Your reading, synced"
                  body="Notes, highlights, bookmarks, and streaks — synced across devices when signed in."
                />
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
                Study it like a scholar.
              </h3>
              <p className="mt-3 text-[0.875rem] leading-6 text-ink-muted">
                Less than a paperback. More than a chatbot.
              </p>
              <ul className="mt-6 space-y-4 text-[0.9375rem] leading-6 text-ink">
                <GroupedBullet
                  title="Unlimited Study Chat"
                  body="No daily caps. Six lenses tuned for honest Bible reading — not a generic chatbot. It knows the passage you're on, the contested words in it, and the tradition you belong to."
                />
                <GroupedBullet
                  title="Generate from any passage"
                  body="On demand: a personal devotional, a family devotional for ages 6-12, a 25-30 minute sermon outline, or a cinematic retelling. Any chapter you pick."
                />
                <GroupedBullet
                  title="Deeper answers"
                  body="Pro responses do the long read. Cross-references, scholarly debate, original-language nuance. Free is for quick takes; Pro is for the questions worth sitting with."
                />
              </ul>
              <div className="mt-8">
                <Link
                  href="/pricing"
                  className="inline-flex h-10 items-center px-4 bg-accent text-paper text-[0.8125rem] font-medium hover:bg-accent-2 transition-colors"
                >
                  Start Pro · $5 / mo →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's on the page — alternating zigzag */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-20">
          <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 mb-16 items-end">
            <h2 className="col-span-12 lg:col-span-6 serif text-[2rem] leading-tight tracking-tight text-ink font-semibold">
              What's on the page.
            </h2>
            <p className="col-span-12 lg:col-span-5 lg:col-start-8 text-[0.9375rem] leading-6 text-ink-muted">
              Every chapter view brings the tools that scholars use into the
              margins of an ordinary read-through.
            </p>
          </div>

          <div className="space-y-16">
            <FeatureRow
              index="01"
              title="Translation debates"
              href="/word-study"
              body="Where translators have made a contested theological choice — almah, arsenokoitai, kephalē, monogenēs — a marker opens the full debate. Each entry sourced from BDB / BDAG / LSJ and monograph-level scholarship."
              side="right"
            >
              <DebateMockup />
            </FeatureRow>
            <FeatureRow
              index="02"
              title="Greek and Hebrew word study"
              href="/words/john/1"
              body="425,000 tagged words across the whole Hebrew Bible and Greek New Testament. Tap any verse and see the original language with morphology and a short gloss."
              side="left"
            >
              <WordStudyMockup />
            </FeatureRow>
            <FeatureRow
              index="03"
              title="Side-by-side translations"
              href="/compare/genesis/1"
              body="Compare any two of ten free translations with a word-level diff. See exactly where the KJV and BSB and NET diverge, and follow the trail to why."
              side="right"
            >
              <CompareMockup />
            </FeatureRow>
            <FeatureRow
              index="04"
              title="Study Chat — six lenses"
              href="/chat"
              body="Ask a question and pick the voice — Scholarly, Devotional, Affirming, Objective, Storytelling, or Kids. The same passage, framed however you need it framed."
              side="left"
            >
              <ChatMockup />
            </FeatureRow>
            <FeatureRow
              index="05"
              title="Generate from any passage"
              href="/generate/devotional"
              body="A personal devotional, family devotional, sermon outline, or cinematic story — written from any chapter you pick, in your tradition, at the length you want."
              side="right"
            >
              <GenerateMockup />
            </FeatureRow>
            <FeatureRow
              index="06"
              title="Reading plans + cross-references"
              href="/plans"
              body="Five curated plans paced for actual reading — Gospels in 30 days, Romans in 14. 340,000 cross-references stream into the margin as you read."
              side="left"
            >
              <PlansMockup />
            </FeatureRow>
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

function GroupedBullet({ title, body }: { title: string; body: string }) {
  return (
    <li>
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
        {title}
      </div>
      <p className="mt-1 text-[0.9375rem] leading-6 text-ink-muted">
        {body}
      </p>
    </li>
  );
}

function FeatureRow({
  index,
  title,
  body,
  href,
  side,
  children,
}: {
  index: string;
  title: string;
  body: string;
  href: string;
  side: "left" | "right";
  children: React.ReactNode;
}) {
  const mockupClass =
    side === "right"
      ? "lg:col-start-7 lg:col-span-6 order-2 lg:order-2"
      : "lg:col-span-6 order-2 lg:order-1";
  const textClass =
    side === "right"
      ? "lg:col-span-5 order-1 lg:order-1"
      : "lg:col-start-8 lg:col-span-5 order-1 lg:order-2";

  return (
    <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 gap-y-6 items-center">
      <div className={`col-span-12 ${textClass}`}>
        <div className="font-mono text-[0.6875rem] text-ink-subtle tabular-nums">
          {index}
        </div>
        <h3 className="serif mt-2 text-[1.5rem] font-semibold text-ink leading-snug">
          {title}
        </h3>
        <p className="mt-3 text-[0.9375rem] leading-7 text-ink-muted max-w-[44ch]">
          {body}
        </p>
        <Link
          href={href}
          className="mt-4 inline-block text-[0.8125rem] text-accent hover:underline"
        >
          See it →
        </Link>
      </div>
      <div className={`col-span-12 ${mockupClass}`}>
        <div className="border border-rule p-6 bg-paper-2/60 min-h-[14rem]">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ---------- Editorial feature mockups (no PNGs, all typography) ---------- */

function DebateMockup() {
  return (
    <div>
      <div className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle">
        Isaiah 7:14 · עַלְמָה · almah
      </div>
      <p className="serif mt-2 text-[1rem] leading-6 text-ink font-semibold">
        "Virgin" or "young woman"?
      </p>
      <p className="serif mt-2 text-[0.875rem] leading-6 text-ink-muted">
        Hebrew almah names a young woman of marriageable age — sexual status
        is not part of its lexical core. The Greek Septuagint chose parthenos,
        which Matthew 1:23 quotes.
      </p>
      <div className="mt-4 grid grid-cols-[3rem_1fr] gap-x-3 gap-y-1.5 text-[0.8125rem]">
        <span className="font-mono text-ink-subtle">BSB</span>
        <span className="serif text-ink">the virgin will be with child</span>
        <span className="font-mono text-ink-subtle">JPS</span>
        <span className="serif text-ink">the young woman is with child</span>
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
      <div className="mt-3 grid grid-cols-[1.5rem_1fr] gap-x-2 gap-y-2.5 items-baseline text-[0.875rem]">
        <sup className="text-[0.625rem] font-mono text-ink-subtle">1</sup>
        <div>
          <span className="font-mono text-flag text-[1rem]">λόγος</span>
          <span className="text-ink-muted ml-2 text-[0.75rem]">logos · noun, masc, sg</span>
          <div className="serif text-ink-muted mt-0.5 text-[0.8125rem]">
            "word, reason, account, ordering principle"
          </div>
        </div>
        <sup className="text-[0.625rem] font-mono text-ink-subtle">2</sup>
        <div>
          <span className="font-mono text-flag text-[1rem]">ἀρχῇ</span>
          <span className="text-ink-muted ml-2 text-[0.75rem]">archē · dat, sg</span>
          <div className="serif text-ink-muted mt-0.5 text-[0.8125rem]">
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
        John 3:16 · BSB vs KJV
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-4 text-[0.8125rem]">
        <div>
          <div className="font-mono text-ink-subtle text-[0.625rem] mb-1.5">
            BSB
          </div>
          <p className="serif leading-6 text-ink">
            <sup className="text-[0.5rem] font-mono">16</sup>{" "}
            For God so loved the world{" "}
            <span className="bg-accent/10 text-accent px-0.5">that</span>{" "}
            He gave His{" "}
            <span className="bg-accent/10 text-accent px-0.5">
              one and only
            </span>{" "}
            Son
          </p>
        </div>
        <div>
          <div className="font-mono text-ink-subtle text-[0.625rem] mb-1.5">
            KJV
          </div>
          <p className="serif leading-6 text-ink">
            <sup className="text-[0.5rem] font-mono">16</sup>{" "}
            For God so loved the world,{" "}
            <span className="bg-flag/10 text-flag px-0.5">that</span>{" "}
            he gave his{" "}
            <span className="bg-flag/10 text-flag px-0.5">
              only begotten
            </span>{" "}
            Son
          </p>
        </div>
      </div>
      <p className="mt-3 text-[0.6875rem] text-ink-subtle italic">
        See the monogenēs debate →
      </p>
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
      <p className="serif mt-1 text-[0.875rem] leading-5 text-ink">
        What's the affirming reading of arsenokoitai here?
      </p>
      <div className="mt-3 text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
        AskScripture · Affirming
      </div>
      <p className="serif mt-1 text-[0.875rem] leading-5 text-ink-muted">
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
        <div className="border border-rule-strong px-2.5 py-2 text-ink">
          <div className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-subtle">
            Personal
          </div>
          <div className="serif mt-0.5">Devotional</div>
        </div>
        <div className="border border-rule-strong px-2.5 py-2 text-ink">
          <div className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-subtle">
            For kids 6-12
          </div>
          <div className="serif mt-0.5">Family devotional</div>
        </div>
        <div className="border border-rule-strong px-2.5 py-2 text-ink">
          <div className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-subtle">
            25-30 min
          </div>
          <div className="serif mt-0.5">Sermon outline</div>
        </div>
        <div className="border-2 border-accent px-2.5 py-2 text-ink bg-paper">
          <div className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-accent">
            Cinematic
          </div>
          <div className="serif mt-0.5">Story retelling</div>
        </div>
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
      <ul className="mt-3 space-y-3 text-[0.875rem]">
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
