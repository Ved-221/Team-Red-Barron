import { createClient } from "@/lib/supabase/server";
import { supabase as staticClient } from "@/lib/supabase";
import { USE_LOCAL_MEDIA_CACHE } from "@/lib/media";
import fs from "fs/promises";
import path from "path";

export interface SponsorTestimonial {
  id: string;
  quote: string;
  name: string;
  company: string;
  tier: string;
  website_url?: string;
  sort_order: number;
}

const TESTIMONIALS_FILE = path.join(process.cwd(), "src", "data", "testimonials.json");
const TESTIMONIALS_STORAGE_PATH = "meta/testimonials.json";

let memoryCache: SponsorTestimonial[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 1000;

async function getClient() {
  try {
    return await createClient();
  } catch {
    return staticClient;
  }
}

export async function getTestimonials(): Promise<SponsorTestimonial[]> {
  const now = Date.now();
  if (memoryCache && now - lastFetchTime < CACHE_TTL_MS) {
    return [...memoryCache];
  }

  // 0. High-performance zero-egress local cache for public launch
  if (USE_LOCAL_MEDIA_CACHE) {
    try {
      const localMetaPath = path.join(process.cwd(), "public", "media", "meta", "testimonials.json");
      const raw = await fs.readFile(localMetaPath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const sorted = parsed.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        memoryCache = sorted;
        lastFetchTime = now;
        return sorted;
      }
    } catch {
      // Fall through to remote if local read fails
    }
  }

  // 1. Direct cache-busted fetch to bypass Cloudflare CDN cache
  try {
    const { data: pubData } = staticClient.storage.from("trb-media").getPublicUrl(TESTIMONIALS_STORAGE_PATH);
    if (pubData?.publicUrl) {
      const res = await fetch(`${pubData.publicUrl}?t=${now}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });
      if (res.ok) {
        const text = await res.text();
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sorted = parsed.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
          memoryCache = sorted;
          lastFetchTime = now;
          return sorted;
        }
      }
    }
  } catch {
    // fall back to storage download
  }

  // 2. Supabase Storage download SDK fallback
  try {
    const client = await getClient();
    const { data, error } = await client.storage
      .from("trb-media")
      .download(TESTIMONIALS_STORAGE_PATH);
    if (!error && data) {
      const text = await data.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const sorted = parsed.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        memoryCache = sorted;
        lastFetchTime = now;
        return sorted;
      }
    }
  } catch {
    // fall back to local file
  }

  // 3. Local file fallback
  try {
    const raw = await fs.readFile(TESTIMONIALS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const sorted = parsed.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      memoryCache = sorted;
      lastFetchTime = now;
      return sorted;
    }
  } catch {
    // fallback
  }

  return [];
}

async function writeTestimonials(items: SponsorTestimonial[]): Promise<void> {
  const jsonStr = JSON.stringify(items, null, 2);
  memoryCache = [...items];
  lastFetchTime = Date.now();

  const clients = [staticClient];
  try {
    const sc = await getClient();
    if (sc !== staticClient) clients.unshift(sc);
  } catch {}

  for (const client of clients) {
    try {
      const { error } = await client.storage
        .from("trb-media")
        .upload(TESTIMONIALS_STORAGE_PATH, jsonStr, {
          upsert: true,
          contentType: "application/json",
          cacheControl: "0",
        });
      if (!error) break;
    } catch {}
  }

  try {
    await fs.mkdir(path.dirname(TESTIMONIALS_FILE), { recursive: true });
    await fs.writeFile(TESTIMONIALS_FILE, jsonStr, "utf-8");
  } catch (err) {
    // Read-only filesystem in serverless (e.g. Vercel Lambda) is expected
    console.warn("Could not write testimonials.json locally (serverless read-only filesystem):", err);
  }
}

export async function saveTestimonial(data: Omit<SponsorTestimonial, "id"> & { id?: string }): Promise<SponsorTestimonial[]> {
  const current = await getTestimonials();
  const id = data.id || `testimonial-${Date.now()}`;
  
  const existingIdx = current.findIndex(t => t.id === id);
  const record: SponsorTestimonial = {
    id,
    quote: data.quote.trim(),
    name: data.name.trim(),
    company: data.company.trim(),
    tier: data.tier.trim(),
    website_url: data.website_url ? data.website_url.trim() : "",
    sort_order: Number.isFinite(data.sort_order) ? data.sort_order : current.length,
  };

  if (existingIdx >= 0) {
    current[existingIdx] = record;
  } else {
    current.push(record);
  }

  current.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  await writeTestimonials(current);
  return current;
}

export async function removeTestimonial(id: string): Promise<SponsorTestimonial[]> {
  const current = await getTestimonials();
  const filtered = current.filter(t => t.id !== id);
  await writeTestimonials(filtered);
  return filtered;
}
