"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Trophy,
  Users,
  ChevronRight,
  Download,
  Mail,
  Quote,
  ExternalLink,
  Rocket,
  Building2,
  TrendingUp,
  Cpu,
  Target,
  Handshake
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import ShinyText from "@/components/ui/ShinyText";
import { DonateModal, ContactModal } from "@/components/ui/SupportModals";

// --- IMPACT METRICS DATA ---
const IMPACT_METRICS = [
  { label: "INDUSTRY PARTNERS", value: 25, suffix: "+", icon: Building2, note: "Top Tier Automotive & Tech Brands" },
  { label: "YEARS OF SUPPORT", value: 13, suffix: "+", icon: Trophy, note: "Since Founding in 2012" },
  { label: "COMPETITIONS PARTICIPATED", value: 30, suffix: "+", icon: Rocket, note: "BAJA SAE India & USA Events" },
  { label: "STUDENT ENGINEERS SUPPORTED", value: 300, suffix: "+", icon: Users, note: "Alumni in Global Automotive Industry" }
];

// --- VALUE PROPOSITIONS DATA ---
const VALUE_PROPS = [
  {
    title: "Brand Visibility",
    desc: "Logo placement on championship ATVs, apparel, and national media reaching 50,000+ motorsport enthusiasts.",
    tag: "MAXIMUM EXPOSURE",
    icon: Target
  },
  {
    title: "Talent Pipeline",
    desc: "Direct recruitment pipeline of student engineers trained in CAD, FEA, CFD, and real-time telemetry.",
    tag: "PREMIER RECRUITMENT",
    icon: Users
  },
  {
    title: "Innovation Ecosystem",
    desc: "R&D track testing of partner components, sensors, and materials under extreme race conditions.",
    tag: "REAL-WORLD R&D",
    icon: Cpu
  },
  {
    title: "Long-Term Impact",
    desc: "Champion collegiate mobility engineering while strengthening CSR and STEM education initiatives.",
    tag: "CORPORATE IMPACT",
    icon: TrendingUp
  }
];

// --- TESTIMONIALS DATA ---
const TESTIMONIALS = [
  {
    quote: "Team Red Baron represents the pinnacle of collegiate engineering discipline in India. Their attention to manufacturing tolerances and data telemetry rivals professional motorsport standards.",
    name: "Senior Engineering Director",
    company: "Varroc Engineering Limited",
    tier: "Title Sponsor Partner"
  },
  {
    quote: "Providing Altium PCB design tools to TRB students has proven how fast young engineers can innovate when backed by industry-standard EDA software. Their pitwall telemetry system is remarkable.",
    name: "University Program Lead",
    company: "Altium LLC",
    tier: "Electronics Partner"
  },
  {
    quote: "Supporting TRB with SKF high-precision bearings for their 4WD transfer case has been a rewarding partnership. Their alumni enter the automotive workforce with unparalleled practical experience.",
    name: "Application Engineering Manager",
    company: "SKF India",
    tier: "Platinum Sponsor"
  }
];


