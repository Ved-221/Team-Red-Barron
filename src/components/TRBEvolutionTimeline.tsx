"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Flag,
  Trophy,
  Cpu,
  Zap,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface Milestone {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  rank?: string;
  description: string;
  badge: string;
  icon: string;
  specs: { label: string; val: string }[];
  eraLabel: string;
}

const WINDOW_SIZE = 5; // Display max 5 nodes at a time for optimal spacing

const iconMap: Record<string, any> = {
  "Flag": Flag,
  "Cpu": Cpu,
  "Trophy": Trophy,
  "ShieldCheck": ShieldCheck,
  "Zap": Zap,
  "Sparkles": Sparkles,
};

export function TRBEvolutionTimeline({ milestones }: { milestones: Milestone[] }) {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [isDriving, setIsDriving] = useState<boolean>(false);

  const handleNodeSelect = (index: number) => {
    if (index === activeIdx || index < 0 || index >= milestones.length) return;
    setIsDriving(true);
    setActiveIdx(index);
    setTimeout(() => setIsDriving(false), 500);
  };

  const handlePrev = () => {
    if (activeIdx > 0) {
      handleNodeSelect(activeIdx - 1);
    }
  };

  const handleNext = () => {
    if (activeIdx < milestones.length - 1) {
      handleNodeSelect(activeIdx + 1);
    }
  };

  const activeMilestone = milestones[activeIdx];
  if (!activeMilestone) return null;

  // Calculate sliding window indices
  const halfWindow = Math.floor(WINDOW_SIZE / 2);
  let startIdx = activeIdx - halfWindow;
  let endIdx = activeIdx + halfWindow;

  if (startIdx < 0) {
    startIdx = 0;
    endIdx = Math.min(milestones.length - 1, WINDOW_SIZE - 1);
  } else if (endIdx >= milestones.length) {
    endIdx = milestones.length - 1;
    startIdx = Math.max(0, milestones.length - WINDOW_SIZE);
  }

  const visibleMilestones = milestones.slice(startIdx, endIdx + 1);
  const visibleCount = visibleMilestones.length;
  const activeRelIdx = activeIdx - startIdx;
  const rawPercent = visibleCount > 1 ? (activeRelIdx / (visibleCount - 1)) * 100 : 50;
  const vehiclePercent = 10 + rawPercent * 0.8;

  return (
    <section id="journey" className="py-24 bg-[#050608] text-white relative overflow-hidden select-none border-t border-white/10">

      {/* Background CAD Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]">
        <div className="w-full h-full bg-grid" />
        <svg className="absolute inset-0 w-full h-full stroke-white/40 fill-none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="blueprint-pattern-grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" strokeWidth="0.5" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="35" strokeWidth="0.25" />
            <line x1="0" y1="50" x2="100" y2="50" strokeWidth="0.25" />
            <line x1="50" y1="0" x2="50" y2="100" strokeWidth="0.25" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#blueprint-pattern-grid)" />
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 relative z-10">

        {/* SECTION HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono-tech text-xs text-[#de1615] tracking-widest uppercase mb-2">
              <Sparkles className="w-4 h-4 text-[#ff6534] animate-pulse" />
              15+ YEARS OF EVOLUTION
            </div>
            <h2 className="font-sora font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight">
              EVOLUTIONARY <span className="text-[#de1615]">TIMELINE</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="glass-card px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#de1615] animate-ping" />
              <span className="font-mono-tech text-xs text-[#e8bdb6] uppercase tracking-wider">
                {activeMilestone.eraLabel}
              </span>
            </div>
          </div>
        </div>

        {/* ACTIVE MILESTONE CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          <div className="lg:col-span-12 max-w-4xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMilestone.id}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative glass-card p-6 sm:p-8 rounded-3xl border border-white/15 bg-black/60 backdrop-blur-xl overflow-hidden group"
              >
                {/* Header Badge & Year */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono-tech text-xs text-[#de1615] bg-[#de1615]/15 px-3 py-1.5 rounded-full border border-[#de1615]/40 font-bold uppercase tracking-wider flex items-center gap-2">
                    {React.createElement(iconMap[activeMilestone.icon] || Trophy, { className: "w-4 h-4" })}
                    {activeMilestone.badge}
                  </span>
                  <div className="bg-black/85 border border-white/20 backdrop-blur-md px-3.5 py-1 rounded-xl">
                    <span className="font-sora font-black text-3xl sm:text-4xl tracking-tight text-white">
                      {activeMilestone.year}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h3 className="font-sora font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
                    {activeMilestone.title}
                  </h3>
                  {activeMilestone.rank && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#de1615]/20 border border-[#de1615]/40 text-white font-sora font-bold text-xs sm:text-sm tracking-wide">
                      <Trophy className="w-3.5 h-3.5 text-[#ff6534] shrink-0" />
                      <span className="text-white">{activeMilestone.rank}</span>
                    </span>
                  )}
                </div>
                <span className="font-mono-tech text-xs text-[#ff6534] uppercase tracking-widest block mb-4">
                  {activeMilestone.subtitle}
                </span>

                <p className="font-inter text-base text-[#e2e2e2]/90 leading-relaxed mb-6">
                  {activeMilestone.description}
                </p>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  {activeMilestone.specs.map((sp, idx) => (
                    <div key={idx} className="bg-white/5 p-3.5 rounded-xl border border-white/5">
                      <span className="font-mono-tech text-[10px] text-[#e8bdb6] block uppercase tracking-wider mb-0.5">
                        {sp.label}
                      </span>
                      <span className="font-sora font-bold text-sm sm:text-base text-white">
                        {sp.val}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* TIMELINE SLIDING TRACK CONTROLS & VEHICLE */}
        <div className="max-w-4xl mx-auto w-full relative pt-14 pb-4">

          {/* VEHICLE ANIMATION LAYER */}
          <div className="relative h-20 w-full mb-1">
            <motion.div
              animate={{
                left: `${vehiclePercent}%`,
                rotate: isDriving ? -2 : 0,
                y: isDriving ? [0, -4, 2, 0] : 0,
              }}
              transition={{
                left: { type: "spring", stiffness: 85, damping: 18 },
                rotate: { duration: 0.3 },
                y: { repeat: isDriving ? Infinity : 0, duration: 0.2 },
              }}
              className="absolute bottom-0 -translate-x-1/2 w-36 sm:w-48 md:w-60 h-auto pointer-events-none z-30 flex flex-col items-center"
            >
              <div className="relative w-full aspect-[4/3] drop-shadow-[0_8px_20px_rgba(0,0,0,0.95)]">
                <Image
                  src="/final_photo_vehicle.png"
                  alt="Team Red Baron Buggy"
                  fill
                  unoptimized
                  className="object-contain"
                />{/* Rear Tire Smoke & Dust */}
                <AnimatePresence>
                  {isDriving && (
                    <>
                      {/* Smoke */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0, x: 0 }}
                        animate={{ opacity: [0, 0.8, 0], scale: [0.5, 2.5, 4], x: -40, y: -20 }}
                        exit={{ opacity: 0, scale: 0, transition: { duration: 0.1 } }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute bottom-[5%] left-[8%] w-6 h-6 bg-gray-300/60 rounded-full blur-md pointer-events-none"
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0, x: 0 }}
                        animate={{ opacity: [0, 0.6, 0], scale: [0.5, 2, 3.5], x: -30, y: -10 }}
                        exit={{ opacity: 0, scale: 0, transition: { duration: 0.1 } }}
                        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                        className="absolute bottom-[10%] left-[12%] w-5 h-5 bg-gray-400/50 rounded-full blur-md pointer-events-none"
                      />
                      {/* Dust Particles */}
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={`dust-rear-${i}`}
                          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1.5, 0],
                            x: -15 - (Math.random() * 25),
                            y: -5 - (Math.random() * 20)
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 + (Math.random() * 0.3), ease: "easeOut" }}
                          className="absolute bottom-[2%] left-[10%] w-1.5 h-1.5 bg-[#8b4513] rounded-full pointer-events-none z-10"
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>

                <motion.div
                  animate={{ rotate: isDriving ? 360 * 3 : 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute bottom-[8%] left-[10.5%] w-[24%] h-[32%] rounded-full border-2 border-dashed border-[#de1615]/80 pointer-events-none flex items-center justify-center z-10"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#de1615]" />
                </motion.div>

                {/* Front Tire Smoke & Dust */}
                <AnimatePresence>
                  {isDriving && (
                    <>
                      {/* Smoke */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0, x: 0 }}
                        animate={{ opacity: [0, 0.7, 0], scale: [0.5, 2, 3], x: -30, y: -15 }}
                        exit={{ opacity: 0, scale: 0, transition: { duration: 0.1 } }}
                        transition={{ duration: 0.6, delay: 0.05, ease: "easeOut" }}
                        className="absolute bottom-[5%] right-[5%] w-6 h-6 bg-gray-300/60 rounded-full blur-md pointer-events-none"
                      />
                      {/* Dust Particles */}
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={`dust-front-${i}`}
                          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1.2, 0],
                            x: -10 - (Math.random() * 20),
                            y: -5 - (Math.random() * 15)
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 + (Math.random() * 0.3), delay: 0.05, ease: "easeOut" }}
                          className="absolute bottom-[2%] right-[5%] w-1.5 h-1.5 bg-[#a0522d] rounded-full pointer-events-none z-10"
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>

                <motion.div
                  animate={{ rotate: isDriving ? 360 * 3 : 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute bottom-[8%] right-[5%] w-[24%] h-[32%] rounded-full border-2 border-dashed border-[#de1615]/80 pointer-events-none flex items-center justify-center z-10"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#de1615]" />
                </motion.div>
              </div>

              <div className="w-0.5 h-3 bg-[#de1615] shadow-[0_0_8px_#de1615] -mt-1" />
            </motion.div>
          </div>

          {/* TRACK RAIL */}
          <div className="relative w-full h-3 bg-white/10 rounded-full border border-white/15 backdrop-blur-md overflow-hidden">
            <motion.div
              animate={{ width: `${vehiclePercent}%` }}
              transition={{ type: "spring", stiffness: 85, damping: 18 }}
              className="h-full bg-gradient-to-r from-[#de1615] via-[#ff6534] to-[#de1615] rounded-full shadow-[0_0_15px_#de1615]"
            />
          </div>

          {/* SLIDING WINDOW YEAR NODES (MAX 5 VISIBLE AT ONCE) */}
          <div className="relative w-full h-12 -mt-3.5">
            <AnimatePresence mode="popLayout">
              {Array.from({ length: visibleCount }).map((_, i) => {
                const realIndex = startIdx + i;
                const m = milestones[realIndex];
                const isActive = realIndex === activeIdx;
                const isPast = realIndex < activeIdx;
                const rawNodePercent = visibleCount > 1 ? (i / (visibleCount - 1)) * 100 : 50;
                const percent = 10 + rawNodePercent * 0.8;

                return (
                  <motion.button
                    key={m.id}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1, left: `${percent}%` }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    onClick={() => handleNodeSelect(realIndex)}
                    className="absolute -translate-x-1/2 flex flex-col items-center group cursor-pointer focus:outline-none"
                    aria-label={`Navigate to era ${m.year}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.35 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center shadow-lg ${isActive
                          ? "bg-[#de1615] border-white shadow-[0_0_20px_#de1615] scale-125"
                          : isPast
                            ? "bg-[#de1615]/80 border-white/80 group-hover:bg-[#de1615] group-hover:scale-125"
                            : "bg-[#181f26] border-white/30 group-hover:border-white group-hover:bg-[#de1615]/60 group-hover:scale-125"
                        }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full transition-colors ${isActive || isPast ? "bg-white" : "bg-white/40 group-hover:bg-white"
                          }`}
                      />
                    </motion.div>

                    <span
                      className={`font-sora font-extrabold text-xs sm:text-sm mt-2 tracking-tight transition-all duration-300 ${isActive
                          ? "text-[#de1615] scale-110 drop-shadow-[0_0_8px_rgba(222,22,21,0.6)]"
                          : isPast
                            ? "text-white group-hover:text-[#de1615] group-hover:scale-110"
                            : "text-white/40 group-hover:text-white group-hover:scale-110"
                        }`}
                    >
                      {m.year}
                    </span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {/* TIMELINE NAVIGATION BUTTONS (PREV YEAR & NEXT YEAR) */}
          <div className="flex items-center justify-between pt-10 px-2">
            <button
              onClick={handlePrev}
              disabled={activeIdx === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border font-sora font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${activeIdx === 0
                  ? "opacity-30 border-white/10 text-gray-500 cursor-not-allowed"
                  : "bg-white/10 hover:bg-[#de1615] border-white/20 text-white hover:border-[#de1615] shadow-lg hover:scale-105 active:scale-95"
                }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>PREV YEAR</span>
            </button>

            {/* Current Step Counter Indicator */}
            <div className="font-mono-tech text-xs text-[#e8bdb6] tracking-widest uppercase font-bold">
              ERA {activeIdx + 1}/{milestones.length}
            </div>

            <button
              onClick={handleNext}
              disabled={activeIdx === milestones.length - 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border font-sora font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${activeIdx === milestones.length - 1
                  ? "opacity-30 border-white/10 text-gray-500 cursor-not-allowed"
                  : "bg-[#de1615] hover:bg-[#b81211] border-[#de1615] text-white shadow-[0_0_15px_rgba(222,22,21,0.4)] hover:scale-105 active:scale-95"
                }`}
            >
              <span>NEXT YEAR</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
