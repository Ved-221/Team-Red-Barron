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
  "sponsors",
  "featured_partners"
];

async function purgeAssetsForRow(supabase: any, table: string, row: any) {
  if (!row) return;

  // Handle cascaded child table assets
  if (table === "team_years") {
    const { data: members } = await supabase
      .from("team_members")
      .select("image_url")
      .eq("team_year_id", row.id);
    if (members && members.length > 0) {
      for (const m of members) {
        if (m.image_url) await deleteImage(m.image_url);
      }
    }
  } else if (table === "sponsor_tiers") {
    const { data: sps } = await supabase
      .from("sponsors")
      .select("logo_url")
      .eq("tier_id", row.id);
    if (sps && sps.length > 0) {
      for (const s of sps) {
        if (s.logo_url) await deleteImage(s.logo_url);
      }
    }
  }

  // Scan all potential storage URL fields in the row
  const candidateKeys = [
    "image_url",
    "logo_url",
    "photo_url",
    "background_video_url",
    "background_image_url",
    "team_photo_url",
    "brochure_url",
    "qr_code_url",
    "sponsors_bg_url"
  ];

  for (const key of candidateKeys) {
    if (row[key] && typeof row[key] === "string" && row[key].length > 0) {
      await deleteImage(row[key]);
    }
  }
}

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

  for (const table of TABLES) {
    const { data: rows } = await supabase.from(table).select("*").eq("deleted_batch_id", batchId);
    if (rows && rows.length > 0) {
      for (const row of rows) {
        await purgeAssetsForRow(supabase, table, row);
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

  const { data: row } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
  if (row) {
    await purgeAssetsForRow(supabase, table, row);
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
        await purgeAssetsForRow(supabase, table, row);
      }
      const { error } = await supabase.from(table).delete().not("deleted_at", "is", null);
      if (error) {
        console.error(`Failed to empty trash for table ${table}:`, error);
      }
    }
  }

  revalidatePath("/", "layout");
}
