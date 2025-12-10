const CACHE_NAME = 'catatanku-pwa-v12'; 
const assets = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './logo-aplikasi.jpeg',
  './icon-512.png' 
  // Jika Anda menggunakan logo-aplikasi.jpeg di HTML, 
  // pastikan ia juga dicache: './logo-aplikasi.jpeg' 
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});