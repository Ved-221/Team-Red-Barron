"use server";

import { createClient } from "@/lib/supabase/server";
import { uploadImage, deleteImage } from "@/lib/upload";
import { revalidatePath } from "next/cache";

export async function addSponsorTier(formData: FormData) {
  const supabase = await createClient();
  const tier_name = formData.get("tier_name") as string;
  const sort_order = parseInt(formData.get("sort_order") as string || "0", 10);

  if (tier_name) {
    await supabase.from("sponsor_tiers").insert({ tier_name, sort_order });
  }
  
  revalidatePath("/");
  revalidatePath("/sponsors");
  revalidatePath("/admin/sponsors");
}

export async function updateSponsorTier(id: string, formData: FormData) {
  const supabase = await createClient();
  const tier_name = formData.get("tier_name") as string;
  const sort_order = parseInt(formData.get("sort_order") as string || "0", 10);

  if (tier_name) {
    await supabase.from("sponsor_tiers").update({ tier_name, sort_order }).eq("id", id);
  }
  
  revalidatePath("/");
  revalidatePath("/sponsors");
  revalidatePath("/admin/sponsors");
}

export async function deleteSponsorTier(id: string) {
  const supabase = await createClient();
  const batchId = crypto.randomUUID();
  
  // Soft delete the tier
  await supabase
    .from("sponsor_tiers")
    .update({ deleted_at: new Date().toISOString(), deleted_batch_id: batchId })
    .eq("id", id);
    
  // Cascade soft delete to all sponsors within this tier
  await supabase
    .from("sponsors")
    .update({ deleted_at: new Date().toISOString(), deleted_batch_id: batchId })
    .eq("tier_id", id);

  revalidatePath("/");
  revalidatePath("/sponsors");
  revalidatePath("/admin/sponsors");
}

export async function addSponsor(formData: FormData) {
  const supabase = await createClient();
  const tier_id = formData.get("tier_id") as string;
  const name = formData.get("name") as string;
  const website_url = formData.get("website_url") as string;
  const sort_order = parseInt(formData.get("sort_order") as string || "0", 10);
  
  const file = formData.get("logo") as File;
  let logo_url = "";

  if (file && file.size > 0) {
    const newUrl = await uploadImage(file, "sponsors");
    if (newUrl) logo_url = newUrl;
  }

  await supabase.from("sponsors").insert({
    tier_id, name, website_url, sort_order, logo_url
  });

  revalidatePath("/");
  revalidatePath("/sponsors");
  revalidatePath("/admin/sponsors");
}

export async function updateSponsor(id: string, formData: FormData) {
  const supabase = await createClient();
  const tier_id = formData.get("tier_id") as string;
  const name = formData.get("name") as string;
  const website_url = formData.get("website_url") as string;
  const sort_order = parseInt(formData.get("sort_order") as string || "0", 10);
  
  const file = formData.get("logo") as File;
  const existingLogoUrl = formData.get("logo_existing") as string;
  const logoRemoved = formData.get("logo_removed") === "true";

  let finalLogoUrl = existingLogoUrl;

  if (file && file.size > 0) {
    const newUrl = await uploadImage(file, "sponsors");
    if (newUrl) {
      finalLogoUrl = newUrl;
      if (existingLogoUrl) await deleteImage(existingLogoUrl);
    }
  } else if (logoRemoved) {
    finalLogoUrl = "";
    if (existingLogoUrl) await deleteImage(existingLogoUrl);
  }

  await supabase.from("sponsors").update({
    tier_id, name, website_url, sort_order, logo_url: finalLogoUrl
  }).eq("id", id);

  revalidatePath("/");
  revalidatePath("/sponsors");
  revalidatePath("/admin/sponsors");
}

export async function deleteSponsor(id: string, logoUrl: string) {
  const supabase = await createClient();
  // Do NOT delete the image from storage on soft-delete
  await supabase
    .from("sponsors")
    .update({ deleted_at: new Date().toISOString(), deleted_batch_id: crypto.randomUUID() })
    .eq("id", id);
    
  revalidatePath("/");
  revalidatePath("/sponsors");
  revalidatePath("/admin/sponsors");
}
