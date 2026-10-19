import { createClient } from "./supabase/server";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_DOC_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function uploadImage(file: File, folder: string): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const rawExt = file.name ? file.name.split('.').pop() : 'jpg';
  const cleanExt = (rawExt || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const isDoc = cleanExt === 'pdf' || file.type === 'application/pdf' || folder === 'brochures';
  const maxBytes = isDoc ? MAX_DOC_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
  const maxLabel = isDoc ? '10 MB' : '5 MB';

  if (file.size > maxBytes) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(`Upload rejected: "${file.name}" (${sizeMb} MB) exceeds the maximum allowed size of ${maxLabel}.`);
  }

  try {
    const supabase = await createClient();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${cleanExt}`;
    const filePath = `${folder}/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error } = await supabase.storage
      .from('trb-media')
      .upload(filePath, buffer, {
        contentType: file.type || (cleanExt === 'pdf' ? 'application/pdf' : cleanExt === 'png' ? 'image/png' : cleanExt === 'webp' ? 'image/webp' : 'image/jpeg'),
        cacheControl: '31536000',
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

