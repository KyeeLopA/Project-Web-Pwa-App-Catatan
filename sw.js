const CACHE_NAME = 'catatanku-pwa-v7'; // <-- Versi Cache Terbaru!

// Daftar semua aset (file) yang harus disimpan agar PWA bisa Offline
const assets = [
  './', // Ini penting untuk meng-cache halaman root/utama
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon-logo-aplikasi.jpeg', 
  './icon-512.png'
  
];

self.addEventListener('install', event => {
  console.log('[Service Worker] Installing. Caching resources...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
     
      return cache.addAll(assets);
    })
    .catch(err => {
        console.error('Failed to cache assets during install:', err);
    })
  );

  self.skipWaiting();
});

// 
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      
      if (response) {
        return response;
      }
      
      return fetch(event.request);
    })
    
  );
});


self.addEventListener('activate', event => {
  console.log('[Service Worker] Activated. Cleaning up old caches...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
         
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  return self.clients.claim();
});