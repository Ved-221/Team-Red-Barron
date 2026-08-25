"use client";

import React, { useState } from "react";
import LineSidebar from "@/components/ui/LineSidebar";
import { ShieldCheck, Zap, Cpu, Settings, Trophy } from "lucide-react";

const MISSION_PILLARS = [
  {
    title: "Engineering Rigor",
    subtitle: "STRUCTURAL FEA SIMULATION",
    desc: "Validating structural chromoly tubes and gear tooth profiles through 3D CAD simulation, FEA strain analysis, and physical load testing.",
    icon: ShieldCheck,
    tag: "VALIDATION",
  },
  {
    title: "Driver Safety & Ergonomics",
    subtitle: "COCKPIT KINEMATICS",
    desc: "Designing ergonomic cockpits and high-strength roll cages that protect drivers during 4-hour high-impact endurance runs.",
    icon: Zap,
    tag: "PROTECTION",
  },
  {
    title: "Real-Time Telemetry",
    subtitle: "LIVE IOT DATA DASHBOARD",
    desc: "Transmitting wheel speeds, CVT thermals, and suspension travel metrics live from sensor nodes directly to the pitwall dashboard.",
    icon: Cpu,
    tag: "TELEMETRY",
  },
  {
    title: "In-House Drivetrain",
    subtitle: "CUSTOM GEARBOX REDUCTION",
    desc: "In-house reduction gear assemblies paired with custom CVT calibration for instant dirt launch torque and top speed endurance.",
    icon: Settings,
    tag: "POWERPLANT",
  },
  {
    title: "Podium Performance",
    subtitle: "NATIONAL PODIUM RECOGNITION",
    desc: "Consistently securing AIR podiums, 1st Rank Statics, and Best Engineering Design awards across BAJA SAE India competitions.",
    icon: Trophy,
    tag: "PODIUM",
  },
];

export function MissionCard() {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const currentPillar = MISSION_PILLARS[activeIdx] || MISSION_PILLARS[0];
  const IconComponent = currentPillar.icon;

  return (
    <div className="relative glass-card p-6 sm:p-8 rounded-3xl border border-[#de1615]/30 bg-[#252e39]/60 backdrop-blur-2xl flex flex-col gap-6 shadow-[0_0_30px_rgba(222,22,21,0.15)] overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="font-mono-tech text-xs text-[#de1615] tracking-widest uppercase font-semibold">
          CORE MISSION PILLARS
        </span>
        <h3 className="font-sora font-extrabold text-2xl sm:text-3xl text-white">
          Engineering Without Compromise
        </h3>
      </div>

      {/* Side-by-Side Grid Layout for Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Sub-column: Interactive LineSidebar */}
        <div className="lg:col-span-6 pl-12 pr-2 py-2 overflow-visible">
          <LineSidebar
            items={MISSION_PILLARS.map((p) => p.title)}
            accentColor="#de1615"
            hoverColor="#ff6534"
            textColor="#c4c4c4"
            markerColor="#6c6c6c"
            showIndex={true}
            showMarker={true}
            markerLength={36}
            itemGap={24}
            defaultActive={0}
            onItemClick={(index) => setActiveIdx(index)}
          />
        </div>

        {/* Right Sub-column: Active Pillar Dynamic Detail Box */}
        <div className="lg:col-span-6">
          <div className="p-5 rounded-2xl bg-black/60 border border-white/10 flex flex-col gap-3 transition-all min-h-[190px] justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#de1615]/20 border border-[#de1615]/40 flex items-center justify-center text-[#de1615]">
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="font-mono-tech text-[10px] text-[#ff6534] bg-[#ff6534]/10 border border-[#ff6534]/20 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
                  {currentPillar.tag}
                </span>
              </div>
              <span className="font-mono-tech text-xs text-[#ae8882] font-bold">
                0{activeIdx + 1} / 0{MISSION_PILLARS.length}
              </span>
            </div>

            <div>
              <h4 className="font-sora font-extrabold text-base text-white mb-1">
                {currentPillar.title}
              </h4>
              <p className="font-inter text-xs text-[#e8bdb6] leading-relaxed">
                {currentPillar.desc}
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono-tech text-[#e2e2e2]/60">
              <span>{currentPillar.subtitle}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#de1615] animate-ping" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
