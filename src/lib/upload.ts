import { createClient } from "./supabase/server";

export async function uploadImage(file: File, folder: string): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const supabase = await createClient();
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from('trb-media')
    .upload(filePath, file);

  if (error) {
    console.error("Upload error:", error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from('trb-media')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

export async function deleteImage(url: string) {
  if (!url) return;

  const supabase = await createClient();
  // Extract path from public URL
  // e.g., https://.../storage/v1/object/public/trb-media/folder/file.jpg
  const bucketPrefix = "/storage/v1/object/public/trb-media/";
  if (url.includes(bucketPrefix)) {
    const filePath = url.split(bucketPrefix)[1];
    if (filePath) {
      await supabase.storage.from('trb-media').remove([filePath]);
    }
  }
}
