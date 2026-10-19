#!/usr/bin/env node

/**
 * Image Cache Warming Script
 * 
 * Fetches HTML from specified public routes, extracts all /_next/image?url=...
 * query URLs, and requests each optimized image once with standard Next.js image headers
 * so that subsequent user visits hit warm cache in the Next.js image optimizer.
 * 
 * Usage:
 *   node scripts/warm-image-cache.mjs [baseUrl]
 *   node scripts/warm-image-cache.mjs http://localhost:3000
 */

const rawBaseUrl = process.argv[2] || "http://localhost:3000";
const baseUrl = rawBaseUrl.replace(/\/+$/, "");

const ROUTES = [
  "/",
  "/about",
  "/team",
  "/team?year=2025-26",
  "/gallery",
  "/sponsors",
  "/contact"
];

async function fetchRouteHtml(route) {
  const url = `${baseUrl}${route}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "TRB-ImageCacheWarmer/1.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    });
    if (!res.ok) {
      console.warn(`[WARN] Route ${route} returned status ${res.status}`);
      return "";
    }
    return await res.text();
  } catch (err) {
    console.error(`[ERROR] Failed to fetch route ${url}:`, err.message);
    return "";
  }
}

function extractImageUrls(html) {
  const urls = new Set();

  // Pattern 1: match /_next/image?url=... inside quotes
  const regex = /["'](\/_next\/image\?[^"'\s>]+)["']/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const decoded = match[1].replace(/&amp;/g, "&");
    urls.add(decoded);
  }

  // Pattern 2: match in srcset list: "/_next/image?url=... 1x, /_next/image?url=... 2x"
  const srcsetRegex = /(\/_next\/image\?[^\s,]+)\s+\d+[wx]/g;
  while ((match = srcsetRegex.exec(html)) !== null) {
    const decoded = match[1].replace(/&amp;/g, "&");
    urls.add(decoded);
  }

  return Array.from(urls);
}

async function warmImage(relativeImageUrl) {
  const fullUrl = `${baseUrl}${relativeImageUrl}`;
  const start = performance.now();
  try {
    const res = await fetch(fullUrl, {
      headers: {
        "User-Agent": "TRB-ImageCacheWarmer/1.0",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br"
      }
    });
    const durationMs = Math.round(performance.now() - start);
    const contentType = res.headers.get("content-type") || "unknown";
    const contentLength = res.headers.get("content-length") || "chunked";
    const cacheStatus = res.headers.get("x-nextjs-cache") || res.headers.get("cf-cache-status") || "n/a";

    if (res.ok) {
      console.log(`[WARM OK] ${res.status} (${durationMs}ms, ${contentType}, ${contentLength}B, cache: ${cacheStatus}) -> ${relativeImageUrl.slice(0, 80)}...`);
      return { success: true, status: res.status, durationMs };
    } else {
      console.warn(`[WARM FAIL] ${res.status} (${durationMs}ms) -> ${relativeImageUrl}`);
      return { success: false, status: res.status, durationMs };
    }
  } catch (err) {
    const durationMs = Math.round(performance.now() - start);
    console.error(`[WARM ERROR] (${durationMs}ms) ${relativeImageUrl}:`, err.message);
    return { success: false, error: err.message, durationMs };
  }
}

async function main() {
  console.log(`=== TRB Next.js Image Cache Warmer ===`);
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Routes to inspect: ${ROUTES.join(", ")}\n`);

  const allImageUrls = new Set();

  for (const route of ROUTES) {
    process.stdout.write(`Scanning route ${route}... `);
    const html = await fetchRouteHtml(route);
    const images = extractImageUrls(html);
    console.log(`found ${images.length} Next.js image optimizer URL(s)`);
    for (const img of images) {
      allImageUrls.add(img);
    }
  }

  const uniqueImages = Array.from(allImageUrls);
  console.log(`\nDiscovered ${uniqueImages.length} unique image variant(s) across all routes.`);
  console.log(`Warming cache now (concurrency: 4)...\n`);

  let warmedCount = 0;
  let failedCount = 0;

  // Process in small batches of 4 concurrent requests
  const CONCURRENCY = 4;
  for (let i = 0; i < uniqueImages.length; i += CONCURRENCY) {
    const batch = uniqueImages.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(warmImage));
    for (const r of results) {
      if (r.success) warmedCount++;
      else failedCount++;
    }
  }

  console.log(`\n=== Warming Complete ===`);
  console.log(`Successfully warmed: ${warmedCount}`);
  console.log(`Failed / skipped:    ${failedCount}`);
  console.log(`Total images processed: ${uniqueImages.length}`);
}

main().catch((err) => {
  console.error("Unhandled error in cache warmer:", err);
  process.exit(1);
});
