import { supabase } from "@/lib/supabase";
import SponsorsClient from "./SponsorsClient";
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
    .order("sort_order", { ascending: true })
    .order("sort_order", { foreignTable: "sponsors", ascending: true });

  const { data: featuredPartnersData } = await supabase
    .from("featured_partners")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <SponsorsClient
      sponsorTiers={sponsorTiersData || []}
      featuredPartners={featuredPartnersData || []}
    />
  );
}
