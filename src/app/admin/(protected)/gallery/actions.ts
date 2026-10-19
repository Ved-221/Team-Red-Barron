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
  const directUrl = ((formData.get("image_direct_url") as string) || "").trim();
  let image_url = directUrl;

  if (file && file.size > 0) {
    const newUrl = await uploadImage(file, "gallery");
    if (newUrl) image_url = newUrl;
  }

  // Auto-arrange sort order
  const { data: existingToShift, error: shiftFetchErr } = await supabase
    .from("gallery_images")
    .select("id, sort_order")
    .is("deleted_at", null)
    .gte("sort_order", sort_order)
    .order("sort_order", { ascending: false });

  if (shiftFetchErr) {
    console.error("Failed to fetch gallery images to shift:", shiftFetchErr);
    throw new Error(shiftFetchErr.message);
  }

  if (existingToShift && existingToShift.length > 0) {
    for (const g of existingToShift) {
      const { error: updErr } = await supabase
        .from("gallery_images")
        .update({ sort_order: g.sort_order + 1 })
        .eq("id", g.id);
      if (updErr) {
        console.error("Failed to update shifted gallery sort order:", updErr);
        throw new Error(updErr.message);
      }
    }
  }

  const { error } = await supabase.from("gallery_images").insert({
    title, category, sort_order, image_url
  });

  if (error) {
    console.error("Failed to add gallery image:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function updateGalleryImage(id: string, formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const sort_order = parseInt(formData.get("sort_order") as string || "0", 10);
  
  const file = formData.get("image") as File;
  const directUrl = ((formData.get("image_direct_url") as string) || "").trim();
  const imageRemoved = formData.get("image_removed") === "true";

  // Fetch actual existing image URL directly from database row
  const { data: currentRecord, error: fetchError } = await supabase
    .from("gallery_images")
    .select("image_url")
    .eq("id", id)
    .single();

  if (fetchError || !currentRecord) {
    throw new Error(fetchError?.message ?? "Gallery image not found");
  }

  const realExistingUrl = currentRecord.image_url || "";
  let finalImageUrl = realExistingUrl;

  if (file && file.size > 0) {
    const newUrl = await uploadImage(file, "gallery");
    if (newUrl) finalImageUrl = newUrl;
  } else if (imageRemoved) {
    finalImageUrl = "";
  } else if (directUrl && directUrl !== realExistingUrl) {
    finalImageUrl = directUrl;
  }

  const { data: updatedRows, error } = await supabase
    .from("gallery_images")
    .update({
      title, category, sort_order, image_url: finalImageUrl
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Failed to update gallery image:", error);
    throw new Error(error.message);
  }

  // Only delete old image if row was confirmed updated and storage URL actually changed
  if (updatedRows && updatedRows.length > 0 && realExistingUrl && realExistingUrl !== finalImageUrl && realExistingUrl.includes("supabase.co/storage")) {
    await deleteImage(realExistingUrl);
  }

  revalidatePath("/");
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
    
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}
