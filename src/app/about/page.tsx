import { supabase } from "@/lib/supabase";
import AboutClient from "./AboutClient";
import { Metadata } from "next";
import {
  Flag,
  Cpu,
  Trophy,
  ShieldCheck,
  Zap,
  Sparkles,
} from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About Us | Team Red Baron — PCCOE Motorsport",
  description:
    "Learn about Team Red Baron (PCCOE Pune), premier collegiate offroad ATV racing team. 12+ years of untamed endurance, in-house engineering, and podium victories.",
};



export default async function AboutPage() {
  const { data: aboutData } = await supabase
    .from("about_content")
    .select("*")
    .eq("id", 1)
    .single();

  const { data: vehicles } = await supabase
    .from("vehicles")
    .select(`
      *,
      vehicle_specs (*)
    `)
    .order("timeline_order", { ascending: true })
    .order("sort_order", { foreignTable: "vehicle_specs", ascending: true });

  const formattedVehicles = (vehicles || []).map((v) => ({
    year: v.year,
    vehicleName: v.vehicle_name,
    rank: v.rank_text,
    subtitle: v.subtitle,
    badge: v.badge_text,
    icon: v.icon_key || "Trophy",
    imageSrc: v.image_url,
    description: v.description,
    specs: (v.vehicle_specs || []).map((s: any) => ({
      label: s.label,
      val: s.value,
    })),
  }));

  return <AboutClient aboutData={aboutData} vehiclesData={formattedVehicles} />;
}
