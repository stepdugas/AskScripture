"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getBookmarks, toggleBookmark } from "@/lib/storage/local";
import type { Bookmark } from "@/lib/storage/types";
import { bookBySlug } from "@/lib/bible/books";

export default function BookmarksPage() {
  const [items, setItems] = useState<Bookmark[]>([]);

  useEffect(() => {
    setItems(getBookmarks());
  }, []);

  function remove(b: Bookmark) {
    toggleBookmark(b.ref);
    setItems(getBookmarks());
  }

  return (
    <>
    <div className="mx-auto max-w-[860px] px-6 lg:px-10 pt-16 pb-24">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            Bookmarks
          </div>
          <h1 className="serif mt-3 text-[2.5rem] leading-[1.05] tracking-tight text-ink font-semibold">
            Saved passages.
          </h1>

          <div className="mt-12">
            {items.length === 0 ? (
              <p className="text-[0.9375rem] text-ink-muted">
                No bookmarks yet.
              </p>
            ) : (
              <ul className="divide-y divide-rule">
                {items.map((b) => {
                  const book = bookBySlug(b.ref.bookSlug);
                  return (
                    <li
                      key={b.id}
                      className="py-4 flex items-baseline justify-between"
                    >
                      <Link
                        href={`/${b.ref.bookSlug}/${b.ref.chapter}#v${b.ref.verse}`}
                        className="serif text-[1rem] text-ink hover:text-accent transition-colors"
                      >
                        {book?.name ?? b.ref.bookSlug} {b.ref.chapter}:{b.ref.verse}
                        {b.label && (
                          <span className="ml-3 text-[0.875rem] italic text-ink-muted">
                            — {b.label}
                          </span>
                        )}
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(b)}
                        className="text-[0.75rem] text-ink-subtle hover:text-flag"
                      >
                        Remove
                      </button>
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
