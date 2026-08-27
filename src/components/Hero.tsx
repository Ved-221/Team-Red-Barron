"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, Flame, ShieldAlert, Cpu } from "lucide-react";
import { TitleTeamRedBaron } from "@/components/TitleTeamRedBaron";
import dynamic from "next/dynamic";
const Hero3DLogo = dynamic(() => import("@/components/Hero3DLogo").then((mod) => mod.Hero3DLogo), {
  ssr: false,
  loading: () => (
    <div className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[340px] md:h-[340px] rounded-full border border-white/5 bg-black/40 shadow-[0_0_30px_rgba(222,22,21,0.2)] animate-pulse" />
  ),
});
import { LogoRadialDistortion, type LogoRadialDistortionRef } from "@/components/LogoRadialDistortion";
import GradientWaves from "@/components/ui/GradientWaves";

export function Hero() {
  const distortionRef = useRef<LogoRadialDistortionRef>(null);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-black select-none">
      {/* Dynamic WebGL Gradient Waves Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <GradientWaves
          horizonColor="#de1615"
          waveColor="#000000"
          crestColor="#ffb4a9"
          speed={0.4}
          amplitude={2.5}
          waveScale={0.6}
          waveRatio={0.9}
          swell={35}
          turbulence={20}
          tilt={1.11}
          zoom={1.0}
          height={5.5}
          fogDepth={15}
          detail="medium"
          brightness={1.0}
          opacity={1.0}
          mouseInteraction={true}
          parallaxStrength={0.5}
          grain={true}
          grainIntensity={0.05}
        />
      </div>

      {/* Background Grid & Atmospheric Glows */}
      <div className="absolute inset-0 bg-grid opacity-60 z-0 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(222,22,21,0.18)_0%,transparent_70%)] pointer-events-none z-0 transform-gpu" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,101,52,0.12)_0%,transparent_70%)] pointer-events-none z-0 transform-gpu" />

      {/* Content Container */}
      <div className="relative z-20 max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 w-full flex flex-col items-center text-center">

        {/* Technical Status Badge */}
        <div className="inline-flex items-center gap-2 glass-card px-4 py-1.5 rounded-full mb-8 border border-white/10 glow-red-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#de1615] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#de1615]" />
          </span>
          <span className="font-mono-tech text-xs tracking-widest text-[#ffb59f] uppercase font-bold">
            INSPIRED TO BUILD, DETERMINED TO WIN.
          </span>
        </div>

        {/* Interactive 3D Team Logo Emblem with Localized Radial Distortion */}
        <div className="relative mb-6 flex items-center justify-center">
          <LogoRadialDistortion ref={distortionRef} />
          <Hero3DLogo distortionRef={distortionRef} />
        </div>

        {/* 3D Extruded Title using React Bits DepthText */}
        <div className="mb-6">
          <TitleTeamRedBaron />
        </div>

        {/* Hero Copy */}
        <p className="font-inter text-base sm:text-lg md:text-xl text-[#e2e2e2]/90 max-w-3xl mb-12 leading-relaxed font-normal">
          Team Red Baron is a high-performance motorsports team from PCCOE Pune — a legacy of innovation, precision, and relentless pursuit of victory. We design and build All-Terrain Vehicles to compete on the toughest terrains in national & international competitions.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center">
          <button className="bg-[#de1615] text-white px-8 py-4 rounded-xl font-sora font-bold text-lg glow-red hover:bg-[#c00009] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
            <Flame className="w-5 h-5 text-white animate-bounce" />
            Explore the Hangar
          </button>
          <button className="glass-card text-white px-8 py-4 rounded-xl font-sora font-bold text-lg border border-white/20 hover:bg-white/10 hover:border-[#de1615] transition-all flex items-center justify-center gap-3">
            <Cpu className="w-5 h-5 text-[#ff6534]" />
            Technical Docs
          </button>
        </div>

        {/* Sub-Technical Spec Telemetry Chips */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          <div className="glass-card p-4 rounded-xl border border-white/10 text-left">
            <span className="font-mono-tech text-xs text-[#de1615] block mb-1">CHASSIS FRAME</span>
            <span className="font-sora font-bold text-lg text-white">Chromoly 4130</span>
          </div>
          <div className="glass-card p-4 rounded-xl border border-white/10 text-left">
            <span className="font-mono-tech text-xs text-[#de1615] block mb-1">POWER PLANT</span>
            <span className="font-sora font-bold text-lg text-white">305cc Custom</span>
          </div>
          <div className="glass-card p-4 rounded-xl border border-white/10 text-left">
            <span className="font-mono-tech text-xs text-[#de1615] block mb-1">SUSPENSION TRAVEL</span>
            <span className="font-sora font-bold text-lg text-white">16 Inch Dual-A</span>
          </div>
          <div className="glass-card p-4 rounded-xl border border-white/10 text-left">
            <span className="font-mono-tech text-xs text-[#de1615] block mb-1">TELEMETRY LINK</span>
            <span className="font-sora font-bold text-lg text-white">Real-Time IoT</span>
          </div>
        </div>

      </div>
    </section>
  );
}
