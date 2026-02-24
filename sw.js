const CACHE_NAME = 'prescription-calc-v1.1'; // 更新時はこの数字を1.2のように変える
const ASSETS = [
    './mobile.html',
    './icon-192.svg',
    './icon-512.svg',
    './manifest.json'
];

// Install: cache all assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch: HTMLはネットワーク優先、その他はキャッシュ優先
self.addEventListener('fetch', event => {
    if (event.request.mode === 'navigate') {
        // HTML（画面の読み込み）は常に最新を試みる
        event.respondWith(
            fetch(event.request).catch(() => caches.match('./mobile.html'))
        );
        return;
    }

    // その他（アイコン等）はキャッシュがあればそれを使い、なければネットワーク
    event.respondWith(
        caches.match(event.request).then(cached => cached || fetch(event.request))
    );
});
