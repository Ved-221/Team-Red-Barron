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

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-[#e2e2e2] flex flex-col selection:bg-[#de1615] selection:text-white">
      <Navbar />

      <Hero />

      <ScrollReveal yOffset={30}>
        <AchievementsTicker />
      </ScrollReveal>

      <ScrollReveal yOffset={50}>
        <VehicleSpotlight />
      </ScrollReveal>

      <ScrollReveal yOffset={50}>
        <TimelinePreview />
      </ScrollReveal>

      <ScrollReveal yOffset={40}>
        <SponsorsMarquee />
      </ScrollReveal>

      <ScrollReveal yOffset={50}>
        <GalleryPreview />
      </ScrollReveal>

      <ScrollReveal yOffset={40}>
        <SupportCTA />
      </ScrollReveal>

      <Footer />
    </main>
  );
}
