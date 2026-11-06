import { supabase } from "@/lib/supabase";
import SponsorsClient from "./SponsorsClient";
import { getTestimonials } from "@/lib/testimonials";
import { Metadata } from "next";
import { getSharedChromeData } from "@/lib/server-data";
import { toLocalMediaUrl } from "@/lib/media";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    sponsors: (tier.sponsors || [])
      .filter((s: { deleted_at?: string | null }) => !s.deleted_at)
      .map((s: { id: string; tier_id: string; name: string; logo_url: string; website_url?: string; sort_order: number }) => ({
        ...s,
        logo_url: toLocalMediaUrl(s.logo_url),
      })),
  }));

  const heroBg = toLocalMediaUrl(settingsRes.data?.sponsors_bg_url) || "/images/sponsors_hero_bg.webp";

  return (
    <SponsorsClient
      sponsorTiers={cleanedTiers}
      testimonials={testimonials}
      heroBgUrl={heroBg}
      chromeData={chromeData}
    />
  );
}

