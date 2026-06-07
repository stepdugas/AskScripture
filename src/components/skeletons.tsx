/**
 * Content-shaped Suspense fallbacks. Editorial restraint: no spinners, no
 * shimmer effects, just paper-2 blocks at the rough dimensions of what's
 * about to load. Matches the page chrome so the first-paint shift is small.
 */

export function ChapterReaderSkeleton() {
  return (
    <div className="mx-auto max-w-[1320px] px-6 lg:px-10 pt-10 pb-20 animate-[pulse_2s_ease-in-out_infinite]">
      <div className="hairline pb-4 mb-10">
        <div className="h-3 w-40 bg-paper-2" />
        <div className="mt-2 h-9 w-64 bg-paper-2" />
      </div>
      <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10">
        <aside className="hidden lg:block col-span-2">
          <div className="grid grid-cols-5 gap-1">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="h-5 bg-paper-2" />
            ))}
          </div>
        </aside>
        <article className="col-span-12 lg:col-span-7 space-y-3">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-paper-2"
              style={{ width: `${82 + (i % 5) * 4}%` }}
            />
          ))}
        </article>
        <aside className="hidden lg:block col-span-3 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 bg-paper-2" />
              <div className="h-4 w-full bg-paper-2" />
              <div className="h-4 w-3/4 bg-paper-2" />
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

export function CompareSkeleton() {
  return (
    <div className="mx-auto max-w-[1320px] px-6 lg:px-10 pt-10 pb-20 animate-[pulse_2s_ease-in-out_infinite]">
      <div className="hairline pb-4 mb-8">
        <div className="h-3 w-44 bg-paper-2" />
        <div className="mt-2 h-9 w-64 bg-paper-2" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-paper-2 w-full" />
            <div className="h-4 bg-paper-2 w-11/12" />
            <div className="h-4 bg-paper-2 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function WordStudySkeleton() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 lg:px-10 pt-12 pb-24 animate-[pulse_2s_ease-in-out_infinite]">
      <div className="hairline pb-4 mb-10">
        <div className="h-3 w-44 bg-paper-2" />
        <div className="mt-2 h-9 w-60 bg-paper-2" />
      </div>
      {Array.from({ length: 4 }).map((_, v) => (
        <section key={v} className="mb-12">
          <div className="h-3 w-24 bg-paper-2 mb-3" />
          <div className="border-t border-rule">
            {Array.from({ length: 10 }).map((_, w) => (
              <div
                key={w}
                className="grid grid-cols-6 gap-x-4 py-2.5 border-b border-rule"
              >
                <div className="h-4 bg-paper-2" />
                <div className="h-4 bg-paper-2 col-span-2" />
                <div className="h-4 bg-paper-2" />
                <div className="h-4 bg-paper-2 col-span-2" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function GenericPageSkeleton() {
  return (
    <div className="mx-auto max-w-[860px] px-6 lg:px-10 pt-16 pb-24 animate-[pulse_2s_ease-in-out_infinite]">
      <div className="h-3 w-32 bg-paper-2" />
      <div className="mt-3 h-10 w-2/3 bg-paper-2" />
      <div className="mt-5 h-4 w-full bg-paper-2" />
      <div className="mt-2 h-4 w-5/6 bg-paper-2" />
      <div className="mt-10 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-paper-2"
            style={{ width: `${78 + (i % 4) * 6}%` }}
          />
        ))}
      </div>
    </div>
  );
}
