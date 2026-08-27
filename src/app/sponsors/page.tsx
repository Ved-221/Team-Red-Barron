"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Award,
  Users,
  Wrench,
  ChevronRight,
  Download,
  Mail,
  Heart,
  ChevronLeft,
  Quote,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  Target,
  Rocket,
  Building2,
  TrendingUp,
  Cpu,
  Layers,
  CheckCircle2,
  Handshake
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import ShinyText from "@/components/ui/ShinyText";
import { DonateModal, ContactModal } from "@/components/ui/SupportModals";

// --- SPONSOR DATA BY TIERS ---
interface SponsorItem {
  name: string;
  logo: string;
  website?: string;
  description?: string;
  contrib?: string;
  category?: string;
}

interface SponsorTier {
  tierName: string;
  subtitle: string;
  description: string;
  sponsors: SponsorItem[];
}

const SPONSOR_TIERS: SponsorTier[] = [
  {
    tierName: "TITLE SPONSORS",
    subtitle: "GENERATING SEASON & VEHICLE ENGINEERING FOUNDATIONS",
    description: "Our premier strategic partners fueling Team Red Baron's championship vehicles, powertrain, and national dynamic operations.",
    sponsors: [
      {
        name: "ALTIUM",
        logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/TITLE/ALTIUM.png",
        website: "https://www.altium.com",
        description: "Leading provider of electronic design automation & printed circuit board (PCB) design software used for TRB's custom telemetry nodes.",
        contrib: "ECU & Telemetry PCB CAD Suite",
        category: "ELECTRONICS & EDA"
      },
      {
        name: "GEFRAN",
        logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/TITLE/GEFRAN.png",
        website: "https://www.gefran.com",
        description: "Global leader in design and production of industrial sensors, automation systems, and high-precision position transducers.",
        contrib: "Suspension Travel & Pressure Sensors",
        category: "SENSORS & AUTOMATION"
      },
      {
        name: "MAHLE",
        logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/TITLE/MAHLE.png",
        website: "https://www.mahle.com",
        description: "Premier automotive systems supplier pioneering powertrain engineering, thermal management, and lightweight engine solutions.",
        contrib: "Powertrain R&D & Thermal Tech",
        category: "AUTOMOTIVE SYSTEMS"
      },
      {
        name: "STAR ENGINEERS",
        logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/TITLE/STAR ENGINEERS.png",
        website: "https://www.starengineers.com",
        description: "Global automotive electronics manufacturing leader specializing in ignition systems, regulators, and vehicle control modules.",
        contrib: "Ignition & Electrical Harness",
        category: "AUTOMOTIVE ELECTRONICS"
      },
      {
        name: "TRIVIKARAM",
        logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/TITLE/TRIVIKARAM.png",
        website: "#",
        description: "Precision manufacturing and specialized machining partner delivering high-strength aluminum wheel hubs & uprights.",
        contrib: "Precision CNC Machining",
        category: "MANUFACTURING"
      },
      {
        name: "VARROC",
        logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/TITLE/VARROC.png",
        website: "https://varroc.com",
        description: "Global Tier-1 automotive component manufacturer supplying exterior lighting, powertrain components, and electrical systems.",
        contrib: "Chassis & Drivetrain Components",
        category: "TIER-1 AUTOMOTIVE"
      },
      {
        name: "ROSENBERGER",
        logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/TITLE/rosenberger.png",
        website: "https://www.rosenberger.com",
        description: "High-frequency, high-voltage, and fiber-optic connectivity technology leader powering robust sensor harness networks.",
        contrib: "High-Speed Data & Coaxial Cabling",
        category: "CONNECTIVITY"
      }
    ]
  },
  {
    tierName: "PLATINUM SPONSORS",
    subtitle: "PRECISION COMPONENTS, BEARINGS & FLUID SYSTEMS",
    description: "Key industrial partners providing mission-critical dynamic hardware and advanced testing equipment for offroad endurance.",
    sponsors: [
      {
        name: "SKF",
        logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/PLATINUM/SKF.png",
        website: "https://www.skf.com",
        description: "World's leading bearing and seal manufacturer enabling low-friction rotational efficiency in TRB's custom drivetrain.",
        contrib: "High-Performance Wheel & Differential Bearings",
        category: "BEARINGS & ROTATION"
      },
      {
        name: "FLUKE",
        logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/PLATINUM/FLUKE.png",
        website: "https://www.fluke.com",
        description: "Global standard in electronic test tools, thermal imaging calibration, and pitwall diagnostic instruments.",
        contrib: "Pitwall Diagnostics & Multimeters",
        category: "MEASUREMENT & CALIBRATION"
      },
      {
        name: "CASTAL DIES",
        logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/PLATINUM/CASTAL DIES.png",
        website: "#",
        description: "Precision die casting and tooling specialist manufacturing custom transmission casing and steering components.",
        contrib: "Gearbox Die Casting & Mold Tooling",
        category: "TOOLING & DIES"
      },
      {
        name: "ESBEE",
        logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/PLATINUM/ESBEE.png",
        website: "https://esbee-electrotech.com",
        description: "Electrotechnical solutions provider delivering heavy-duty switches, relays, and emergency power cut-off safety modules.",
        contrib: "High-Amperage Safety Cut-Off Switches",
        category: "ELECTRO-TECH"
      },
      {
        name: "ANUCOOL",
        logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/PLATINUM/ANUCOOL.png",
        website: "#",
        description: "Thermal engineering and cooling solutions company providing high-flow radiators and CVT cooling ducting.",
        contrib: "CVT & Engine Cooling System",
        category: "THERMAL SOLUTIONS"
      },
      {
        name: "C2M",
        logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/PLATINUM/C2M.png",
        website: "#",
        description: "Concept-to-Manufacturing partner supporting composite fabrication and CAD prototyping.",
        contrib: "Prototyping & CAD Design",
        category: "DESIGN & FABRICATION"
      }
    ]
  },
  {
    tierName: "GOLD SPONSORS",
    subtitle: "ADVANCED MATERIALS, COATINGS & METROLOGY",
    description: "Pioneering technology suppliers providing specialized composites, electrical harnesses, and precision measurement.",
    sponsors: [
      {
        name: "MITUTOYO",
        logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/GOLD/MITUTOYO.png",
        website: "https://www.mitutoyo.co.jp/global/",
        description: "World leader in precision measuring instruments, vernier calipers, micrometers, and dimensional metrology.",
        contrib: "Precision Quality Control Metrology",
        category: "METROLOGY & MEASUREMENT"
      },
      {
        name: "BALAJI WIRES",
        logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/GOLD/BALAJI WIRES.png",
        website: "#",
        description: "High-grade automotive wire and wiring harness manufacturer delivering fire-retardant electrical conduits.",
        contrib: "Custom Wiring Harness & Conduits",
        category: "WIRING HARNESS"
      },
      {
        name: "COMPOSITE TOMORROW",
        logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/GOLD/COMPOSITE TOMORROW.png",
        website: "#",
        description: "Carbon fiber and glass fiber raw material supplier powering TRB's ultra-lightweight body paneling.",
        contrib: "Carbon Fiber & Vacuum Infusion Resin",
        category: "COMPOSITES"
      },
      {
        name: "BHARAT MECHATRONICS",
        logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/GOLD/BHARAT MECHATRONICS.png",
        website: "#",
        description: "Mechatronic systems and actuator developer assisting in electronic throttle and CVT tuning.",
        contrib: "Actuator & Servo Control Systems",
        category: "MECHATRONICS"
      },
      {
        name: "ELECTRO CATALYST",
        logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/GOLD/ELECTRO CATALYST.png",
        website: "#",
        description: "Specialized electro-chemical coatings and surface plating partner protecting chromoly tubing against corrosion.",
        contrib: "Frame Surface Coating & Plating",
        category: "SURFACE COATING"
      },
      {
        name: "VR COATING",
        logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/GOLD/VR COATING.png",
        website: "#",
        description: "Industrial powder coating and paint equipment company providing high-durability TRB Crimson livery finishes.",
        contrib: "Powder Coating & Livery Finish",
        category: "INDUSTRIAL FINISH"
      }
    ]
  },
  {
    tierName: "SILVER SPONSORS",
    subtitle: "MANUFACTURING SUPPORT, FABRICATION & CONNECTIVITY",
    description: "Valued manufacturing partners supplying laser cutting, plasma treatment, specialized connectors, and raw material stock.",
    sponsors: [
      {
        name: "MOLEX",
        logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/SILVER/MOLEX.png",
        website: "https://www.molex.com",
        description: "Global electronics leader delivering IP67 waterproof connector solutions for extreme offroad environments.",
        contrib: "IP67 Weatherproof Connectors",
        category: "CONNECTORS"
      },
      {
        name: "BEICO",
        logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/SILVER/BEICO.png",
        website: "#",
        description: "Heavy engineering and tube bending specialists providing CNC notched Chromoly 4130 spaceframe tubes.",
        contrib: "Precision Tube Bending & Laser Notching",
        category: "FABRICATION"
      },
      {
        name: "METADEK",
        logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/SILVER/METADEK.png",
        website: "#",
        description: "Structural metal sheet decking and laser cutting partner supporting chassis floorpan and skidplate fabrication.",
        contrib: "Skid Plate & Sheet Metal Fabrication",
        category: "SHEET METAL"
      },
      {
        name: "SHOGINI",
        logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/SILVER/SHOGINI.png",
        website: "#",
        description: "Multi-layer PCB manufacturer producing high-density circuit boards for TRB's pitwall telemetry sender units.",
        contrib: "Telemetry Printed Circuit Board Production",
        category: "PCB MANUFACTURING"
      },
      {
        name: "SHITAL PLASMA",
        logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/SILVER/SHITAL PLASMA.png",
        website: "#",
        description: "High-precision CNC plasma cutting and profiling unit enabling rapid chassis gusset plate fabrication.",
        contrib: "CNC Plasma Profiling & Cutting",
        category: "PLASMA CUTTING"
      },
      {
        name: "CHINTAMANI",
        logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/SILVER/CHINTAMANI.png",
        website: "#",
        description: "Raw material stockist delivering certified aircraft-grade 6061-T6 and 7075-T6 aluminum billets.",
        contrib: "Aerospace Grade Aluminum Billet Stock",
        category: "RAW MATERIALS"
      }
    ]
  }
];

