import assert from "node:assert/strict";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const missingPath = "/some-path-that-does-not-exist";

function absolute(path) {
  return new URL(path, baseUrl).toString();
}

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function headerIncludes(response, header, expected) {
  return response.headers.get(header)?.toLowerCase().includes(expected) ?? false;
}

async function fetchText(path, init) {
  const response = await fetch(absolute(path), init);
  const body = await response.text();
  return { response, body };
}

async function verifyHomepageHtml() {
  const { response, body } = await fetchText("/");

  assert.equal(response.status, 200);
  assert.ok(headerIncludes(response, "content-type", "text/html"));
  assert.match(body, /<h1[^>]*>\s*ISHTIAQ UL HAQ SYED\s*<\/h1>/i);
  assert.match(body, /<h2[^>]*>\s*SOFTWARE ENGINEER\s*<\/h2>/i);
  assert.doesNotMatch(body, /Who is Ishtiaq|What does this website cover/i);
  assert.match(body, /<title\b[^>]*>[^<]{30,70}<\/title>/);
  assert.match(body, /<meta name="description" content="[^\"]{120,150}"/);
  assert.match(body, /<link rel="canonical" href="https:\/\/www\.ishtiaqsyed\.com"/);
  assert.match(body, /<html[^>]+lang="en"/);
  assert.match(body, /<meta property="og:type" content="website"/);
  assert.match(body, /<meta property="og:image" content="https:\/\/[^\"]+\.webp"/);
  assert.match(body, /rel="privacy-policy" href="https:\/\/www\.ishtiaqsyed\.com\/privacy"/);
  assert.match(body, /rel="terms-of-service" href="https:\/\/www\.ishtiaqsyed\.com\/terms"/);
  assert.match(body, /url=%2Fishtiaq\.webp/);
  assert.match(body, /loading="eager"/);
  assert.match(body, /fetchPriority="high"/i);

  const jsonLdMatch = body.match(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/,
  );
  assert.ok(jsonLdMatch, "homepage JSON-LD script missing");
  const jsonLd = JSON.parse(jsonLdMatch[1]);
  const graph = jsonLd["@graph"] ?? [];
  const person = graph.find((entry) => entry["@type"] === "Person");
  const website = graph.find((entry) => entry["@type"] === "WebSite");
  const webpage = graph.find((entry) => entry["@type"] === "WebPage");
  assert.ok(person, "Person schema missing");
  assert.equal(person.name, "Ishtiaq Ul Haq Syed");
  assert.equal(person.url, "https://www.ishtiaqsyed.com");
  assert.ok(person.image, "Person image missing");
  assert.ok(website, "WebSite schema missing");
  assert.equal(website.name, "Ishtiaq Syed");
  assert.equal(website.url, "https://www.ishtiaqsyed.com");
  assert.ok(webpage, "WebPage schema missing");
  assert.equal(webpage.author["@id"], person["@id"]);
  assert.equal(webpage.dateModified, "2026-10-02");
}

