"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SparklesDivider } from "@/components/ui/SparklesDivider";
import { WarpText } from "@/components/ui/WarpText";
import GhostCursor from "@/components/ui/GhostCursor";
import { ChevronDown, Users, ShieldAlert, Cpu, Wrench, Flame, Zap, Settings } from "lucide-react";

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export interface DepartmentInfo {
  name: "TRANSMISSION" | "ACCUMULATOR" | "ELECTRIC POWERTRAIN" | "ROLLCAGE" | "VEHICLE DYNAMICS" | "MECHANICAL POWERTRAIN";
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
}

const getLinkedinUrl = (url?: string) => {
  if (!url || url === "#") return "#";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
};

const DEPARTMENTS: DepartmentInfo[] = [
  {
    name: "TRANSMISSION",
    description: "Designing and optimizing the power delivery system to ensure maximum efficiency and performance on the track.",
    icon: Settings,
  },
  {
    name: "ACCUMULATOR",
    description: "Developing safe, high-capacity, and high-discharge energy storage systems for our electric powertrain.",
    icon: Cpu,
  },
  {
    name: "ELECTRIC POWERTRAIN",
    description: "Engineering the high-voltage electrical systems and motor controllers that provide our vehicle's immense torque.",
    icon: Zap,
  },
  {
    name: "ROLLCAGE",
    description: "Constructing the structural backbone of the race car, ensuring driver safety and maximizing torsional rigidity.",
    icon: ShieldAlert,
  },
  {
    name: "VEHICLE DYNAMICS",
    description: "Fine-tuning suspension, steering, and aerodynamics to give our drivers complete control in every corner.",
    icon: Wrench,
  },
  {
    name: "MECHANICAL POWERTRAIN",
    description: "Maximizing the efficiency and reliability of internal combustion components for extreme racing conditions.",
    icon: Flame,
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TeamContent({ teamData }: { teamData: Record<string, any[]> }) {
  const searchParams = useSearchParams();
  const yearParam = searchParams.get("year");
  
  // Find latest year if nothing is selected or year is invalid
  const allYears = Object.keys(teamData).sort().reverse();
  const defaultYear = allYears.length > 0 ? allYears[0] : "2025-26";
  
  const selectedSeason = (yearParam && teamData[yearParam]) ? yearParam : defaultYear;
  const currentMembers = teamData[selectedSeason] || [];

  return (
    <main className="min-h-screen bg-black text-[#e2e2e2] flex flex-col selection:bg-[#de1615] selection:text-white">
      <Navbar />

      <section className="pt-32 pb-16 relative overflow-hidden">
        <GhostCursor className="absolute inset-0 z-0 pointer-events-none" color="#de1615" bloomStrength={0.25} bloomRadius={1.2} trailLength={60} inertia={0.6} fadeDelayMs={800} fadeDurationMs={1500} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-[#de1615]/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 font-mono-tech text-xs text-[#de1615] tracking-widest uppercase bg-[#1a0505] px-4 py-1.5 rounded-full border border-[#de1615]/30 mb-8">
            <Zap className="w-3.5 h-3.5 text-[#de1615]" />
            <span>THE ENGINEERS BEHIND ALBATROSS</span>
          </div>

          <div className="w-full pb-14 flex justify-center items-center">
            <WarpText
              key={selectedSeason}
              text={`TEAM ${selectedSeason}`}
              color="#de1615"
              warpStrength={0.08}
              warpScale={1.7}
              speed={0.55}
              pointerInfluence={0.42}
              pointerStrength={0.38}
              refraction={0.018}
              ripple
              fontSize="clamp(3.5rem, 9vw, 7rem)"
              fontWeight={900}
              fontFamily="Sora, sans-serif"
              letterSpacing="-0.03em"
              style={{ height: "160px", width: "100%" }}
            />
          </div>
        </div>
      </section>

      <section className="pb-32 relative z-10 pt-16">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 space-y-28">
          
          {DEPARTMENTS.map((dept) => {
            const deptMembers = currentMembers.filter(
              (m) => m.department === dept.name
            );

            if (deptMembers.length === 0) return null;

            const IconComponent = dept.icon;

            return (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8 scroll-mt-32"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="text-center max-w-3xl mx-auto space-y-3"
                >
                  <div className="inline-flex items-center justify-center gap-2 font-sora font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-wider">
                    <IconComponent className="w-6 h-6 text-[#de1615]" />
                    <span>{dept.name}</span>
                  </div>
                  <p className="text-gray-400 font-inter text-sm sm:text-base leading-relaxed">
                    {dept.description}
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {deptMembers.map((member, idx) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 35, scale: 0.96 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{
                        duration: 0.65,
                        delay: (idx % 4) * 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="group relative bg-[#12151b]/80 border border-white/10 rounded-2xl overflow-hidden hover:border-[#de1615]/70 hover:shadow-[0_0_30px_rgba(222,22,21,0.25)] transition-all duration-300 flex flex-row items-stretch"
                    >
                      <div className="relative w-28 sm:w-32 shrink-0 bg-black/50 overflow-hidden">
                        <img
                          src={member.photo_url || "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png"}
                          alt={member.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#12151b]/80" />
                      </div>

                      <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          <h3 className="font-sora font-bold text-base sm:text-lg text-white group-hover:text-[#de1615] transition-colors uppercase leading-tight">
                            {member.name}
                          </h3>
                        </div>

                        <div className="pt-3 flex justify-end">
                          <a
                            href={getLinkedinUrl(member.linkedin_url)}
                            target={member.linkedin_url && member.linkedin_url !== "#" ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-[#de1615] hover:border-[#de1615] text-white flex items-center justify-center transition-all hover:scale-110 shadow-md"
                            aria-label={`${member.name}'s LinkedIn profile`}
                          >
                            <LinkedinIcon className="w-4 h-4 fill-current" />
                          </a>
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#de1615]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  ))}
                </div>

                <div className="pt-8">
                  <SparklesDivider />
                </div>
              </motion.div>
            );
          })}

          {/* Fallback for members without a matching department */}
          {(() => {
            const definedDepts = DEPARTMENTS.map((d) => d.name);
            const unassignedMembers = currentMembers.filter(
              (m) => !definedDepts.includes(m.department as any)
            );

            if (unassignedMembers.length === 0) return null;

            return (
              <motion.div
                key="Unassigned"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8 scroll-mt-32"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="text-center max-w-3xl mx-auto space-y-3"
                >
                  <div className="inline-flex items-center justify-center gap-2 font-sora font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-wider">
                    <Users className="w-6 h-6 text-[#de1615]" />
                    <span>Team Members</span>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {unassignedMembers.map((member, idx) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 35, scale: 0.96 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{
                        duration: 0.65,
                        delay: (idx % 4) * 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="group relative bg-[#12151b]/80 border border-white/10 rounded-2xl overflow-hidden hover:border-[#de1615]/70 hover:shadow-[0_0_30px_rgba(222,22,21,0.25)] transition-all duration-300 flex flex-row items-stretch"
                    >
                      <div className="relative w-28 sm:w-32 shrink-0 bg-black/50 overflow-hidden">
                        <img
                          src={member.photo_url || "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png"}
                          alt={member.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#12151b]/80" />
                      </div>

                      <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          <h3 className="font-sora font-bold text-base sm:text-lg text-white group-hover:text-[#de1615] transition-colors uppercase leading-tight">
                            {member.name}
                          </h3>
                        </div>

                        <div className="pt-3 flex justify-end">
                          <a
                            href={getLinkedinUrl(member.linkedin_url)}
                            target={member.linkedin_url && member.linkedin_url !== "#" ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-[#de1615] hover:border-[#de1615] text-white flex items-center justify-center transition-all hover:scale-110 shadow-md"
                            aria-label={`${member.name}'s LinkedIn profile`}
                          >
                            <LinkedinIcon className="w-4 h-4 fill-current" />
                          </a>
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#de1615]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  ))}
                </div>

                <div className="pt-8">
                  <SparklesDivider />
                </div>
              </motion.div>
            );
          })()}

        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function TeamClient({ teamData }: { teamData: Record<string, any[]> }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <TeamContent teamData={teamData} />
    </Suspense>
  );
}
