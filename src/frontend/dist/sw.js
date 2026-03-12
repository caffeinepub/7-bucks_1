// Minimal service worker for PWA installability
const CACHE_NAME = '7bucks-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/Untitled design_20260217_200738_0000.png',
  '/assets/generated/seven-bucks-app-icon.dim_512x512.png',
  '/assets/generated/seven-bucks-favicon.dim_64x64.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
