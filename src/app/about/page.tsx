import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AboutTimeline } from "@/components/AboutTimeline";
import Particles from "@/components/ui/Particles";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  ShieldCheck,
  Cpu,
  Trophy,
  Award,
  Users,
  Target,
  Compass,
  Wrench,
} from "lucide-react";

export const metadata = {
  title: "About Us | Team Red Baron — PCCOE Motorsport",
  description:
    "Learn about Team Red Baron (PCCOE Pune), premier collegiate offroad ATV racing team. 12+ years of untamed endurance, in-house engineering, and podium victories.",
};

const stats = [
  { label: "Years Active", value: "12+", icon: Trophy, note: "Est. 2012 at PCCOE" },
  { label: "Vehicles Built", value: "13", icon: Wrench, note: "Albatros I to XIII" },
  { label: "National Podiums", value: "10+", icon: Award, note: "BAJA SAE India" },
  { label: "In-House Engineering", value: "100%", icon: Cpu, note: "Chassis & Telemetry" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#000000] text-[#e2e2e2] flex flex-col font-sans relative">
      {/* Ambient OGL Particles Background Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-60">
        <Particles
          particleColors={["#de1615", "#ff6534", "#ffffff"]}
          particleCount={250}
          particleSpread={12}
          speed={0.12}
          particleBaseSize={120}
          moveParticlesOnHover={true}
          particleHoverFactor={0.8}
          alphaParticles={true}
          disableRotation={false}
          cameraDistance={22}
        />
      </div>

      <Navbar />

      {/* Hero Header Section */}
      <ScrollReveal yOffset={40}>
        <section className="relative pt-36 pb-20 px-5 sm:px-10 lg:px-20 max-w-[1440px] mx-auto w-full overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#de1615]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-32 right-1/4 w-80 h-80 bg-[#ff6534]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Status Badge Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#252e39]/60 border border-[#de1615]/40 text-[#ffb4a9] text-xs font-mono tracking-widest uppercase mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(222,22,21,0.2)]">
              <span className="w-2 h-2 rounded-full bg-[#de1615] animate-ping" />
              PCCOE MOTORSPORT / EST. 2012
            </div>

            <h1 className="font-sora font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white mb-6 leading-tight">
              THE LEGACY OF <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ffb59f] to-[#de1615]">
                UNTAMED ENDURANCE
              </span>
            </h1>

            <p className="font-inter text-lg sm:text-xl text-[#e8bdb6] max-w-2xl font-normal leading-relaxed mb-10">
              Team Red Baron is Pimpri Chinchwad College of Engineering’s official collegiate offroad racing team. We design, manufacture, test, and race high-performance All-Terrain Vehicles (ATVs) for national BAJA SAE India competitions.
            </p>

            {/* Quick Stat Counters Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full pt-4">
              {stats.map((st) => {
                const Icon = st.icon;
                return (
                  <div
                    key={st.label}
                    className="glass-card p-5 rounded-2xl border border-white/10 bg-[#252e39]/40 backdrop-blur-xl flex flex-col items-center text-center group hover:border-[#de1615]/50 transition-all duration-300"
                  >
                    <Icon className="w-6 h-6 text-[#de1615] mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-sora font-extrabold text-3xl sm:text-4xl text-white mb-1">
                      {st.value}
                    </span>
                    <span className="font-sora font-bold text-xs text-[#ffb59f] uppercase tracking-wider">
                      {st.label}
                    </span>
                    <span className="font-mono text-[11px] text-[#ae8882] mt-1">
                      {st.note}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Team Summary & Photo Space Section */}
      <ScrollReveal yOffset={50}>
        <section className="py-20 px-5 sm:px-10 lg:px-20 max-w-[1440px] mx-auto w-full border-t border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Summary */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 text-[#de1615] font-mono text-xs tracking-widest uppercase font-semibold">
                <Compass className="w-4 h-4" />
                ABOUT TEAM RED BARON
              </div>

              <h2 className="font-sora font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                Driven by Passion, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ffb59f] to-[#de1615]">
                  Engineered for Podium Victory
                </span>
              </h2>

              <p className="font-inter text-[#e8bdb6] text-base sm:text-lg leading-relaxed font-normal">
                Team Red Baron is the premier collegiate offroad racing team from Pimpri Chinchwad College of Engineering (PCCOE), Pune. Established in 2012, our team brings together ambitious student engineers who design, fabricate, and race custom All-Terrain Vehicles (ATVs) for national BAJA SAE competitions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-5 rounded-2xl glass-card border border-white/10 bg-[#1e2020]/60 flex items-start gap-3.5 hover:border-[#de1615]/40 transition-all">
                  <Target className="w-5 h-5 text-[#de1615] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-sora font-bold text-sm text-white">Our Mission</h4>
                    <p className="text-xs text-[#ae8882] mt-1 leading-relaxed">
                      To push the frontiers of automotive engineering through student-led innovation and domain mastery.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl glass-card border border-white/10 bg-[#1e2020]/60 flex items-start gap-3.5 hover:border-[#ff6534]/40 transition-all">
                  <ShieldCheck className="w-5 h-5 text-[#ff6534] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-sora font-bold text-sm text-white">Our Values</h4>
                    <p className="text-xs text-[#ae8882] mt-1 leading-relaxed">
                      Safety without compromise, mechanical precision, and an unyielding spirit on the track.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Official Team Photo Card */}
            <div className="lg:col-span-5">
              <div className="relative group rounded-3xl overflow-hidden glass-card border border-white/15 bg-[#12151b] p-2.5 aspect-[4/3] shadow-[0_10px_40px_rgba(222,22,21,0.25)] hover:border-[#de1615]/70 transition-all duration-500">
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <img
                    src="https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team/IMG_9368.jpg"
                    alt="Team Red Baron Group Photo"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                    <span className="font-sora font-bold text-sm text-white uppercase tracking-wider drop-shadow-md">
                      Team Red Baron Squad
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Evolutionary Journey Timeline Section */}
      <ScrollReveal yOffset={50}>
        <div id="journey" className="border-t border-white/5 pt-10">
          <AboutTimeline />
        </div>
      </ScrollReveal>

      {/* CTA Section */}
      <ScrollReveal yOffset={40}>
        <section className="py-20 px-5 sm:px-10 lg:px-20 max-w-[1440px] mx-auto w-full">
          <div className="glass-card p-10 sm:p-14 rounded-3xl border border-[#de1615]/40 bg-gradient-to-r from-[#1e2020] via-[#252e39] to-[#121414] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_0_40px_rgba(222,22,21,0.2)]">
            <div className="max-w-xl text-center md:text-left">
              <span className="font-mono text-xs text-[#ff6534] tracking-widest uppercase font-semibold">
                JOIN THE HANGAR / SEASON 2024-25
              </span>
              <h2 className="font-sora font-extrabold text-3xl sm:text-4xl text-white mt-2">
                Ready to Build the Next Albatros?
              </h2>
              <p className="font-inter text-sm sm:text-base text-[#e8bdb6] mt-3">
                Whether you are a PCCOE student passionate about offroad engineering or a corporate brand looking to sponsor national collegiate champions—connect with us.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <Link
                href="/contact"
                className="bg-[#de1615] hover:bg-[#b81211] text-white px-7 py-3.5 rounded-full font-sora font-bold text-sm hover:scale-105 transition-all shadow-md"
              >
                Contact Pitwall
              </Link>

              <Link
                href="#journey"
                className="glass-card text-white px-7 py-3.5 rounded-full font-sora font-semibold text-sm border border-white/20 hover:border-[#de1615] hover:bg-white/10 transition-all"
              >
                Explore Timeline
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <Footer />
    </main>
  );
}