// --- FEATURED PARTNERS DATA ---
const FEATURED_PARTNERS = [
  {
    name: "VARROC ENGINEERING",
    tier: "TITLE PARTNER",
    logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/TITLE/VARROC.png",
    image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/TITLE/VARROC.png",
    bgImage: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/hero/IMG_4588.png",
    description: "Varroc has been instrumental in backing Team Red Baron's structural and powertrain development. Through their Tier-1 automotive manufacturing resources, TRB engineers gain access to advanced metallurgy, component heat-treatment, and automotive lighting technology.",
    contribution: "Chassis Components, Powertrain Support & Technical Mentorship",
    website: "https://varroc.com"
  },
  {
    name: "ALTIUM LLC",
    tier: "TITLE ELECTRONICS PARTNER",
    logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/TITLE/ALTIUM.png",
    image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/TITLE/ALTIUM.png",
    bgImage: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2023.png",
    description: "Altium empowers our Electronics & Telemetry sub-team with full enterprise PCB design licenses. Using Altium Designer, TRB student engineers synthesize custom telemetry sender boards, wheel-speed sensor nodes, and live pitwall telemetry feeds.",
    contribution: "Altium Designer PCB EDA Suite & Cloud Collaboration",
    website: "https://www.altium.com"
  },
  {
    name: "SKF GROUP",
    tier: "PLATINUM ROTATIONAL PARTNER",
    logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/PLATINUM/SKF.png",
    image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/PLATINUM/SKF.png",
    bgImage: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2022.avif",
    description: "SKF provides TRB with ultra-low friction ceramic hybrid and deep-groove ball bearings for our custom 4WD transfer case and wheel hubs, reducing parasitic drivetrain power loss by over 8%.",
    contribution: "High-Precision Drivetrain & Wheel Hub Bearings",
    website: "https://www.skf.com"
  },
  {
    name: "FLUKE CORPORATION",
    tier: "PLATINUM MEASUREMENT PARTNER",
    logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/PLATINUM/FLUKE.png",
    image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/PLATINUM/FLUKE.png",
    bgImage: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2025.jpg",
    description: "Fluke equips Team Red Baron with thermal imaging cameras and precision digital multimeters to diagnose engine heat dissipation, CVT belt thermals, and battery pack telemetry during 4-hour endurance runs.",
    contrib: "Thermal Diagnostics & Pitwall Multimeter Suite",
    contribution: "Thermal Imaging & Diagnostic Metrology Hardware",
    website: "https://www.fluke.com"
  }
];

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
    desc: "Gain prominent logo placement on championship ATVs, team apparel, national event media, and digital platforms reaching over 50,000+ motorsport enthusiasts and collegiate engineers.",
    tag: "MAXIMUM EXPOSURE",
    icon: Target
  },
  {
    title: "Talent Pipeline",
    desc: "Direct access to top-tier PCCOE student engineers trained in CAD, FEA, CFD, composite fabrication, hands-on machining, and real-time IoT data telemetry.",
    tag: "PREMIER RECRUITMENT",
    icon: Users
  },
  {
    title: "Innovation Ecosystem",
    desc: "Collaborate with student-led R&D testing your products, sensors, coatings, and raw materials under extreme offroad endurance track conditions.",
    tag: "REAL-WORLD R&D",
    icon: Cpu
  },
  {
    title: "Long-Term Impact",
    desc: "Empower future automotive leaders and foster sustainable mobility engineering while strengthening your company's CSR and STEM education initiatives.",
    tag: "CORPORATE RESPONSIBILITY",
    icon: TrendingUp
  }
];

