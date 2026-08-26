"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  Cpu,
  Trophy,
  Wrench,
  Sparkles,
  ChevronRight,
  Activity,
  Layers,
  ArrowRight,
} from "lucide-react";

interface Member {
  id: string;
  name: string;
  position: string;
  responsibility: string;
  tagline: string;
  description: string;
  department: string;
  academicYear: string;
  experience: string;
  tags: string[];
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  fallbackGradient: string;
}

const LEADERS: Member[] = [
  {
    id: "captain",
    name: "Vedant Patil",
    position: "Team Captain",
    responsibility: "Overall Team Lead & Driver",
    tagline: "Captain of the Ship",
    description: "Guides overall team strategy, technical direction, and pitwall execution.",
    department: "Chassis & Operations",
    academicYear: "Final Year B.Tech",
    experience: "3+ BAJA Seasons",
    tags: ["Leadership", "Strategy", "Driving"],
    icon: Trophy,
    image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team/leader1.jpg",
    fallbackGradient: "from-[#de1615]/30 to-[#121414]",
  },
  {
    id: "vice_captain",
    name: "Atharva Kulkarni",
    position: "Vice Captain",
    responsibility: "Technical Director",
    tagline: "The Strategic Mind",
    description: "Oversees vehicle dynamics, transmission tuning, and structural FEA testing.",
    department: "Drivetrain & Dynamics",
    academicYear: "Final Year B.Tech",
    experience: "3 BAJA Seasons",
    tags: ["Drivetrain", "FEA", "Tuning"],
    icon: Zap,
    image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team/leader2.jpg",
    fallbackGradient: "from-[#ff6534]/30 to-[#121414]",
  },
  {
    id: "telemetry_lead",
    name: "Pranav Joshi",
    position: "Telemetry Lead",
    responsibility: "Electronics & Software Head",
    tagline: "Eyes on Every Metric",
    description: "Architects wireless IoT hubs streaming live vehicle thermal & speed metrics.",
    department: "IoT Systems & Software",
    academicYear: "Third Year B.Tech",
    experience: "2 BAJA Seasons",
    tags: ["IoT Hub", "Sensors", "Telemetry"],
    icon: Cpu,
    image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team/leader3.jpg",
    fallbackGradient: "from-[#de1615]/30 to-[#121414]",
  },
  {
    id: "design_lead",
    name: "Siddharth Pawar",
    position: "Design Lead",
    responsibility: "Chassis & Ergonomics Head",
    tagline: "Shaping Performance",
    description: "Leads 3D CAD modeling, cockpit ergonomics, and roll cage safety compliance.",
    department: "CAD Kinematics & Body",
    academicYear: "Final Year B.Tech",
    experience: "3 BAJA Seasons",
    tags: ["3D CAD", "Roll Cage", "Ergonomics"],
    icon: ShieldCheck,
    image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team/leader4.jpg",
    fallbackGradient: "from-[#ff6534]/30 to-[#121414]",
  },
  {
    id: "manufacturing_lead",
    name: "Yash Deshmukh",
    position: "Manufacturing Lead",
    responsibility: "Workshop Operations",
    tagline: "Built with Precision",
    description: "Manages CNC machining, TIG welding, and 100% quality inspection.",
    department: "Workshop & CNC Fab",
    academicYear: "Final Year B.Tech",
    experience: "3 BAJA Seasons",
    tags: ["TIG Welding", "CNC Machining", "Assembly"],
    icon: Wrench,
    image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team/leader5.jpg",
    fallbackGradient: "from-[#de1615]/30 to-[#121414]",
  },
];

