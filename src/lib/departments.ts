import { createClient } from "@/lib/supabase/server";
import { supabase as staticClient } from "@/lib/supabase";
import fs from "fs/promises";
import path from "path";

export interface DepartmentItem {
  id?: string;
  name: string;
  sort_order: number;
  description: string;
}

export const DEFAULT_DEPARTMENT_DETAILS: Record<string, { description: string; sort_order: number }> = {
  "FACULTY ADVISORS": {
    description: "Academic mentors and institutional leadership guiding technical research, safety standards, and collegiate compliance.",
    sort_order: 0,
  },
  "FACULTY": {
    description: "Academic mentors and institutional leadership guiding technical research, safety standards, and collegiate compliance.",
    sort_order: 0,
  },
  "TRANSMISSION": {
    description: "Designing and optimizing the power delivery system to ensure maximum efficiency and performance on the track.",
    sort_order: 1,
  },
  "ACCUMULATOR": {
    description: "Developing safe, high-capacity, and high-discharge energy storage systems for our electric powertrain.",
    sort_order: 2,
  },
  "ELECTRIC POWERTRAIN": {
    description: "Engineering the high-voltage electrical systems and motor controllers that provide our vehicle's immense torque.",
    sort_order: 3,
  },
  "ROLLCAGE": {
    description: "Constructing the structural backbone of the race car, ensuring driver safety and maximizing torsional rigidity.",
    sort_order: 4,
  },
  "VEHICLE DYNAMICS": {
    description: "Fine-tuning suspension, steering, and aerodynamics to give our drivers complete control in every corner.",
    sort_order: 5,
  },
  "MECHANICAL POWERTRAIN": {
    description: "Maximizing the efficiency and reliability of internal combustion components for extreme racing conditions.",
    sort_order: 6,
  },
  "MANAGEMENT": {
    description: "Operations, corporate outreach, media, logistics, and organizational excellence driving Team Red Baron.",
    sort_order: 7,
  },
};

export const DEFAULT_DEPARTMENTS = [
  "TRANSMISSION",
  "ACCUMULATOR",
  "ELECTRIC POWERTRAIN",
  "ROLLCAGE",
  "VEHICLE DYNAMICS",
  "MECHANICAL POWERTRAIN",
  "MANAGEMENT",
];

const DEPARTMENTS_META_FILE = path.join(process.cwd(), "src", "data", "departments_meta.json");
const DEPARTMENTS_STORAGE_PATH = "meta/departments_meta.json";

async function getClient() {
  try {
    return await createClient();
  } catch {
    return staticClient;
  }
}

