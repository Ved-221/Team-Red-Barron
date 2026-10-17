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

  // Auto-arrange order: shift all existing vehicles at or above this order by +1
  const { data: existingToShift, error: shiftFetchErr } = await supabase
    .from("vehicles")
    .select("id, timeline_order")
    .is("deleted_at", null)
    .gte("timeline_order", timeline_order)
    .order("timeline_order", { ascending: false });

  if (shiftFetchErr) throw new Error(shiftFetchErr.message);

  if (existingToShift && existingToShift.length > 0) {
    for (const v of existingToShift) {
      const { error: updErr } = await supabase
        .from("vehicles")
        .update({ timeline_order: v.timeline_order + 1 })
        .eq("id", v.id);
      if (updErr) throw new Error(updErr.message);
    }
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
  revalidatePath("/admin/home");
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
  const imageRemoved = formData.get("image_removed") === "true";

  // Check if order changed to auto-arrange only the affected range, and get existing image URL
  const { data: currentVehicle, error: fetchErr } = await supabase
    .from("vehicles")
    .select("timeline_order, image_url")
    .eq("id", id)
    .single();

  if (fetchErr) {
    throw new Error(`Failed to read vehicle: ${fetchErr.message}`);
  }

  const realExistingUrl = currentVehicle?.image_url || "";
  let finalImageUrl = realExistingUrl;
  if (file && file.size > 0) {
    const newUrl = await uploadImage(file, "vehicles");
    if (newUrl) finalImageUrl = newUrl;
  } else if (imageRemoved) {
    finalImageUrl = "";
  } else if (directUrl && directUrl !== realExistingUrl) {
    finalImageUrl = directUrl;
  }

  const oldOrder = currentVehicle?.timeline_order ?? 0;
  if (oldOrder !== timeline_order) {
    if (oldOrder > timeline_order) {
      // Moving up: shift rows in [timeline_order, oldOrder) upward by +1
      const { data: rangeToShift, error: rangeErr } = await supabase
        .from("vehicles")
        .select("id, timeline_order")
        .is("deleted_at", null)
        .neq("id", id)
        .gte("timeline_order", timeline_order)
        .lt("timeline_order", oldOrder)
        .order("timeline_order", { ascending: false });

      if (rangeErr) throw new Error(rangeErr.message);

      if (rangeToShift && rangeToShift.length > 0) {
        for (const v of rangeToShift) {
          const { error: updErr } = await supabase
            .from("vehicles")
            .update({ timeline_order: v.timeline_order + 1 })
            .eq("id", v.id);
          if (updErr) throw new Error(updErr.message);
        }
      }
    } else {
      // Moving down: shift rows in (oldOrder, timeline_order] downward by -1
      const { data: rangeToShift, error: rangeErr } = await supabase
        .from("vehicles")
        .select("id, timeline_order")
        .is("deleted_at", null)
        .neq("id", id)
        .gt("timeline_order", oldOrder)
        .lte("timeline_order", timeline_order)
        .order("timeline_order", { ascending: true });

      if (rangeErr) throw new Error(rangeErr.message);

      if (rangeToShift && rangeToShift.length > 0) {
        for (const v of rangeToShift) {
          const { error: updErr } = await supabase
            .from("vehicles")
            .update({ timeline_order: v.timeline_order - 1 })
            .eq("id", v.id);
          if (updErr) throw new Error(updErr.message);
        }
      }
    }
  }

  const { data: updatedRows, error } = await supabase.from("vehicles").update({
    year, vehicle_name, chassis_serial, subtitle, rank_text, badge_text,
    icon_key, description, status_badge, background_video_url, era_label, timeline_order,
    image_url: finalImageUrl
  }).eq("id", id).select("id");

  if (error) {
    console.error("Error updating vehicle:", error);
    throw new Error(error.message);
  }

  if (updatedRows && updatedRows.length > 0 && realExistingUrl && realExistingUrl !== finalImageUrl && realExistingUrl.includes("supabase.co/storage")) {
    await deleteImage(realExistingUrl);
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/timeline");
  revalidatePath("/admin/home");
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
  revalidatePath("/admin/home");
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
