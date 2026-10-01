"use server";

import { createClient } from "@/lib/supabase/server";
import { uploadImage, deleteImage } from "@/lib/upload";
import { revalidatePath } from "next/cache";

export async function updateAboutContent(formData: FormData) {
  const supabase = await createClient();
  
  const intro_headline = formData.get("intro_headline") as string;
  const intro_summary = formData.get("intro_summary") as string;
  const main_body_text = formData.get("main_body_text") as string;
  const vision_text = formData.get("vision_text") as string;
  const mission_text = formData.get("mission_text") as string;
  const team_photo_caption = formData.get("team_photo_caption") as string;

  const file = formData.get("team_photo") as File;
  const directUrl = ((formData.get("team_photo_direct_url") as string) || "").trim();
  const existingImageUrl = (formData.get("team_photo_existing") as string) || "";
  const imageRemoved = formData.get("team_photo_removed") === "true";

  let finalImageUrl = existingImageUrl;

  if (file && file.size > 0) {
    const newUrl = await uploadImage(file, "team");
    if (newUrl) {
      finalImageUrl = newUrl;
      // Delete old image
      if (existingImageUrl && existingImageUrl !== newUrl) await deleteImage(existingImageUrl);
    }
  } else if (directUrl && directUrl !== existingImageUrl) {
    finalImageUrl = directUrl;
  } else if (imageRemoved) {
    finalImageUrl = "";
    if (existingImageUrl) await deleteImage(existingImageUrl);
  }

  const stats_cards = Array.from({ length: 4 }).map((_, i) => ({
    label: formData.get(`stat${i + 1}_label`) as string,
    value: formData.get(`stat${i + 1}_value`) as string,
    note: formData.get(`stat${i + 1}_note`) as string,
  }));

  await supabase.from("about_content").update({
    intro_headline,
    intro_summary,
    main_body_text,
    vision_text,
    mission_text,
    team_photo_caption,
    team_photo_url: finalImageUrl,
    stats_cards
  }).eq("id", 1);

  revalidatePath("/about");
  revalidatePath("/admin/about");
}
