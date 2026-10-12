const CACHE_PREFIX = "ishtiaq-syed-website-";
const CACHE_NAME = `${CACHE_PREFIX}v3`;
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

async function cacheOfflinePages() {
  const cache = await caches.open(CACHE_NAME);
  const staticAssets = new Set();

  await Promise.all(
    Array.from(PAGE_PATHS, async (path) => {
      const request = pageCacheKey(path);
      const response = await fetch(request);

      if (
        !response.ok ||
        !response.headers.get("Content-Type")?.includes("text/html")
      ) {
        throw new Error(`Could not cache offline page: ${path}`);
      }

      const html = await response.clone().text();
      for (const match of html.matchAll(
        /\b(?:src|href)="(\/_next\/static\/[^\"]+)"/g,
      )) {
        staticAssets.add(match[1]);
      }

      await cache.put(request, response);
    }),
  );

  if (staticAssets.size === 0) {
    throw new Error("Could not find Next.js assets for offline pages");
  }

  await cache.addAll([...ASSET_PATHS, ...staticAssets]);
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheOfflinePages());
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

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request, { ignoreVary: true });
        if (cached) return cached;

        const response = await fetch(request);
        if (response.ok) {
          try {
            await cache.put(request, response.clone());
          } catch {
            // Quota errors should not prevent online assets from loading.
          }
        }
        return response;
      })(),
    );
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
          (isPortraitImage && (await caches.match("/ishtiaq.webp"))) ||
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
