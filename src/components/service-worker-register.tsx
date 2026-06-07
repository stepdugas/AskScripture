"use client";

import { useEffect } from "react";

/**
 * Registers the offline service worker. No-op in development or when
 * the browser doesn't support service workers.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch(() => {
        // ignore — service workers aren't critical
      });
  }, []);
  return null;
}
