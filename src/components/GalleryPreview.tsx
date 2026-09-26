"use client";

import { Camera } from "lucide-react";
import MorphSlider from "@/components/ui/MorphSlider";

export function GalleryPreview({ teamPhotos }: { teamPhotos: any[] }) {
  if (!teamPhotos || teamPhotos.length === 0) return null;

  const teamItems = teamPhotos.map(p => ({
    image: p.image_url,
    caption: p.caption || "",
  }));

  return (
    <section className="py-24 sm:py-28 bg-black relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#de1615]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 sm:mb-12 gap-4">
          <div>
            <span className="font-mono-tech text-xs text-[#de1615] tracking-widest uppercase block mb-2">
              TEAM RED BARON IN ACTION
            </span>
            <h2 className="font-sora font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight">
              OFF THE <span className="text-[#de1615]">MAP</span>
            </h2>
          </div>
          <div className="flex items-center gap-3 font-mono-tech text-xs sm:text-sm text-[#e8bdb6] bg-[#12151b]/80 px-4 py-2 rounded-full border border-white/10">
            <Camera className="w-4 h-4 text-[#de1615]" />
            <span className="uppercase">Interactive GPU Morph Gallery</span>
          </div>
        </div>

        {/* Morph Slider Showcase Container */}
        <div className="w-full h-[380px] sm:h-[600px] lg:h-[680px] relative rounded-3xl overflow-hidden glass-card border border-white/10">
          <MorphSlider
            items={teamItems}
            transition="melt"
            intensity={0.55}
            aberration={0.35}
            drift={0.4}
            autoplay={true}
            autoplayDelay={5}
            loop={true}
            radius={24}
            overlayColor="#000000"
            showCaptions={false}
            fitMode="auto"
          />
        </div>

      </div>
    </section>
  );
}
