/**
 * sw.js — Service Worker
 *
 * Caching strategies:
 *   Static assets  → Cache-first  (HTML, CSS, JS, manifest)
 *   .glb models    → Stale-while-revalidate  (large files; serve cached instantly, refresh in bg)
 *   Everything else → Network-first with cache fallback
 *
 * Versioning: bump CACHE_VERSION on any breaking deploy so users get fresh assets.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────

const CACHE_VERSION  = "v2";
const BASE           = "/ar-restaurant-menu";
const STATIC_CACHE   = `ar-menu-static-${CACHE_VERSION}`;
const MODEL_CACHE    = `ar-menu-models-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/styles/app.css`,
  `${BASE}/js/app.js`,
  `${BASE}/js/dishes.js`,
  `${BASE}/manifest.json`,
];

// ─────────────────────────────────────────────────────────────────────────────
// Install — pre-cache static assets
// ─────────────────────────────────────────────────────────────────────────────

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Activate — remove outdated caches
// ─────────────────────────────────────────────────────────────────────────────

self.addEventListener("activate", (event) => {
  const currentCaches = new Set([STATIC_CACHE, MODEL_CACHE]);

  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !currentCaches.has(key))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Fetch
// ─────────────────────────────────────────────────────────────────────────────

self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  const { pathname } = new URL(event.request.url);

  // 3D models — stale-while-revalidate
  if (pathname.endsWith(".glb") || pathname.endsWith(".usdz")) {
    event.respondWith(staleWhileRevalidate(MODEL_CACHE, event.request));
    return;
  }

  // Static assets — cache-first
  const isStatic = STATIC_ASSETS.some(
    (a) => pathname === a || pathname === `${a}/`,
  );
  if (isStatic) {
    event.respondWith(cacheFirst(STATIC_CACHE, event.request));
    return;
  }

  // Everything else — network-first
  event.respondWith(networkFirst(STATIC_CACHE, event.request));
});

// ─────────────────────────────────────────────────────────────────────────────
// Strategy helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Cache-first: return cached response immediately; fall back to network.
 * @param {string} cacheName
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function cacheFirst(cacheName, request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}

/**
 * Stale-while-revalidate: return cache immediately (if available) and
 * refresh cache in the background.
 * @param {string} cacheName
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function staleWhileRevalidate(cacheName, request) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  return cached ?? await fetchPromise;
}

/**
 * Network-first: try network; fall back to cache on failure.
 * @param {string} cacheName
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function networkFirst(cacheName, request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return (await caches.match(request)) ?? Response.error();
  }
}
