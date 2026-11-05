"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Monitor, ArrowLeft, ShieldAlert, Laptop, Radio } from "lucide-react";

interface AdminDesktopOnlyGuardProps {
  children: ReactNode;
}

export function AdminDesktopOnlyGuard({ children }: AdminDesktopOnlyGuardProps) {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const isMobileOrTablet = dimensions !== null && dimensions.width < 1024;

  return (
    <>
      {/* 
        Mobile / Tablet Gate
        Using both Tailwind CSS (lg:hidden) for instant SSR rendering with zero layout shift,
        and reactive client-side width checks.
      */}
      <div className={`fixed inset-0 z-[9999] bg-[#050608] text-white flex flex-col justify-between p-6 sm:p-10 overflow-y-auto selection:bg-[#de1615] selection:text-white ${isClient && !isMobileOrTablet ? "hidden" : "lg:hidden"}`}>
        {/* Subtle Ambient Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#de1615]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-[#ff6534]/10 rounded-full blur-[160px] pointer-events-none" />

        {/* Top Header */}
        <header className="relative z-10 flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 shrink-0">
              <Image src="/logo.png" alt="Team Red Baron Logo" fill className="object-contain" priority />
            </div>
            <div>
              <div className="font-sora font-extrabold text-sm tracking-wider uppercase text-white flex items-center gap-1.5">
                <span>TEAM</span>
                <span className="text-[#de1615]">RED BARON</span>
              </div>
              <span className="font-mono-tech text-[10px] text-[#ae8882] tracking-widest block uppercase">
                Pitwall Command Station
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-[#de1615]/10 border border-[#de1615]/30 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#de1615] animate-ping" />
            <span className="font-mono-tech text-[10px] text-[#de1615] uppercase tracking-wider font-semibold">
              Desktop Only
            </span>
          </div>
        </header>

        {/* Main Gated Notice */}
        <main className="relative z-10 my-auto py-10 flex flex-col items-center text-center max-w-lg mx-auto">
          {/* Glowing Hardware Graphic */}
          <div className="relative mb-8">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#12151b] border border-[#de1615]/40 flex items-center justify-center shadow-[0_0_50px_rgba(222,22,21,0.25)] relative group">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#de1615]/20 to-transparent pointer-events-none" />
              <Laptop className="w-12 h-12 sm:w-14 sm:h-14 text-[#de1615]" />
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#de1615] flex items-center justify-center shadow-lg border-2 border-black">
                <ShieldAlert className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Pitwall Alert Badge */}
          <div className="inline-flex items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-[#de1615] bg-[#de1615]/10 border border-[#de1615]/30 px-3 py-1 rounded-full mb-4">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Restricted Access Protocol</span>
          </div>

          {/* Headline */}
          <h1 className="font-sora font-extrabold text-2xl sm:text-3xl text-white tracking-tight uppercase leading-snug">
            Desktop Workstation <br />
            <span className="text-[#de1615]">Required</span>
          </h1>

          {/* Description */}
          <p className="font-inter text-sm text-gray-300 mt-4 leading-relaxed max-w-md">
            The Team Red Baron Administrative Control Center is optimized exclusively for desktop workstations. Telemetry controls, chassis specs, high-resolution media uploads, and team roster management require a widescreen display.
          </p>

          {/* Live Telemetry Device Diagnostic */}
          <div className="w-full bg-[#12151b]/90 border border-white/10 rounded-2xl p-4 mt-6 text-left space-y-2.5 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
              <span className="font-mono-tech text-white/50 uppercase text-[11px]">System Status:</span>
              <span className="font-mono-tech text-[#de1615] uppercase font-bold text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#de1615]" />
                Access Gated
              </span>
            </div>

            <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
              <span className="font-mono-tech text-white/50 uppercase text-[11px]">Current Viewport:</span>
              <span className="font-mono text-white text-[11px]">
                {dimensions ? `${dimensions.width}px × ${dimensions.height}px` : "Detecting..."}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-mono-tech text-white/50 uppercase text-[11px]">Minimum Required:</span>
              <span className="font-mono-tech text-[#ff6534] font-semibold text-[11px] flex items-center gap-1">
                <Monitor className="w-3 h-3" />
                1024px (Desktop Widescreen)
              </span>
            </div>
          </div>

          {/* Return CTA */}
          <div className="mt-8 w-full flex flex-col gap-3">
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#de1615] hover:bg-[#b81211] text-white font-sora font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all shadow-[0_0_25px_rgba(222,22,21,0.35)] hover:shadow-[0_0_35px_rgba(222,22,21,0.55)] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Public Website</span>
            </Link>
          </div>
        </main>

        {/* Footer info */}
        <footer className="relative z-10 border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center text-[10px] font-mono-tech text-[#ae8882]">
          <span>©2025 TEAM RED BARON • PCCOE PUNE</span>
          <span className="text-white/40">PLEASE LOG IN FROM A PC, MAC, OR LAPTOP</span>
        </footer>
      </div>

      {/* 
        Desktop Content Viewport
        Rendered only when viewport is >= 1024px width.
      */}
      <div className={`hidden lg:block min-h-screen ${isClient && isMobileOrTablet ? "!hidden" : ""}`}>
        {children}
      </div>
    </>
  );
}
