"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { saveAchievement, deleteAchievement } from "@/lib/achievements";

export async function updateHomeSettings(formData: FormData) {
  const supabase = await createClient();
  
  const hero_tagline = formData.get("hero_tagline") as string;
  const flagship_vehicle_id = formData.get("flagship_vehicle_id") as string;

  if (hero_tagline) {
    await supabase.from("site_settings").update({
      hero_tagline,
      ...(flagship_vehicle_id ? { flagship_vehicle_id } : {})
    }).eq("id", 1);
  }

  revalidatePath("/", "layout");
  revalidatePath("/", "page");
  revalidatePath("/");
  revalidatePath("/admin/home", "layout");
  revalidatePath("/admin/home", "page");
  revalidatePath("/admin/home");
}

export async function addAchievement(formData: FormData) {
  const value = (formData.get("value") as string || "").trim();
  const label = (formData.get("label") as string || "").trim();
  const detail = (formData.get("detail") as string || "").trim();
  const icon = (formData.get("icon") as string || "Trophy").trim();
  const sort_order = parseInt((formData.get("sort_order") as string) || "1", 10);

  if (value && label) {
    await saveAchievement({
      value,
      label,
      detail,
      icon,
      sort_order: isNaN(sort_order) ? 1 : sort_order,
    });
  }

  revalidatePath("/", "layout");
  revalidatePath("/", "page");
  revalidatePath("/");
  revalidatePath("/admin/home", "layout");
  revalidatePath("/admin/home", "page");
  revalidatePath("/admin/home");
}

export async function updateAchievement(id: string, formData: FormData) {
  const value = (formData.get("value") as string || "").trim();
  const label = (formData.get("label") as string || "").trim();
  const detail = (formData.get("detail") as string || "").trim();
  const icon = (formData.get("icon") as string || "Trophy").trim();
  const sort_order = parseInt((formData.get("sort_order") as string) || "1", 10);

  if (id && value && label) {
    await saveAchievement({
      id,
      value,
      label,
      detail,
      icon,
      sort_order: isNaN(sort_order) ? 1 : sort_order,
    });
  }

  revalidatePath("/", "layout");
  revalidatePath("/", "page");
  revalidatePath("/");
  revalidatePath("/admin/home", "layout");
  revalidatePath("/admin/home", "page");
  revalidatePath("/admin/home");
}

export async function deleteAchievementAction(id: string) {
  if (id) {
    await deleteAchievement(id);
  }

  revalidatePath("/", "layout");
  revalidatePath("/", "page");
  revalidatePath("/");
  revalidatePath("/admin/home", "layout");
  revalidatePath("/admin/home", "page");
  revalidatePath("/admin/home");
}
