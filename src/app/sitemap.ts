import type { MetadataRoute } from "next";
import { BOOKS } from "@/lib/bible/books";
import { BIAS_FLAGS } from "@/data/bias-flags";
import { READING_PLANS } from "@/data/reading-plans";
import { env } from "@/lib/env";

const BASE = env.siteUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/method",
    "/sources",
    "/privacy",
    "/terms",
    "/word-study",
    "/chat",
    "/card",
    "/plans",
    "/settings",
    "/dashboard",
    "/notes",
    "/bookmarks",
    "/generate/devotional",
    "/generate/family",
    "/generate/sermon",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const chapterRoutes = BOOKS.flatMap((b) =>
    Array.from({ length: b.chapters }, (_, i) => i + 1).map((c) => ({
      url: `${BASE}/${b.slug}/${c}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  );

  const compareRoutes = BOOKS.flatMap((b) =>
    Array.from({ length: b.chapters }, (_, i) => i + 1).map((c) => ({
      url: `${BASE}/compare/${b.slug}/${c}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  );

  const flagRoutes = BIAS_FLAGS.map((f) => ({
    url: `${BASE}/word-study/${f.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const planRoutes = READING_PLANS.map((p) => ({
    url: `${BASE}/plans/${p.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...chapterRoutes,
    ...compareRoutes,
    ...flagRoutes,
    ...planRoutes,
  ];
}