// --- PARTNERSHIP TIMELINE DATA ---
const TIMELINE_STEPS = [
  {
    year: "2012",
    title: "Founding Era",
    desc: "Initial backing by founding industrial supporters; Albatros 1.0 launched.",
    milestone: "5 Founding Partners"
  },
  {
    year: "2016",
    title: "Composite Tech Era",
    desc: "Partnership expansion into carbon fiber composites and CNC machining.",
    milestone: "12 Industry Partners"
  },
  {
    year: "2019",
    title: "International USA Entry",
    desc: "Corporate sponsors backed TRB's debut at BAJA SAE USA in Rochester NY.",
    milestone: "18 Global Sponsors"
  },
  {
    year: "2021",
    title: "First 4WD Drivetrain",
    desc: "Sponsors provided custom transfer case aluminum billets & bearings.",
    milestone: "22 Technical Sponsors"
  },
  {
    year: "2025",
    title: "AIR 3 National Podium",
    desc: "Record 25+ industry partners fueling TRB to AIR 3 Overall in India.",
    milestone: "25+ Active Partners"
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

export default function SponsorsPage() {
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

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
        {/* Full-width Background Hero Imagery with 80% Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/hero/IMG_4588.png"
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
          {/* Status Badge Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#252e39]/60 border border-[#de1615]/50 text-[#ffb4a9] text-xs font-mono tracking-widest uppercase mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(222,22,21,0.3)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#de1615] animate-ping" />
            CHAMPIONSHIP PARTNERS & SPONSORS // TRB PITWALL
          </div>

          <h1 className="font-sora font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight mb-6 leading-tight uppercase flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            <ShinyText
              text="OUR"
              speed={2}
              color="#ffffff"
              shineColor="#ff6534"
              spread={120}
            />
            <ShinyText
              text="SPONSORS"
              speed={2}
              color="#de1615"
              shineColor="#ffffff"
              spread={120}
            />
          </h1>

          <p className="font-inter text-lg sm:text-xl text-[#e8bdb6] max-w-2xl font-normal leading-relaxed mb-10">
            “Every innovation, every lap, and every achievement is made possible through the support of our partners.”
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => setContactModalOpen(true)}
              className="bg-[#de1615] hover:bg-[#b81211] text-white px-8 py-4 rounded-full font-sora font-bold text-sm hover:scale-105 transition-all shadow-md flex items-center gap-2"
            >
              <Handshake className="w-4 h-4" />
              Become a Partner
            </button>
            <a
              href="#sponsor-wall"
              className="glass-card text-white px-8 py-4 rounded-full font-sora font-semibold text-sm border border-white/20 hover:border-[#de1615] hover:bg-white/10 transition-all flex items-center gap-2"
            >
              Explore Sponsor Wall
              <ChevronRight className="w-4 h-4 text-[#de1615]" />
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
              <div
                key={st.label}
                className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#1e2020]/60 backdrop-blur-xl flex flex-col items-center text-center group hover:border-white/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#de1615]/20 border border-[#de1615]/50 flex items-center justify-center text-[#de1615] mb-4 group-hover:bg-[#de1615] group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-sora font-extrabold text-4xl sm:text-5xl text-white mb-2 tracking-tight">
                  {counterValues[idx]}
                  <span className="text-[#de1615]">{st.suffix}</span>
                </span>
                <span className="font-sora font-bold text-xs sm:text-sm text-[#ffb59f] uppercase tracking-wider mb-1">
                  {st.label}
                </span>
                <span className="font-mono-tech text-[11px] text-[#ae8882]">
                  {st.note}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3 — SPONSOR WALL (INSPIRED DIRECTLY BY REFERENCE IMAGE) */}
      <section id="sponsor-wall" className="py-24 px-5 sm:px-10 lg:px-20 max-w-[1440px] mx-auto w-full z-10">
        {/* Sponsor Tiers Stack */}
        <div className="space-y-24">
          {SPONSOR_TIERS.map((tier, tierIdx) => (
            <div key={tier.tierName} className="flex flex-col items-center">
              {/* Tier Header Line */}
              <div className="w-full flex items-center justify-between pb-4 mb-10 gap-4">
                <div>
                  <h3 className="font-sora font-extrabold text-2xl sm:text-3xl text-white tracking-wider uppercase flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-[#de1615]" />
                    {tier.tierName}
                  </h3>
                  <p className="font-mono-tech text-xs text-[#ff6534] tracking-widest uppercase mt-1">
                    {tier.subtitle}
                  </p>
                </div>
                <span className="font-mono-tech text-xs text-[#ae8882] bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase">
                  {tier.sponsors.length} PARTNERS
                </span>
              </div>

              {/* Logo Grid */}
              <div
                className={`grid w-full gap-6 ${
                  tierIdx === 0
                    ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                    : tierIdx === 1
                    ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
                    : "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
                }`}
              >
                {tier.sponsors.map((sp) => {
                  const hasWebsite = Boolean(sp.website && sp.website !== "#");
                  const CardTag = hasWebsite ? "a" : "div";
                  const cardLinkProps = hasWebsite
                    ? {
                        href: sp.website,
                        target: "_blank",
                        rel: "noreferrer",
                        className:
                          "group relative glass-card p-6 rounded-2xl border border-white/10 bg-[#121414]/90 backdrop-blur-xl flex flex-col items-center justify-center min-h-[140px] hover:border-white/30 hover:bg-[#1e2020] transition-all duration-300 cursor-pointer",
                      }
                    : {
                        className:
                          "group relative glass-card p-6 rounded-2xl border border-white/10 bg-[#121414]/90 backdrop-blur-xl flex flex-col items-center justify-center min-h-[140px] transition-all duration-300 cursor-default",
                      };

                  return (
                    <CardTag key={sp.name} {...cardLinkProps}>
                      {/* Logo Image — Retains original color on hover */}
                      <div className="relative w-full h-16 flex items-center justify-center filter group-hover:scale-105 transition-all duration-300">
                        <Image
                          src={sp.logo}
                          alt={`${sp.name} Logo`}
                          width={160}
                          height={60}
                          unoptimized
                          className="object-contain max-h-14"
                        />
                      </div>

                      {/* Sponsor Label */}
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

      {/* SECTION 4 — FEATURED PARTNERS */}
      <section className="py-24 px-5 sm:px-10 lg:px-20 max-w-[1440px] mx-auto w-full z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono-tech text-xs text-[#de1615] tracking-widest uppercase font-semibold mb-2">
            STRATEGIC INDUSTRY SHOWCASE
          </span>
          <h2 className="font-sora font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight">
            FEATURED CHAMPIONSHIP PARTNERS
          </h2>
          <p className="font-inter text-sm sm:text-base text-[#e8bdb6] mt-3">
            In-depth look at key technical sponsors enabling TRB's engineering breakthroughs.
          </p>
        </div>

        <div className="space-y-16">
          {FEATURED_PARTNERS.map((partner, idx) => {
            const isImageLeft = idx % 2 === 0;
            return (
              <div
                key={partner.name}
                className="glass-card rounded-3xl border border-white/15 bg-[#1e2020]/70 backdrop-blur-xl p-8 sm:p-12 hover:border-white/30 transition-all duration-300 group overflow-hidden"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${isImageLeft ? "" : "lg:flex-row-reverse"}`}>
                  
                  {/* Image Column */}
                  <div className={`lg:col-span-5 relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/15 bg-black ${isImageLeft ? "" : "lg:order-2"}`}>
                    <Image
                      src={partner.bgImage}
                      alt={partner.name}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    
                    {/* Logo Overlay */}
                    <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/20 max-w-[160px]">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={140}
                        height={50}
                        unoptimized
                        className="object-contain max-h-10 filter brightness-125"
                      />
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className={`lg:col-span-7 flex flex-col gap-4 ${isImageLeft ? "" : "lg:order-1"}`}>
                    <div className="flex items-center gap-3">
                      <span className="font-mono-tech text-xs text-[#de1615] bg-[#de1615]/15 px-3 py-1 rounded-full border border-[#de1615]/40 font-bold uppercase tracking-wider">
                        {partner.tier}
                      </span>
                    </div>

                    <h3 className="font-sora font-extrabold text-2xl sm:text-4xl text-white uppercase tracking-tight group-hover:text-[#ffb59f] transition-colors">
                      {partner.name}
                    </h3>

                    <p className="font-inter text-sm sm:text-base text-[#e2e2e2]/90 leading-relaxed">
                      {partner.description}
                    </p>

                    <div className="p-4 rounded-xl bg-black/50 border border-white/10 mt-2">
                      <span className="font-mono-tech text-xs text-[#ff6534] block uppercase tracking-wider mb-1">
                        KEY CONTRIBUTION & HARDWARE
                      </span>
                      <span className="font-sora font-bold text-sm text-white">
                        {partner.contribution}
                      </span>
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-white bg-[#de1615] hover:bg-[#b81211] px-6 py-2.5 rounded-full font-sora font-bold text-xs uppercase tracking-wider hover:scale-105 transition-transform shadow-md"
                      >
                        Visit Partner Website
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5 — WHY PARTNER WITH TRB */}
      <section className="py-24 px-5 sm:px-10 lg:px-20 max-w-[1440px] mx-auto w-full z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono-tech text-xs text-[#de1615] tracking-widest uppercase font-semibold mb-2">
            MUTUAL VALUE PROPOSITION
          </span>
          <h2 className="font-sora font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight">
            WHY PARTNER WITH TEAM RED BARON?
          </h2>
          <p className="font-inter text-sm sm:text-base text-[#e8bdb6] mt-3">
            Sponsoring Team Red Baron delivers measurable return on investment for industry partners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUE_PROPS.map((vp) => {
            const Icon = vp.icon;
            return (
              <div
                key={vp.title}
                className="glass-card p-8 rounded-3xl border border-white/10 bg-[#1e2020]/60 backdrop-blur-xl flex flex-col justify-between group hover:border-white/30 transition-all duration-300"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#de1615]/20 border border-[#de1615]/50 flex items-center justify-center text-[#de1615] mb-6 group-hover:bg-[#de1615] group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono-tech text-[10px] text-[#ff6534] bg-[#ff6534]/10 border border-[#ff6534]/20 px-2.5 py-1 rounded-md tracking-widest font-semibold uppercase block mb-3 w-fit">
                    {vp.tag}
                  </span>
                  <h3 className="font-sora font-bold text-xl text-white mb-3 group-hover:text-[#ffb59f] transition-colors">
                    {vp.title}
                  </h3>
                  <p className="font-inter text-xs sm:text-sm text-[#e2e2e2]/80 leading-relaxed">
                    {vp.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between font-mono-tech text-xs text-[#de1615]">
                  <span>Explore Returns</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 7 — TESTIMONIALS */}
      <section className="py-24 px-5 sm:px-10 lg:px-20 max-w-[1440px] mx-auto w-full z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono-tech text-xs text-[#de1615] tracking-widest uppercase font-semibold mb-2">
            WHAT OUR SUPPORTERS SAY
          </span>
          <h2 className="font-sora font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight">
            SPONSOR TESTIMONIALS
          </h2>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="glass-card p-10 sm:p-14 rounded-3xl border border-white/15 bg-[#1e2020]/80 backdrop-blur-2xl text-center relative overflow-hidden">
            <Quote className="w-16 h-16 text-[#de1615]/20 absolute top-6 left-6 pointer-events-none" />

            <p className="font-inter text-lg sm:text-xl text-white leading-relaxed italic mb-8 relative z-10">
              "{TESTIMONIALS[activeTestimonial].quote}"
            </p>

            <div className="flex flex-col items-center">
              <span className="font-sora font-extrabold text-lg text-white">
                {TESTIMONIALS[activeTestimonial].name}
              </span>
              <span className="font-mono-tech text-xs text-[#ff6534] font-semibold uppercase mt-0.5">
                {TESTIMONIALS[activeTestimonial].company}
              </span>
              <span className="font-mono-tech text-[10px] text-[#ae8882] uppercase mt-1">
                {TESTIMONIALS[activeTestimonial].tier}
              </span>
            </div>

            {/* Testimonial Controls */}
            <div className="flex items-center justify-center gap-4 mt-8">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === activeTestimonial ? "bg-[#de1615] w-8 shadow-[0_0_10px_#de1615]" : "bg-white/20 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — BECOME A SPONSOR CTA */}
      <section className="py-24 px-5 sm:px-10 lg:px-20 max-w-[1440px] mx-auto w-full z-10">
        <div className="glass-card rounded-[3rem] p-10 sm:p-16 lg:p-20 text-center relative overflow-hidden border border-[#de1615]/50 bg-gradient-to-br from-[#121414] via-[#1e2020] to-[#0c0f0f] shadow-[0_0_60px_rgba(222,22,21,0.25)]">
          {/* Background Hero Image Vignette */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <Image
              src="https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/hero/IMG_4588.png"
              alt="TRB ATV Hero Background"
              fill
              unoptimized
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <span className="font-mono-tech text-xs text-[#ff6534] tracking-widest uppercase font-semibold mb-3">
              JOIN THE CHAMPIONSHIP JOURNEY
            </span>
            
            <h2 className="font-sora font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight mb-6">
              JOIN THE <span className="text-[#de1615]">JOURNEY</span>
            </h2>

            <p className="font-inter text-base sm:text-lg text-[#e8bdb6] leading-relaxed mb-10">
              “Partner with Team Red Baron and help shape the next generation of engineering innovation.”
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => setDonateModalOpen(true)}
                className="bg-[#de1615] hover:bg-[#b81211] text-white px-8 py-4 rounded-full font-sora font-bold text-sm hover:scale-105 transition-all shadow-md flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Sponsorship Brochure
              </button>

              <button
                onClick={() => setContactModalOpen(true)}
                className="glass-card text-white px-8 py-4 rounded-full font-sora font-semibold text-sm border border-white/20 hover:border-[#de1615] hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-[#de1615]" />
                Contact Us
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
