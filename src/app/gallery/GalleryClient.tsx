"use client";

import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Masonry, { MasonryItem } from "@/components/ui/Masonry";
import { FoldText } from "@/components/ui/FoldText";
import { X, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { SmartImage } from "@/components/SmartImage";

const HEIGHTS = [750, 520, 850, 600, 700, 550, 480, 800, 520, 680, 560, 720, 580, 760, 490, 640, 700, 540, 780];

import type { SharedChromeData } from "@/lib/server-data";

interface GalleryItemData {
  id: string;
  image_url: string;
  title?: string;
  category?: string;
}

export default function GalleryClient({
  galleryData,
  chromeData,
}: {
  galleryData: GalleryItemData[];
  chromeData?: SharedChromeData;
}) {
  const [selectedItem, setSelectedItem] = useState<MasonryItem | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const GALLERY_ITEMS: MasonryItem[] = galleryData.map((item, index) => ({
    id: item.id,
    img: item.image_url,
    title: item.title,
    category: item.category,
    height: HEIGHTS[index % HEIGHTS.length],
  }));

  const displayedItems = (isMobile && visibleCount < GALLERY_ITEMS.length)
    ? GALLERY_ITEMS.slice(0, visibleCount)
    : GALLERY_ITEMS;

  const currentIndex = selectedItem ? GALLERY_ITEMS.findIndex(it => it.id === selectedItem.id) : -1;

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex > 0) {
      setSelectedItem(GALLERY_ITEMS[currentIndex - 1]);
    } else {
      setSelectedItem(GALLERY_ITEMS[GALLERY_ITEMS.length - 1]);
    }
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex < GALLERY_ITEMS.length - 1) {
      setSelectedItem(GALLERY_ITEMS[currentIndex + 1]);
    } else {
      setSelectedItem(GALLERY_ITEMS[0]);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        handleNextImage();
      } else {
        handlePrevImage();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <main className="min-h-screen bg-black text-[#e2e2e2] flex flex-col selection:bg-[#de1615] selection:text-white">
      <Navbar teamYears={chromeData?.teamYears} supportSettings={chromeData?.siteSettings} />

      {/* Hero Section */}
      <section className="pt-32 pb-12 max-md:pt-24 max-md:pb-6 relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#de1615]/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 max-md:px-4 relative z-10">
          
          <div className="flex flex-col items-start gap-4 max-w-3xl">
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
      <section className="pb-28 max-md:pb-16 relative z-10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 max-md:px-4">
          <Masonry
            items={displayedItems}
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

          {/* Mobile "Load More" after 12 items */}
          {isMobile && visibleCount < GALLERY_ITEMS.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="w-full py-4 px-6 rounded-full bg-[#121414] hover:bg-[#de1615] border border-white/15 text-white font-sora font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all min-h-[44px] shadow-lg active:scale-95"
              >
                <Plus className="w-4 h-4 text-[#de1615]" />
                <span>Load More Photos ({GALLERY_ITEMS.length - visibleCount} Remaining)</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* High-Res Modal / Lightbox with Touch Swipe Support */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200 select-none"
          onClick={() => setSelectedItem(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="relative max-w-5xl w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-[#de1615] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-xl hover:scale-105 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Nav Arrow */}
            <button
              onClick={handlePrevImage}
              className="absolute left-2 sm:left-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-[#de1615] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-xl hover:scale-105 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Nav Arrow */}
            <button
              onClick={handleNextImage}
              className="absolute right-2 sm:right-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-[#de1615] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-xl hover:scale-105 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* High-Res Image Display */}
            <SmartImage
              src={selectedItem.img}
              alt={selectedItem.title || "Gallery image"}
              width={1920}
              height={1080}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-2xl shadow-2xl border border-white/10"
              quality={85}
              sizes="(max-width: 1280px) 95vw, 1200px"
            />
          </div>
        </div>
      )}

      <Footer contactData={chromeData?.contactInfo} />
    </main>
  );
}