export default function SponsorsClient({
  sponsorTiers,
  testimonials = [],
  heroBgUrl = "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/hero/IMG_4588.png"
}: {
  sponsorTiers: any[];
  testimonials?: any[];
  heroBgUrl?: string;
}) {
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonialItems = (testimonials && testimonials.length > 0) ? testimonials : TESTIMONIALS;
  const currentTestimonial = testimonialItems[activeTestimonial % testimonialItems.length];

  // Animated Counter Effect Hook
  const [counterValues, setCounterValues] = useState(IMPACT_METRICS.map(() => 0));

  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setCounterValues(
        IMPACT_METRICS.map((m) => Math.min(Math.round((m.value / steps) * step), m.value))
      );
      if (step >= steps) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#000000] text-[#e2e2e2] flex flex-col font-sans relative">
      <Navbar />

      {/* SECTION 1 — HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-32 pb-20 px-5 sm:px-10 lg:px-20 max-w-[1440px] mx-auto w-full overflow-hidden z-10">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroBgUrl}
            alt="Team Red Baron Championship ATV Hero Shot"
            fill
            unoptimized
            priority
            className="object-cover object-center scale-105"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-[#000000]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(222,22,21,0.2),transparent_70%)]" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="font-sora font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight mb-6 leading-tight uppercase flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            <ShinyText text="OUR" speed={2} color="#ffffff" shineColor="#ff6534" spread={120} />
            <ShinyText text="SPONSORS" speed={2} color="#de1615" shineColor="#ffffff" spread={120} />
          </h1>

          <p className="font-inter text-lg sm:text-xl text-[#e8bdb6] max-w-2xl font-normal leading-relaxed mb-10">
            “Every innovation, every lap, and every achievement is made possible through the support of our partners.”
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button onClick={() => setContactModalOpen(true)} className="bg-[#de1615] hover:bg-[#b81211] text-white px-8 py-4 rounded-full font-sora font-bold text-sm hover:scale-105 transition-all shadow-md flex items-center gap-2">
              <Handshake className="w-4 h-4" /> Become a Partner
            </button>
            <a href="#sponsor-wall" className="glass-card text-white px-8 py-4 rounded-full font-sora font-semibold text-sm border border-white/20 hover:border-[#de1615] hover:bg-white/10 transition-all flex items-center gap-2">
              Explore Sponsor Wall <ChevronRight className="w-4 h-4 text-[#de1615]" />
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2 — IMPACT METRICS */}
      <section className="py-20 px-5 sm:px-10 lg:px-20 max-w-[1440px] mx-auto w-full z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {IMPACT_METRICS.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div key={st.label} className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#1e2020]/60 backdrop-blur-xl flex flex-col items-center text-center group hover:border-white/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-[#de1615]/20 border border-[#de1615]/50 flex items-center justify-center text-[#de1615] mb-4 group-hover:bg-[#de1615] group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-sora font-extrabold text-4xl sm:text-5xl text-white mb-2 tracking-tight">
                  {counterValues[idx]}<span className="text-[#de1615]">{st.suffix}</span>
                </span>
                <span className="font-sora font-bold text-xs sm:text-sm text-[#ffb59f] uppercase tracking-wider mb-1">{st.label}</span>
                <span className="font-mono-tech text-[11px] text-[#ae8882]">{st.note}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3 — SPONSOR WALL */}
      <section id="sponsor-wall" className="py-24 px-5 sm:px-10 lg:px-20 max-w-[1440px] mx-auto w-full z-10">
        <div className="space-y-24">
          {sponsorTiers.map((tier, tierIdx) => (
            <div key={tier.id} className="flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-4 mb-10 gap-4">
                <div>
                  <h3 className="font-sora font-extrabold text-2xl sm:text-3xl text-white tracking-wider uppercase flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-[#de1615]" />
                    {tier.tier_name}
                  </h3>
                </div>
                <span className="font-mono-tech text-xs text-[#ae8882] bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase">
                  {tier.sponsors.length} PARTNERS
                </span>
              </div>

              <div className={`grid w-full gap-6 ${tierIdx === 0 ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : tierIdx === 1 ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-6" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"}`}>
                {tier.sponsors.map((sp: any) => {
                  const hasWebsite = Boolean(sp.website_url && sp.website_url !== "#");
                  const CardTag = hasWebsite ? "a" : "div";
                  const cardLinkProps = hasWebsite
                    ? { href: sp.website_url, target: "_blank", rel: "noreferrer", className: "group relative glass-card p-6 rounded-2xl border border-white/10 bg-[#121414]/90 backdrop-blur-xl flex flex-col items-center justify-center min-h-[140px] hover:border-white/30 hover:bg-[#1e2020] transition-all duration-300 cursor-pointer" }
                    : { className: "group relative glass-card p-6 rounded-2xl border border-white/10 bg-[#121414]/90 backdrop-blur-xl flex flex-col items-center justify-center min-h-[140px] transition-all duration-300 cursor-default" };

                  return (
                    <CardTag key={sp.id} {...cardLinkProps}>
                      <div className="relative w-full h-16 flex items-center justify-center filter group-hover:scale-105 transition-all duration-300">
                        <Image src={sp.logo_url} alt={`${sp.name} Logo`} width={160} height={60} unoptimized className="object-contain max-h-14" />
                      </div>
                      <span className="font-sora font-bold text-xs text-white/70 group-hover:text-white mt-3 tracking-wider uppercase transition-colors text-center">
                        {sp.name}
                      </span>
                    </CardTag>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5 — WHY PARTNER WITH TRB */}
      <section className="py-16 px-5 sm:px-10 lg:px-20 max-w-[1440px] mx-auto w-full z-10">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-sora font-extrabold text-2xl sm:text-4xl text-white uppercase tracking-tight">WHY PARTNER WITH TEAM RED BARON?</h2>
          <p className="font-inter text-xs sm:text-sm text-[#e8bdb6] mt-2">Measurable return on investment and engineering collaboration for industry partners.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {VALUE_PROPS.map((vp) => {
            const Icon = vp.icon;
            return (
              <div key={vp.title} className="glass-card p-5 sm:p-6 rounded-2xl border border-white/10 bg-[#1e2020]/60 backdrop-blur-xl flex flex-col justify-between group hover:border-[#de1615]/50 transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#de1615]/20 border border-[#de1615]/40 flex items-center justify-center text-[#de1615] group-hover:bg-[#de1615] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono-tech text-[10px] text-[#ff6534] bg-[#ff6534]/10 border border-[#ff6534]/20 px-2 py-0.5 rounded tracking-wider font-semibold uppercase">{vp.tag}</span>
                  </div>
                  <h3 className="font-sora font-bold text-base sm:text-lg text-white mb-2 group-hover:text-[#ffb59f] transition-colors">{vp.title}</h3>
                  <p className="font-inter text-xs text-[#e2e2e2]/80 leading-relaxed">{vp.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 7 — TESTIMONIALS */}
      <section className="py-24 px-5 sm:px-10 lg:px-20 max-w-[1440px] mx-auto w-full z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-sora font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight">SPONSOR TESTIMONIALS</h2>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="glass-card p-10 sm:p-14 rounded-3xl border border-white/15 bg-[#1e2020]/80 backdrop-blur-2xl text-center relative overflow-hidden">
            <Quote className="w-16 h-16 text-[#de1615]/20 absolute top-6 left-6 pointer-events-none" />
            <p className="font-inter text-lg sm:text-xl text-white leading-relaxed italic mb-8 relative z-10">"{currentTestimonial.quote}"</p>
            <div className="flex flex-col items-center">
              <span className="font-sora font-extrabold text-lg text-white">{currentTestimonial.name}</span>
              <span className="font-mono-tech text-xs text-[#ff6534] font-semibold uppercase mt-0.5">{currentTestimonial.company}</span>
              <span className="font-mono-tech text-[10px] text-[#ae8882] uppercase mt-1">{currentTestimonial.tier}</span>

              {/* Sponsor Website / Case Study Link (with space for links) */}
              {currentTestimonial.website_url ? (
                <a
                  href={currentTestimonial.website_url.startsWith("http") ? currentTestimonial.website_url : `https://${currentTestimonial.website_url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-xs font-mono-tech text-white bg-[#de1615] hover:bg-[#b81211] px-5 py-2 rounded-full transition-all hover:scale-105 shadow-md"
                >
                  <span>Visit Sponsor Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : null}
            </div>
            {testimonialItems.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                {testimonialItems.map((_, idx) => (
                  <button key={idx} onClick={() => setActiveTestimonial(idx)} className={`w-3 h-3 rounded-full transition-all ${idx === (activeTestimonial % testimonialItems.length) ? "bg-[#de1615] w-8 shadow-[0_0_10px_#de1615]" : "bg-white/20 hover:bg-white/50"}`} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 8 — BECOME A SPONSOR CTA */}
      <section className="py-24 px-5 sm:px-10 lg:px-20 max-w-[1440px] mx-auto w-full z-10">
        <div className="glass-card rounded-[3rem] p-10 sm:p-16 lg:p-20 text-center relative overflow-hidden border border-[#de1615]/50 bg-gradient-to-br from-[#121414] via-[#1e2020] to-[#0c0f0f] shadow-[0_0_60px_rgba(222,22,21,0.25)]">
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <Image src="https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/hero/IMG_4588.png" alt="TRB ATV Hero Background" fill unoptimized className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="font-sora font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight mb-6">JOIN THE <span className="text-[#de1615]">JOURNEY</span></h2>
            <p className="font-inter text-base sm:text-lg text-[#e8bdb6] leading-relaxed mb-10">“Partner with Team Red Baron and help shape the next generation of engineering innovation.”</p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button onClick={() => setDonateModalOpen(true)} className="bg-[#de1615] hover:bg-[#b81211] text-white px-8 py-4 rounded-full font-sora font-bold text-sm hover:scale-105 transition-all shadow-md flex items-center gap-2">
                <Download className="w-4 h-4" /> Download Sponsorship Brochure
              </button>
              <button onClick={() => setContactModalOpen(true)} className="glass-card text-white px-8 py-4 rounded-full font-sora font-semibold text-sm border border-white/20 hover:border-[#de1615] hover:bg-white/10 transition-all flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#de1615]" /> Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Shared Interactive Modals */}
      <DonateModal isOpen={donateModalOpen} onClose={() => setDonateModalOpen(false)} />
      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
    </main>
  );
}
