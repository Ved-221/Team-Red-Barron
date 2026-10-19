import { supabase } from "@/lib/supabase";

export interface SharedContactInfo {
  email: string | null;
  address: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  twitter_url: string | null;
  managing_director_name?: string | null;
  managing_director_email?: string | null;
  managing_director_phone?: string | null;
  marketing_director_name?: string | null;
  marketing_director_email?: string | null;
  marketing_director_phone?: string | null;
}

export interface SharedChromeData {
  teamYears: { id: string; year_label: string }[];
  contactInfo: SharedContactInfo | null;
  siteSettings: {
    upi_id?: string | null;
    qr_code_url?: string | null;
    brochure_url?: string | null;
  } | null;
}

export async function getSharedChromeData(): Promise<SharedChromeData> {
  const [yearsRes, contactRes, settingsRes] = await Promise.all([
    supabase
      .from("team_years")
      .select("id, year_label")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
    supabase
      .from("contact_info")
      .select("email, address, linkedin_url, instagram_url, youtube_url, twitter_url, managing_director_name, managing_director_email, managing_director_phone, marketing_director_name, marketing_director_email, marketing_director_phone")
      .eq("id", 1)
      .maybeSingle(),
    supabase
      .from("site_settings")
      .select("upi_id, qr_code_url, brochure_url")
      .eq("id", 1)
      .maybeSingle(),
  ]);

  return {
    teamYears: yearsRes.data || [],
    contactInfo: contactRes.data || null,
    siteSettings: settingsRes.data || null,
  };
}
