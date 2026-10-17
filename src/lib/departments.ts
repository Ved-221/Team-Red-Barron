import fs from "fs/promises";
import path from "path";

export const DEFAULT_DEPARTMENTS = [
  "TRANSMISSION",
  "ACCUMULATOR",
  "ELECTRIC POWERTRAIN",
  "ROLLCAGE",
  "VEHICLE DYNAMICS",
  "MECHANICAL POWERTRAIN"
];

const DEPARTMENTS_FILE = path.join(process.cwd(), "src", "data", "departments.json");

export async function getDepartments(): Promise<string[]> {
  try {
    const raw = await fs.readFile(DEPARTMENTS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure all uppercase and trimmed
      return Array.from(new Set(parsed.map((d: any) => String(d).trim().toUpperCase()).filter(Boolean)));
    }
  } catch (err) {
    // If file doesn't exist, return defaults
  }
  return [...DEFAULT_DEPARTMENTS];
}

export async function saveDepartment(name: string): Promise<string[]> {
  const cleanName = name.trim().toUpperCase();
  if (!cleanName) return getDepartments();

  const current = await getDepartments();
  if (!current.includes(cleanName)) {
    current.push(cleanName);
    await fs.mkdir(path.dirname(DEPARTMENTS_FILE), { recursive: true });
    await fs.writeFile(DEPARTMENTS_FILE, JSON.stringify(current, null, 2), "utf-8");
  }
  return current;
}

export async function removeDepartment(name: string): Promise<string[]> {
  const cleanName = name.trim().toUpperCase();
  const current = await getDepartments();
  const filtered = current.filter(d => d !== cleanName);
  await fs.mkdir(path.dirname(DEPARTMENTS_FILE), { recursive: true });
  await fs.writeFile(DEPARTMENTS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  return filtered;
}
