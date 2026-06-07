import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "AskScripture is built by Stephanie Dugas as an editorial Bible study tool — sourced from standard lexicons, scholarly translation debates, and original-language datasets.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-[760px] px-6 lg:px-10 pt-16 pb-24">
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
        About
      </div>
      <h1 className="serif mt-3 text-[2.75rem] leading-[1.05] tracking-tight text-ink font-semibold">
        A study tool, not a sermon.
      </h1>
      <div className="serif mt-10 text-[1.0625rem] leading-[1.8] text-ink space-y-6">
        <p>
          AskScripture exists for one reason: most Bible study apps decide
          what a passage means before you read it. They smooth over the seams
          between the original language and the English, between the
          translator's choices and the text itself.
        </p>
        <p>
          This tool tries to do the opposite. Every chapter is set next to
          the translations that disagree about it. Where the Hebrew or Greek
          is contested, the debate is named — with the scholars, the
          dictionaries, and the alternate renderings on the page. The AI
          study chat has{" "}
          <Link href="/modes" className="text-accent hover:underline">
            six modes
          </Link>{" "}
          because the same text honestly admits more than one way of being
          read.
        </p>
        <p>
          No translation is treated as the default true one. No tradition is
          treated as the assumed one. If you want to read with a particular
          lens, you can pick it explicitly in {""}
          <Link href="/settings" className="text-accent hover:underline">
            preferences
          </Link>
          .
        </p>
      </div>

      <hr className="my-14 border-t border-rule" />

      {/* Founder section — editorial restraint: name + reason + contact, no photo. */}
      <section>
        <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-3">
          Who builds this
        </div>
        <h2 className="serif text-[1.75rem] leading-tight font-semibold text-ink">
          Stephanie Dugas
        </h2>
        <p className="mt-4 text-[1rem] leading-7 text-ink-muted max-w-[58ch]">
          One developer, one project. AskScripture is built and maintained by
          Stephanie Dugas (Erie Apps LLC) — paid for out of pocket, with
          Anthropic and Vercel bills on the line.
        </p>
        <p className="mt-4 text-[1rem] leading-7 text-ink-muted max-w-[58ch]">
          The tool exists because I wanted it for my own study, and the
          honest version didn't exist in the App Store. If you find something
          missing or wrong, that's a real bug — write in.
        </p>
        <div className="mt-6 grid grid-cols-[6.5rem_1fr] gap-y-2 text-[0.875rem]">
          <span className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium pt-1">
            Contact
          </span>
          <a
            href="mailto:hello@askscripture.com"
            className="text-ink hover:text-accent font-mono"
          >
            hello@askscripture.com
          </a>
          <span className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium pt-1">
            Methodology
          </span>
          <Link href="/method" className="text-ink hover:text-accent">
            How sourcing and AI responses work
          </Link>
          <span className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium pt-1">
            Attribution
          </span>
          <Link href="/sources" className="text-ink hover:text-accent">
            Every dataset and font with its license
          </Link>
        </div>
      </section>
    </article>
  );
}
