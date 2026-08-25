"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SparklesDivider } from "@/components/ui/SparklesDivider";
import { WarpText } from "@/components/ui/WarpText";
import GhostCursor from "@/components/ui/GhostCursor";
import { ChevronDown, Users, ShieldAlert, Cpu, Wrench, Flame, Zap } from "lucide-react";

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: "Management" | "Vehicle Dynamics" | "Electronics" | "Structures" | "Drivetrain";
  image: string;
  linkedin: string;
}

export interface DepartmentInfo {
  name: "Management" | "Vehicle Dynamics" | "Electronics" | "Structures" | "Drivetrain";
  description: string;
  icon: any;
}

const DEPARTMENTS: DepartmentInfo[] = [
  {
    name: "Management",
    description:
      "Strategic coordination and structured planning form the backbone of our management team, ensuring every department operates in perfect synchronization toward a common goal.",
    icon: Users,
  },
  {
    name: "Vehicle Dynamics",
    description:
      "Vehicle Dynamics ensures the car maintains optimal stability, grip, and control, allowing the driver to extract maximum performance from the vehicle.",
    icon: Wrench,
  },
  {
    name: "Electronics",
    description:
      "Our car is basically a computer on wheels. Many high voltage and low voltage electronics engineers work together to make sure everything runs safely and efficiently.",
    icon: Cpu,
  },
  {
    name: "Structures",
    description:
      "The chassis forms the structural backbone of the race car; ensuring strength, safety and rigidity while maintaining minimal weight.",
    icon: ShieldAlert,
  },
  {
    name: "Drivetrain",
    description:
      "The drivetrain ensures efficient power transmission from the engine/motor to the wheels for optimal acceleration and endurance performance.",
    icon: Flame,
  },
];

