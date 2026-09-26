"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Masonry, { MasonryItem } from "@/components/ui/Masonry";
import { FoldText } from "@/components/ui/FoldText";
import { Camera, X } from "lucide-react";
import Image from "next/image";

const HEIGHTS = [750, 520, 850, 600, 700, 550, 480, 800, 520, 680, 560, 720, 580, 760, 490, 640, 700, 540, 780];

export default function GalleryClient({ galleryData }: { galleryData: any[] }) {
  const [selectedItem, setSelectedItem] = useState<MasonryItem | null>(null);

  const GALLERY_ITEMS: MasonryItem[] = galleryData.map((item, index) => ({
    id: item.id,
    img: item.image_url,
    title: item.title,
    category: item.category,
    height: HEIGHTS[index % HEIGHTS.length],
  }));

  return (
    <main className="min-h-screen bg-black text-[#e2e2e2] flex flex-col selection:bg-[#de1615] selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#de1615]/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 relative z-10">
          
          <div className="flex flex-col items-start gap-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 font-mono-tech text-xs text-[#de1615] tracking-widest uppercase bg-[#1a0505] px-4 py-1.5 rounded-full border border-[#de1615]/30">
              <Camera className="w-3.5 h-3.5 text-[#de1615]" />
              <span>HIGH RESOLUTION ARCHIVE</span>
            </div>

            <div className="py-2">
              <FoldText
                text="Action Gallery"
                splitBy="word"
                hinge="top"
                trigger="scroll"
                duration={0.65}
                stagger={0.05}
                ease="power3.out"
                perspective={700}
                creaseShading={0.55}
                fontSize="clamp(2rem, 4.5vw, 3.8rem)"
                fontWeight={900}
                color="#FFFFFF"
                highlightColor="#de1615"
                accentWords={["Gallery"]}
                className="font-sora uppercase tracking-tight font-extrabold"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Masonry Grid Section with Scroll Reveal */}
      <section className="pb-28 relative z-10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20">
          <Masonry
            items={GALLERY_ITEMS}
            ease="power3.out"
            duration={0.7}
            stagger={0.05}
            animateFrom="bottom"
            scaleOnHover={true}
            hoverScale={1.03}
            showTextOnHover={false}
            blurToFocus={true}
            colorShiftOnHover={false}
            onItemClick={(item) => setSelectedItem(item)}
          />
        </div>
      </section>

      {/* High-Res Modal / Lightbox */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-5xl w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-black/60 hover:bg-[#de1615] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-xl hover:scale-105 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* High-Res Image Display */}
            <Image
              src={selectedItem.img}
              alt="Gallery image"
              width={1920}
              height={1080}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-2xl shadow-2xl border border-white/10"
              quality={90}
            />
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
