"use client";

import { useEffect } from "react";
import { recordRead } from "@/lib/storage/local";

type Props = {
  bookSlug: string;
  chapter: number;
};

/**
 * Drops the last-read marker + bumps the streak when a chapter mounts in the
 * browser. Pure side-effect component.
 */
export function RecordRead({ bookSlug, chapter }: Props) {
  useEffect(() => {
    recordRead({ bookSlug, chapter, verse: 1 });
  }, [bookSlug, chapter]);
  return null;
}
