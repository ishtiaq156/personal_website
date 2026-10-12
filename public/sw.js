const CACHE_PREFIX = "ishtiaq-syed-website-";
const CACHE_NAME = `${CACHE_PREFIX}v2`;
const PAGE_PATHS = new Set([
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/projects",
]);
const ASSET_PATHS = new Set([
  "/ishtiaq.webp",
  "/ishtiaq.jpeg",
  "/favicon.ico",
  "/site.webmanifest",
]);

function pageCacheKey(pathname) {
  return new Request(new URL(pathname, self.location.origin), {
    headers: { Accept: "text/html" },
  });
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.all([
          ...Array.from(PAGE_PATHS, (path) => cache.add(pageCacheKey(path))),
          ...Array.from(ASSET_PATHS, (path) => cache.add(path)),
        ]),
      ),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter(
              (name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME,
            )
            .map((name) => caches.delete(name)),
        ),
      ),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  const isPage =
    request.mode === "navigate" &&
    request.headers.get("Accept")?.includes("text/html") &&
    PAGE_PATHS.has(url.pathname);
  const isPortraitImage =
    url.pathname === "/_next/image" &&
    url.searchParams.get("url") === "/ishtiaq.webp";
  const isAsset = ASSET_PATHS.has(url.pathname) || isPortraitImage;

  if (!isPage && !isAsset) {
    return;
  }

  const cacheKey = isPage ? pageCacheKey(url.pathname) : request;

  event.respondWith(
    (async () => {
      let response;

      try {
        response = await fetch(request);
      } catch {
        return (
          (await caches.match(cacheKey, { ignoreVary: isPage })) ||
          Response.error()
        );
      }

      const isExpectedPage =
        isPage && response.headers.get("Content-Type")?.includes("text/html");

      if (response.ok && (isExpectedPage || isAsset)) {
        try {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(cacheKey, response.clone());
        } catch {
          // Cache storage can be unavailable or full; keep the network response.
        }
      }

      return response;
    })(),
  );
});
