import { createClient } from "@/lib/supabase/server";
import { supabase as staticClient } from "@/lib/supabase";
import { USE_LOCAL_MEDIA_CACHE } from "@/lib/media";
import fs from "fs/promises";
import path from "path";

const MEMBERS_META_FILE = path.join(process.cwd(), "src", "data", "team_members_meta.json");
const STORAGE_BUCKET = "trb-media";
const STORAGE_PATH = "meta/team_members_positions.json";

let memoryCache: Record<string, string> | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 1000;

async function getClient() {
  try {
    return await createClient();
  } catch {
    return staticClient;
  }
}

export function isColumnMissingError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as { code?: string; message?: string };
  const code = String(err.code || "");
  const msg = String(err.message || "").toLowerCase();
  return (
    code === "42703" ||
    code === "PGRST204" ||
    msg.includes("does not exist") ||
    msg.includes("could not find") ||
    msg.includes("schema cache") ||
    msg.includes("column")
  );
}

export async function getMemberPositions(): Promise<Record<string, string>> {
  const now = Date.now();
  if (memoryCache && now - lastFetchTime < CACHE_TTL_MS) {
    return { ...memoryCache };
  }

  // 0. High-performance zero-egress local cache for public launch
  if (USE_LOCAL_MEDIA_CACHE) {
    try {
      const localMetaPath = path.join(process.cwd(), "public", "media", "meta", "team_members_positions.json");
      const raw = await fs.readFile(localMetaPath, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        memoryCache = parsed;
        lastFetchTime = now;
        return { ...parsed };
      }
    } catch {
      // Fall through to remote if local read fails
    }
  }

  // 1. Direct cache-busted fetch to bypass Cloudflare CDN cache (max-age 3600 override)
  try {
    const { data: pubData } = staticClient.storage.from(STORAGE_BUCKET).getPublicUrl(STORAGE_PATH);
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
        if (parsed && typeof parsed === "object") {
          memoryCache = parsed;
          lastFetchTime = now;
          return { ...parsed };
        }
      }
    }
  } catch {
    // fall through to storage download
  }

  // 2. Try Supabase Storage download SDK
  try {
    const client = await getClient();
    const { data, error } = await client.storage
      .from(STORAGE_BUCKET)
      .download(STORAGE_PATH);

    if (!error && data) {
      const text = await data.text();
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === "object") {
        memoryCache = parsed;
        lastFetchTime = now;
        return { ...parsed };
      }
    }
  } catch {
    // fall through to local fallback
  }

  // 3. Local JSON fallback
  try {
    const raw = await fs.readFile(MEMBERS_META_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      memoryCache = parsed;
      lastFetchTime = now;
      return { ...parsed };
    }
  } catch {
    // empty fallback
  }

  return memoryCache || {};
}

export async function getMemberPosition(memberId: string): Promise<string> {
  if (!memberId) return "";
  const all = await getMemberPositions();
  return all[memberId] || "";
}

export async function saveMemberPosition(memberId: string, position: string): Promise<void> {
  if (!memberId) return;
  const all = await getMemberPositions();
  const cleanPos = (position || "").trim();

  if (cleanPos) {
    all[memberId] = cleanPos;
  } else {
    delete all[memberId];
  }

  memoryCache = { ...all };
  lastFetchTime = Date.now();

  const jsonStr = JSON.stringify(all, null, 2);

  // 1. Save to Supabase Storage with cacheControl: '0'
  // Try both getClient() and staticClient to guarantee write succeeds regardless of auth context
  const clients = [staticClient];
  try {
    const sc = await getClient();
    if (sc !== staticClient) clients.unshift(sc);
  } catch {}

  for (const client of clients) {
    try {
      const { error } = await client.storage
        .from(STORAGE_BUCKET)
        .upload(STORAGE_PATH, jsonStr, {
          upsert: true,
          contentType: "application/json",
          cacheControl: "0",
        });
      if (!error) {
        break;
      } else {
        console.warn("Supabase storage position upload warning:", error.message);
      }
    } catch (err) {
      console.warn("Could not sync position to Supabase storage:", err);
    }
  }

  // 2. Local file write (for local dev environments)
  try {
    await fs.mkdir(path.dirname(MEMBERS_META_FILE), { recursive: true });
    await fs.writeFile(MEMBERS_META_FILE, jsonStr, "utf-8");
  } catch {
    // Read-only filesystem in serverless environments, safe to ignore
  }
}

export async function deleteMemberPosition(memberId: string): Promise<void> {
  if (!memberId) return;
  const all = await getMemberPositions();
  if (memberId in all) {
    delete all[memberId];
    memoryCache = { ...all };
    lastFetchTime = Date.now();

    const jsonStr = JSON.stringify(all, null, 2);

    const clients = [staticClient];
    try {
      const sc = await getClient();
      if (sc !== staticClient) clients.unshift(sc);
    } catch {}

    for (const client of clients) {
      try {
        const { error } = await client.storage
          .from(STORAGE_BUCKET)
          .upload(STORAGE_PATH, jsonStr, {
            upsert: true,
            contentType: "application/json",
            cacheControl: "0",
          });
        if (!error) break;
      } catch {}
    }

    try {
      await fs.writeFile(MEMBERS_META_FILE, jsonStr, "utf-8");
    } catch {
      // Safe to ignore on read-only serverless filesystems
    }
  }
}
