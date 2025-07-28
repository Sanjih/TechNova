const CACHE_NAME = 'technova-v1';
const urlsToCache = [
  '/',                     // Page d'accueil
  '/index.html',
  '/profile.html',
  '/css/style.css',
  '/js/app.js',
  '/favicon.ico',
  '/assets/android-icon-192x192.png', // Corrected path based on manifest.json
  '/assets/apple-icon-180x180.png'    // Corrected path based on manifest.json
  '/TechNova/tutorials/Fampiasana AI amin'ny Méga 200 Ar.html',
  '/tutorials/tutoriel-ia.html',
];
// Note: The manifest.json indicates asset paths without /TechNova/ prefix.
// The sw.js initially had '/TechNova/assets/icon-192.png' and 'icon-512.png'.
// I've adjusted these to match typical asset naming and removed the /TechNova/ prefix.

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
