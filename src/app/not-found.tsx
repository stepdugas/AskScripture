import Link from "next/link";

export default function NotFound() {
  return (
    <>
    <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-32">
          <div className="grid grid-cols-12 gap-x-10">
            <div className="col-span-12 lg:col-span-7 lg:col-start-3">
              <div className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle">
                404 · Not found
              </div>
              <h1 className="serif mt-4 text-[2.5rem] leading-[1.05] tracking-tight text-ink font-semibold">
                That passage isn&rsquo;t here.
              </h1>
              <p className="mt-5 text-[1rem] leading-7 text-ink-muted max-w-[52ch]">
                You may have followed an old link, or the reference may be
                outside the protestant 66-book canon. The page index has every
                chapter we serve.
              </p>
              <div className="mt-8 flex items-center gap-3">
                <Link
                  href="/"
                  className="inline-flex h-10 items-center px-5 bg-accent text-paper text-[0.8125rem] font-medium tracking-wide hover:bg-accent-2 transition-colors"
                >
                  Return home
                </Link>
                <Link
                  href="/genesis/1"
                  className="inline-flex h-10 items-center px-5 border border-rule-strong text-ink text-[0.8125rem] font-medium tracking-wide hover:bg-paper-2 transition-colors"
                >
                  Open Genesis 1
                </Link>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
