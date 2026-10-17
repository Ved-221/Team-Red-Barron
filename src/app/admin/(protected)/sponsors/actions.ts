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
  const directUrl = ((formData.get("logo_direct_url") as string) || "").trim();
  let logo_url = directUrl;

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
  const directUrl = ((formData.get("logo_direct_url") as string) || "").trim();
  const logoRemoved = formData.get("logo_removed") === "true";

  // Fetch actual existing logo URL directly from database row
  const { data: currentRecord, error: fetchError } = await supabase
    .from("sponsors")
    .select("logo_url")
    .eq("id", id)
    .single();

  if (fetchError || !currentRecord) {
    throw new Error(fetchError?.message ?? "Sponsor not found");
  }

  const realExistingUrl = currentRecord.logo_url || "";
  let finalLogoUrl = realExistingUrl;

  if (file && file.size > 0) {
    const newUrl = await uploadImage(file, "sponsors");
    if (newUrl) {
      finalLogoUrl = newUrl;
    }
  } else if (logoRemoved) {
    finalLogoUrl = directUrl || "";
  } else if (directUrl && directUrl !== realExistingUrl) {
    finalLogoUrl = directUrl;
  }

  const { data: updatedRows, error } = await supabase
    .from("sponsors")
    .update({
      tier_id, name, website_url, sort_order, logo_url: finalLogoUrl
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Failed to update sponsor:", error);
    throw new Error(error.message);
  }

  if (updatedRows && updatedRows.length > 0 && realExistingUrl && realExistingUrl !== finalLogoUrl && realExistingUrl.includes("supabase.co/storage")) {
    await deleteImage(realExistingUrl);
  }

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

export async function updateSponsorHeroBg(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("hero_bg") as File;
  const directUrl = ((formData.get("hero_bg_direct_url") as string) || "").trim();
  const imageRemoved = formData.get("hero_bg_removed") === "true";

  // Fetch actual existing background from site_settings row
  const { data: currentSetting, error: settingError } = await supabase
    .from("site_settings")
    .select("sponsors_bg_url")
    .eq("id", 1)
    .single();

  if (settingError || !currentSetting) {
    throw new Error(settingError?.message ?? "Site settings not found");
  }

  const realExistingUrl = currentSetting.sponsors_bg_url || "";
  let finalImageUrl = realExistingUrl;

  if (file && file.size > 0) {
    const newUrl = await uploadImage(file, "sponsors");
    if (newUrl) finalImageUrl = newUrl;
  } else if (imageRemoved) {
    finalImageUrl = "";
  } else if (directUrl && directUrl !== realExistingUrl) {
    finalImageUrl = directUrl;
  }

  const { data: updatedRows, error } = await supabase
    .from("site_settings")
    .update({
      sponsors_bg_url: finalImageUrl,
      updated_at: new Date().toISOString()
    })
    .eq("id", 1)
    .select();

  if (error) {
    console.error("Failed to update sponsor hero background:", error);
    throw new Error(error.message);
  }

  if (updatedRows && updatedRows.length > 0 && realExistingUrl && realExistingUrl !== finalImageUrl && realExistingUrl.includes("supabase.co/storage")) {
    await deleteImage(realExistingUrl);
  }

  revalidatePath("/sponsors");
  revalidatePath("/admin/sponsors");
}

export async function addSponsorTestimonial(formData: FormData) {
  const quote = (formData.get("quote") as string || "").trim();
  const name = (formData.get("name") as string || "").trim();
  const company = (formData.get("company") as string || "").trim();
  const tier = (formData.get("tier") as string || "").trim();
  const website_url = (formData.get("website_url") as string || "").trim();
  const sort_order = parseInt(formData.get("sort_order") as string || "0", 10);

  if (!quote || !company) {
    throw new Error("Quote and company name are required.");
  }

  const { saveTestimonial } = await import("@/lib/testimonials");
  await saveTestimonial({ quote, name, company, tier, website_url, sort_order });

  revalidatePath("/sponsors");
  revalidatePath("/admin/sponsors");
}

export async function updateSponsorTestimonial(id: string, formData: FormData) {
  const quote = (formData.get("quote") as string || "").trim();
  const name = (formData.get("name") as string || "").trim();
  const company = (formData.get("company") as string || "").trim();
  const tier = (formData.get("tier") as string || "").trim();
  const website_url = (formData.get("website_url") as string || "").trim();
  const sort_order = parseInt(formData.get("sort_order") as string || "0", 10);

  if (!quote || !company) {
    throw new Error("Quote and company name are required.");
  }

  const { saveTestimonial } = await import("@/lib/testimonials");
  await saveTestimonial({ id, quote, name, company, tier, website_url, sort_order });

  revalidatePath("/sponsors");
  revalidatePath("/admin/sponsors");
}

export async function deleteSponsorTestimonial(id: string) {
  const { removeTestimonial } = await import("@/lib/testimonials");
  await removeTestimonial(id);
  revalidatePath("/sponsors");
  revalidatePath("/admin/sponsors");
}

