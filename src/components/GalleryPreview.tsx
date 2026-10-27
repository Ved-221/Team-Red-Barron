"use client";

import { useRef } from "react";
import MorphSlider from "@/components/ui/MorphSlider";
import { useInView } from "framer-motion";

interface TeamPhotoItem {
  image_url: string;
  caption?: string | null;
}

export function GalleryPreview({ teamPhotos }: { teamPhotos: TeamPhotoItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "300px" });

  if (!teamPhotos || teamPhotos.length === 0) return null;

  const teamItems = teamPhotos.map((p) => {
    let optimizedUrl = p.image_url;
    if (
      p.image_url &&
      (p.image_url.startsWith("http://") || p.image_url.startsWith("https://")) &&
      !p.image_url.startsWith("/_next/image")
    ) {
      optimizedUrl = `/_next/image?url=${encodeURIComponent(p.image_url)}&w=1920&q=75`;
    }
    return {
      image: optimizedUrl,
      caption: p.caption || "",
    };
  });

  return (
    <section ref={sectionRef} className="py-24 sm:py-28 bg-black relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#de1615]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 sm:mb-12 gap-4">
          <div>
            <h2 className="font-sora font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight">
              OFF THE <span className="text-[#de1615]">MAP</span>
            </h2>
          </div>
        </div>

        {/* Morph Slider Showcase Container */}
        <div className="w-full h-[380px] sm:h-[600px] lg:h-[680px] relative rounded-3xl overflow-hidden glass-card border border-white/10 bg-[#0a0c0e]">
          {isInView ? (
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
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black/40 animate-pulse">
              <span className="font-mono-tech text-xs uppercase tracking-widest text-white/30">
                Loading Visual Showcase...
              </span>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
