"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Gauge, Zap, Timer, CheckCircle2 } from "lucide-react";

// Configurable media paths for ALBATROS XIII section
const VEHICLE_BACKGROUND_VIDEO = "/media/assets/videos/albatros-background.mp4";
const VEHICLE_IMAGE_PATH = "/media/assets/images/albatros-xiii.png";

export function VehicleSpotlight() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    if (videoRef.current && !mediaQuery.matches) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback if browser restricts immediate playback
      });
    }

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const specs = [
    {
      label: "CURB WEIGHT",
      value: "1,840 KG",
      detail: "OPT-SPEC COMPOSITE",
      icon: Gauge,
    },
    {
      label: "HORSEPOWER",
      value: "850 HP",
      detail: "V8 TWIN TURBO INTERCOOLED",
      icon: Zap,
    },
    {
      label: "0-100 KM/H ACCELERATION",
      value: "2.9 SEC",
      detail: "UNPAVED DIRT LAUNCH",
      icon: Timer,
    },
  ];

  return (
    <section className="py-28 relative bg-[#0a0c0e] overflow-hidden min-h-[750px] flex items-center">
      {/* Layer 0: Background Video (Decorative, Full Bleed) */}
      {!prefersReducedMotion && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0"
        >
          <source src={VEHICLE_BACKGROUND_VIDEO} type="video/mp4" />
        </video>
      )}

      {/* Layer 1: Dark Cinematic Overlay */}
      <div className="absolute inset-0 bg-black/35 z-[1] pointer-events-none" />

      {/* Layer 2: Gradient Overlays, Vignette & Edge Red Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/15 z-[2] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c0e] via-transparent to-[#0a0c0e]/60 z-[2] pointer-events-none" />
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(222,22,21,0.25),transparent_60%)] z-[2] pointer-events-none" />

      {/* Layer 3: Section Content */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-[3] w-full">
        
        {/* Left / Top Column: Vehicle Spotlight Header & Photo */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="inline-flex items-center gap-2 font-mono-tech text-xs text-[#de1615] tracking-widest uppercase mb-4 drop-shadow">
            <span className="w-2 h-2 rounded-full bg-[#de1615] animate-ping" />
            Current Flagship Vehicle
          </div>

          <h2 className="font-sora font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white mb-6 tracking-tight uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            ALBATROS <span className="text-[#de1615]">XIII</span>
          </h2>

          <p className="font-inter text-base sm:text-lg text-white/90 mb-8 leading-relaxed max-w-xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            The Albatros XIII is a masterwork of lightweight composite construction, telemetry integration, and extreme-travel suspension. Engineered specifically for high-speed desert endurance and ruthless terrain conquering.
          </p>

          {/* Vehicle Card - Positioned Prominently Above / Beside Stats */}
          <div className="relative group w-full">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#de1615] via-[#ff6534] to-[#de1615] rounded-[2.5rem] blur-xl opacity-25 group-hover:opacity-60 transition duration-700" />
            
            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden glass-card border border-white/20 shadow-2xl">
              {/* Vehicle Card Image */}
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={VEHICLE_IMAGE_PATH}
                  alt="Albatros XIII Flagship Offroad Vehicle"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none z-10" />
              </div>

              {/* Chassis Badge */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between glass-card p-4 sm:p-5 rounded-2xl border border-white/20 backdrop-blur-md bg-black/50 shadow-xl z-20">
                <div>
                  <span className="font-mono-tech text-xs text-[#e8bdb6] block uppercase tracking-wider mb-0.5">
                    CHASSIS SERIAL
                  </span>
                  <span className="font-sora font-extrabold text-lg sm:text-xl text-white">
                    TRB-2024-X13
                  </span>
                </div>
                <span className="font-mono-tech text-xs font-bold text-white bg-[#de1615] px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl glow-red">
                  RACE READY
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right / Bottom Column: Telemetry Specs & Approval Status */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-4">
          <span className="font-mono-tech text-xs text-[#ff6534] tracking-widest uppercase mb-1 font-bold">
            TELEMETRY & TECHNICAL SPECIFICATIONS
          </span>

          {specs.map((spec, idx) => {
            const Icon = spec.icon;
            return (
              <div
                key={idx}
                className="flex items-center justify-between glass-card p-4 sm:p-5 rounded-2xl border border-white/15 hover:border-[#de1615]/60 transition-all duration-300 group backdrop-blur-md bg-black/55 hover:bg-black/75 shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#252e39]/80 border border-white/10 flex items-center justify-center text-[#ff6534] group-hover:text-[#de1615] group-hover:border-[#de1615]/40 transition-colors shadow-inner shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-mono-tech text-xs text-[#e8bdb6] block uppercase tracking-wider mb-0.5">
                      {spec.label}
                    </span>
                    <span className="font-sora font-extrabold text-2xl sm:text-3xl text-white">
                      {spec.value}
                    </span>
                  </div>
                </div>
                <span className="font-mono-tech text-[10px] sm:text-xs text-[#de1615] bg-[#de1615]/20 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-[#de1615]/40 font-medium shadow-sm shrink-0">
                  {spec.detail}
                </span>
              </div>
            );
          })}

          <div className="pt-2">
            <div className="flex items-center gap-3 text-sm text-white/90 font-mono-tech glass-card px-4 py-3 rounded-2xl border border-white/15 bg-black/50 backdrop-blur-md shadow-md w-full">
              <CheckCircle2 className="w-5 h-5 text-[#de1615] shrink-0" />
              <span>SAE International Technical Inspection Approved</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
