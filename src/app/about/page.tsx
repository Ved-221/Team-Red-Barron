import { supabase } from "@/lib/supabase";
import AboutClient from "./AboutClient";
import { Metadata } from "next";

import { getSharedChromeData } from "@/lib/server-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About Us | PCCOE Motorsport",
  description:
    "Learn about Team Red Baron (PCCOE Pune), premier collegiate offroad ATV racing team. 12+ years of untamed endurance, in-house engineering, and podium victories.",
  alternates: {
    canonical: "/about",
  },
};

export default async function AboutPage() {
  const [chrome, { data: aboutData }, { data: vehicles }] = await Promise.all([
    getSharedChromeData(),
    supabase
      .from("about_content")
      .select("id, intro_headline, intro_summary, main_body_text, vision_text, mission_text, team_photo_url, team_photo_caption")
      .eq("id", 1)
      .maybeSingle(),
    supabase
      .from("vehicles")
      .select(`
        id, year, vehicle_name, rank_text, subtitle, badge_text, icon_key, image_url, description, timeline_order,
        vehicle_specs (label, value, sort_order)
      `)
      .order("timeline_order", { ascending: true })
      .order("sort_order", { foreignTable: "vehicle_specs", ascending: true }),
  ]);

  const formattedVehicles = (vehicles || []).map((v) => ({
    year: v.year,
    vehicleName: v.vehicle_name,
    rank: v.rank_text,
    subtitle: v.subtitle,
    badge: v.badge_text,
    icon: v.icon_key || "Trophy",
    imageSrc: v.image_url,
    description: v.description,
    specs: (v.vehicle_specs || []).map((s: { label: string; value: string }) => ({
      label: s.label,
      val: s.value,
    })),
  }));

  return <AboutClient aboutData={aboutData} vehiclesData={formattedVehicles} chromeData={chrome} />;
}
