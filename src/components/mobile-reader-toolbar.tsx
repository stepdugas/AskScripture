"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StudyPanel } from "./study-panel";

type Props = {
  bookSlug: string;
  bookName: string;
  chapter: number;
  translationId: string;
  totalChapters: number;
};

/**
 * Sticky bottom toolbar shown only on small viewports. Provides quick prev /
 * next chapter, a study-panel bottom-sheet, and a TOC button.
 */
export function MobileReaderToolbar({
  bookSlug,
  bookName,
  chapter,
  translationId,
  totalChapters,
}: Props) {
  const [openStudy, setOpenStudy] = useState(false);
  const [openToc, setOpenToc] = useState(false);

  // Close drawers when the route changes (Next App Router doesn't unmount this
  // since it's used inside a server component as a child, but the chapter prop
  // changes — close on prop change).
  useEffect(() => {
    setOpenStudy(false);
    setOpenToc(false);
  }, [bookSlug, chapter]);

  const prev = chapter > 1 ? `/${bookSlug}/${chapter - 1}` : null;
  const next = chapter < totalChapters ? `/${bookSlug}/${chapter + 1}` : null;

  return (
    <>
      <nav
        className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-paper border-t border-rule"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Reader toolbar"
      >
        <div className="flex items-stretch h-14 text-[0.75rem] text-ink-muted">
          <ToolbarLink href={prev} label="Prev" disabled={!prev}>
            <span aria-hidden>←</span>
          </ToolbarLink>
          <ToolbarButton
            label="Chapter"
            onClick={() => setOpenToc(true)}
          >
            <span className="font-mono">{chapter}</span>
          </ToolbarButton>
          <ToolbarButton
            label="Study"
            onClick={() => setOpenStudy(true)}
          >
            <span aria-hidden>≡</span>
          </ToolbarButton>
          <ToolbarLink href={next} label="Next" disabled={!next}>
            <span aria-hidden>→</span>
          </ToolbarLink>
        </div>
      </nav>

      {openStudy && (
        <Sheet onClose={() => setOpenStudy(false)} title="Study">
          {/* The server-component StudyPanel can't render here; instead show a
              simplified menu with links into the same destinations. */}
          <MobileStudyMenu
            bookSlug={bookSlug}
            bookName={bookName}
            chapter={chapter}
            translationId={translationId}
          />
        </Sheet>
      )}

      {openToc && (
        <Sheet onClose={() => setOpenToc(false)} title={bookName}>
          <ChapterGrid
            bookSlug={bookSlug}
            current={chapter}
            total={totalChapters}
            onPick={() => setOpenToc(false)}
          />
        </Sheet>
      )}
    </>
  );
}

function ToolbarLink({
  href,
  label,
  disabled,
  children,
}: {
  href: string | null;
  label: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  if (disabled || !href) {
    return (
      <div
        className="flex-1 inline-flex flex-col items-center justify-center gap-0.5 text-ink-subtle"
        aria-disabled
      >
        <span className="text-[0.875rem]">{children}</span>
        <span>{label}</span>
      </div>
    );
  }
  return (
    <Link
      href={href}
      className="flex-1 inline-flex flex-col items-center justify-center gap-0.5 hover:text-accent active:bg-paper-2 transition-colors border-r border-rule"
    >
      <span className="text-[0.875rem]">{children}</span>
      <span>{label}</span>
    </Link>
  );
}

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 inline-flex flex-col items-center justify-center gap-0.5 hover:text-accent active:bg-paper-2 transition-colors border-r border-rule"
    >
      <span className="text-[0.875rem]">{children}</span>
      <span>{label}</span>
    </button>
  );
}

function Sheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-40 lg:hidden flex flex-col"
      role="dialog"
      aria-label={title}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="flex-1 bg-ink/40"
      />
      <div
        className="bg-paper border-t border-rule-strong shadow-[0_-8px_32px_-12px_rgba(20,23,31,0.18)] max-h-[85vh] overflow-y-auto"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="px-5 pt-3 pb-2 flex items-center justify-between border-b border-rule sticky top-0 bg-paper">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            {title}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[0.75rem] text-ink-muted hover:text-ink"
          >
            Close
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

function ChapterGrid({
  bookSlug,
  current,
  total,
  onPick,
}: {
  bookSlug: string;
  current: number;
  total: number;
  onPick: () => void;
}) {
  return (
    <ul className="grid grid-cols-6 gap-1.5">
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
        const active = n === current;
        return (
          <li key={n}>
            <Link
              href={`/${bookSlug}/${n}`}
              onClick={onPick}
              className={
                "block text-center py-2 font-mono tabular-nums text-[0.875rem] border transition-colors " +
                (active
                  ? "bg-accent text-paper border-accent"
                  : "border-rule text-ink hover:border-rule-strong")
              }
            >
              {n}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function MobileStudyMenu({
  bookSlug,
  bookName,
  chapter,
  translationId,
}: {
  bookSlug: string;
  bookName: string;
  chapter: number;
  translationId: string;
}) {
  const refQuery = encodeURIComponent(`${bookName} ${chapter}`);
  const items: { label: string; href: string }[] = [
    { label: "Ask AI about this passage", href: `/chat?passage=${refQuery}` },
    { label: "Side-by-side translations", href: `/compare/${bookSlug}/${chapter}` },
    { label: "Word study (interlinear)", href: `/words/${bookSlug}/${chapter}` },
    { label: "Story mode", href: `/story/${bookSlug}/${chapter}` },
    { label: "Personal devotional", href: `/generate/devotional?ref=${refQuery}` },
    { label: "Family devotional", href: `/generate/family?ref=${refQuery}` },
    { label: "Sermon outline", href: `/generate/sermon?ref=${refQuery}` },
    { label: "Quote card", href: `/card?ref=${refQuery}&t=${translationId}` },
    { label: "Print-ready devotional", href: `/print/devotional?ref=${refQuery}` },
  ];
  return (
    <ul>
      {items.map((it) => (
        <li key={it.label} className="border-b border-rule">
          <Link
            href={it.href}
            className="block py-3 text-[0.9375rem] text-ink hover:text-accent transition-colors"
          >
            {it.label} <span className="text-ink-subtle">&rarr;</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
