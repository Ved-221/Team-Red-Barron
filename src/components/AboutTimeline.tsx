"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Timeline, TimelineEntry } from "@/components/ui/timeline";
import { Flag, Cpu, Trophy, ShieldCheck, Zap, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

interface VehicleMilestone {
  year: string;
  vehicleName: string;
  rank: string;
  subtitle: string;
  badge: string;
  icon: string;
  imageSrc: string;
  description: string;
  specs: { label: string; val: string }[];
}



const iconMap: Record<string, any> = {
  "Flag": Flag,
  "Cpu": Cpu,
  "Trophy": Trophy,
  "ShieldCheck": ShieldCheck,
  "Zap": Zap,
  "Sparkles": Sparkles,
};

export function AboutTimeline({ milestones }: { milestones: VehicleMilestone[] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleMilestones = isExpanded ? milestones : milestones.slice(0, 4);

  const timelineData: TimelineEntry[] = visibleMilestones.map((m, idx) => {
    const IconComponent = iconMap[m.icon] || Trophy;
    const isPhotoOnRight = idx % 2 === 0;

    // Compact Photo Card
    const PhotoCard = (
      <div className="flex justify-center items-center w-full">
        <div className="relative w-full max-w-[360px] aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-[0_0_25px_rgba(0,0,0,0.8)] group hover:border-[#de1615] hover:shadow-[0_0_35px_rgba(222,22,21,0.4)] hover:scale-[1.03] transition-all duration-300">
          <Image
            src={m.imageSrc}
            alt={`Team Red Baron ATV (${m.year})`}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-75 group-hover:opacity-50 transition-opacity" />
        </div>
      </div>
    );

    // Full-Sized Description & Specs Card Component (Header contains ONLY Vehicle Name)
    const DescriptionCard = (
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#de1615]/40 bg-[#1e2020]/80 backdrop-blur-xl shadow-[0_0_30px_rgba(222,22,21,0.15)] hover:border-[#de1615] hover:shadow-[0_0_40px_rgba(222,22,21,0.3)] transition-all duration-300 group">
        {/* Header: ONLY Vehicle Name */}
        <div className="border-b border-white/10 pb-3 mb-5 flex items-center justify-between">
          <h4 className="font-sora font-extrabold text-2xl sm:text-3xl text-white group-hover:text-[#ffb59f] transition-colors">
            {m.vehicleName}
          </h4>
          <span className="w-8 h-8 rounded-lg bg-[#de1615]/20 border border-[#de1615]/50 flex items-center justify-center text-[#de1615] group-hover:bg-[#de1615] group-hover:text-white group-hover:shadow-[0_0_15px_#de1615] transition-all duration-300">
            <IconComponent className="w-4 h-4" />
          </span>
        </div>

        {/* Badges & Subtitle inside card body */}
        <div className="flex flex-wrap items-center gap-2.5 mb-3">
          {m.rank && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#de1615]/30 via-[#ff6534]/25 to-[#de1615]/30 border border-[#de1615]/70 text-white font-sora font-bold text-xs tracking-wide shadow-[0_0_15px_rgba(222,22,21,0.4)]">
              <Trophy className="w-3.5 h-3.5 text-[#ff6534] shrink-0" />
              <span>{m.rank}</span>
            </span>
          )}
          {m.badge && (
            <span className="font-mono-tech text-xs font-bold text-[#de1615] bg-[#de1615]/15 border border-[#de1615]/30 px-3 py-1 rounded-full uppercase tracking-wider">
              {m.badge}
            </span>
          )}
        </div>

        {m.subtitle && (
          <p className="font-mono-tech text-xs text-[#ff6534] uppercase tracking-wider mb-4 font-semibold">
            {m.subtitle}
          </p>
        )}

        <p className="font-inter text-sm sm:text-base text-[#e2e2e2]/90 leading-relaxed mb-6">
          {m.description}
        </p>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
          {m.specs.map((sp, specIdx) => (
            <div
              key={specIdx}
              className="bg-black/50 p-3 rounded-xl border border-white/5 group-hover:border-[#de1615]/30 hover:!border-[#de1615] hover:!bg-[#de1615]/15 hover:!shadow-[0_0_15px_rgba(222,22,21,0.3)] transition-all duration-200"
            >
              <span className="font-mono-tech text-[10px] text-[#ae8882] block uppercase tracking-wider mb-0.5">
                {sp.label}
              </span>
              <span className="font-sora font-bold text-xs sm:text-sm text-white">
                {sp.val}
              </span>
            </div>
          ))}
        </div>
      </div>
    );

    return {
      title: m.year,
      content: (
        <div className="w-full">
          {/* DESKTOP ALTERNATING 2-COLUMN LAYOUT */}
          <div className="hidden md:grid md:grid-cols-2 md:gap-12 lg:gap-16 items-center">
            {isPhotoOnRight ? (
              <>
                {/* Description Left */}
                <div className="w-full pl-2 lg:pl-6">
                  {DescriptionCard}
                </div>
                {/* Photo Right */}
                <div className="w-full pr-2 lg:pr-6">
                  {PhotoCard}
                </div>
              </>
            ) : (
              <>
                {/* Photo Left */}
                <div className="w-full pl-2 lg:pl-6">
                  {PhotoCard}
                </div>
                {/* Description Right */}
                <div className="w-full pr-2 lg:pr-6">
                  {DescriptionCard}
                </div>
              </>
            )}
          </div>

          {/* MOBILE STACKED LAYOUT */}
          <div className="md:hidden flex flex-col gap-6 pl-12 pr-2">
            {PhotoCard}
            {DescriptionCard}
          </div>
        </div>
      ),
    };
  });

  return (
    <section className="relative bg-[#000000] text-white">
      <Timeline data={timelineData} />

      {/* Explore More / Show Less Toggle Button */}
      <div className="flex justify-center -mt-6 pb-20 relative z-30">
        {!isExpanded ? (
          <button
            onClick={() => setIsExpanded(true)}
            className="group relative inline-flex items-center gap-3 bg-[#de1615] hover:bg-[#b81211] text-white px-9 py-4 rounded-full font-sora font-extrabold text-sm sm:text-base tracking-wide shadow-[0_0_25px_rgba(222,22,21,0.5)] hover:shadow-[0_0_35px_rgba(222,22,21,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
            <span>EXPLORE FULL HANGAR HISTORY (2012 – 2021)</span>
            <ChevronDown className="w-5 h-5 text-white group-hover:translate-y-1 transition-transform" />
          </button>
        ) : (
          <button
            onClick={() => setIsExpanded(false)}
            className="group relative inline-flex items-center gap-3 glass-card hover:bg-white/10 text-white px-8 py-3.5 rounded-full font-sora font-bold text-sm tracking-wide border border-white/20 hover:border-[#de1615] transition-all duration-300 cursor-pointer"
          >
            <span>SHOW LESS</span>
            <ChevronUp className="w-4 h-4 text-white group-hover:-translate-y-1 transition-transform" />
          </button>
        )}
      </div>
    </section>
  );
}
