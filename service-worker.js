const CACHE_NAME = 'praymate-v2';
const BASE = '/praymate-app';
const urlsToCache = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/jadwal.html`,
  `${BASE}/quran.html`,
  `${BASE}/settings.html`,
  `${BASE}/doa.html`,
  `${BASE}/hadits.html`,
  `${BASE}/asmaul-husna.html`,
  `${BASE}/dzikir.html`,
  `${BASE}/kiblat.html`,
  `${BASE}/zakat.html`,
  `${BASE}/kalender.html`,
  `${BASE}/panduan-sholat.html`,
  `${BASE}/css/style.css`,
  `${BASE}/js/app.js`,
  `${BASE}/js/theme.js`,
  `${BASE}/js/prayerApi.js`,
  `${BASE}/js/quranApi.js`,
  `${BASE}/js/doaData.js`,
  `${BASE}/js/haditsData.js`,
  `${BASE}/js/asmaulHusnaData.js`,
  `${BASE}/js/islamic-features.js`,
  `${BASE}/js/panduanSholatData.js`,
  `${BASE}/manifest.webmanifest`
];

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

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
