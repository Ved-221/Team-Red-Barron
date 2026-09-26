"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateContactInfo(formData: FormData) {
  const supabase = await createClient();
  
  const email = formData.get("email") as string;
  const address = formData.get("address") as string;
  const instagram_url = formData.get("instagram_url") as string;
  const linkedin_url = formData.get("linkedin_url") as string;
  const youtube_url = formData.get("youtube_url") as string;
  const twitter_url = formData.get("twitter_url") as string;
  const managing_director_name = formData.get("managing_director_name") as string;
  const managing_director_email = formData.get("managing_director_email") as string;
  const marketing_director_name = formData.get("marketing_director_name") as string;
  const marketing_director_email = formData.get("marketing_director_email") as string;

  await supabase.from("contact_info").update({
    email,
    address,
    instagram_url,
    linkedin_url,
    youtube_url,
    twitter_url,
    managing_director_name,
    managing_director_email,
    marketing_director_name,
    marketing_director_email
  }).eq("id", 1);

  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/admin/contact");
}
