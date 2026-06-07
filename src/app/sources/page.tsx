import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sources & attribution",
  description:
    "Sources, licenses, and attribution for the data behind AskScripture.",
};

const SOURCES = [
  {
    name: "Free Use Bible API (HelloAO)",
    purpose: "Scripture text for all displayed translations",
    license: "Public domain / individual translation licenses",
    url: "https://bible.helloao.org/",
  },
  {
    name: "Berean Standard Bible",
    purpose: "Default translation (BSB)",
    license: "Public domain",
    url: "https://berean.bible/",
  },
  {
    name: "OpenBible.info Cross References",
    purpose: "340,000 cross-references derived from the Treasury of Scripture Knowledge",
    license: "CC BY",
    url: "https://www.openbible.info/labs/cross-references/",
  },
  {
    name: "STEPBible-Data",
    purpose: "Greek and Hebrew morphology and interlinear data",
    license: "CC BY 4.0",
    url: "https://github.com/STEPBible/STEPBible-Data",
  },
  {
    name: "Anthropic Claude",
    purpose: "AI study chat and content generation",
    license: "Per Anthropic Usage Policies",
    url: "https://www.anthropic.com",
  },
  {
    name: "Source Serif 4",
    purpose: "Scripture and display typography",
    license: "SIL Open Font License 1.1",
    url: "https://github.com/adobe-fonts/source-serif",
  },
  {
    name: "Inter",
    purpose: "UI typography",
    license: "SIL Open Font License 1.1",
    url: "https://rsms.me/inter/",
  },
  {
    name: "JetBrains Mono",
    purpose: "Greek/Hebrew transliteration and code typography",
    license: "SIL Open Font License 1.1",
    url: "https://www.jetbrains.com/lp/mono/",
  },
];

export default function SourcesPage() {
  return (
    <>
    <article className="mx-auto max-w-[860px] px-6 lg:px-10 pt-16 pb-24">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            Sources &amp; attribution
          </div>
          <h1 className="serif mt-3 text-[2.5rem] leading-[1.05] tracking-tight text-ink font-semibold">
            Where the data comes from.
          </h1>
          <p className="mt-5 text-[1rem] leading-7 text-ink-muted max-w-[58ch]">
            Every dataset, font, and service used by AskScripture, with its
            license.
          </p>

          <div className="mt-12 border-t border-rule">
            {SOURCES.map((s) => (
              <div
                key={s.name}
                className="grid grid-cols-12 gap-x-6 py-5 border-b border-rule"
              >
                <div className="col-span-12 md:col-span-4">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="serif text-[1rem] font-semibold text-ink hover:text-accent transition-colors"
                  >
                    {s.name}
                  </a>
                  <div className="mt-1 text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
                    {s.license}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-8 text-[0.9375rem] leading-6 text-ink-muted">
                  {s.purpose}
                </div>
              </div>
            ))}
          </div>
        </article>
    </>
  );
}
