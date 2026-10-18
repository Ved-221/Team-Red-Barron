"use server";

import { createClient } from "@/lib/supabase/server";
import { deleteImage } from "@/lib/upload";
import { revalidatePath } from "next/cache";

const TABLES = [
  "vehicles",
  "vehicle_specs",
  "team_photos",
  "team_years",
  "team_members",
  "gallery_images",
  "sponsor_tiers",
  "sponsors"
];

export async function restoreBatch(batchId: string) {
  const supabase = await createClient();

  if (!batchId) return;

  for (const table of TABLES) {
    await supabase
      .from(table)
      .update({ deleted_at: null, deleted_batch_id: null })
      .eq("deleted_batch_id", batchId);
  }

  revalidatePath("/", "layout");
}

export async function restoreItem(table: string, id: string) {
  const supabase = await createClient();

  await supabase
    .from(table)
    .update({ deleted_at: null, deleted_batch_id: null })
    .eq("id", id);

  revalidatePath("/", "layout");
}

export async function permanentlyDeleteBatch(batchId: string) {
  const supabase = await createClient();
  
  if (!batchId) return;

  // We must handle image deletions for specific tables
  for (const table of TABLES) {
    const { data: rows } = await supabase.from(table).select("*").eq("deleted_batch_id", batchId);
    if (rows && rows.length > 0) {
      for (const row of rows) {
        // Delete image if exists
        const imageUrl = row.image_url || row.logo_url;
        if (imageUrl) {
          await deleteImage(imageUrl);
        }
      }
      await supabase.from(table).delete().eq("deleted_batch_id", batchId);
    }
  }

  revalidatePath("/", "layout");
}

export async function permanentlyDeleteItem(table: string, id: string, imageUrl?: string) {
  const supabase = await createClient();

  let targetImageUrl = imageUrl;
  if (!targetImageUrl) {
    const { data: row } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
    if (row) {
      targetImageUrl = row.image_url || row.logo_url || row.photo_url;
    }
  }

  if (targetImageUrl) {
    await deleteImage(targetImageUrl);
  }

  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) {
    console.error(`Failed to permanently delete from ${table}:`, error);
    throw new Error(`Failed to delete record: ${error.message}`);
  }

  revalidatePath("/", "layout");
}

export async function emptyAllTrash() {
  const supabase = await createClient();

  for (const table of TABLES) {
    const { data: rows } = await supabase.from(table).select("*").not("deleted_at", "is", null);
    if (rows && rows.length > 0) {
      for (const row of rows) {
        const imageUrl = row.image_url || row.logo_url || row.photo_url;
        if (imageUrl) {
          await deleteImage(imageUrl);
        }
      }
      const { error } = await supabase.from(table).delete().not("deleted_at", "is", null);
      if (error) {
        console.error(`Failed to empty trash for table ${table}:`, error);
      }
    }
  }

  revalidatePath("/", "layout");
}
