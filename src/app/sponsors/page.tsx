import { supabase } from "@/lib/supabase";
import SponsorsClient from "./SponsorsClient";
import { getTestimonials } from "@/lib/testimonials";
import { Metadata } from "next";

export const revalidate = 60; // Revalidate cache every 60 seconds

export const metadata: Metadata = {
  title: "Sponsors | Team Red Baron",
  description: "Our strategic industry partners and sponsors.",
};

export default async function SponsorsPage() {
  const { data: sponsorTiersData } = await supabase
    .from("sponsor_tiers")
    .select(`
      *,
      sponsors (*)
    `)
    .is("deleted_at", null)
    .is("sponsors.deleted_at", null)
    .order("sort_order", { ascending: true })
    .order("sort_order", { foreignTable: "sponsors", ascending: true });

  const cleanedTiers = (sponsorTiersData || []).map((tier: any) => ({
    ...tier,
    sponsors: (tier.sponsors || []).filter((s: any) => !s.deleted_at),
  }));

  const testimonials = await getTestimonials();

  const { data: settings } = await supabase
    .from("site_settings")
    .select("sponsors_bg_url")
    .eq("id", 1)
    .single();

  return (
    <SponsorsClient
      sponsorTiers={cleanedTiers}
      testimonials={testimonials}
      heroBgUrl={settings?.sponsors_bg_url || "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/hero/IMG_4588.png"}
    />
  );
}