async function readMetaFallback(): Promise<Record<string, { sort_order?: number; description?: string }>> {
  try {
    const client = await getClient();
    const { data, error } = await client.storage
      .from("trb-media")
      .download(DEPARTMENTS_STORAGE_PATH);
    if (!error && data) {
      const text = await data.text();
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch {
    // fall back to local file
  }

  try {
    const raw = await fs.readFile(DEPARTMENTS_META_FILE, "utf-8");
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

async function writeMetaFallback(meta: Record<string, { sort_order?: number; description?: string }>) {
  const jsonStr = JSON.stringify(meta, null, 2);
  try {
    const client = await getClient();
    await client.storage
      .from("trb-media")
      .upload(DEPARTMENTS_STORAGE_PATH, jsonStr, {
        upsert: true,
        contentType: "application/json",
      });
  } catch {
    // ignore
  }

  try {
    await fs.mkdir(path.dirname(DEPARTMENTS_META_FILE), { recursive: true });
    await fs.writeFile(DEPARTMENTS_META_FILE, jsonStr, "utf-8");
  } catch {
    // Read-only filesystem in serverless environments, safe to ignore
  }
}

function isColumnMissingError(error: unknown): boolean {
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

export async function getDepartmentDetails(): Promise<DepartmentItem[]> {
  const metaFallback = await readMetaFallback();

  try {
    const client = await getClient();
    // 1. Try to query with sort_order and description from Supabase
    const { data, error } = await client
      .from("departments")
      .select("id, name, sort_order, description")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((row: { id?: string; name?: string; sort_order?: number; description?: string }, idx: number) => {
        const cleanName = (row.name || "").trim().toUpperCase();
        const defaultInfo = DEFAULT_DEPARTMENT_DETAILS[cleanName];
        const meta = metaFallback[cleanName];

        const sort_order = typeof row.sort_order === "number" && !isNaN(row.sort_order)
          ? row.sort_order
          : (meta?.sort_order ?? defaultInfo?.sort_order ?? idx + 1);

        const description = (row.description && row.description.trim())
          ? row.description.trim()
          : (meta?.description || defaultInfo?.description || `Specialized engineering and operational domain for ${cleanName}.`);

        return {
          id: row.id,
          name: cleanName,
          sort_order,
          description,
        };
      }).sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
    }

    // 2. If sort_order or description column doesn't exist yet (PGRST204 / 42703), fetch name only
    if (error && isColumnMissingError(error)) {
      const { data: nameData } = await client
        .from("departments")
        .select("id, name");

      if (nameData && nameData.length > 0) {
        return nameData.map((row: { id?: string; name?: string }, idx: number) => {
          const cleanName = (row.name || "").trim().toUpperCase();
          const defaultInfo = DEFAULT_DEPARTMENT_DETAILS[cleanName];
          const meta = metaFallback[cleanName];

          const sort_order = meta?.sort_order ?? defaultInfo?.sort_order ?? idx + 1;
          const description = meta?.description || defaultInfo?.description || `Specialized engineering and operational domain for ${cleanName}.`;

          return {
            id: row.id,
            name: cleanName,
            sort_order,
            description,
          };
        }).sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
      }
    }
  } catch (err) {
    console.warn("Failed to fetch department details from Supabase, using defaults:", err);
  }

  // Fallback to defaults merged with metaFallback
  return DEFAULT_DEPARTMENTS.map((name, idx) => {
    const defaultInfo = DEFAULT_DEPARTMENT_DETAILS[name];
    const meta = metaFallback[name];
    return {
      name,
      sort_order: meta?.sort_order ?? defaultInfo?.sort_order ?? idx + 1,
      description: meta?.description || defaultInfo?.description || `Specialized engineering and operational domain for ${name}.`,
    };
  }).sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
}

export async function getDepartments(): Promise<string[]> {
  const details = await getDepartmentDetails();
  return details.map(d => d.name);
}

export async function saveDepartment(
  name: string,
  sortOrder: number = 0,
  description: string = ""
): Promise<string[]> {
  const cleanName = name.trim().toUpperCase();
  if (!cleanName) return getDepartments();

  // Save to meta fallback
  const metaFallback = await readMetaFallback();
  metaFallback[cleanName] = {
    sort_order: sortOrder,
    description: description.trim(),
  };
  await writeMetaFallback(metaFallback);

  try {
    const client = await getClient();
    // Try to insert with sort_order and description
    const { error } = await client
      .from("departments")
      .insert({
        name: cleanName,
        sort_order: sortOrder,
        description: description.trim(),
      });

    if (error) {
      if (isColumnMissingError(error)) {
        // Columns don't exist yet -> insert name only
        const { error: nameErr } = await client.from("departments").insert({ name: cleanName });
        if (nameErr && nameErr.code !== "23505") {
          console.warn("departments name insert:", nameErr.message);
        }
      } else if (error.code !== "23505") {
        console.warn("departments insert warning:", error.message);
      }
    }
  } catch (err) {
    console.warn("Error saving department:", err);
  }

  return getDepartments();
}

export async function updateDepartmentDetails(
  name: string,
  sortOrder: number,
  description: string
): Promise<void> {
  const cleanName = name.trim().toUpperCase();
  if (!cleanName) return;

  // Always update meta fallback for immediate durability
  const metaFallback = await readMetaFallback();
  metaFallback[cleanName] = {
    sort_order: sortOrder,
    description: description.trim(),
  };
  await writeMetaFallback(metaFallback);

  try {
    const client = await getClient();
    const { error } = await client
      .from("departments")
      .update({
        sort_order: sortOrder,
        description: description.trim(),
      })
      .ilike("name", cleanName);

    if (error) {
      if (isColumnMissingError(error)) {
        console.info(`Domain [${cleanName}] metadata saved locally (Supabase columns pending migration).`);
      } else {
        console.warn("Failed to update department details in Supabase:", error.message);
      }
    }
  } catch (err) {
    console.warn("Error updating department details:", err);
  }
}

export async function removeDepartment(name: string): Promise<string[]> {
  const cleanName = name.trim().toUpperCase();
  if (!cleanName) return getDepartments();

  const metaFallback = await readMetaFallback();
  delete metaFallback[cleanName];
  await writeMetaFallback(metaFallback);

  try {
    const client = await getClient();
    const { error } = await client
      .from("departments")
      .delete()
      .ilike("name", cleanName);

    if (error) {
      console.warn("Failed to delete department from Supabase:", error.message);
    }
  } catch (err) {
    console.warn("Error removing department:", err);
  }

  return getDepartments();
}
