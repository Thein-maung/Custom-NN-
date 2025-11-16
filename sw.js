// Service Worker for offline functionality
console.log('🔧 Service Worker: Installing...');

const CACHE_NAME = 'quantum-chat-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/chat.html', 
  '/voice.html',
  '/styles.css',
  '/app.js',
  '/chat.js',
  '/voice.js',
  '/crypto.js',
  '/twinnet.js',
  '/qr.js',
  '/debug.js'
];

self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Installing cache...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('🔧 Service Worker: Cache opened, adding files...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker: Installation completed');
      })
      .catch(error => {
        console.error('❌ Service Worker: Installation failed:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('🔧 Service Worker: Serving from cache:', event.request.url);
          return response;
        }
        console.log('🔧 Service Worker: Fetching from network:', event.request.url);
        return fetch(event.request);
      })
      .catch(error => {
        console.error('❌ Service Worker: Fetch failed:', error);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('🔧 Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🔧 Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('✅ Service Worker: Activation completed');
    })
  );
});

console.log('✅ Service Worker: Registered successfully');