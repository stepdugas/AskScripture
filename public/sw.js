/**
 * AskScripture service worker — cache-first for static + Bible chapter JSON.
 * Bumping CACHE_VERSION invalidates the cache for all users on next install.
 */
const CACHE_VERSION = "askscripture-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const PRECACHE_URLS = ["/", "/manifest.webmanifest", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !k.startsWith(CACHE_VERSION))
          .map((k) => caches.delete(k)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle GET
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Bypass the SW for our own API routes (always fresh)
  if (url.origin === self.location.origin && url.pathname.startsWith("/api/")) {
    return;
  }

  // Cache-first for HelloAO Bible chapter JSON (immutable for our purposes)
  if (url.hostname === "bible.helloao.org") {
    event.respondWith(cacheFirst(req, RUNTIME_CACHE));
    return;
  }

  // Same-origin navigation: network-first with offline fallback
  if (req.mode === "navigate") {
    event.respondWith(networkFirstHtml(req));
    return;
  }

  // Same-origin static assets: stale-while-revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(req, RUNTIME_CACHE));
  }
});

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const fresh = await fetch(req);
    if (fresh.ok) cache.put(req, fresh.clone());
    return fresh;
  } catch (err) {
    return cached ?? Response.error();
  }
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const networkPromise = fetch(req)
    .then((res) => {
      if (res.ok) cache.put(req, res.clone());
      return res;
    })
    .catch(() => null);
  return cached ?? (await networkPromise) ?? Response.error();
}

async function networkFirstHtml(req) {
  try {
    const fresh = await fetch(req);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(req, fresh.clone());
    return fresh;
  } catch (err) {
    const cache = await caches.open(STATIC_CACHE);
    return (
      (await cache.match(req)) ??
      (await cache.match("/")) ??
      Response.error()
    );
  }
}