async function verifyMarkdownNegotiation() {
  const { response, body } = await fetchText("/", {
    headers: { Accept: "text/markdown, text/html;q=0.8" },
  });

  assert.equal(response.status, 200);
  assert.ok(headerIncludes(response, "content-type", "text/markdown"));
  assert.ok(headerIncludes(response, "vary", "accept"));
  assert.match(body, /^# Ishtiaq Ul Haq Syed/m);
  assert.ok(body.length >= 500, `markdown body length was ${body.length}`);

  const htmlPreferred = await fetchText("/", {
    headers: { Accept: "text/html;q=1, text/markdown;q=0.2" },
  });
  assert.equal(htmlPreferred.response.status, 200);
  assert.ok(headerIncludes(htmlPreferred.response, "content-type", "text/html"));
  assert.ok(headerIncludes(htmlPreferred.response, "vary", "accept"));

  const plainTextFallback = await fetchText("/", {
    headers: { Accept: "text/plain" },
  });
  assert.equal(plainTextFallback.response.status, 200);
  assert.ok(
    headerIncludes(plainTextFallback.response, "content-type", "text/html"),
  );
  assert.ok(headerIncludes(plainTextFallback.response, "vary", "accept"));

  const notAcceptable = await fetchText("/", {
    headers: { Accept: "application/json" },
  });
  assert.equal(notAcceptable.response.status, 406);
  assert.ok(headerIncludes(notAcceptable.response, "vary", "accept"));
}

async function verifyNotFound() {
  const { response, body } = await fetchText(missingPath, {
    headers: { Accept: "text/markdown" },
  });

  assert.equal(response.status, 404);
  assert.ok(headerIncludes(response, "content-type", "text/markdown"));
  assert.ok(headerIncludes(response, "vary", "accept"));
  assert.match(body, /^# 404 - Not Found/m);
  assert.match(body, /sitemap\.xml/);
  assert.match(body, /llms\.txt/);

  const html404 = await fetchText(missingPath, {
    headers: { Accept: "text/html" },
  });
  assert.equal(html404.response.status, 404);
  assert.ok(headerIncludes(html404.response, "content-type", "text/html"));
  assert.ok(headerIncludes(html404.response, "vary", "accept"));
  assert.match(html404.body, /404 - NOT FOUND/);
}

async function verifyLlmsTxt() {
  const { response, body } = await fetchText("/llms.txt");

  assert.equal(response.status, 200);
  assert.ok(headerIncludes(response, "content-type", "text/plain"));
  assert.match(body, /^# Ishtiaq Syed/);
  assert.match(body, /When to use this:/);
  assert.match(body, /https:\/\/www\.ishtiaqsyed\.com\/sitemap\.xml/);
}

async function verifySitemap() {
  const { response, body } = await fetchText("/sitemap.xml");

  assert.equal(response.status, 200);
  assert.ok(headerIncludes(response, "content-type", "xml"));
  assert.match(body, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(
    body,
    /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/,
  );

  for (const path of ["", "/about", "/contact", "/privacy", "/projects", "/terms"]) {
    assert.match(body, new RegExp(`<loc>https://www\\.ishtiaqsyed\\.com${path}</loc>`));
    assert.match(body, /<lastmod>2026-10-02<\/lastmod>/);
  }
}

async function verifyRobotsTxt() {
  const { response, body } = await fetchText("/robots.txt");

  assert.equal(response.status, 200);
  assert.ok(headerIncludes(response, "content-type", "text/plain"));
  assert.match(body, /^User-agent: \*/m);
  assert.match(body, /^Sitemap: https:\/\/www\.ishtiaqsyed\.com\/sitemap\.xml/m);
}

async function verifyStaticSupportFiles() {
  const manifest = await fetchText("/site.webmanifest");
  assert.equal(manifest.response.status, 200);
  assert.ok(headerIncludes(manifest.response, "content-type", "json"));
  assert.equal(JSON.parse(manifest.body).name, "Ishtiaq Syed");

  const serviceWorker = await fetchText("/sw.js");
  assert.equal(serviceWorker.response.status, 200);
  assert.ok(headerIncludes(serviceWorker.response, "content-type", "javascript"));
  assert.match(serviceWorker.body, /"\/contact"/);
  assert.match(serviceWorker.body, /"\/privacy"/);
  assert.match(serviceWorker.body, /"\/terms"/);

  const portrait = await fetch(absolute("/ishtiaq.webp"));
  const portraitBytes = new Uint8Array(await portrait.arrayBuffer());
  assert.equal(portrait.status, 200);
  assert.ok(headerIncludes(portrait, "content-type", "image/webp"));
  assert.equal(String.fromCharCode(...portraitBytes.slice(8, 12)), "WEBP");
}

async function verifyIndexablePages() {
  for (const path of ["/", "/about", "/contact", "/privacy", "/projects", "/terms"]) {
    const { response, body } = await fetchText(path);

    assert.equal(response.status, 200, `${path} status`);
    assert.ok(headerIncludes(response, "content-type", "text/html"));
    assert.ok(headerIncludes(response, "vary", "accept"));
    const canonical = body.match(/<link rel="canonical" href="([^"]+)"/);
    assert.equal(
      canonical?.[1],
      `https://www.ishtiaqsyed.com${path === "/" ? "" : path}`,
    );
  }
}

async function verifySecurityHeaders() {
  const { response } = await fetchText("/");

  assert.match(response.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/);
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  assert.match(response.headers.get("permissions-policy") ?? "", /camera=\(\)/);
  assert.match(response.headers.get("link") ?? "", /rel="privacy-policy"/);
  assert.match(response.headers.get("link") ?? "", /rel="terms-of-service"/);
}

async function verifyTrustPages() {
  for (const path of ["/contact", "/privacy", "/terms"]) {
    const { response, body } = await fetchText(path);
    const text = visibleText(body);

    assert.equal(response.status, 200, `${path} status`);
    assert.ok(text.length >= 500, `${path} text length was ${text.length}`);
    assert.ok(headerIncludes(response, "vary", "accept"));
  }

  const about = await fetchText("/about");
  assert.equal(about.response.status, 200);
  assert.match(about.body, /Hi, I(?:&#x27;|&apos;)m Ishtiaq!/);
}

await verifyHomepageHtml();
await verifyMarkdownNegotiation();
await verifyNotFound();
await verifyLlmsTxt();
await verifySitemap();
await verifyRobotsTxt();
await verifyStaticSupportFiles();
await verifyIndexablePages();
await verifySecurityHeaders();
await verifyTrustPages();

console.log(`Agent-readiness endpoint checks passed for ${baseUrl}`);