export function LeadershipExperience() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>(null);

  const toggleMobileExpand = (id: string) => {
    setMobileExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-24 px-5 sm:px-10 lg:px-20 max-w-[1440px] mx-auto w-full relative z-10 select-none">
      {/* SECTION HEADER WITH ENTRANCE ANIMATION */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#de1615]/15 border border-[#de1615]/40 text-[#de1615] font-mono-tech text-xs tracking-widest uppercase mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#ff6534] animate-pulse" />
          THE PEOPLE BEHIND THE MACHINE
        </div>

        <h2 className="font-sora font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight leading-tight">
          Meet the Team Driving <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ffb59f] to-[#de1615]">
            Red Baron Forward
          </span>
        </h2>

        <p className="font-inter text-base sm:text-lg text-[#e8bdb6] mt-4 leading-relaxed max-w-2xl font-normal">
          “Behind every race, every innovation, and every victory is a team of passionate students turning ideas into reality.”
        </p>
      </motion.div>

      {/* LEADERSHIP MEMBERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {LEADERS.map((leader, index) => {
          const IconComponent = leader.icon;
          const isHovered = hoveredId === leader.id;
          const isMobileExpanded = mobileExpandedId === leader.id;
          const isExpanded = isHovered || isMobileExpanded;

          return (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              onMouseEnter={() => setHoveredId(leader.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => toggleMobileExpand(leader.id)}
              className="relative group rounded-3xl overflow-hidden glass-card border border-white/15 bg-[#121414]/90 backdrop-blur-xl transition-all duration-500 hover:border-[#de1615] hover:shadow-[0_0_35px_rgba(222,22,21,0.25)] cursor-pointer min-h-[440px] flex flex-col justify-between"
            >
              {/* Background Motorsport Telemetry SVG Lines */}
              <div className="absolute inset-0 pointer-events-none opacity-10 group-hover:opacity-25 transition-opacity duration-500">
                <svg className="w-full h-full stroke-white/40 fill-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 40 H300 M40 0 V400 M200 0 V400" strokeWidth="0.5" strokeDasharray="4 4" />
                </svg>
              </div>

              {/* CARD INITIAL VIEW CONTAINER */}
              <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-7 z-10">
                {/* Top Badge & Header Line */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono-tech text-[10px] text-[#de1615] bg-[#de1615]/15 border border-[#de1615]/40 px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <IconComponent className="w-3.5 h-3.5" />
                    {leader.position}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono-tech text-[#ae8882]">
                    <Activity className="w-3.5 h-3.5 text-[#ff6534] animate-pulse" />
                    <span>REF #0{index + 1}</span>
                  </div>
                </div>

                {/* Dominant Portrait Visual Area */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-black/60 my-2 group-hover:border-[#de1615]/50 transition-colors">
                  {/* Portrait Placeholder Artwork with Gradient & Initials */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${leader.fallbackGradient} flex flex-col items-center justify-center text-center p-4`}>
                    <div className="w-16 h-16 rounded-full bg-black/60 border-2 border-[#de1615] flex items-center justify-center font-sora font-extrabold text-2xl text-white shadow-[0_0_20px_rgba(222,22,21,0.5)] mb-2 group-hover:scale-110 transition-transform">
                      {leader.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="font-mono-tech text-[11px] text-[#ffb59f] uppercase tracking-widest font-semibold">
                      TRB PITWALL LEAD
                    </span>
                  </div>

                  {/* Gradient Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                  {/* Tagline Overlay on Portrait */}
                  <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 text-center">
                    <span className="font-mono-tech text-xs text-[#ff6534] italic font-semibold">
                      “{leader.tagline}”
                    </span>
                  </div>
                </div>

                {/* Member Name & Responsibility Footer */}
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <h3 className="font-sora font-extrabold text-xl text-white group-hover:text-[#ffb59f] transition-colors">
                      {leader.name}
                    </h3>
                    <p className="font-mono-tech text-xs text-[#ae8882] mt-0.5">
                      {leader.responsibility}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white group-hover:bg-[#de1615] group-hover:border-[#de1615] group-hover:text-white transition-all shrink-0">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>

              {/* OVERLAY SLIDE-IN ENGINEERING PANEL ON HOVER / TAP */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: "100%" }}
                    animate={{ opacity: 1, x: "0%" }}
                    exit={{ opacity: 0, x: "100%" }}
                    transition={{ type: "spring", stiffness: 220, damping: 25 }}
                    className="absolute inset-0 z-20 p-6 sm:p-7 bg-[#08090b] border-l-2 border-[#de1615] flex flex-col justify-between overflow-y-auto no-scrollbar shadow-2xl"
                  >
                    {/* Header */}
                    <div className="flex flex-col gap-0.5 pb-3 border-b border-white/10">
                      <h4 className="font-sora font-extrabold text-xl text-white">
                        {leader.name}
                      </h4>
                      <span className="font-mono-tech text-xs text-[#de1615] font-semibold">
                        {leader.position} • {leader.responsibility}
                      </span>
                    </div>

                    {/* What They Do Description */}
                    <div className="my-2">
                      <span className="font-mono-tech text-[10px] text-[#ae8882] uppercase tracking-wider block mb-1">
                        LEADERSHIP CONTRIBUTION
                      </span>
                      <p className="font-inter text-xs text-white/90 leading-relaxed font-normal">
                        {leader.description}
                      </p>
                    </div>

                    {/* 2x2 Technical Metrics Grid (Filling Vertical Space) */}
                    <div className="grid grid-cols-2 gap-2 my-2">
                      <div className="p-2.5 rounded-xl bg-[#14161a] border border-white/10 flex flex-col justify-center">
                        <span className="font-mono-tech text-[9px] text-[#ae8882] uppercase tracking-wider">DEPARTMENT</span>
                        <span className="font-sora font-bold text-xs text-white truncate mt-0.5">{leader.department}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#14161a] border border-white/10 flex flex-col justify-center">
                        <span className="font-mono-tech text-[9px] text-[#ae8882] uppercase tracking-wider">ACADEMIC</span>
                        <span className="font-sora font-bold text-xs text-white truncate mt-0.5">{leader.academicYear}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#14161a] border border-white/10 flex flex-col justify-center">
                        <span className="font-mono-tech text-[9px] text-[#ae8882] uppercase tracking-wider">TRACK EXP</span>
                        <span className="font-sora font-bold text-xs text-[#ff6534] truncate mt-0.5">{leader.experience}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#14161a] border border-white/10 flex flex-col justify-center">
                        <span className="font-mono-tech text-[9px] text-[#ae8882] uppercase tracking-wider">SEASON</span>
                        <span className="font-sora font-bold text-xs text-white truncate mt-0.5">2024 – 2025</span>
                      </div>
                    </div>

                    {/* Key Focus Areas (Tags) */}
                    <div className="my-1">
                      <span className="font-mono-tech text-[10px] text-[#ae8882] uppercase tracking-wider block mb-1.5">
                        KEY FOCUS AREAS
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {leader.tags.map((t) => (
                          <span
                            key={t}
                            className="font-mono-tech text-[10px] bg-[#de1615]/15 border border-[#de1615]/30 px-2.5 py-1 rounded-md text-[#ffb59f] font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* VIEW ENTIRE TEAM CTA BUTTON */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Link
          href="/team"
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#de1615] hover:bg-[#b81211] text-white font-sora font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(222,22,21,0.4)] hover:shadow-[0_0_35px_rgba(222,22,21,0.6)] hover:scale-105"
        >
          <span>VIEW ENTIRE TEAM ROSTER</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-white" />
        </Link>
      </motion.div>
    </section>
  );
}
