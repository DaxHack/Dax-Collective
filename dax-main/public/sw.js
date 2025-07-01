// public/sw.js
const CACHE_NAME = 'dax-collective-cache-v1';
const URLS_TO_CACHE = [ '/', '/index.html', '/manifest.json', /* etc. */ ];

self.addEventListener('install', e =>
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(URLS_TO_CACHE)).then(() => self.skipWaiting()))
);

self.addEventListener('activate', e =>
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
);

self.addEventListener('fetch', e =>
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)))
);