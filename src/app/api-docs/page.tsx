import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Public API",
  description:
    "Read-only JSON endpoints for translations, chapter text, 340,000 cross-references, original-language word study (Greek + Hebrew), and the daily verse. No auth required, CORS-open.",
};

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/v1/translations",
    body: "Returns the list of free translations AskScripture serves.",
    sample: `[
  { "id": "BSB", "shortName": "BSB", "name": "Berean Standard Bible", "year": 2022, "lens": "literal", ... },
  ...
]`,
  },
  {
    method: "GET",
    path: "/api/v1/chapter/{book}/{chapter}?t=BSB",
    body: "Returns the chapter text in the requested translation (defaults to BSB). Book is the canonical slug (e.g. genesis, 1-corinthians).",
    sample: `{
  "book": { "slug": "john", "name": "John", "testament": "NT", "section": "Gospels" },
  "chapter": 3,
  "translation": { "id": "BSB", "shortName": "BSB" },
  "verses": [
    { "number": 1, "text": "Now there was a man of the Pharisees..." },
    ...
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/cross-refs/{book}/{chapter}",
    body: "Returns the cross-references for every verse in the chapter, vote-weighted. Derived from the Treasury of Scripture Knowledge via OpenBible.info (CC BY).",
    sample: `{
  "book": "john",
  "chapter": 3,
  "crossRefs": {
    "16": [
      { "ref": "1 John 4:9", "votes": 158, "href": "/1-john/4#v9" },
      ...
    ]
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/word-study",
    body: "Returns every translation-debate entry — Greek/Hebrew word, the debate, and how major translations render it.",
    sample: `{
  "entries": [
    {
      "id": "1co-6-9-arsenokoitai",
      "bookSlug": "1-corinthians",
      "chapter": 6,
      "verses": [9],
      "term": "arsenokoitai / malakoi",
      "script": "ἀρσενοκοῖται / μαλακοί",
      ...
    },
    ...
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/daily-verse",
    body: "Today's curated verse and editorial note.",
    sample: `{ "ref": "John 14", "note": "The Last Discourse begins..." }`,
  },
];

export default function ApiDocs() {
  return (
    <div className="mx-auto max-w-[960px] px-6 lg:px-10 pt-16 pb-24">
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
        Public API · v1
      </div>
      <h1 className="serif mt-3 text-[2.5rem] leading-[1.05] tracking-tight text-ink font-semibold">
        Build on AskScripture.
      </h1>
      <p className="mt-5 text-[1rem] leading-7 text-ink-muted max-w-[58ch]">
        Read-only JSON, no auth required, CORS-enabled. Cached for 24 hours
        at the edge.
      </p>

      <div className="mt-6 border border-rule p-4 max-w-[640px] text-[0.8125rem] leading-6 text-ink-muted">
        <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-2">
          Limits
        </div>
        <ul className="space-y-1">
          <li>
            <strong className="text-ink font-medium">60 requests/minute per IP</strong> across all{" "}
            <code className="font-mono text-[0.8125rem]">/api/v1/*</code> endpoints, enforced at the edge.
          </li>
          <li>
            Burst traffic above that gets <code className="font-mono text-[0.8125rem]">429 Too Many Requests</code> with a{" "}
            <code className="font-mono text-[0.8125rem]">Retry-After</code> header.
          </li>
          <li>
            For higher volume or commercial use, email{" "}
            <a
              href="mailto:hello@askscripture.com"
              className="text-accent hover:underline font-mono"
            >
              hello@askscripture.com
            </a>{" "}
            — happy to issue a key.
          </li>
        </ul>
      </div>

      <p className="mt-6 text-[0.875rem] text-ink-muted">
        Attribution: <em>Powered by AskScripture &amp; the Free Use Bible API</em>.
      </p>

      <div className="mt-12">
        {ENDPOINTS.map((ep) => (
          <section key={ep.path} className="border-t border-rule py-8">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-flag font-medium">
                {ep.method}
              </span>
              <code className="font-mono text-[0.9375rem] text-ink">
                {ep.path}
              </code>
            </div>
            <p className="mt-3 text-[0.9375rem] leading-6 text-ink-muted max-w-[68ch]">
              {ep.body}
            </p>
            <pre className="mt-4 bg-paper-2 border border-rule p-4 overflow-x-auto font-mono text-[0.75rem] leading-5 text-ink whitespace-pre">
              {ep.sample}
            </pre>
          </section>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-rule">
        <p className="text-[0.875rem] text-ink-muted">
          Coming later: webhooks for new word-study entries, authenticated user
          endpoints (notes/bookmarks export), and a streaming SSE endpoint for
          generated content.{" "}
          <Link href="/sources" className="text-accent hover:underline">
            See data sources
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
