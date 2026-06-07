"use client";

import type {
  Bookmark,
  Highlight,
  Note,
  ReadingProgress,
  StreakState,
  VerseRef,
} from "./types";

/**
 * Thin localStorage adapter. Each domain has its own key so we can migrate
 * collections independently to Supabase later.
 */

const K = {
  notes: "askscripture.notes.v1",
  highlights: "askscripture.highlights.v1",
  bookmarks: "askscripture.bookmarks.v1",
  progress: "askscripture.progress.v1",
  streak: "askscripture.streak.v1",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(`as:storage:${key}`));
  } catch {
    /* ignore */
  }
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function refKey(r: VerseRef) {
  return `${r.bookSlug}/${r.chapter}/${r.verse}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

// ---------- Notes ----------

export function getNotes(): Note[] {
  return read<Note[]>(K.notes, []).sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getNotesForVerse(ref: VerseRef): Note[] {
  return getNotes().filter(
    (n) => refKey(n.ref) === refKey(ref),
  );
}

export function getNotesForChapter(bookSlug: string, chapter: number): Note[] {
  return getNotes().filter(
    (n) => n.ref.bookSlug === bookSlug && n.ref.chapter === chapter,
  );
}

export function saveNote(ref: VerseRef, text: string): Note {
  const all = getNotes();
  const now = Date.now();
  const note: Note = {
    id: uid(),
    ref,
    text,
    createdAt: now,
    updatedAt: now,
  };
  all.unshift(note);
  write(K.notes, all);
  return note;
}

export function updateNote(id: string, text: string) {
  const all = getNotes();
  const n = all.find((x) => x.id === id);
  if (!n) return;
  n.text = text;
  n.updatedAt = Date.now();
  write(K.notes, all);
}

export function deleteNote(id: string) {
  write(K.notes, getNotes().filter((n) => n.id !== id));
}

// ---------- Highlights ----------

export function getHighlights(): Highlight[] {
  return read<Highlight[]>(K.highlights, []);
}

export function getHighlightsForChapter(bookSlug: string, chapter: number) {
  return getHighlights().filter(
    (h) => h.ref.bookSlug === bookSlug && h.ref.chapter === chapter,
  );
}

export function toggleHighlight(ref: VerseRef, color: Highlight["color"]) {
  const all = getHighlights();
  const existing = all.find(
    (h) => refKey(h.ref) === refKey(ref) && h.color === color,
  );
  if (existing) {
    write(K.highlights, all.filter((h) => h.id !== existing.id));
    return null;
  }
  const h: Highlight = {
    id: uid(),
    ref,
    color,
    createdAt: Date.now(),
  };
  all.push(h);
  write(K.highlights, all);
  return h;
}

// ---------- Bookmarks ----------

export function getBookmarks(): Bookmark[] {
  return read<Bookmark[]>(K.bookmarks, []).sort(
    (a, b) => b.createdAt - a.createdAt,
  );
}

export function toggleBookmark(ref: VerseRef, label?: string): Bookmark | null {
  const all = getBookmarks();
  const existing = all.find((b) => refKey(b.ref) === refKey(ref));
  if (existing) {
    write(K.bookmarks, all.filter((b) => b.id !== existing.id));
    return null;
  }
  const b: Bookmark = {
    id: uid(),
    ref,
    label,
    createdAt: Date.now(),
  };
  all.unshift(b);
  write(K.bookmarks, all);
  return b;
}

export function isBookmarked(ref: VerseRef): boolean {
  return getBookmarks().some((b) => refKey(b.ref) === refKey(ref));
}

// ---------- Reading progress & streak ----------

export function getProgress(): ReadingProgress | null {
  return read<ReadingProgress | null>(K.progress, null);
}

export function recordRead(ref: VerseRef) {
  const day = today();
  write<ReadingProgress>(K.progress, { date: day, ref });
  updateStreak(day);
}

export function getStreak(): StreakState {
  return read<StreakState>(K.streak, { lastRead: null, current: 0, best: 0 });
}

function updateStreak(day: string) {
  const state = getStreak();
  if (state.lastRead === day) return;
  if (state.lastRead) {
    const last = new Date(state.lastRead);
    const todayD = new Date(day);
    const diff = Math.round(
      (todayD.getTime() - last.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diff === 1) {
      state.current += 1;
    } else if (diff > 1) {
      state.current = 1;
    }
  } else {
    state.current = 1;
  }
  state.lastRead = day;
  if (state.current > state.best) state.best = state.current;
  write(K.streak, state);
}

export const STORAGE_KEYS = K;
