"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Masonry, { MasonryItem } from "@/components/ui/Masonry";
import { FoldText } from "@/components/ui/FoldText";
import { Camera, X } from "lucide-react";

const GALLERY_ITEMS: MasonryItem[] = [
  {
    id: "1",
    img: "/media/gallery/9P3A5963.JPG",
    title: "Albatross Baja Vehicle Field Test",
    category: "Testing & Track",
    height: 750,
  },
  {
    id: "2",
    img: "/media/gallery/9P3A7208.JPG",
    title: "High-Chroma Endurance Rally",
    category: "Testing & Track",
    height: 520,
  },
  {
    id: "3",
    img: "/media/gallery/DSC09637.JPG",
    title: "Chassis Precision & TIG Welds",
    category: "Chassis & Frame",
    height: 850,
  },
  {
    id: "4",
    img: "/media/gallery/DSCN0816.JPG",
    title: "Steering & Ergonomic Controls",
    category: "Telemetry & Cockpit",
    height: 600,
  },
  {
    id: "5",
    img: "/media/gallery/DSC00220.jpg",
    title: "All-Terrain Offroad Prototype",
    category: "Testing & Track",
    height: 700,
  },
  {
    id: "6",
    img: "/media/gallery/DSC_5688.jpeg",
    title: "Dynamic Double-A Arm Suspension",
    category: "Suspension & Wheels",
    height: 550,
  },
  {
    id: "7",
    img: "/media/gallery/IMG-20250812-WA0006.jpg",
    title: "Night Pit Scrutineering & Check",
    category: "Telemetry & Cockpit",
    height: 480,
  },
  {
    id: "8",
    img: "/media/gallery/IMG20260111194040.jpg",
    title: "High-Speed Sand Dune Sprint",
    category: "Testing & Track",
    height: 800,
  },
  {
    id: "9",
    img: "/media/gallery/IMG_0292.jpg",
    title: "Custom Tuned CVT Powertrain",
    category: "Powertrain",
    height: 520,
  },
  {
    id: "10",
    img: "/media/gallery/IMG_0497.JPG",
    title: "Endurance Championship Vehicle",
    category: "Chassis & Frame",
    height: 680,
  },
  {
    id: "11",
    img: "/media/gallery/IMG_20240816_090641.jpg",
    title: "Air Dam & Shock Telemetry",
    category: "Suspension & Wheels",
    height: 560,
  },
  {
    id: "12",
    img: "/media/gallery/IMG_5855.JPG",
    title: "All-Terrain Mud & Obstacle Run",
    category: "Testing & Track",
    height: 720,
  },
  {
    id: "13",
    img: "/media/gallery/IMG_5888.JPG",
    title: "Cockpit Dashboard & Brake Bias",
    category: "Telemetry & Cockpit",
    height: 580,
  },
  {
    id: "14",
    img: "/media/gallery/IMG_6603.JPG",
    title: "High-G Cornering Dynamics",
    category: "Testing & Track",
    height: 760,
  },
  {
    id: "15",
    img: "/media/gallery/IMG_6840.jpg",
    title: "Chassis Tubing Structural Audit",
    category: "Chassis & Frame",
    height: 490,
  },
  {
    id: "16",
    img: "/media/gallery/IMG_9384.JPG",
    title: "All-Terrain Offroad Wheel Assembly",
    category: "Suspension & Wheels",
    height: 640,
  },
  {
    id: "17",
    img: "/media/gallery/TRB_2.JPG",
    title: "Team Red Baron Motorsport Prototype",
    category: "Chassis & Frame",
    height: 700,
  },
  {
    id: "18",
    img: "/media/gallery/WBD09944.JPG",
    title: "Sensor Calibration & Telemetry",
    category: "Telemetry & Cockpit",
    height: 540,
  },
  {
    id: "19",
    img: "/media/gallery/20230405_171839.jpg",
    title: "BAJA National Championship Sprint",
    category: "Testing & Track",
    height: 780,
  },
];

export default function GalleryPage() {
  const [selectedItem, setSelectedItem] = useState<MasonryItem | null>(null);

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
            <img
              src={selectedItem.img}
              alt="Gallery image"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
