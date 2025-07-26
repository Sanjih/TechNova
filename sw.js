const CACHE_NAME = 'technova-v1';
const urlsToCache = [
  '/TechNova/',                     // Page d'accueil
  '/TechNova/index.html',
  '/TechNova/profile.html',
  '/TechNova/css/style.css',
  '/TechNova/js/app.js',
  '/TechNova/favicon.ico',
  '/TechNova/assets/icon-192.png',
  '/TechNova/assets/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.log('Failed to cache:', err))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
