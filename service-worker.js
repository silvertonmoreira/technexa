const CACHE_NAME = "technexa-v1";

const arquivosParaCache = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./img/icon-192.png",
    "./img/icon-512.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(arquivosParaCache);
            })
    );

    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(keys => {
                return Promise.all(
                    keys.map(key => {
                        if (key !== CACHE_NAME) {
                            return caches.delete(key);
                        }
                    })
                );
            })
    );

    self.clients.claim();
});

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {
                const copia = response.clone();

                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(
                            event.request,
                            copia
                        );
                    });

                return response;
            })
            .catch(() => {
                return caches.match(
                    event.request
                );
            })
    );
});