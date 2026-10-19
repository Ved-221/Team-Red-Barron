import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { AchievementsTicker } from "@/components/AchievementsTicker";
import { VehicleSpotlight } from "@/components/VehicleSpotlight";
import { TimelinePreview } from "@/components/TimelinePreview";
import { SponsorsMarquee } from "@/components/SponsorsMarquee";
import { GalleryPreview } from "@/components/GalleryPreview";
import { SupportCTA } from "@/components/SupportCTA";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { HomepageIntro } from "@/components/HomepageIntro";
import { supabase } from "@/lib/supabase";
import { getSharedChromeData } from "@/lib/server-data";

export const revalidate = 3600;

export default async function Home() {
  const [chrome, { data: settings }, { data: vehicles }, { data: sponsors }, { data: teamPhotos }] =
    await Promise.all([
      getSharedChromeData(),
      supabase
        .from("site_settings")
        .select("id, hero_tagline, flagship_vehicle_id, upi_id, qr_code_url, brochure_url")
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
      supabase
        .from("sponsors")
        .select("id, name, logo_url, sort_order")
        .is("deleted_at", null)
        .order("sort_order", { ascending: true }),
      supabase
        .from("team_photos")
        .select("id, image_url, caption, sort_order")
        .is("deleted_at", null)
        .order("sort_order", { ascending: true }),
    ]);

  const formattedVehicles = (vehicles || []).map((v) => ({
    id: v.id,
    year: v.year,
    title: v.vehicle_name, // for TRBEvolutionTimeline
    vehicleName: v.vehicle_name, // for AboutTimeline
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
    eraLabel: `${v.year} — ${v.vehicle_name}`,
  }));

  const flagshipVehicle = 
    (vehicles && settings?.flagship_vehicle_id) 
      ? vehicles.find(v => v.id === settings.flagship_vehicle_id) || vehicles[0]
      : (vehicles && vehicles.length > 0) ? vehicles[0] : null;

  return (
    <main className="min-h-screen bg-black text-[#e2e2e2] flex flex-col selection:bg-[#de1615] selection:text-white">
      <HomepageIntro />
      <Navbar teamYears={chrome.teamYears} supportSettings={chrome.siteSettings} />

      <Hero tagline={settings?.hero_tagline} />

      <ScrollReveal yOffset={30}>
        <AchievementsTicker />
      </ScrollReveal>

      <ScrollReveal yOffset={50}>
        <VehicleSpotlight vehicleData={flagshipVehicle} />
      </ScrollReveal>

      <ScrollReveal yOffset={50}>
        <TimelinePreview vehiclesData={formattedVehicles} />
      </ScrollReveal>

      <ScrollReveal yOffset={40}>
        <SponsorsMarquee sponsors={sponsors || []} />
      </ScrollReveal>

      <ScrollReveal yOffset={50}>
        <GalleryPreview teamPhotos={teamPhotos || []} />
      </ScrollReveal>

      <ScrollReveal yOffset={40}>
        <SupportCTA supportSettings={chrome.siteSettings} />
      </ScrollReveal>

      <Footer contactData={chrome.contactInfo} />
    </main>
  );
}
