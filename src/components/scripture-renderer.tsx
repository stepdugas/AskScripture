import type {
  ChapterContentItem,
  InlineContent,
  InlineText,
} from "@/lib/bible/types";

type Props = {
  content: ChapterContentItem[];
};

/**
 * Renders a chapter as paragraphs of inline verses, preserving:
 * - verse numbers as superscript
 * - section headings (small caps, sans)
 * - explicit line breaks within verses (poetry / strophe)
 * - line_break items as paragraph boundaries
 */
export function ScriptureRenderer({ content }: Props) {
  // Group items into paragraphs, splitting on line_break items.
  const paragraphs: ChapterContentItem[][] = [];
  let current: ChapterContentItem[] = [];

  for (const item of content) {
    if (item.type === "line_break") {
      if (current.length) paragraphs.push(current);
      current = [];
    } else {
      current.push(item);
    }
  }
  if (current.length) paragraphs.push(current);

  return (
    <div className="scripture">
      {paragraphs.map((para, pIdx) => (
        <Paragraph key={pIdx} items={para} isFirst={pIdx === 0} />
      ))}
    </div>
  );
}

function Paragraph({
  items,
  isFirst,
}: {
  items: ChapterContentItem[];
  isFirst: boolean;
}) {
  // A "paragraph" may begin with a heading and then verses.
  const heading = items.find((i) => i.type === "heading");
  const verses = items.filter((i) => i.type === "verse");
  const hebrewSubtitle = items.find((i) => i.type === "hebrew_subtitle");

  return (
    <>
      {heading && (
        <span className="heading">{heading.content.join(" ")}</span>
      )}
      {hebrewSubtitle && (
        <p className="no-indent text-ink-muted italic text-[0.9375rem] mb-3">
          {hebrewSubtitle.content
            .map((c) => (typeof c === "string" ? c : c.text ?? ""))
            .join("")}
        </p>
      )}
      {verses.length > 0 && (
        <p className={heading || isFirst ? "no-indent" : undefined}>
          {verses.map((verse) => (
            <Verse key={verse.number} number={verse.number} content={verse.content} />
          ))}
        </p>
      )}
    </>
  );
}

function Verse({
  number,
  content,
}: {
  number: number;
  content: InlineContent[];
}) {
  return (
    <span className="verse" id={`v${number}`}>
      <sup className="verse-num">{number}</sup>
      {content.map((node, idx) => (
        <InlineNode key={idx} node={node} />
      ))}{" "}
    </span>
  );
}

function InlineNode({ node }: { node: InlineContent }) {
  if (typeof node === "string") {
    return <>{node}</>;
  }
  const inline = node as InlineText;
  if (inline.lineBreak) {
    return <br />;
  }
  if (inline.text) {
    if (inline.wordsOfJesus) {
      return <span className="text-[#7A1F1F]">{inline.text}</span>;
    }
    return <>{inline.text}</>;
  }
  return null;
}
