import { supabase } from "@/lib/supabase";
import SponsorsClient from "./SponsorsClient";
import { getTestimonials } from "@/lib/testimonials";
import { Metadata } from "next";
import { getSharedChromeData } from "@/lib/server-data";

export const revalidate = 3600; // 1-hour ISR cache

export const metadata: Metadata = {
  title: "Sponsors & Partners",
  description: "Explore the strategic industry partners and sponsors empowering Team Red Baron's BAJA SAE racing and engineering development.",
  alternates: {
    canonical: "/sponsors",
  },
};

export default async function SponsorsPage() {
  const [sponsorTiersRes, testimonials, settingsRes, chromeData] = await Promise.all([
    supabase
      .from("sponsor_tiers")
      .select(`
        id,
        tier_name,
        sort_order,
        sponsors (
          id,
          tier_id,
          name,
          logo_url,
          website_url,
          sort_order,
          deleted_at
        )
      `)
      .is("deleted_at", null)
      .is("sponsors.deleted_at", null)
      .order("sort_order", { ascending: true })
      .order("sort_order", { foreignTable: "sponsors", ascending: true }),
    getTestimonials(),
    supabase
      .from("site_settings")
      .select("sponsors_bg_url")
      .eq("id", 1)
      .maybeSingle(),
    getSharedChromeData(),
  ]);

  const cleanedTiers = (sponsorTiersRes.data || []).map((tier) => ({
    ...tier,
    sponsors: (tier.sponsors || []).filter((s: { deleted_at?: string | null }) => !s.deleted_at),
  }));

  return (
    <SponsorsClient
      sponsorTiers={cleanedTiers}
      testimonials={testimonials}
      heroBgUrl={settingsRes.data?.sponsors_bg_url || "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/hero/IMG_4588.png"}
      chromeData={chromeData}
    />
  );
}

