import { cacheLife } from "next/cache";
import type {
  Book,
  ChapterResponse,
  Translation,
} from "./types";

const BASE = "https://bible.helloao.org/api";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    throw new Error(
      `Bible API ${res.status} for ${path}: ${res.statusText}`,
    );
  }
  return (await res.json()) as T;
}

export async function listTranslations(): Promise<Translation[]> {
  "use cache";
  cacheLife("weeks");
  const data = await fetchJson<{ translations: Translation[] }>(
    "/available_translations.json",
  );
  return data.translations.filter((t) => t.language === "eng");
}

export async function getBooks(translationId: string): Promise<Book[]> {
  "use cache";
  cacheLife("weeks");
  const data = await fetchJson<{ books: Book[] }>(
    `/${translationId}/books.json`,
  );
  return data.books;
}

export async function getChapter(
  translationId: string,
  bookId: string,
  chapter: number,
): Promise<ChapterResponse> {
  "use cache";
  cacheLife("weeks");
  return fetchJson<ChapterResponse>(
    `/${translationId}/${bookId}/${chapter}.json`,
  );
}
