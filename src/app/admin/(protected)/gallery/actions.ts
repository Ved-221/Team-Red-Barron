"use server";

import { createClient } from "@/lib/supabase/server";
import { uploadImage, deleteImage } from "@/lib/upload";
import { revalidatePath } from "next/cache";

export async function addGalleryImage(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const sort_order = parseInt(formData.get("sort_order") as string || "0", 10);
  
  const file = formData.get("image") as File;
  let image_url = "";

  if (file && file.size > 0) {
    const newUrl = await uploadImage(file, "gallery");
    if (newUrl) image_url = newUrl;
  }

  await supabase.from("gallery_images").insert({
    title, category, sort_order, image_url
  });

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function updateGalleryImage(id: string, formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const sort_order = parseInt(formData.get("sort_order") as string || "0", 10);
  
  const file = formData.get("image") as File;
  const existingImageUrl = formData.get("image_existing") as string;
  const imageRemoved = formData.get("image_removed") === "true";

  let finalImageUrl = existingImageUrl;

  if (file && file.size > 0) {
    const newUrl = await uploadImage(file, "gallery");
    if (newUrl) {
      finalImageUrl = newUrl;
      if (existingImageUrl) await deleteImage(existingImageUrl);
    }
  } else if (imageRemoved) {
    finalImageUrl = "";
    if (existingImageUrl) await deleteImage(existingImageUrl);
  }

  await supabase.from("gallery_images").update({
    title, category, sort_order, image_url: finalImageUrl
  }).eq("id", id);

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function deleteGalleryImage(id: string, imageUrl: string) {
  const supabase = await createClient();
  // Do NOT delete the image from storage on soft-delete
  await supabase
    .from("gallery_images")
    .update({ deleted_at: new Date().toISOString(), deleted_batch_id: crypto.randomUUID() })
    .eq("id", id);
    
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}
