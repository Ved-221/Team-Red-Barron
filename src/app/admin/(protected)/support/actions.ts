"use server";

import { createClient } from "@/lib/supabase/server";
import { uploadImage } from "@/lib/upload";
import { revalidatePath } from "next/cache";

export async function updateSupportSettings(formData: FormData) {
  const supabase = await createClient();

  const upi_id = ((formData.get("upi_id") as string) || "").trim();
  const qrDirectUrl = ((formData.get("qr_code_direct_url") as string) || "").trim();
  const qrFile = formData.get("qr_code_file") as File | null;

  const brochureDirectUrl = ((formData.get("brochure_direct_url") as string) || "").trim();
  const brochureFile = formData.get("brochure_file") as File | null;

  let finalQrUrl: string | undefined = qrDirectUrl || undefined;
  if (qrFile && qrFile.size > 0) {
    const uploadedQr = await uploadImage(qrFile, "support");
    if (uploadedQr) finalQrUrl = uploadedQr;
  }

  let finalBrochureUrl: string | undefined = brochureDirectUrl || undefined;
  if (brochureFile && brochureFile.size > 0) {
    const uploadedBrochure = await uploadImage(brochureFile, "brochures");
    if (uploadedBrochure) finalBrochureUrl = uploadedBrochure;
  }

  const updatePayload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (upi_id) {
    updatePayload.upi_id = upi_id;
  }
  if (finalQrUrl) {
    updatePayload.qr_code_url = finalQrUrl;
  }
  if (finalBrochureUrl) {
    updatePayload.brochure_url = finalBrochureUrl;
  }

  const { error } = await supabase
    .from("site_settings")
    .update(updatePayload)
    .eq("id", 1);

  if (error) {
    console.error("Failed to update support settings:", error);
    throw new Error(`Failed to update support settings: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/sponsors");
  revalidatePath("/admin/support");
}
