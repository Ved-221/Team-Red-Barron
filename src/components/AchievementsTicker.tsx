"use client";

import { Trophy, Award, History, Car, ShieldCheck, Zap } from "lucide-react";

export function AchievementsTicker() {
  const stats = [
    { label: "Years of Legacy", value: "15 YEARS", icon: History, detail: "Active 2011 – Present" },
    { label: "Vehicles Built", value: "14 ATVs", icon: Car, detail: "Albatros 1.0 to XIV" },
    { label: "E-BAJA INDIA 2025", value: "1ST RANK", icon: ShieldCheck, detail: "Overall Statics" },
    { label: "E-BAJA INDIA 2024", value: "AIR 1", icon: Trophy, detail: "Engineering Design" },
    { label: "E-BAJA INDIA 2024", value: "AIR 2", icon: Award, detail: "Overall National Rank" },
    { label: "E-BAJA INDIA", value: "BEST 4WD", icon: Zap, detail: "Performance Award" },
    { label: "Baja SAE Illinois 2017", value: "9TH RANK", icon: Car, detail: "Overall Dynamics (USA)" },
    { label: "Baja SAE Rochester 2019", value: "7TH RANK", icon: History, detail: "Hill Climbing (USA)" },
  ];

  return (
    <section className="py-8 bg-black/80 border-y border-white/10 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      <div className="flex animate-marquee gap-8">
        {[...stats, ...stats].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="glass-card px-8 py-4 rounded-2xl flex items-center gap-5 whitespace-nowrap min-w-[290px] border border-white/10 hover:border-[#de1615] transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#de1615]/20 border border-[#de1615]/40 flex items-center justify-center text-[#de1615] group-hover:bg-[#de1615] group-hover:text-white transition-colors">
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-sora font-extrabold text-2xl text-white group-hover:text-[#de1615] transition-colors">
                  {stat.value}
                </span>
                <span className="font-mono-tech text-xs text-[#e8bdb6] tracking-wider uppercase font-semibold">
                  {stat.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
