"use client";

import React, { Suspense } from "react";
import { Users, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export interface ShiftingDropDownProps {
  currentSeason?: string;
  onSelectSeason?: (season: string) => void;
}

function DropDownContent({ onSelectSeason }: { onSelectSeason?: (season: string) => void }) {
  const searchParams = useSearchParams();
  const activeSeason = searchParams.get("year") || "2025-26";

  const seasons = [
    { year: "2025-26", title: "Team 2025-26", desc: "Current Championship Season Roster" },
    { year: "2024-25", title: "Team 2024-25", desc: "National BAJA 2024-25 Squad" },
    { year: "2023-24", title: "Team 2023-24", desc: "Legacy Albatros XI Roster" },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-mono-tech text-[#de1615] tracking-widest uppercase mb-3 flex items-center gap-2">
        <Users className="w-4 h-4 text-[#de1615]" />
        <span>Select Team Season</span>
      </h3>

      <div className="space-y-2">
        {seasons.map((s) => (
          <Link
            key={s.year}
            href={`/team?year=${s.year}`}
            onClick={() => onSelectSeason && onSelectSeason(s.year)}
            className={`block p-3 rounded-xl border transition-all ${
              activeSeason === s.year
                ? "bg-[#de1615]/20 border-[#de1615] text-white shadow-md shadow-[#de1615]/20"
                : "bg-white/5 border-white/10 hover:border-[#de1615]/60 hover:bg-white/10 text-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-sora font-bold text-sm text-white uppercase">{s.title}</span>
              {activeSeason === s.year && (
                <span className="text-[10px] font-mono-tech uppercase bg-[#de1615] text-white px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 font-inter mt-1">{s.desc}</p>
          </Link>
        ))}
      </div>

      <Link
        href="/team"
        className="mt-4 flex items-center justify-end gap-1 text-xs font-mono-tech text-[#de1615] hover:text-white transition-colors"
      >
        <span>View Full Roster</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

export const ShiftingDropDown = ({ onSelectSeason }: ShiftingDropDownProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="w-80 sm:w-96 rounded-2xl border border-white/15 bg-gradient-to-b from-[#12151b] via-[#0d0f14] to-black p-5 shadow-2xl z-50 backdrop-blur-2xl relative"
    >
      {/* Top Nub Pointer */}
      <span
        style={{
          clipPath: "polygon(0 0, 100% 0, 50% 50%, 0% 100%)",
        }}
        className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-tl border border-white/20 bg-[#12151b]"
      />

      <Suspense fallback={<div className="h-40 w-full animate-pulse bg-white/5 rounded-xl" />}>
        <DropDownContent onSelectSeason={onSelectSeason} />
      </Suspense>
    </motion.div>
  );
};
