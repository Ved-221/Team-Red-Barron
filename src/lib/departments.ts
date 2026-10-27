import { createClient } from "@/lib/supabase/server";
import { supabase as staticClient } from "@/lib/supabase";

export const DEFAULT_DEPARTMENTS = [
  "TRANSMISSION",
  "ACCUMULATOR",
  "ELECTRIC POWERTRAIN",
  "ROLLCAGE",
  "VEHICLE DYNAMICS",
  "MECHANICAL POWERTRAIN",
];

async function getClient() {
  try {
    return await createClient();
  } catch {
    return staticClient;
  }
}

export async function getDepartments(): Promise<string[]> {
  try {
    const client = await getClient();
    const { data, error } = await client
      .from("departments")
      .select("name")
      .order("name", { ascending: true });

    if (!error && data && data.length > 0) {
      return Array.from(
        new Set(
          data
            .map((row: { name: string }) => row.name.trim().toUpperCase())
            .filter(Boolean)
        )
      );
    }
  } catch (err) {
    console.warn("Failed to fetch departments from Supabase, using defaults:", err);
  }
  return [...DEFAULT_DEPARTMENTS];
}

export async function saveDepartment(name: string): Promise<string[]> {
  const cleanName = name.trim().toUpperCase();
  if (!cleanName) return getDepartments();

  try {
    const client = await getClient();
    const { error } = await client
      .from("departments")
      .insert({ name: cleanName });

    // 23505 is PostgreSQL unique_violation (domain already exists)
    if (error && error.code !== "23505") {
      console.error("Failed to insert department into Supabase:", error);
      throw new Error(`Failed to save domain: ${error.message}`);
    }
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("Failed to save domain:")) {
      throw err;
    }
    console.error("Error saving department:", err);
  }

  return getDepartments();
}

export async function removeDepartment(name: string): Promise<string[]> {
  const cleanName = name.trim().toUpperCase();
  if (!cleanName) return getDepartments();

  try {
    const client = await getClient();
    const { error } = await client
      .from("departments")
      .delete()
      .ilike("name", cleanName);

    if (error) {
      console.error("Failed to delete department from Supabase:", error);
      throw new Error(`Failed to delete domain: ${error.message}`);
    }
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("Failed to delete domain:")) {
      throw err;
    }
    console.error("Error removing department:", err);
  }

  return getDepartments();
}
