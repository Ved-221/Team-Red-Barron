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
  icon: React.ComponentType<{ className?: string }>;
  imageSrc: string;
  description: string;
  specs: { label: string; val: string }[];
}

const milestones: VehicleMilestone[] = [
  {
    year: "2026",
    vehicleName: "Albatros XIV",
    rank: "AIR 3 National",
    subtitle: "AIR 3 Overall Podium & BEST 4WD",
    badge: "BEST 4WD",
    icon: ShieldCheck,
    imageSrc: "/final_photo_vehicle.png",
    description:
      "Secured AIR 3 overall and AIR 4 in both Statics and Dynamics, emerging as the best-performing 4WD vehicle and continuing the team’s engineering evolution.",
    specs: [
      { label: "OVERALL RANK", val: "AIR 3 National" },
      { label: "STATICS RANK", val: "AIR 4 Overall" },
      { label: "DYNAMICS RANK", val: "AIR 4 Overall" },
      { label: "AWARD", val: "Best 4WD Vehicle" },
    ],
  },
  {
    year: "2025",
    vehicleName: "Albatros XIII",
    rank: "AIR 3 National",
    subtitle: "AIR 3 Overall Podium & AIR 1 Statics",
    badge: "AIR 3 PODIUM",
    icon: ShieldCheck,
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2025.jpg",
    description:
      "Achieved AIR 3 Overall National Rank at BAJA SAE India 2025 in Hyderabad. Secured AIR 1 Overall Statics, AIR 3 Sled Pull, and AIR 2 in CAE & Cost Evaluations among 100+ national universities.",
    specs: [
      { label: "OVERALL RANK", val: "AIR 3 National" },
      { label: "STATICS RANK", val: "AIR 1 Overall" },
      { label: "SLED PULL", val: "AIR 3 Podium" },
      { label: "CAE & COST", val: "AIR 2 National" },
    ],
  },
  {
    year: "2024",
    vehicleName: "e-BAJA SAE 2024",
    rank: "National Runner-Up",
    subtitle: "National Overall Runner-Up — Electric Era",
    badge: "ELECTRIC PODIUM",
    icon: Zap,
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2024.jpg",
    description:
      "Achieved National Overall Runner-Up at e-BAJA SAE India 2024. Won prestigious awards including Green Efficient Vehicle, Engineering Design Champion, and Technical Innovation Award.",
    specs: [
      { label: "OVERALL", val: "National Runner-Up" },
      { label: "POWERTRAIN", val: "High Torque EV Motor" },
      { label: "AWARDS", val: "Green Efficient & Design" },
      { label: "INNOVATION", val: "1st Rank Tech Award" },
    ],
  },
  {
    year: "2023",
    vehicleName: "Albatros XII",
    rank: "Telemetry Era",
    subtitle: "Advanced IoT Telemetry & Dynamic Rigidity",
    badge: "TELEMETRY ERA",
    icon: Cpu,
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2023.png",
    description:
      "Integrated real-time wireless IoT pitwall telemetry streaming wheel speeds, CVT temperatures, and suspension travel metrics live. Optimized chassis weight reduction by 14% with enhanced torsional stiffness.",
    specs: [
      { label: "TELEMETRY", val: "Real-Time Wireless IoT" },
      { label: "CHASSIS", val: "-14% Weight Saved" },
      { label: "SUSPENSION", val: "16\" Wheel Travel" },
      { label: "DATA FEED", val: "Live Pit Dashboard" },
    ],
  },
  {
    year: "2022",
    vehicleName: "Albatros XR",
    rank: "1st AIR Statics",
    subtitle: "Best 4WD ATV & 1st Overall Statics",
    badge: "BEST 4WD ATV",
    icon: Trophy,
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2022.avif",
    description:
      "Awarded 'Best 4WD ATV' & 1st Rank in Overall Statics at BAJA SAE India 2022. First collegiate team to clear complete Technical Inspection on the very first attempt without callbacks.",
    specs: [
      { label: "STATICS", val: "1st Rank AIR" },
      { label: "AWARD", val: "Best 4WD ATV" },
      { label: "TECH INSPECT", val: "Passed 1st Attempt" },
      { label: "SUSPENSION", val: "Dual A-Arm Air Shocks" },
    ],
  },
  {
    year: "2021",
    vehicleName: "Albatros X",
    rank: "1st AIR Design",
    subtitle: "First Four-Wheel-Drive (4WD) ATV",
    badge: "4WD INNOVATION",
    icon: Zap,
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2021.avif",
    description:
      "Pioneered Team Red Baron's first custom 4WD transfer case and custom front differential setup. Dominated BAJA SAE India 2021 Overall Design Standings and earned 2nd Runner-Up Cost internationally.",
    specs: [
      { label: "DRIVETRAIN", val: "First 4WD Spec" },
      { label: "DESIGN", val: "1st Standings AIR" },
      { label: "INTL COST", val: "2nd Runner-Up" },
      { label: "TRANSFER CASE", val: "Custom CNC Al" },
    ],
  },
  {
    year: "2020",
    vehicleName: "Albatros 9.0",
    rank: "Overall Runner-Up",
    subtitle: "Custom In-House CVT S1 & ESI Runner-Up",
    badge: "CVT INNOVATION",
    icon: Cpu,
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2020.avif",
    description:
      "Engineered the team's first custom in-house CVT calibration and reduction gearbox. Won ESI 2020 Overall Runner-Up (1st Design, 1st Cost, 2nd Endurance, Fastest Lap) and 3rd Design at BAJA SAE India.",
    specs: [
      { label: "ESI OVERALL", val: "2nd Rank Runner-Up" },
      { label: "CVT DYNAMICS", val: "In-House S1 Spec" },
      { label: "FASTEST LAP", val: "Winner ESI" },
      { label: "DESIGN", val: "3rd AIR India" },
    ],
  },
  {
    year: "2019",
    vehicleName: "Albatros 8.0",
    rank: "Top 5 AIR",
    subtitle: "BAJA USA Rochester NY & Triple Competition",
    badge: "TRIPLE COMPETITION",
    icon: Sparkles,
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2019.avif",
    description:
      "Competed simultaneously across 3 premier championships: BAJA SAE India (Top 5), ESI (1st Design, 2nd Cost, 3rd Endurance), and BAJA SAE USA in Rochester, New York.",
    specs: [
      { label: "USA VENUE", val: "Rochester NY" },
      { label: "ESI DESIGN", val: "1st Rank Winner" },
      { label: "INDIA RANK", val: "Top 5 Overall" },
      { label: "ESI COST", val: "2nd Rank" },
    ],
  },
  {
    year: "2018",
    vehicleName: "Albatros 7.0",
    rank: "2nd AIR Endurance",
    subtitle: "Runner-Up Durability Award",
    badge: "NATIONAL PODIUM",
    icon: Trophy,
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2018.avif",
    description:
      "Secured 2nd Place in the 4-Hour Endurance Race at BAJA SAE India along with the Runner-Up Durability Award. Followed up with an Overall 2nd Runner-Up finish at Enduro Student India (ESI) 2018.",
    specs: [
      { label: "ENDURANCE", val: "2nd Rank AIR" },
      { label: "DURABILITY", val: "Runner-Up Award" },
      { label: "ESI 2018", val: "2nd Runner-Up" },
      { label: "TOP SPEED", val: "58 km/h Dirt" },
    ],
  },
  {
    year: "2017",
    vehicleName: "Albatros 6.0",
    rank: "Overall Runner-Up",
    subtitle: "BAJA USA Illinois Debut & ESI Runner-Up",
    badge: "INTERNATIONAL USA",
    icon: Flag,
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2017.avif",
    description:
      "Expanded onto the international stage at BAJA SAE Illinois USA (7th fastest lap overall). Claimed ESI 2017 Overall Runner-Up (1st in Design) and MegaATV Overall Runner-Up titles.",
    specs: [
      { label: "USA DEBUT", val: "BAJA Illinois USA" },
      { label: "ESI 2017", val: "Overall Runner-Up" },
      { label: "DESIGN", val: "1st Rank ESI" },
      { label: "MEGAATV", val: "Overall 2nd Rank" },
    ],
  },
  {
    year: "2016",
    vehicleName: "Albatros 5.0",
    rank: "5th AIR Design",
    subtitle: "Tech Innovation Composite Steering",
    badge: "COMPOSITE TECH",
    icon: Zap,
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2016.avif",
    description:
      "Won 2nd Prize in Technical Innovation for lightweight composite steering linkage design. Secured 5th in Engineering Design, 6th Lightest Vehicle overall, and 7th in Acceleration.",
    specs: [
      { label: "TECH AWARD", val: "2nd Composite Linkage" },
      { label: "DESIGN RANK", val: "5th AIR" },
      { label: "WEIGHT RANK", val: "6th Lightest ATV" },
      { label: "ACCELERATION", val: "7th AIR" },
    ],
  },
  {
    year: "2015",
    vehicleName: "Albatros 4.0",
    rank: "12th AIR",
    subtitle: "4-Hour Endurance Landmark",
    badge: "ENDURANCE PROVEN",
    icon: ShieldCheck,
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2015.avif",
    description:
      "Became the team's first ATV to complete the brutal 4-hour BAJA SAE endurance race without a single mechanical breakdown. Tested structural longevity and thermal endurance under extreme track heat.",
    specs: [
      { label: "ENDURANCE", val: "4-Hour Full Finish" },
      { label: "OVERALL RANK", val: "12th AIR" },
      { label: "RELIABILITY", val: "0 Mech Failures" },
      { label: "CHASSIS", val: "Chromoly 4130" },
    ],
  },
  {
    year: "2014",
    vehicleName: "Albatros 3.0",
    rank: "8th AIR Podium",
    subtitle: "Best Engineering Design Winner",
    badge: "DESIGN CHAMPION",
    icon: Trophy,
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2014.avif",
    description:
      "Captured the coveted 'Best Engineering Design' national award. Cleared the steep hill-climb challenge in a record 13 seconds with flawless maneuverability, elevating TRB into the national top 10.",
    specs: [
      { label: "AWARD", val: "Best Engineering Design" },
      { label: "OVERALL", val: "8th AIR Podium" },
      { label: "HILL CLIMB", val: "13 Seconds" },
      { label: "MANEUVERABILITY", val: "Zero Penalty" },
    ],
  },
  {
    year: "2013",
    vehicleName: "Albatros 2.0",
    rank: "30th AIR",
    subtitle: "Suspension Tech — Top 5 Innovation Award",
    badge: "INNOVATION NOMINEE",
    icon: Cpu,
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2013.avif",
    description:
      "Pioneered an independent leaf spring front suspension mechanism that earned a nomination in the Top 5 Innovations at BAJA SAE India 2013. Climbed 4 ranks nationally against 125 collegiate teams.",
    specs: [
      { label: "SUSPENSION", val: "Independent Leaf Spring" },
      { label: "RANK", val: "30th AIR / 125 Teams" },
      { label: "AWARD", val: "Top 5 Tech Innovation" },
      { label: "EVENT", val: "Pithampur Track" },
    ],
  },
  {
    year: "2012",
    vehicleName: "Albatros 1.0",
    rank: "34th AIR",
    subtitle: "The Genesis — PCCOE BAJA Foundation",
    badge: "FOUNDING ERA",
    icon: Flag,
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2012.avif",
    description:
      "Founded by 25 passionate undergraduates at PCCOE Pune inspired by Capt. Manfred von Richthofen 'The Red Baron'. Albatros 1.0 successfully completed its maiden national dynamic events and established the engineering foundation for Team Red Baron.",
    specs: [
      { label: "FRAME", val: "Tubular Spaceframe" },
      { label: "RANK", val: "34th AIR" },
      { label: "TEAM SIZE", val: "25 Engineers" },
      { label: "COMPETITION", val: "BAJA SAE India" },
    ],
  },
];

export function AboutTimeline() {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleMilestones = isExpanded ? milestones : milestones.slice(0, 4);

  const timelineData: TimelineEntry[] = visibleMilestones.map((m, idx) => {
    const IconComponent = m.icon;
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
