"use server";

import { createClient } from "@/lib/supabase/server";
import { uploadImage, deleteImage } from "@/lib/upload";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addVehicle(formData: FormData) {
  const supabase = await createClient();
  
  const year = formData.get("year") as string;
  const vehicle_name = formData.get("vehicle_name") as string;
  const chassis_serial = formData.get("chassis_serial") as string;
  const subtitle = formData.get("subtitle") as string;
  const rank_text = formData.get("rank_text") as string;
  const badge_text = formData.get("badge_text") as string;
  const icon_key = formData.get("icon_key") as string;
  const description = formData.get("description") as string;
  const status_badge = formData.get("status_badge") as string;
  const background_video_url = formData.get("background_video_url") as string;
  const era_label = formData.get("era_label") as string || "MODERN ERA";
  const timeline_order = parseInt(formData.get("timeline_order") as string || "0", 10);

  const file = formData.get("image") as File;
  const directUrl = ((formData.get("image_direct_url") as string) || "").trim();
  let image_url = directUrl;

  if (file && file.size > 0) {
    const newUrl = await uploadImage(file, "vehicles");
    if (newUrl) image_url = newUrl;
  }

  const { error } = await supabase.from("vehicles").insert({
    year, vehicle_name, chassis_serial, subtitle, rank_text, badge_text,
    icon_key, description, status_badge, background_video_url, era_label, timeline_order,
    image_url
  });

  if (error) {
    console.error("Error creating vehicle:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/timeline");
  redirect("/admin/timeline");
}

export async function updateVehicle(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const year = formData.get("year") as string;
  const vehicle_name = formData.get("vehicle_name") as string;
  const chassis_serial = formData.get("chassis_serial") as string;
  const subtitle = formData.get("subtitle") as string;
  const rank_text = formData.get("rank_text") as string;
  const badge_text = formData.get("badge_text") as string;
  const icon_key = formData.get("icon_key") as string;
  const description = formData.get("description") as string;
  const status_badge = formData.get("status_badge") as string;
  const background_video_url = formData.get("background_video_url") as string;
  const era_label = formData.get("era_label") as string || "MODERN ERA";
  const timeline_order = parseInt(formData.get("timeline_order") as string || "0", 10);

  const file = formData.get("image") as File;
  const directUrl = ((formData.get("image_direct_url") as string) || "").trim();
  const existingImageUrl = (formData.get("image_existing") as string) || "";
  const imageRemoved = formData.get("image_removed") === "true";

  let finalImageUrl = existingImageUrl;
  if (file && file.size > 0) {
    const newUrl = await uploadImage(file, "vehicles");
    if (newUrl) {
      finalImageUrl = newUrl;
      if (existingImageUrl && existingImageUrl !== newUrl) await deleteImage(existingImageUrl);
    }
  } else if (directUrl && directUrl !== existingImageUrl) {
    finalImageUrl = directUrl;
  } else if (imageRemoved) {
    finalImageUrl = "";
    if (existingImageUrl) await deleteImage(existingImageUrl);
  }

  const { error } = await supabase.from("vehicles").update({
    year, vehicle_name, chassis_serial, subtitle, rank_text, badge_text,
    icon_key, description, status_badge, background_video_url, era_label, timeline_order,
    image_url: finalImageUrl
  }).eq("id", id);

  if (error) {
    console.error("Error updating vehicle:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/timeline");
  redirect("/admin/timeline");
}

export async function deleteVehicle(id: string, imageUrl: string) {
  const supabase = await createClient();
  const batchId = crypto.randomUUID();
  
  // Soft delete the vehicle
  await supabase
    .from("vehicles")
    .update({ deleted_at: new Date().toISOString(), deleted_batch_id: batchId })
    .eq("id", id);
    
  // Cascade soft delete to vehicle specs
  await supabase
    .from("vehicle_specs")
    .update({ deleted_at: new Date().toISOString(), deleted_batch_id: batchId })
    .eq("vehicle_id", id);

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/timeline");
}

export async function updateSpecs(vehicleId: string, specs: { id?: string, label: string, value: string, sort_order: number }[]) {
  const supabase = await createClient();
  
  // To keep it simple, we soft delete old specs instead of hard deleting
  await supabase
    .from("vehicle_specs")
    .update({ deleted_at: new Date().toISOString(), deleted_batch_id: crypto.randomUUID() })
    .eq("vehicle_id", vehicleId)
    .is("deleted_at", null);

  const newSpecs = specs.map(s => ({
    vehicle_id: vehicleId,
    label: s.label,
    value: s.value,
    sort_order: s.sort_order
  }));

  if (newSpecs.length > 0) {
    await supabase.from("vehicle_specs").insert(newSpecs);
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/timeline");
}