const TEAM_DATA: Record<string, TeamMember[]> = {
  "2025-26": [
    // MANAGEMENT
    {
      id: "m1",
      name: "Untitled",
      role: "Captain",
      department: "Management",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
    {
      id: "m2",
      name: "Untitled",
      role: "CFO & COO",
      department: "Management",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
    {
      id: "m3",
      name: "Untitled",
      role: "Mechanical CTO",
      department: "Management",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
    {
      id: "m4",
      name: "Untitled",
      role: "Electrical CTO",
      department: "Management",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },

    // VEHICLE DYNAMICS
    {
      id: "vd1",
      name: "Untitled",
      role: "Suspension Lead",
      department: "Vehicle Dynamics",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
    {
      id: "vd2",
      name: "Untitled",
      role: "Brakes & Steering Lead",
      department: "Vehicle Dynamics",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
    {
      id: "vd3",
      name: "Untitled",
      role: "Sr. Vehicle Dynamics Member",
      department: "Vehicle Dynamics",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
    {
      id: "vd4",
      name: "Untitled",
      role: "Jr. Vehicle Dynamics Member",
      department: "Vehicle Dynamics",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },

    // ELECTRONICS
    {
      id: "e1",
      name: "Untitled",
      role: "High Voltage Lead",
      department: "Electronics",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
    {
      id: "e2",
      name: "Untitled",
      role: "Low Voltage Lead",
      department: "Electronics",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
    {
      id: "e3",
      name: "Untitled",
      role: "B-Plan Lead & High Voltage Member",
      department: "Electronics",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
    {
      id: "e4",
      name: "Untitled",
      role: "Sr. Low Voltage Member",
      department: "Electronics",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
    {
      id: "e5",
      name: "Untitled",
      role: "Sr. Low Voltage Member",
      department: "Electronics",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
    {
      id: "e6",
      name: "Untitled",
      role: "Sr. Low Voltage Member",
      department: "Electronics",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
    {
      id: "e7",
      name: "Untitled",
      role: "Jr. Low Voltage Member",
      department: "Electronics",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
    {
      id: "e8",
      name: "Untitled",
      role: "Jr. Low Voltage Member",
      department: "Electronics",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
    {
      id: "e9",
      name: "Untitled",
      role: "Jr. Low Voltage Member",
      department: "Electronics",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },

    // STRUCTURES
    {
      id: "s1",
      name: "Untitled",
      role: "Chassis Lead",
      department: "Structures",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
    {
      id: "s2",
      name: "Untitled",
      role: "Aerodynamics Lead",
      department: "Structures",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
    {
      id: "s3",
      name: "Untitled",
      role: "Sr. Structures Member",
      department: "Structures",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
    {
      id: "s4",
      name: "Untitled",
      role: "Sr. Structures Member",
      department: "Structures",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
    {
      id: "s5",
      name: "Untitled",
      role: "Sr. Structures Member",
      department: "Structures",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },

    // DRIVETRAIN
    {
      id: "d1",
      name: "Untitled",
      role: "Drivetrain Lead",
      department: "Drivetrain",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
    {
      id: "d2",
      name: "Untitled",
      role: "Sr. Drivetrain Member",
      department: "Drivetrain",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
    {
      id: "d3",
      name: "Untitled",
      role: "Jr. Drivetrain Member",
      department: "Drivetrain",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
  ],
  "2024-25": [
    {
      id: "m24_1",
      name: "Untitled",
      role: "Vice Captain & Dynamics Lead",
      department: "Management",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
    {
      id: "m24_2",
      name: "Untitled",
      role: "Treasury & Finance Head",
      department: "Management",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
    {
      id: "vd24_1",
      name: "Untitled",
      role: "Sr. Suspension Engineer",
      department: "Vehicle Dynamics",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
    {
      id: "e24_1",
      name: "Untitled",
      role: "Telemetry & DAQ Lead",
      department: "Electronics",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
    {
      id: "s24_1",
      name: "Untitled",
      role: "FEA & Chassis Engineer",
      department: "Structures",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
  ],
  "2023-24": [
    {
      id: "m23_1",
      name: "Untitled",
      role: "Junior Vehicle Engineer",
      department: "Vehicle Dynamics",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
    {
      id: "e23_1",
      name: "Untitled",
      role: "Wiring & Harness Member",
      department: "Electronics",
      image: "/media/team_person.png",
      linkedin: "https://linkedin.com",
    },
  ],
};

function TeamContent() {
  const searchParams = useSearchParams();
  const yearParam = searchParams.get("year");
  const selectedSeason = (yearParam && TEAM_DATA[yearParam]) ? yearParam : "2025-26";
  const currentMembers = TEAM_DATA[selectedSeason] || [];

  return (
    <main className="min-h-screen bg-black text-[#e2e2e2] flex flex-col selection:bg-[#de1615] selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Ghost Cursor Interactive Background */}
        <GhostCursor
          className="absolute inset-0 z-0 pointer-events-none"
          color="#de1615"
          bloomStrength={0.25}
          bloomRadius={1.2}
          trailLength={60}
          inertia={0.6}
          fadeDelayMs={800}
          fadeDurationMs={1500}
        />

        {/* Ambient Glow Backdrop */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-[#de1615]/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 relative z-10 flex flex-col items-center">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 font-mono-tech text-xs text-[#de1615] tracking-widest uppercase bg-[#1a0505] px-4 py-1.5 rounded-full border border-[#de1615]/30 mb-8">
            <Zap className="w-3.5 h-3.5 text-[#de1615]" />
            <span>THE ENGINEERS BEHIND ALBATROSS</span>
          </div>

          {/* Title Header with WebGL WarpText */}
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

      {/* Departments & Team Grid Section */}
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
                {/* Department Header */}
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

                {/* Team Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                      {/* Left Half: Member Photo */}
                      <div className="relative w-28 sm:w-32 shrink-0 bg-black/50 overflow-hidden">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#12151b]/80" />
                      </div>

                      {/* Right Half: Member Details */}
                      <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          <h3 className="font-sora font-bold text-base sm:text-lg text-white group-hover:text-[#de1615] transition-colors truncate uppercase">
                            {member.name}
                          </h3>
                          <span className="font-mono-tech text-[11px] text-[#e8bdb6] tracking-wider uppercase block mt-1 line-clamp-2">
                            {member.role}
                          </span>
                        </div>

                        {/* LinkedIn Link Button */}
                        <div className="pt-3 flex justify-end">
                          <a
                            href={member.linkedin}
                            target="_blank"
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

                {/* Sparkles Divider after position section */}
                <div className="pt-8">
                  <SparklesDivider />
                </div>

              </motion.div>
            );
          })}

        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function TeamPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <TeamContent />
    </Suspense>
  );
}
