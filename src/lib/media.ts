/**
 * Media URL Resolver for Team Red Baron Website.
 *
 * Automatically maps remote Supabase Storage URLs to local Vercel-hosted /media/ paths
 * to ensure 100% of website traffic is served from Vercel Edge with ZERO Supabase Cached Egress.
 *
 * To toggle back to live Supabase Storage URLs after Nov 26:
 * Set USE_LOCAL_MEDIA_CACHE = false.
 */
export const USE_LOCAL_MEDIA_CACHE = true;

const SUPABASE_STORAGE_PREFIX =
  "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/";

function safeDecode(val: string): string {
  try {
    return decodeURIComponent(val);
  } catch {
    return val;
  }
}

export function toLocalMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (!USE_LOCAL_MEDIA_CACHE) return url;

  // Already local
  if (url.startsWith("/media/")) {
    return url;
  }

  // Full Supabase Storage public URL
  if (url.includes(SUPABASE_STORAGE_PREFIX)) {
    let rawPath = safeDecode(url.split(SUPABASE_STORAGE_PREFIX)[1].split("?")[0]);
    // In gallery, assets were optimized to .webp in storage
    if (rawPath.startsWith("gallery/") && !rawPath.endsWith(".webp")) {
      rawPath = rawPath.replace(/\.(jpg|jpeg|png)$/i, ".webp");
    }
    if (rawPath.startsWith("hero/") && rawPath.includes("IMG_4588")) {
      rawPath = "hero/sponsors_hero_bg.webp";
    }
    // In hero, ensure sponsors_hero_bg is resolved
    if (rawPath.startsWith("hero/") && rawPath.includes("IMG_4588")) {
      rawPath = "hero/sponsors_hero_bg.webp";
    }
    return `/media/${rawPath}`;
  }

  // Any trb-media bucket reference (e.g. transform/render URLs)
  const marker = "/trb-media/";
  if (url.includes(marker)) {
    let rawPath = safeDecode(url.split(marker)[1].split("?")[0]);
    if (rawPath.startsWith("gallery/") && !rawPath.endsWith(".webp")) {
      rawPath = rawPath.replace(/\.(jpg|jpeg|png)$/i, ".webp");
    }
    if (rawPath.startsWith("hero/") && rawPath.includes("IMG_4588")) {
      rawPath = "hero/sponsors_hero_bg.webp";
    }
    return `/media/${rawPath}`;
  }

  return url;
}
