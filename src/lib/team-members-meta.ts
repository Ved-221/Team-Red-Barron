import fs from "fs/promises";
import path from "path";

const MEMBERS_META_FILE = path.join(process.cwd(), "src", "data", "team_members_meta.json");

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
  try {
    const raw = await fs.readFile(MEMBERS_META_FILE, "utf-8");
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

export async function getMemberPosition(memberId: string): Promise<string> {
  if (!memberId) return "";
  const all = await getMemberPositions();
  return all[memberId] || "";
}

export async function saveMemberPosition(memberId: string, position: string): Promise<void> {
  if (!memberId) return;
  const all = await getMemberPositions();
  all[memberId] = (position || "").trim();
  try {
    await fs.mkdir(path.dirname(MEMBERS_META_FILE), { recursive: true });
    await fs.writeFile(MEMBERS_META_FILE, JSON.stringify(all, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write team_members_meta.json fallback:", err);
  }
}

export async function deleteMemberPosition(memberId: string): Promise<void> {
  if (!memberId) return;
  const all = await getMemberPositions();
  if (memberId in all) {
    delete all[memberId];
    try {
      await fs.writeFile(MEMBERS_META_FILE, JSON.stringify(all, null, 2), "utf-8");
    } catch (err) {
      console.warn("Could not update team_members_meta.json fallback on delete:", err);
    }
  }
}
