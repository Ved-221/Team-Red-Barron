import { createClient } from "@/lib/supabase/server";
import { supabase as staticClient } from "@/lib/supabase";
import { USE_LOCAL_MEDIA_CACHE } from "@/lib/media";
import fs from "fs/promises";
import path from "path";
import { AchievementStat, DEFAULT_ACHIEVEMENTS } from "./achievements-types";

export type { AchievementStat };
export { DEFAULT_ACHIEVEMENTS };

const ACHIEVEMENTS_FILE = path.join(process.cwd(), "src", "data", "achievements.json");
const ACHIEVEMENTS_STORAGE_PATH = "meta/achievements.json";

let memoryCache: AchievementStat[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 1000;

async function getClient() {
  try {
    return await createClient();
  } catch {
    return staticClient;
  }
}

function isTableMissingError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as { code?: string; message?: string };
  const code = String(err.code || "");
  const msg = String(err.message || "").toLowerCase();
  return (
    code === "42P01" ||
    code === "PGRST205" ||
    msg.includes("does not exist") ||
    msg.includes("could not find") ||
    msg.includes("schema cache")
  );
}

async function readJsonFallback(): Promise<AchievementStat[]> {
  const now = Date.now();
  if (memoryCache && now - lastFetchTime < CACHE_TTL_MS) {
    return [...memoryCache];
  }

  // 0. High-performance zero-egress local cache for public launch
  if (USE_LOCAL_MEDIA_CACHE) {
    try {
      const localMetaPath = path.join(process.cwd(), "public", "media", "meta", "achievements.json");
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
    const { data: pubData } = staticClient.storage.from("trb-media").getPublicUrl(ACHIEVEMENTS_STORAGE_PATH);
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
      .download(ACHIEVEMENTS_STORAGE_PATH);
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
    // fall back to file
  }

  // 3. Local file fallback
  try {
    const raw = await fs.readFile(ACHIEVEMENTS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const sorted = parsed.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      memoryCache = sorted;
      lastFetchTime = now;
      return sorted;
    }
  } catch {
    // If not found, use default
  }

  memoryCache = DEFAULT_ACHIEVEMENTS;
  lastFetchTime = now;
  return DEFAULT_ACHIEVEMENTS;
}

async function writeJsonFallback(items: AchievementStat[]): Promise<void> {
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
        .upload(ACHIEVEMENTS_STORAGE_PATH, jsonStr, {
          upsert: true,
          contentType: "application/json",
          cacheControl: "0",
        });
      if (!error) break;
    } catch {}
  }

  try {
    await fs.mkdir(path.dirname(ACHIEVEMENTS_FILE), { recursive: true });
    await fs.writeFile(ACHIEVEMENTS_FILE, jsonStr, "utf-8");
  } catch (err) {
    console.warn("Could not write achievements.json fallback:", err);
  }
}

export async function getAchievements(): Promise<AchievementStat[]> {
  try {
    const client = await getClient();
    const { data, error } = await client
      .from("home_achievements")
      .select("id, label, value, icon, detail, sort_order")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((row: Partial<AchievementStat>, idx: number) => ({
        id: String(row.id || `stat-${idx}`),
        label: row.label || "",
        value: row.value || "",
        icon: row.icon || "Trophy",
        detail: row.detail || "",
        sort_order: typeof row.sort_order === "number" ? row.sort_order : idx + 1,
      }));
    }
  } catch {
    // fall back to json file
  }

  return readJsonFallback();
}

export async function saveAchievement(data: {
  id?: string;
  label: string;
  value: string;
  icon?: string;
  detail?: string;
  sort_order?: number;
}): Promise<AchievementStat[]> {
  const current = await readJsonFallback();
  const id = data.id || `stat-${Date.now()}`;
  const sort_order = Number.isFinite(data.sort_order) ? Number(data.sort_order) : current.length + 1;

  const record: AchievementStat = {
    id,
    label: (data.label || "").trim(),
    value: (data.value || "").trim(),
    icon: (data.icon || "Trophy").trim(),
    detail: (data.detail || "").trim(),
    sort_order,
  };

  const existingIdx = current.findIndex((item) => item.id === id);
  if (existingIdx >= 0) {
    current[existingIdx] = record;
  } else {
    current.push(record);
  }

  current.sort((a, b) => a.sort_order - b.sort_order);
  await writeJsonFallback(current);

  // Attempt to save to Supabase home_achievements if table exists
  try {
    const client = await getClient();
    const payload = {
      label: record.label,
      value: record.value,
      icon: record.icon,
      detail: record.detail,
      sort_order: record.sort_order,
      updated_at: new Date().toISOString(),
    };

    if (existingIdx >= 0 && !id.startsWith("stat-")) {
      const { error } = await client.from("home_achievements").update(payload).eq("id", id);
      if (error && !isTableMissingError(error)) {
        console.warn("Supabase home_achievements update warning:", error.message);
      }
    } else {
      const { error } = await client.from("home_achievements").insert(payload);
      if (error && !isTableMissingError(error)) {
        console.warn("Supabase home_achievements insert warning:", error.message);
      }
    }
  } catch (err) {
    console.warn("Could not sync achievement to Supabase:", err);
  }

  return current;
}

export async function deleteAchievement(id: string): Promise<AchievementStat[]> {
  const current = await readJsonFallback();
  const filtered = current.filter((item) => item.id !== id);
  await writeJsonFallback(filtered);

  try {
    const client = await getClient();
    const { error } = await client
      .from("home_achievements")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error && !isTableMissingError(error)) {
      console.warn("Supabase home_achievements delete warning:", error.message);
    }
  } catch (err) {
    console.warn("Could not sync achievement deletion to Supabase:", err);
  }

  return filtered;
}
