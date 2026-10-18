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
        contentType: file.type || (cleanExt === 'pdf' ? 'application/pdf' : cleanExt === 'png' ? 'image/png' : cleanExt === 'webp' ? 'image/webp' : 'image/jpeg'),
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
    const bucketPrefix = "/storage/v1/object/public/trb-media/";
    let filePath = "";

    if (url.includes(bucketPrefix)) {
      filePath = url.split(bucketPrefix)[1];
    } else if (url.startsWith("trb-media/")) {
      filePath = url.replace("trb-media/", "");
    } else if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("/")) {
      filePath = url;
    }

    if (filePath) {
      filePath = decodeURIComponent(filePath.split("?")[0].trim());
      const { error } = await supabase.storage.from("trb-media").remove([filePath]);
      if (error) {
        console.warn(`deleteImage warning for [${filePath}]:`, error.message);
      }
    }
  } catch (err) {
    console.warn("deleteImage exception:", err);
  }
}

