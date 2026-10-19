"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SparklesDivider } from "@/components/ui/SparklesDivider";
import { WarpText } from "@/components/ui/WarpText";
import GhostCursor from "@/components/ui/GhostCursor";
import { ShieldAlert, Cpu, Wrench, Flame, Zap, Settings } from "lucide-react";

import { SmartImage } from "@/components/SmartImage";

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

const KNOWN_DEPARTMENTS: Record<string, { description: string; icon: React.ComponentType<{ className?: string }> }> = {
  "TRANSMISSION": {
    description: "Designing and optimizing the power delivery system to ensure maximum efficiency and performance on the track.",
    icon: Settings,
  },
  "ACCUMULATOR": {
    description: "Developing safe, high-capacity, and high-discharge energy storage systems for our electric powertrain.",
    icon: Cpu,
  },
  "ELECTRIC POWERTRAIN": {
    description: "Engineering the high-voltage electrical systems and motor controllers that provide our vehicle's immense torque.",
    icon: Zap,
  },
  "ROLLCAGE": {
    description: "Constructing the structural backbone of the race car, ensuring driver safety and maximizing torsional rigidity.",
    icon: ShieldAlert,
  },
  "VEHICLE DYNAMICS": {
    description: "Fine-tuning suspension, steering, and aerodynamics to give our drivers complete control in every corner.",
    icon: Wrench,
  },
  "MECHANICAL POWERTRAIN": {
    description: "Maximizing the efficiency and reliability of internal combustion components for extreme racing conditions.",
    icon: Flame,
  },
};

export interface TeamMemberItem {
  id: string;
  name: string;
  department: string;
  academic_year?: string | null;
  linkedin_url?: string | null;
  image_url?: string | null;
  photo_url?: string | null;
  team_year_id: string;
  sort_order?: number;
}

function TeamContent({
  teamData,
  chromeData,
}: {
  teamData: Record<string, TeamMemberItem[]>;
  chromeData?: SharedChromeData;
}) {
  const searchParams = useSearchParams();
  const yearParam = searchParams.get("year");
  
  // Find latest year if nothing is selected or year is invalid
  const allYears = Object.keys(teamData).sort().reverse();
  const defaultYear = allYears.length > 0 ? allYears[0] : "2025-26";
  
  const selectedSeason = (yearParam && teamData[yearParam]) ? yearParam : defaultYear;
  const currentMembers = teamData[selectedSeason] || [];

  return (
    <main className="min-h-screen bg-black text-[#e2e2e2] flex flex-col selection:bg-[#de1615] selection:text-white">
      <Navbar teamYears={chromeData?.teamYears} supportSettings={chromeData?.siteSettings} />

      <section className="pt-32 pb-16 relative overflow-hidden">
        <GhostCursor className="absolute inset-0 z-0 pointer-events-none" color="#de1615" bloomStrength={0.25} bloomRadius={1.2} trailLength={60} inertia={0.6} fadeDelayMs={800} fadeDurationMs={1500} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-[#de1615]/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 relative z-10 flex flex-col items-center">
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
          
          {(() => {
            const memberDepts = Array.from(
              new Set(currentMembers.map((m) => (m.department?.trim() || "ENGINEERING").toUpperCase()))
            );

            const knownKeys = Object.keys(KNOWN_DEPARTMENTS);
            const activeDepartments = memberDepts.sort((a, b) => {
              const idxA = knownKeys.indexOf(a);
              const idxB = knownKeys.indexOf(b);
              if (idxA !== -1 && idxB !== -1) return idxA - idxB;
              if (idxA !== -1) return -1;
              if (idxB !== -1) return 1;
              return a.localeCompare(b);
            });

            return activeDepartments.map((deptName) => {
              const deptMembers = currentMembers.filter(
                (m) => (m.department?.trim() || "ENGINEERING").toUpperCase() === deptName
              );

              if (deptMembers.length === 0) return null;

              const info = KNOWN_DEPARTMENTS[deptName] || {
                description: `Specialized engineering and operational domain for ${deptName}.`,
                icon: Wrench,
              };
              const IconComponent = info.icon;

              return (
                <motion.div
                  key={deptName}
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
                      <span>{deptName}</span>
                    </div>
                    <p className="text-gray-400 font-inter text-sm sm:text-base leading-relaxed">
                      {info.description}
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
                        <div className="relative w-28 sm:w-32 shrink-0 bg-black/50 overflow-hidden min-h-[110px] sm:min-h-[120px]">
                          <SmartImage
                            src={member.photo_url || "/team_person.webp"}
                            fallbackSrc="/team_person.webp"
                            alt={member.name}
                            fill
                            sizes="(max-width: 640px) 112px, 128px"
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
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
            });
          })()}

        </div>
      </section>

      <Footer contactData={chromeData?.contactInfo} />
    </main>
  );
}

export default function TeamClient({
  teamData,
  chromeData,
}: {
  teamData: Record<string, TeamMemberItem[]>;
  chromeData?: SharedChromeData;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <TeamContent teamData={teamData} chromeData={chromeData} />
    </Suspense>
  );
}
