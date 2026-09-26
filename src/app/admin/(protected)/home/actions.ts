"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

  revalidatePath("/");
  revalidatePath("/admin/home");
}
