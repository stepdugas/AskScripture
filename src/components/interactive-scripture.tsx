"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  getBookmarks,
  getHighlightsForChapter,
  getNotesForChapter,
  isBookmarked,
  saveNote,
  deleteNote,
  toggleBookmark,
  toggleHighlight,
} from "@/lib/storage/local";
import {
  HIGHLIGHT_COLORS,
  isProColor,
  type Highlight,
  type HighlightColor,
  type Note,
  type VerseRef,
} from "@/lib/storage/types";

type Props = {
  bookSlug: string;
  chapter: number;
  children: React.ReactNode;
};

/**
 * Client-side enhancer for the ScriptureRenderer.
 * - Event-delegates clicks on .verse elements to open an action popover
 * - Reads highlights/bookmarks/notes from localStorage on mount
 * - Applies highlight color via inline style on .verse spans
 * - Re-applies on storage events so changes from other tabs show up
 */
export function InteractiveScripture({ bookSlug, chapter, children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [popover, setPopover] = useState<{
    verse: number;
    x: number;
    y: number;
  } | null>(null);
  const [version, setVersion] = useState(0);

  // Apply stored state to the DOM
  const applyState = useCallback(() => {
    const root = containerRef.current;
    if (!root) return;
    const highlights = getHighlightsForChapter(bookSlug, chapter);
    const bookmarks = getBookmarks().filter(
      (b) => b.ref.bookSlug === bookSlug && b.ref.chapter === chapter,
    );
    const notes = getNotesForChapter(bookSlug, chapter);

    root.querySelectorAll<HTMLElement>(".verse").forEach((el) => {
      el.style.background = "";
      el.style.borderBottom = "";
      el.classList.remove("data-bookmarked", "data-noted");
      el.removeAttribute("data-highlight");
      el.removeAttribute("data-bookmark");
      el.removeAttribute("data-note");
      el.style.cursor = "pointer";
    });

    for (const h of highlights) {
      const el = root.querySelector<HTMLElement>(`#v${h.ref.verse}`);
      if (!el) continue;
      const color = COLOR_BG[h.color];
      el.style.background = color;
    }
    for (const b of bookmarks) {
      const el = root.querySelector<HTMLElement>(`#v${b.ref.verse}`);
      if (!el) continue;
      el.setAttribute("data-bookmark", "1");
    }
    for (const n of notes) {
      const el = root.querySelector<HTMLElement>(`#v${n.ref.verse}`);
      if (!el) continue;
      el.setAttribute("data-note", "1");
    }
  }, [bookSlug, chapter]);

  useEffect(() => {
    applyState();
  }, [applyState, version]);

  // Listen for cross-tab storage changes
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key?.startsWith("askscripture.")) setVersion((v) => v + 1);
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Click + keyboard delegation. Container is position:relative, so the popover
  // is placed in CONTAINER-relative coordinates (not viewport / scroll). This
  // also makes each .verse keyboard-reachable.
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    // Tag every verse as a button for assistive tech + keyboard support.
    root.querySelectorAll<HTMLElement>(".verse").forEach((el) => {
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
      el.setAttribute("aria-haspopup", "dialog");
      el.setAttribute("aria-label", `Verse ${el.id.replace(/^v/, "")}`);
    });

    function openFor(target: HTMLElement) {
      const id = target.id;
      if (!id?.startsWith("v")) return;
      const verse = parseInt(id.slice(1), 10);
      if (!verse) return;
      const targetRect = target.getBoundingClientRect();
      const containerRect = root!.getBoundingClientRect();
      setPopover({
        verse,
        // Center horizontally over the verse, clamped so we don't sit beyond
        // a "thumb-reachable" 240px from its left edge for wide-wrapped verses.
        x: targetRect.left - containerRect.left + Math.min(targetRect.width / 2, 120),
        y: targetRect.top - containerRect.top - 8,
      });
    }

    function onClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest<HTMLElement>(".verse");
      if (!target) return;
      openFor(target);
    }

    function onKey(e: KeyboardEvent) {
      if (e.key !== "Enter" && e.key !== " ") return;
      const target = (e.target as HTMLElement).closest<HTMLElement>(".verse");
      if (!target) return;
      e.preventDefault();
      openFor(target);
    }

    root.addEventListener("click", onClick);
    root.addEventListener("keydown", onKey);
    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKey);
    };
  }, []);

  const ref: VerseRef | null = popover
    ? { bookSlug, chapter, verse: popover.verse }
    : null;

  return (
    <>
      <div ref={containerRef} className="relative scripture-interactive">
        {children}
        <style>{`
          .scripture-interactive .verse[data-bookmark="1"]::after {
            content: "";
            display: inline-block;
            width: 6px;
            height: 6px;
            background: var(--color-accent);
            border-radius: 50%;
            margin-left: 4px;
            vertical-align: super;
            font-size: 0.5em;
          }
          .scripture-interactive .verse[data-note="1"] .verse-num {
            color: var(--color-accent);
            font-weight: 600;
          }
          /* Hover affordance — soft and non-overriding so it never fights an
             existing highlight. */
          .scripture-interactive .verse:not([style*="background"]):hover {
            background: rgba(27, 40, 69, 0.04);
          }
          /* Focus ring for keyboard users — visible against both highlighted
             and unhighlighted verses. */
          .scripture-interactive .verse:focus-visible {
            outline: 2px solid var(--color-accent);
            outline-offset: 2px;
            border-radius: 2px;
          }
        `}</style>
      </div>
      {popover && ref && (
        <VersePopover
          x={popover.x}
          y={popover.y}
          ref={ref}
          onClose={() => setPopover(null)}
          onChange={() => setVersion((v) => v + 1)}
        />
      )}
    </>
  );
}

