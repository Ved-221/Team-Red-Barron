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

  if (imageUrl) {
    await deleteImage(imageUrl);
  }

  await supabase.from(table).delete().eq("id", id);

  revalidatePath("/", "layout");
}
