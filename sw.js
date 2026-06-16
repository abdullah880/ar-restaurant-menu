const CACHE_NAME = "ar-menu-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/styles/app.css",
  "/js/app.js",
  "/js/dishes.js",
  "/manifest.json",
];

// Install — pre-cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      ),
  );
  self.clients.claim();
});

// Fetch — cache-first for static, network-first for models
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // GLB models: stale-while-revalidate (large files, benefit from cache)
  if (url.pathname.endsWith(".glb")) {
    event.respondWith(
      caches.open(CACHE_NAME + "-models").then((cache) =>
        cache.match(event.request).then((cached) => {
          const fetchPromise = fetch(event.request)
            .then((response) => {
              if (response && response.status === 200) {
                cache.put(event.request, response.clone());
              }
              return response;
            })
            .catch(() => cached);
          return cached || fetchPromise;
        }),
      ),
    );
    return;
  }

  // Static assets: cache-first
  if (
    STATIC_ASSETS.some((a) => url.pathname === a || url.pathname === a + "/")
  ) {
    event.respondWith(
      caches
        .match(event.request)
        .then((cached) => cached || fetch(event.request)),
    );
    return;
  }

  // Default: network with cache fallback
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request)),
  );
});
