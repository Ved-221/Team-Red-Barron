"use client";

import React from "react";
import {
  Trophy,
  Award,
  History,
  Car,
  ShieldCheck,
  Zap,
  Flame,
  Gauge,
  Medal,
  Crown,
  Flag,
  Target,
  Star,
} from "lucide-react";
import type { AchievementStat } from "@/lib/achievements-types";
import { DEFAULT_ACHIEVEMENTS } from "@/lib/achievements-types";

export const AVAILABLE_ACHIEVEMENT_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Trophy,
  Award,
  History,
  Car,
  ShieldCheck,
  Zap,
  Flame,
  Gauge,
  Medal,
  Crown,
  Flag,
  Target,
  Star,
};

function getIconComponent(iconName?: string): React.ComponentType<{ className?: string }> {
  if (!iconName) return Trophy;
  return AVAILABLE_ACHIEVEMENT_ICONS[iconName] || Trophy;
}

export function AchievementsTicker({ stats }: { stats?: AchievementStat[] }) {
  const activeStats = (stats && stats.length > 0) ? stats : DEFAULT_ACHIEVEMENTS;

  return (
    <section className="py-8 max-md:py-4 bg-black/80 border-y border-white/10 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-24 max-md:w-6 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 max-md:w-6 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      {/* Desktop Marquee (>= 768px) */}
      <div className="flex animate-marquee gap-8 max-md:hidden">
        {[...activeStats, ...activeStats].map((stat, idx) => {
          const Icon = getIconComponent(stat.icon);
          return (
            <div
              key={`${stat.id || idx}-${idx}`}
              className="glass-card px-8 py-4 rounded-2xl flex items-center gap-5 whitespace-nowrap min-w-[290px] border border-white/10 hover:border-[#de1615] transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#de1615]/20 border border-[#de1615]/40 flex items-center justify-center text-[#de1615] group-hover:bg-[#de1615] group-hover:text-white transition-colors shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-sora font-extrabold text-2xl text-white group-hover:text-[#de1615] transition-colors">
                  {stat.value}
                </span>
                <span className="font-mono-tech text-xs text-[#e8bdb6] tracking-wider uppercase font-semibold">
                  {stat.label}
                </span>
                {stat.detail && (
                  <span className="font-inter text-[11px] text-white/40 mt-0.5 max-w-[200px] truncate">
                    {stat.detail}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Horizontal Scroll-Snap Strip (< 768px) */}
      <div className="hidden max-md:flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-3 px-4 py-2">
        {activeStats.map((stat, idx) => {
          const Icon = getIconComponent(stat.icon);
          return (
            <div
              key={stat.id || idx}
              className="snap-center shrink-0 glass-card px-5 py-3.5 rounded-2xl flex items-center gap-4 whitespace-nowrap min-w-[240px] border border-white/10 hover:border-[#de1615] transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#de1615]/20 border border-[#de1615]/40 flex items-center justify-center text-[#de1615] group-hover:bg-[#de1615] group-hover:text-white transition-colors shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-sora font-extrabold text-xl text-white group-hover:text-[#de1615] transition-colors">
                  {stat.value}
                </span>
                <span className="font-mono-tech text-[11px] text-[#e8bdb6] tracking-wider uppercase font-semibold">
                  {stat.label}
                </span>
                {stat.detail && (
                  <span className="font-inter text-[10px] text-white/40 mt-0.5 max-w-[180px] truncate">
                    {stat.detail}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
