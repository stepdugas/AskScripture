import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule mt-24">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-12">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          <div className="col-span-12 md:col-span-4">
            <Image
              src="/logo.svg"
              alt="AskScripture"
              width={140}
              height={28}
              className="h-6 w-auto"
            />
            <p className="mt-3 text-[0.8125rem] leading-6 text-ink-muted max-w-[28ch]">
              A study tool for reading the Bible carefully — across translations,
              languages, and centuries.
            </p>
          </div>
          <div className="col-span-6 md:col-span-2">
            <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
              Read
            </div>
            <ul className="mt-3 space-y-2 text-[0.8125rem] text-ink-muted">
              <li><Link href="/genesis/1" className="hover:text-ink">Old Testament</Link></li>
              <li><Link href="/matthew/1" className="hover:text-ink">New Testament</Link></li>
              <li><Link href="/translations" className="hover:text-ink">Translations</Link></li>
            </ul>
          </div>
          <div className="col-span-6 md:col-span-2">
            <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
              Study
            </div>
            <ul className="mt-3 space-y-2 text-[0.8125rem] text-ink-muted">
              <li><Link href="/word-study" className="hover:text-ink">Word study</Link></li>
              <li><Link href="/compare" className="hover:text-ink">Compare</Link></li>
              <li><Link href="/notes" className="hover:text-ink">Notes</Link></li>
            </ul>
          </div>
          <div className="col-span-6 md:col-span-2">
            <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
              Project
            </div>
            <ul className="mt-3 space-y-2 text-[0.8125rem] text-ink-muted">
              <li><Link href="/about" className="hover:text-ink">About</Link></li>
              <li><Link href="/method" className="hover:text-ink">Method</Link></li>
              <li><Link href="/modes" className="hover:text-ink">Modes</Link></li>
              <li><Link href="/sources" className="hover:text-ink">Sources</Link></li>
              <li><Link href="/api-docs" className="hover:text-ink">API</Link></li>
            </ul>
          </div>
          <div className="col-span-6 md:col-span-2">
            <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
              Account
            </div>
            <ul className="mt-3 space-y-2 text-[0.8125rem] text-ink-muted">
              <li><Link href="/signin" className="hover:text-ink">Sign in</Link></li>
              <li><Link href="/contact" className="hover:text-ink">Contact</Link></li>
              <li><Link href="/support" className="hover:text-ink">Donate</Link></li>
              <li><Link href="/privacy" className="hover:text-ink">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-ink">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-rule flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[0.75rem] text-ink-subtle">
          <div>
            Scripture text via the Free Use Bible API. Cross-references from
            OpenBible.info (CC&nbsp;BY). Original-language data from STEPBible
            (CC&nbsp;BY 4.0).
          </div>
          <div>© 2026 AskScripture</div>
        </div>
      </div>
    </footer>
  );
}
