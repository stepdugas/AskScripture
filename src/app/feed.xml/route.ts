import { DAILY_VERSES } from "@/data/daily-verses";
import { parseRef } from "@/lib/bible/parse-ref";
import { env } from "@/lib/env";

/**
 * RSS 2.0 feed of the daily verse. iTunes podcast tags included so the same
 * feed can be ingested by podcast players once a real audio enclosure is
 * generated for each item. For now, the enclosure points at the chapter's
 * BSB audio reading from HelloAO when the daily verse maps to a single
 * chapter we have audio for.
 */
export async function GET() {
  const now = new Date();
  const SITE = env.siteUrl;

  // Walk the past 90 days; each day shows one item from the rotation.
  const items: string[] = [];
  for (let i = 0; i < 90; i++) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    const dayOfYear = Math.floor(
      (Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) -
        Date.UTC(d.getUTCFullYear(), 0, 0)) /
        86400000,
    );
    const verse = DAILY_VERSES[dayOfYear % DAILY_VERSES.length];
    const parsed = parseRef(verse.ref);
    const dateKey = d.toISOString().slice(0, 10);
    const itemLink = parsed
      ? `${SITE}/${parsed.book.slug}/${parsed.chapter}`
      : SITE;
    const audioUrl = parsed
      ? `https://audio.bible.helloao.org/api/BSB/${parsed.book.id}/${parsed.chapter}/audio/david.mp3`
      : null;

    items.push(
      `<item>
        <title>${escapeXml(verse.ref)}</title>
        <link>${itemLink}</link>
        <guid isPermaLink="false">askscripture:${dateKey}:${slug(verse.ref)}</guid>
        <pubDate>${d.toUTCString()}</pubDate>
        <description>${escapeXml(verse.note)}</description>
        <content:encoded><![CDATA[<p><em>${escapeXml(verse.note)}</em></p><p><a href="${itemLink}">Read ${escapeXml(verse.ref)} on AskScripture</a></p>]]></content:encoded>
        <itunes:title>${escapeXml(verse.ref)}</itunes:title>
        <itunes:summary>${escapeXml(verse.note)}</itunes:summary>
        <itunes:explicit>false</itunes:explicit>
        ${audioUrl ? `<enclosure url="${audioUrl}" type="audio/mpeg" length="0" />` : ""}
      </item>`,
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AskScripture — Daily verse</title>
    <link>${SITE}</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
    <description>One curated passage every day with an editorial note. From AskScripture.</description>
    <language>en-us</language>
    <lastBuildDate>${now.toUTCString()}</lastBuildDate>
    <itunes:author>AskScripture</itunes:author>
    <itunes:summary>One curated Bible passage every day, with an editorial note pointing to what to look for. Audio readings of the same chapter (Berean Standard Bible) attached where available.</itunes:summary>
    <itunes:category text="Religion &amp; Spirituality">
      <itunes:category text="Christianity" />
    </itunes:category>
    <itunes:explicit>false</itunes:explicit>
    <itunes:owner>
      <itunes:name>AskScripture</itunes:name>
      <itunes:email>hello@askscripture.com</itunes:email>
    </itunes:owner>
    <itunes:image href="${SITE}/icon-512.png" />
    ${items.join("\n    ")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
