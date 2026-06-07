import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Method",
  description:
    "How AskScripture sources its translations (HelloAO + BSB), cross-references (OpenBible.info), original-language data (STEPBible), and AI responses (Claude Sonnet 4.6 with mode-specific system prompts).",
};

export default function MethodPage() {
  return (
    <>
    <article className="mx-auto max-w-[760px] px-6 lg:px-10 pt-16 pb-24">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            Method
          </div>
          <h1 className="serif mt-3 text-[2.5rem] leading-[1.05] tracking-tight text-ink font-semibold">
            How this works.
          </h1>

          <div className="mt-12 space-y-12">
            <Section title="Translations">
              <p>
                The chapter reader pulls from the Free Use Bible API, an
                open-source project that serves over a thousand translations
                without rate limits or copyright restrictions. AskScripture
                surfaces the English translations whose licenses permit
                redistribution: BSB, WEB, NET, LSV, KJV, ASV, Geneva, Darby,
                YLT, and BBE.
              </p>
              <p>
                Translations that require paid licensing — NIV, NASB, ESV,
                NRSVue — are not currently available. Adding them requires a
                license per translation; that's on the project roadmap.
              </p>
            </Section>

            <Section title="Cross-references">
              <p>
                340,000 cross-references curated and vote-weighted by the
                OpenBible.info community, derived from the public-domain
                Treasury of Scripture Knowledge. Used under CC BY.
              </p>
            </Section>

            <Section title="Original-language data">
              <p>
                Greek and Hebrew word information is sourced from STEPBible-Data
                (CC BY 4.0), curated by Tyndale House Cambridge. The translation
                debates index draws on standard lexicons — BDB and HALOT for
                Hebrew; LSJ and BDAG for Greek — as well as monograph-level
                scholarship on each contested term.
              </p>
            </Section>

            <Section title="AI responses">
              <p>
                The study chat and content generators use Anthropic's Claude
                Sonnet 4.6. System prompts for each chat mode are visible in the
                source code at <code className="font-mono text-[0.875rem]">src/lib/chat/modes.ts</code>. The prompts include
                strict guardrails against inventing references and pushing
                denominational agendas.
              </p>
              <p>
                Generated text is not authoritative. Treat it as a
                conversation partner whose job is to surface questions, name
                debates, and bring relevant context — not to settle theology
                for you.
              </p>
            </Section>

            <Section title="What's not here">
              <p>
                Photo OCR upload, audio playback, group study sessions, public
                study notes, follow-other-users, and email digests are on the
                roadmap but not yet shipped. Sign-in and cross-device sync are
                coming alongside Supabase integration.
              </p>
            </Section>
          </div>

          <p className="mt-16 text-[0.8125rem] text-ink-muted">
            See also: {""}
            <Link href="/sources" className="text-accent hover:underline">
              Sources &amp; attribution
            </Link>
          </p>
        </article>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
    <section className="grid grid-cols-12 gap-x-6">
      <div className="col-span-12 md:col-span-3">
        <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
          {title}
        </div>
      </div>
      <div className="col-span-12 md:col-span-9 serif text-[1rem] leading-[1.8] text-ink space-y-4">
        {children}
      </div>
    </section>
    </>
  );
}
