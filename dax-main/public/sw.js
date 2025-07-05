// Replace entire contents with minimal working version:
const CACHE_NAME = 'dax-collective-v1';

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Just pass through all requests
  event.respondWith(fetch(event.request));
});