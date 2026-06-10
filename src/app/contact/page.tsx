import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with AskScripture. One human reads every email.",
};

const EMAIL = "stephanie@erie-apps.com";

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-[760px] px-6 lg:px-10 pt-16 pb-24">
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
        Contact
      </div>
      <h1 className="serif mt-3 text-[2.5rem] leading-[1.05] tracking-tight text-ink font-semibold">
        Get in touch.
      </h1>
      <p className="mt-5 text-[1rem] leading-7 text-ink-muted max-w-[58ch]">
        AskScripture is built by one person. Every email is read by a human —
        usually the same day.
      </p>

      <div className="mt-12">
        <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
          Email
        </div>
        <a
          href={`mailto:${EMAIL}`}
          className="serif mt-2 inline-block text-[1.75rem] text-accent hover:underline font-semibold"
        >
          {EMAIL}
        </a>
      </div>

      <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-10 border-t border-rule pt-10">
        <section className="col-span-12 md:col-span-6">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            Something's broken
          </div>
          <p className="mt-3 text-[0.9375rem] leading-7 text-ink">
            Tell me what page you were on, what you expected, and what
            happened. A screenshot helps. Your browser + device is useful too.
          </p>
        </section>
        <section className="col-span-12 md:col-span-6">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            A feature request
          </div>
          <p className="mt-3 text-[0.9375rem] leading-7 text-ink">
            I keep a running list. The more specific the request — what you
            were trying to do, where it broke down — the more useful it is.
          </p>
        </section>
        <section className="col-span-12 md:col-span-6">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            A translation question
          </div>
          <p className="mt-3 text-[0.9375rem] leading-7 text-ink">
            If you spot a translation debate AskScripture should cover, send
            it. Include the passage and the contested word in the original
            language if you know it.
          </p>
        </section>
        <section className="col-span-12 md:col-span-6">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            A theological disagreement
          </div>
          <p className="mt-3 text-[0.9375rem] leading-7 text-ink">
            Welcome. AskScripture is built to surface honest debates, not
            avoid them. If an entry overclaims or strawmans, tell me.
          </p>
        </section>
      </div>

      <div className="mt-16 pt-6 border-t border-rule text-[0.75rem] text-ink-muted leading-6">
        Looking for something specific?{" "}
        <Link href="/about" className="text-accent hover:underline">
          About
        </Link>
        {" · "}
        <Link href="/method" className="text-accent hover:underline">
          Method
        </Link>
        {" · "}
        <Link href="/sources" className="text-accent hover:underline">
          Sources
        </Link>
        {" · "}
        <Link href="/privacy" className="text-accent hover:underline">
          Privacy
        </Link>
        {" · "}
        <Link href="/terms" className="text-accent hover:underline">
          Terms
        </Link>
        .
      </div>
    </article>
  );
}