const COLOR_BG: Record<Highlight["color"], string> = {
  navy: "rgba(27, 40, 69, 0.12)",
  ochre: "rgba(201, 155, 51, 0.18)",
  olive: "rgba(107, 138, 58, 0.18)",
  rust: "rgba(122, 59, 46, 0.16)",
  sky: "rgba(74, 144, 164, 0.18)",
  sage: "rgba(143, 166, 142, 0.22)",
  coral: "rgba(215, 122, 107, 0.18)",
  plum: "rgba(123, 92, 126, 0.22)",
  violet: "rgba(107, 107, 163, 0.22)",
};

function VersePopover({
  x,
  y,
  ref,
  onClose,
  onChange,
}: {
  x: number;
  y: number;
  ref: VerseRef;
  onClose: () => void;
  onChange: () => void;
}) {
  const [noteText, setNoteText] = useState("");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showingNoteEditor, setShowingNoteEditor] = useState(false);

  useEffect(() => {
    const notes = getNotesForChapter(ref.bookSlug, ref.chapter).filter(
      (n) => n.ref.verse === ref.verse,
    );
    if (notes[0]) {
      setEditingNote(notes[0]);
      setNoteText(notes[0].text);
    }
  }, [ref.bookSlug, ref.chapter, ref.verse]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    function onDocClick(e: MouseEvent) {
      const t = e.target as HTMLElement;
      if (!t.closest("[data-verse-popover]")) onClose();
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDocClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDocClick);
    };
  }, [onClose]);

  function setColor(color: Highlight["color"]) {
    toggleHighlight(ref, color);
    onChange();
  }
  function bookmark() {
    toggleBookmark(ref);
    onChange();
  }
  function saveNoteNow() {
    if (!noteText.trim()) {
      if (editingNote) {
        deleteNote(editingNote.id);
        setEditingNote(null);
      }
    } else if (editingNote) {
      deleteNote(editingNote.id);
      const saved = saveNote(ref, noteText.trim());
      setEditingNote(saved);
    } else {
      const saved = saveNote(ref, noteText.trim());
      setEditingNote(saved);
    }
    onChange();
    setShowingNoteEditor(false);
  }

  const bookmarked = isBookmarked(ref);

  return (
    <div
      data-verse-popover
      role="dialog"
      aria-label={`Verse ${ref.verse} actions`}
      className="absolute z-30 bg-paper border border-rule-strong shadow-[0_8px_32px_-12px_rgba(20,23,31,0.18)]"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -100%)",
        width: showingNoteEditor ? "320px" : "auto",
        minWidth: "260px",
      }}
    >
      <div className="px-3 py-2 border-b border-rule flex items-center justify-between">
        <span className="font-mono text-[0.6875rem] text-ink-muted">
          v{ref.verse}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-[0.6875rem] text-ink-subtle hover:text-ink"
          aria-label="Close"
        >
          Close
        </button>
      </div>

      {!showingNoteEditor && (
        <div className="px-3 py-2.5">
          <ColorPalette onPick={setColor} />

          <div className="mt-2.5 flex flex-col gap-1.5 text-[0.8125rem]">
            <button
              type="button"
              onClick={bookmark}
              className="text-left text-ink hover:text-accent flex items-center gap-2"
            >
              <span className="text-ink-subtle">{bookmarked ? "•" : "○"}</span>
              {bookmarked ? "Bookmarked" : "Bookmark"}
            </button>
            <button
              type="button"
              onClick={() => setShowingNoteEditor(true)}
              className="text-left text-ink hover:text-accent flex items-center gap-2"
            >
              <span className="text-ink-subtle">
                {editingNote ? "•" : "○"}
              </span>
              {editingNote ? "Edit note" : "Add note"}
            </button>
          </div>
        </div>
      )}

      {/* Note editor branch */}
      {showingNoteEditor && (
        <div className="px-3 py-3">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Your note…"
            rows={4}
            autoFocus
            className="w-full bg-paper border border-rule-strong p-2 text-[0.875rem] text-ink resize-none focus:border-accent outline-none"
          />
          <div className="mt-2 flex gap-2 justify-end text-[0.75rem]">
            <button
              type="button"
              onClick={() => setShowingNoteEditor(false)}
              className="text-ink-muted hover:text-ink px-2 py-1"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveNoteNow}
              className="bg-accent text-paper px-3 py-1 font-medium hover:bg-accent-2 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ColorPalette({
  onPick,
}: {
  onPick: (c: HighlightColor) => void;
}) {
  const [isPro, setIsPro] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { isPro?: boolean }) => setIsPro(!!d.isPro))
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const free: HighlightColor[] = ["navy", "ochre", "olive", "rust"];
  const pro: HighlightColor[] = ["sky", "sage", "coral", "plum", "violet"];

  return (
    <div>
      <div
        className="grid grid-cols-4 gap-2"
        role="group"
        aria-label="Highlight color"
      >
        {free.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onPick(c)}
            aria-label={`Highlight: ${HIGHLIGHT_COLORS[c].label}`}
            className="h-9 w-full border border-rule-strong hover:border-accent focus-visible:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent transition-colors"
            style={{ background: COLOR_BG[c] }}
            title={HIGHLIGHT_COLORS[c].label}
          />
        ))}
      </div>
      <div
        className="mt-2 grid grid-cols-5 gap-2"
        role="group"
        aria-label="Pro highlight colors"
      >
        {pro.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => (isPro ? onPick(c) : null)}
            aria-label={`${isPro ? "Highlight" : "Pro only:"} ${HIGHLIGHT_COLORS[c].label}`}
            disabled={!isPro}
            className={
              "h-9 w-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent " +
              (isPro
                ? "border-rule-strong hover:border-accent focus-visible:border-accent"
                : "border-rule cursor-not-allowed opacity-50")
            }
            style={{ background: COLOR_BG[c] }}
            title={isPro ? HIGHLIGHT_COLORS[c].label : `Pro: ${HIGHLIGHT_COLORS[c].label}`}
          />
        ))}
      </div>
      {ready && !isPro && (
        <Link
          href="/pricing"
          className="mt-3 inline-block text-[0.6875rem] text-ink-muted hover:text-accent"
        >
          5 more colors with Pro &rarr;
        </Link>
      )}
    </div>
  );
}
// Note: `isProColor` is exported by storage/types in case consumers need to detect Pro highlights.
void isProColor;
