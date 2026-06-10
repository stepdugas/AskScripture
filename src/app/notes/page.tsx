"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { deleteNote, getNotes, updateNote } from "@/lib/storage/local";
import type { Note } from "@/lib/storage/types";
import { bookBySlug } from "@/lib/bible/books";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    setNotes(getNotes());
  }, []);

  function refresh() {
    setNotes(getNotes());
  }

  function remove(id: string) {
    if (!confirm("Delete this note?")) return;
    deleteNote(id);
    refresh();
  }

  function startEdit(n: Note) {
    setEditingId(n.id);
    setEditText(n.text);
  }

  function saveEdit() {
    if (editingId) {
      updateNote(editingId, editText.trim());
      setEditingId(null);
      setEditText("");
      refresh();
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
  }

  const filtered = useMemo(() => {
    if (!query.trim()) return notes;
    const q = query.trim().toLowerCase();
    return notes.filter((n) => {
      const book = bookBySlug(n.ref.bookSlug);
      const ref = `${book?.abbr ?? n.ref.bookSlug} ${n.ref.chapter}:${n.ref.verse}`.toLowerCase();
      return n.text.toLowerCase().includes(q) || ref.includes(q);
    });
  }, [notes, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, Note[]>();
    for (const n of filtered) {
      const key = n.ref.bookSlug;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(n);
    }
    return [...map.entries()].sort(([a], [b]) => {
      const ao = bookBySlug(a)?.order ?? 999;
      const bo = bookBySlug(b)?.order ?? 999;
      return ao - bo;
    });
  }, [filtered]);

  const totalCount = notes.length;
  const filteredCount = filtered.length;

  return (
    <div className="mx-auto max-w-[860px] px-6 lg:px-10 pt-16 pb-24">
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
        Notes
      </div>
      <h1 className="serif mt-3 text-[2.5rem] leading-[1.05] tracking-tight text-ink font-semibold">
        Your notes.
      </h1>
      <p className="mt-5 text-[1rem] leading-7 text-ink-muted max-w-[58ch]">
        Saved locally on this device. {totalCount > 0 && (
          <>
            {totalCount} note{totalCount === 1 ? "" : "s"}
            {grouped.length > 0 && (
              <> across {grouped.length} book{grouped.length === 1 ? "" : "s"}</>
            )}
            .
          </>
        )}
      </p>

      {totalCount > 0 && (
        <div className="mt-8">
          <label htmlFor="notes-search" className="sr-only">
            Search notes
          </label>
          <input
            id="notes-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes or references…"
            className="w-full h-11 border border-rule-strong px-4 bg-paper text-ink placeholder:text-ink-subtle focus:border-accent outline-none text-[0.9375rem]"
            autoComplete="off"
          />
          {query.trim() && (
            <p className="mt-2 text-[0.75rem] text-ink-subtle">
              {filteredCount === 0
                ? "No matches."
                : `${filteredCount} match${filteredCount === 1 ? "" : "es"}.`}
            </p>
          )}
        </div>
      )}

      {totalCount === 0 ? (
        <div className="mt-12 border border-rule p-10 text-center">
          <p className="serif text-[1.125rem] text-ink leading-7">
            No notes yet.
          </p>
          <p className="mt-2 text-[0.875rem] text-ink-muted">
            Open any chapter, tap a verse, and write what stays with you.
          </p>
          <Link
            href="/john/1"
            className="mt-6 inline-flex h-10 items-center px-4 bg-accent text-paper text-[0.8125rem] font-medium hover:bg-accent-2 transition-colors"
          >
            Start with John 1 →
          </Link>
        </div>
      ) : (
        <div className="mt-10 divide-y divide-rule">
          {grouped.map(([bookSlug, bookNotes]) => {
            const book = bookBySlug(bookSlug);
            return (
              <section key={bookSlug} className="py-8 first:pt-0">
                <div className="flex items-baseline justify-between mb-5">
                  <h2 className="serif text-[1.375rem] leading-tight text-ink font-semibold">
                    {book?.name ?? bookSlug}
                  </h2>
                  <span className="font-mono text-[0.6875rem] text-ink-subtle">
                    {bookNotes.length} note{bookNotes.length === 1 ? "" : "s"}
                  </span>
                </div>
                <ul className="space-y-4">
                  {bookNotes.map((n) => {
                    const isEditing = editingId === n.id;
                    return (
                      <li
                        key={n.id}
                        className="group border border-rule p-5 hover:border-rule-strong transition-colors"
                      >
                        <div className="flex items-baseline justify-between gap-4 mb-2">
                          <Link
                            href={`/${n.ref.bookSlug}/${n.ref.chapter}#v${n.ref.verse}`}
                            className="font-mono text-[0.75rem] text-ink-muted hover:text-accent"
                          >
                            {book?.abbr ?? n.ref.bookSlug} {n.ref.chapter}:
                            {n.ref.verse}
                          </Link>
                          <div className="flex items-center gap-3 text-[0.6875rem]">
                            <span className="text-ink-subtle">
                              {formatRelative(n.updatedAt)}
                            </span>
                            {!isEditing && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => startEdit(n)}
                                  className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-accent transition-opacity"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => remove(n.id)}
                                  className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-flag transition-opacity"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        {isEditing ? (
                          <div>
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              rows={Math.max(3, editText.split("\n").length)}
                              className="w-full border border-rule-strong px-3 py-2 bg-paper text-ink focus:border-accent outline-none serif text-[1rem] leading-7"
                              autoFocus
                            />
                            <div className="mt-2 flex gap-3 text-[0.75rem]">
                              <button
                                type="button"
                                onClick={saveEdit}
                                className="text-accent hover:underline font-medium"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                className="text-ink-muted hover:text-ink"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="serif text-[1rem] leading-7 text-ink whitespace-pre-wrap">
                            {n.text}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
