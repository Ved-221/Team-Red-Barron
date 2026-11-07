"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SparklesDivider } from "@/components/ui/SparklesDivider";
import { WarpText } from "@/components/ui/WarpText";
import GhostCursor from "@/components/ui/GhostCursor";
import { ShieldAlert, Cpu, Wrench, Flame, Zap, Settings, GraduationCap } from "lucide-react";

import { SmartImage } from "@/components/SmartImage";
import type { DepartmentItem } from "@/lib/departments";

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

import type { SharedChromeData } from "@/lib/server-data";

const getLinkedinUrl = (url?: string | null) => {
  if (!url || url === "#") return "#";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
};

const KNOWN_DEPARTMENTS: Record<string, { description: string; icon: React.ComponentType<{ className?: string }> }> = {
  "FACULTY ADVISOR": {
    description: "Academic mentorship and institutional leadership guiding technical research, safety standards, and collegiate compliance.",
    icon: GraduationCap,
  },
  "FACULTY ADVISORS": {
    description: "Academic mentors and institutional leadership guiding technical research, safety standards, and collegiate compliance.",
    icon: GraduationCap,
  },
  "FACULTY": {
    description: "Academic mentors and institutional leadership guiding technical research, safety standards, and collegiate compliance.",
    icon: GraduationCap,
  },
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
  position?: string | null;
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
  departments = [],
}: {
  teamData: Record<string, TeamMemberItem[]>;
  chromeData?: SharedChromeData;
  departments?: DepartmentItem[];
}) {
  const searchParams = useSearchParams();
  const yearParam = searchParams.get("year");
  
  // Find latest year with members if nothing is selected or year is invalid
  const allYears = Object.keys(teamData).sort().reverse();
  const defaultYear = allYears.find(y => (teamData[y] && teamData[y].length > 0)) || allYears[0] || "2025-26";
  
  const selectedSeason = (yearParam && teamData[yearParam]) ? yearParam : defaultYear;
  const currentMembers = teamData[selectedSeason] || [];

  return (
    <main className="min-h-screen bg-black text-[#e2e2e2] flex flex-col selection:bg-[#de1615] selection:text-white">
      <Navbar teamYears={chromeData?.teamYears} supportSettings={chromeData?.siteSettings} />

      <section className="pt-32 pb-16 max-md:pt-24 max-md:pb-6 relative overflow-hidden">
        <GhostCursor className="absolute inset-0 z-0 pointer-events-none" color="#de1615" bloomStrength={0.25} bloomRadius={1.2} trailLength={60} inertia={0.6} fadeDelayMs={800} fadeDurationMs={1500} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-[#de1615]/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 max-md:px-4 relative z-10 flex flex-col items-center">
          <div className="w-full pb-14 max-md:pb-6 flex justify-center items-center">
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
              fontSize="clamp(3rem, 9vw, 7rem)"
              fontWeight={900}
              fontFamily="Sora, sans-serif"
              letterSpacing="-0.03em"
              style={{ height: "140px", width: "100%" }}
            />
          </div>
        </div>
      </section>

      <section className="pb-32 max-md:pb-16 relative z-10 pt-16 max-md:pt-6">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 max-md:px-4 space-y-28 max-md:space-y-12">
          {currentMembers.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-mono-tech text-xs tracking-widest text-[#de1615] uppercase mb-2">Season Roster</p>
              <h3 className="font-sora text-xl sm:text-2xl text-white font-bold">No Team Members Listed Yet</h3>
              <p className="font-inter text-gray-400 text-sm mt-2 max-w-md mx-auto">
                Roster details for season {selectedSeason} will be announced soon.
              </p>
            </div>
          ) : (
            (() => {
              const memberDepts = Array.from(
                new Set(currentMembers.map((m) => (m.department?.trim() || "ENGINEERING").toUpperCase()))
              );

            const knownKeys = Object.keys(KNOWN_DEPARTMENTS);
              const deptMap = new Map((departments || []).map(d => [d.name.trim().toUpperCase(), d]));

              const activeDepartments = memberDepts.sort((a, b) => {
                const isFacultyA = a.includes("FACULTY") || a.includes("ADVISOR") || a.includes("LEADERSHIP");
                const isFacultyB = b.includes("FACULTY") || b.includes("ADVISOR") || b.includes("LEADERSHIP");
                if (isFacultyA && !isFacultyB) return -1;
                if (!isFacultyA && isFacultyB) return 1;

                const orderA = deptMap.get(a)?.sort_order ?? 999;
                const orderB = deptMap.get(b)?.sort_order ?? 999;
                if (orderA !== orderB) return orderA - orderB;

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

              const fallbackInfo = KNOWN_DEPARTMENTS[deptName] || {
                description: `Specialized engineering and operational domain for ${deptName}.`,
                icon: Wrench,
              };
              const deptMeta = deptMap.get(deptName);
              const descriptionText = deptMeta?.description?.trim() || fallbackInfo.description;
              const IconComponent = fallbackInfo.icon;

              return (
                <motion.div
                  key={deptName}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "120px" }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-8 max-md:space-y-4 scroll-mt-32"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "120px" }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="text-center max-w-3xl mx-auto space-y-3 max-md:space-y-1.5"
                  >
                    <div className="inline-flex items-center justify-center gap-2 font-sora font-extrabold text-2xl sm:text-3xl max-md:text-lg text-white uppercase tracking-wider">
                      <IconComponent className="w-6 h-6 max-md:w-4 max-md:h-4 text-[#de1615]" />
                      <span>{deptName}</span>
                    </div>
                    <p className="text-gray-400 font-inter text-sm sm:text-base max-md:text-xs leading-relaxed">
                      {descriptionText}
                    </p>
                  </motion.div>

                  <div className={
                    deptMembers.length === 1
                      ? "flex justify-center"
                      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-md:grid-cols-2 gap-6 lg:gap-8 max-md:gap-3"
                  }>
                    {deptMembers.map((member, idx) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: "120px" }}
                        transition={{
                          duration: 0.4,
                          delay: (idx % 3) * 0.05,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className={`group relative bg-[#12151b]/80 border border-white/10 rounded-2xl max-md:rounded-xl overflow-hidden hover:border-[#de1615]/70 hover:shadow-[0_0_30px_rgba(222,22,21,0.25)] transition-all duration-300 flex items-stretch ${
                          deptMembers.length === 1
                            ? "flex-row w-full max-w-md mx-auto"
                            : "flex-row max-md:flex-col"
                        }`}
                      >
                        <div
                          className={`relative shrink-0 bg-black/50 overflow-hidden ${
                            deptMembers.length === 1
                              ? "w-28 sm:w-36 aspect-[4/5] min-h-[140px] sm:min-h-[160px]"
                              : "w-28 sm:w-32 max-md:w-full max-md:aspect-[4/5] min-h-[110px] sm:min-h-[120px] max-md:min-h-0"
                          }`}
                        >
                          <SmartImage
                            src={member.photo_url || "/team_person.webp"}
                            fallbackSrc="/team_person.webp"
                            alt={member.name}
                            fill
                            priority={idx < 6}
                            sizes={
                              deptMembers.length === 1
                                ? "(max-width: 640px) 120px, 144px"
                                : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 128px"
                            }
                            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                          <div
                            className={`absolute inset-0 ${
                              deptMembers.length === 1
                                ? "bg-gradient-to-r from-transparent via-transparent to-[#12151b]/80"
                                : "bg-gradient-to-r max-md:bg-gradient-to-b from-transparent via-transparent to-[#12151b]/80"
                            }`}
                          />
                        </div>

                        <div
                          className={`p-4 flex flex-col justify-between flex-1 min-w-0 ${
                            deptMembers.length === 1 ? "max-md:p-3" : "max-md:p-2.5"
                          }`}
                        >
                          <div>
                            <h3
                              className={`font-sora font-bold text-white group-hover:text-[#de1615] transition-colors uppercase leading-tight line-clamp-2 ${
                                deptMembers.length === 1
                                  ? "text-base sm:text-lg max-md:text-sm"
                                  : "text-base sm:text-lg max-md:text-xs"
                              }`}
                            >
                              {member.name}
                            </h3>
                            {member.position?.trim() && (
                              <div className="mt-1.5 max-md:mt-1">
                                <span className="inline-block font-mono-tech text-xs max-md:text-[10px] text-[#ff4d4b] font-bold tracking-wider uppercase bg-[#de1615]/15 border border-[#de1615]/40 px-2 py-0.5 rounded shadow-sm">
                                  {member.position.trim()}
                                </span>
                              </div>
                            )}
                            {member.academic_year && (
                              <span className="font-mono-tech text-xs max-md:text-[10px] text-[#ae8882] line-clamp-2 block mt-1">
                                {member.academic_year}
                              </span>
                            )}
                          </div>

                          <div className="pt-3 max-md:pt-1.5 flex justify-end">
                            <a
                              href={getLinkedinUrl(member.linkedin_url)}
                              target={member.linkedin_url && member.linkedin_url !== "#" ? "_blank" : undefined}
                              rel="noopener noreferrer"
                              className="w-8 h-8 max-md:w-7 max-md:h-7 rounded-full bg-white/5 border border-white/10 hover:bg-[#de1615] hover:border-[#de1615] text-white flex items-center justify-center transition-all hover:scale-110 shadow-md shrink-0"
                              aria-label={`${member.name}'s LinkedIn profile`}
                            >
                              <LinkedinIcon className="w-4 h-4 max-md:w-3.5 max-md:h-3.5 fill-current" />
                            </a>
                          </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#de1615]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    ))}
                  </div>

                  <div className="pt-8 max-md:pt-4">
                    <SparklesDivider />
                  </div>
                </motion.div>
              );
            });
          })()
        )}

        </div>
      </section>

      <Footer contactData={chromeData?.contactInfo} />
    </main>
  );
}

export default function TeamClient({
  teamData,
  chromeData,
  departments,
}: {
  teamData: Record<string, TeamMemberItem[]>;
  chromeData?: SharedChromeData;
  departments?: DepartmentItem[];
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <TeamContent teamData={teamData} chromeData={chromeData} departments={departments} />
    </Suspense>
  );
}
