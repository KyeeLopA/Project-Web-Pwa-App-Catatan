// Nama cache unik untuk aplikasi Anda
const CACHE_NAME = 'catatanku-pwa-v1';

// Daftar aset (file) yang harus disimpan ke dalam cache browser
const urlsToCache = [
  './', // Ini penting untuk meng-cache halaman utama
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './logo-aplikasi.jpeg',
  './icon-512.png'
];

// 1. Event 'install': Menyimpan semua aset ke cache
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching assets');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Event 'fetch': Mengambil dari cache, jika gagal baru ambil dari network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika file ada di cache, kembalikan dari cache
        if (response) {
          return response;
        }
        // Jika tidak, ambil dari network (internet)
        return fetch(event.request);
      })
  );
});

// 3. Event 'activate': Menghapus cache lama jika ada update
self.addEventListener('activate', event => {
  console.log('Service Worker: Activated');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});