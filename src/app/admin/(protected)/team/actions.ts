"use server";

import { createClient } from "@/lib/supabase/server";
import { uploadImage, deleteImage } from "@/lib/upload";
import { revalidatePath } from "next/cache";

export async function addTeamYear(formData: FormData) {
  const supabase = await createClient();
  const year_label = formData.get("year_label") as string;
  const sort_order = parseInt(formData.get("sort_order") as string || "1", 10);

  if (year_label) {
    // Increment sort_order of existing years that are >= the new sort_order
    const { data: existingYears } = await supabase
      .from("team_years")
      .select("id, sort_order")
      .gte("sort_order", sort_order)
      .is("deleted_at", null);

    if (existingYears && existingYears.length > 0) {
      for (const year of existingYears) {
        await supabase
          .from("team_years")
          .update({ sort_order: year.sort_order + 1 })
          .eq("id", year.id);
      }
    }

    await supabase.from("team_years").insert({ year_label, sort_order });
  }
  
  revalidatePath("/team");
  revalidatePath("/admin/team");
}

export async function updateTeamYear(id: string, formData: FormData) {
  const supabase = await createClient();
  const year_label = formData.get("year_label") as string;
  const sort_order = parseInt(formData.get("sort_order") as string || "1", 10);

  if (year_label) {
    await supabase.from("team_years").update({ year_label, sort_order }).eq("id", id);
  }
  
  revalidatePath("/team");
  revalidatePath("/admin/team");
}

export async function deleteTeamYear(id: string) {
  const supabase = await createClient();
  const batchId = crypto.randomUUID();
  
  // Check if year has any members
  const { data: members, error: membersError } = await supabase
    .from("team_members")
    .select("id")
    .eq("team_year_id", id)
    .is("deleted_at", null)
    .limit(1);
    
  if (members && members.length > 0) {
    throw new Error("Cannot delete a team year that has members.");
  }
  
  // Get the current year label to append a suffix so the unique constraint is freed
  const { data: yearData } = await supabase.from("team_years").select("year_label").eq("id", id).single();
  const deletedLabel = yearData ? `${yearData.year_label}_deleted_${Date.now()}` : `deleted_${Date.now()}`;

  // Soft delete the team year
  await supabase
    .from("team_years")
    .update({ 
      deleted_at: new Date().toISOString(), 
      deleted_batch_id: batchId,
      year_label: deletedLabel 
    })
    .eq("id", id);

  revalidatePath("/team");
  revalidatePath("/admin/team");
}

export async function addTeamMember(formData: FormData) {
  const supabase = await createClient();
  const team_year_id = formData.get("team_year_id") as string;
  const name = formData.get("name") as string;
  const department = formData.get("department") as string;
  const linkedin_url = formData.get("linkedin_url") as string;
  const sort_order = parseInt(formData.get("sort_order") as string || "1", 10);
  
  const file = formData.get("image") as File;
  const directUrl = ((formData.get("image_direct_url") as string) || "").trim();
  let image_url = directUrl;

  if (file && file.size > 0) {
    const newUrl = await uploadImage(file, "team");
    if (newUrl) image_url = newUrl;
  }

  // Auto-increment sort orders for members in the same department and year
  const { data: existingMembers } = await supabase
    .from("team_members")
    .select("id, sort_order")
    .eq("team_year_id", team_year_id)
    .eq("department", department)
    .gte("sort_order", sort_order)
    .is("deleted_at", null);

  if (existingMembers && existingMembers.length > 0) {
    for (const m of existingMembers) {
      await supabase
        .from("team_members")
        .update({ sort_order: m.sort_order + 1 })
        .eq("id", m.id);
    }
  }

  await supabase.from("team_members").insert({
    team_year_id, name, department, linkedin_url, sort_order, image_url
  });

  revalidatePath("/team");
  revalidatePath("/admin/team");
}

export async function updateTeamMember(id: string, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const department = formData.get("department") as string;
  const linkedin_url = formData.get("linkedin_url") as string;
  const sort_order = parseInt(formData.get("sort_order") as string || "1", 10);
  
  const file = formData.get("image") as File;
  const directUrl = ((formData.get("image_direct_url") as string) || "").trim();
  const existingImageUrl = (formData.get("image_existing") as string) || "";
  const imageRemoved = formData.get("image_removed") === "true";

  let finalImageUrl = existingImageUrl;

  if (file && file.size > 0) {
    const newUrl = await uploadImage(file, "team");
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

  await supabase.from("team_members").update({
    name, department, linkedin_url, sort_order, image_url: finalImageUrl
  }).eq("id", id);

  revalidatePath("/team");
  revalidatePath("/admin/team");
}

export async function deleteTeamMember(id: string, imageUrl: string) {
  const supabase = await createClient();
  // Do NOT delete the image from storage on soft-delete
  await supabase
    .from("team_members")
    .update({ deleted_at: new Date().toISOString(), deleted_batch_id: crypto.randomUUID() })
    .eq("id", id);
    
  revalidatePath("/team");
  revalidatePath("/admin/team");
}
