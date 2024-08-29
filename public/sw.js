const prefix = "V1";
const cache_files = [
  "/index.html",
  "/manifest.json",

  "/favicon.ico",
  "/icons/icon512.png",
  "/icons/icon512.webp",
  "/icons/icon192.webp",
];

// Ecoute l'évenement install sur le sw
self.addEventListener("install", (event) => {
  // Active directement le sw
  self.skipWaiting();

  // Met en pause l'install du sw et attend la résolution de la promise
  event.waitUntil(
    (async () => {
      const cache = await caches.open(prefix); // Ouvre le cache avec la clé de cache = prefix
      try {
        await cache.addAll(cache_files);
      } catch (error) {
        console.log(error);
      }
    })()
  ); // Auto appel de la fonction ()

  console.log(`${prefix} Install`);
});

// Ecoute l'évenement activate sur le sw
self.addEventListener("activate", (event) => {
  // Active directement le sw
  clients.claim();

  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        // On attend que les anciennes clé soit supprmiées
        keys.map((key) => {
          if (!key.includes(prefix)) {
            return caches.delete(key);
          }
        })
      );
    })()
  ); // Auto appel de la fonction ()

  console.log(`${prefix} Activate`);
});

// Ecoute l'évenement fetch sur le sw
self.addEventListener("fetch", (event) => {
  // console.log(`${prefix} Fetching: ${event.request.url}, Mode: ${event.request.mode}`)

  if (event.request.mode === "navigate") {
    // Intercepte la requête pour ajouter des comportements
    event.respondWith(
      (async () => {
        try {
          // Online
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          return await fetch(event.request); // Comportement habituel, charge l'app
        } catch (e) {
          // Offline
          const cache = await caches.open(prefix); // Ouvre le cache avec la clé de cache = prefix
          return await cache.match("/index.html");
        }
      })()
    ); // Auto appel de la fonction ()
  } else if (
    cache_files.includes(event.request.url) &&
    !event.request.url.includes(".hot-update.")
  ) {
    // Si le fichiers requeté est déjà dans le cache
    console.log("FROM CACHE");
    try {
      event.respondWith(caches.match(event.request));
    } catch (error) {
      console.log(error);
    }
  }

  if (event.request.url.includes("hot-update")) {
    console.log("HOT-UPDATE...");
    try {
      return event;
    } catch (error) {
      console.log("hot-update error: ", error);
    }
  }
});
