"use server";

import { createClient } from "@/lib/supabase/server";
import { uploadImage, deleteImage } from "@/lib/upload";
import { revalidatePath } from "next/cache";

export async function addTeamPhoto(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("image") as File;
  const directUrl = ((formData.get("image_direct_url") as string) || "").trim();
  const caption = formData.get("caption") as string;
  const sort_order = parseInt(formData.get("sort_order") as string || "0", 10);

  let imageUrl = directUrl;
  if (file && file.size > 0) {
    const uploadedUrl = await uploadImage(file, "team-photos");
    if (uploadedUrl) imageUrl = uploadedUrl;
  }

  if (imageUrl) {
    await supabase.from("team_photos").insert({
      image_url: imageUrl,
      caption,
      sort_order
    });
  }
  
  revalidatePath("/");
  revalidatePath("/admin/off-the-map");
}

export async function updateTeamPhoto(id: string, formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("image") as File;
  const directUrl = ((formData.get("image_direct_url") as string) || "").trim();
  const caption = formData.get("caption") as string;
  const sort_order = parseInt(formData.get("sort_order") as string || "0", 10);
  const existingImageUrl = (formData.get("image_existing") as string) || "";
  const imageRemoved = formData.get("image_removed") === "true";

  let finalImageUrl = existingImageUrl;

  if (file && file.size > 0) {
    const newUrl = await uploadImage(file, "team-photos");
    if (newUrl) finalImageUrl = newUrl;
  } else if (directUrl && directUrl !== existingImageUrl) {
    finalImageUrl = directUrl;
  } else if (imageRemoved) {
    finalImageUrl = "";
  }

  const { error } = await supabase.from("team_photos").update({
    image_url: finalImageUrl,
    caption,
    sort_order
  }).eq("id", id);

  if (error) {
    console.error("Failed to update team photo:", error);
    throw new Error(error.message);
  }

  if (existingImageUrl && existingImageUrl !== finalImageUrl) {
    await deleteImage(existingImageUrl);
  }

  revalidatePath("/");
  revalidatePath("/admin/off-the-map");
}

export async function deleteTeamPhoto(id: string, imageUrl: string) {
  const supabase = await createClient();
  // Do NOT delete the image from storage on soft-delete
  await supabase
    .from("team_photos")
    .update({ deleted_at: new Date().toISOString(), deleted_batch_id: crypto.randomUUID() })
    .eq("id", id);
  
  revalidatePath("/");
  revalidatePath("/admin/off-the-map");
}
