const CACHE_NAME = 'ng-hub-v12';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apps/nasirglass/index.html',
  './apps/nasirglass/icon-192.png',
  './apps/nasirglass/icon-512.png',
  './apps/toncount/index.html',
  './apps/toncount/icon-192.png',
  './apps/toncount/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// HTML files (the actual app code): always try the network first, so a new
// deploy shows up the very next time the app is opened — no stale content,
// no need to open the app twice. Falls back to cache only if offline.
// Icons/manifest: cache-first (they rarely change, load instantly).
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const isHTML = event.request.mode === 'navigate' ||
                 event.request.destination === 'document' ||
                 event.request.url.endsWith('.html') ||
                 event.request.url.endsWith('/');

  if (isHTML) {
    event.respondWith(
      fetch(event.request).then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkRes;
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request).then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkRes;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
