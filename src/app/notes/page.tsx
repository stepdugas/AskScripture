"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteNote, getNotes } from "@/lib/storage/local";
import type { Note } from "@/lib/storage/types";
import { bookBySlug } from "@/lib/bible/books";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    setNotes(getNotes());
  }, []);

  function remove(id: string) {
    if (!confirm("Delete this note?")) return;
    deleteNote(id);
    setNotes(getNotes());
  }

  return (
    <>
    <div className="mx-auto max-w-[860px] px-6 lg:px-10 pt-16 pb-24">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            Notes
          </div>
          <h1 className="serif mt-3 text-[2.5rem] leading-[1.05] tracking-tight text-ink font-semibold">
            Your notes.
          </h1>
          <p className="mt-5 text-[1rem] leading-7 text-ink-muted max-w-[58ch]">
            Saved locally. Sync coming when sign-in lands.
          </p>

          <div className="mt-12">
            {notes.length === 0 ? (
              <p className="text-[0.9375rem] text-ink-muted">
                No notes yet. Open any chapter and tap a verse to add one.
              </p>
            ) : (
              <ul className="divide-y divide-rule">
                {notes.map((n) => {
                  const book = bookBySlug(n.ref.bookSlug);
                  return (
                    <li key={n.id} className="py-5 group">
                      <div className="flex items-baseline justify-between gap-4">
                        <Link
                          href={`/${n.ref.bookSlug}/${n.ref.chapter}#v${n.ref.verse}`}
                          className="font-mono text-[0.75rem] text-ink-muted hover:text-accent"
                        >
                          {book?.abbr ?? n.ref.bookSlug} {n.ref.chapter}:{n.ref.verse}
                        </Link>
                        <button
                          type="button"
                          onClick={() => remove(n.id)}
                          className="opacity-0 group-hover:opacity-100 text-[0.6875rem] text-ink-subtle hover:text-flag transition-opacity"
                        >
                          Delete
                        </button>
                      </div>
                      <p className="mt-2 serif text-[1rem] leading-7 text-ink whitespace-pre-wrap">
                        {n.text}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
    </>
  );
}
