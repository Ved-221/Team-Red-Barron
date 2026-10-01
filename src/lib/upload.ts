import { createClient } from "./supabase/server";

export async function uploadImage(file: File, folder: string): Promise<string | null> {
  if (!file || file.size === 0) return null;

  try {
    const supabase = await createClient();
    const rawExt = file.name ? file.name.split('.').pop() : 'jpg';
    const cleanExt = (rawExt || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${cleanExt}`;
    const filePath = `${folder}/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error } = await supabase.storage
      .from('trb-media')
      .upload(filePath, buffer, {
        contentType: file.type || (cleanExt === 'png' ? 'image/png' : cleanExt === 'webp' ? 'image/webp' : 'image/jpeg'),
        upsert: true
      });

    if (error) {
      console.error("Supabase Storage Upload Error:", error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from('trb-media')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("Failed to upload image to Supabase Storage:", err);
    throw err;
  }
}

export async function deleteImage(url: string) {
  if (!url) return;

  try {
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
  } catch (err) {
    console.warn("deleteImage warning:", err);
  }
}

