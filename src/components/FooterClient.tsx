"use client";

import Image from "next/image";
import Link from "next/link";
import { Globe, ArrowUp } from "lucide-react";

export function FooterClient({ contactData }: { contactData: any }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const email = contactData?.email || "contact@teamredbaron.com";
  const address = contactData?.address || "Pimpri Chinchwad College of Engineering (PCCOE)\nNear Akurdi Railway Station, Nigdi\nPune – 411044, Maharashtra, India";

  return (
    <footer className="w-full bg-[#0a0a0a] border-t border-white/10 pt-16 pb-8 relative">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-black border border-white/10 p-1">
                <Image
                  src="/logo.png"
                  alt="Team Red Baron Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="font-sora font-extrabold text-2xl text-white">
                TEAM <span className="text-[#de1615]">RED BARON</span>
              </span>
            </div>

            <p className="font-mono text-xs text-[#ff6534] font-semibold tracking-wider uppercase mb-3">
              "Inspired To Build, Determined To Win."
            </p>

            <p className="font-inter text-sm text-[#e2e2e2]/70 max-w-md leading-relaxed mb-6">
              A high-performance motorsports team from Pimpri Chinchwad College of Engineering (PCCOE), Pune. Designing and manufacturing champion All-Terrain Vehicles (ATVs) for national and international competitions.
            </p>

            <div className="flex items-center gap-3">
              {contactData?.linkedin_url && (
                <a href={contactData.linkedin_url} target="_blank" rel="noreferrer" className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-white/80 hover:text-[#de1615] hover:border-[#de1615] transition-colors" aria-label="LinkedIn">
                  <Globe className="w-5 h-5" />
                </a>
              )}
              {contactData?.github_url && (
                <a href={contactData.github_url} target="_blank" rel="noreferrer" className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-white/80 hover:text-[#de1615] hover:border-[#de1615] transition-colors" aria-label="GitHub">
                  <Globe className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-mono-tech text-xs text-white uppercase tracking-widest mb-6">
              Navigation
            </h4>
            <ul className="space-y-3 font-inter text-sm text-[#e2e2e2]/70">
              <li>
                <Link href="/" className="hover:text-[#de1615] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#de1615] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about#team" className="hover:text-[#de1615] transition-colors">
                  Team Members & Faculty
                </Link>
              </li>
              <li>
                <Link href="/#gallery" className="hover:text-[#de1615] transition-colors">
                  Photo & Video Gallery
                </Link>
              </li>
              <li>
                <Link href="/sponsors" className="hover:text-[#de1615] transition-colors">
                  Our Sponsors
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#de1615] transition-colors">
                  Contact Pitwall
                </Link>
              </li>
            </ul>
          </div>

          {/* Location & Workshop */}
          <div>
            <h4 className="font-mono-tech text-xs text-white uppercase tracking-widest mb-6">
              Pitwall Headquarters
            </h4>
            <div className="font-inter text-xs text-[#e8bdb6] space-y-2 leading-relaxed whitespace-pre-line">
              <p className="font-bold text-white uppercase text-[10px] tracking-wider">Innovation Center</p>
              {address}
              <div className="pt-4 space-y-4">
                <div>
                  <p className="font-bold text-white uppercase text-[10px] tracking-wider">Managing Director</p>
                  <p className="font-bold text-white text-sm">Tanmay Chaskar</p>
                  <p className="text-[#e8bdb6] text-[10px]">+91 84829 88462</p>
                  <p className="font-mono text-[#de1615] text-[10px]">teamredbaron07@gmail.com</p>
                </div>
                <div>
                  <p className="font-bold text-white uppercase text-[10px] tracking-wider">Marketing Director</p>
                  <p className="font-bold text-white text-sm">Atharva Patil</p>
                  <p className="text-[#e8bdb6] text-[10px]">+91 88301 34073</p>
                  <p className="font-mono text-[#de1615] text-[10px]">marketingteamredbaron@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-tech text-xs text-[#e8bdb6]">
          <span>©2025 Team Red Baron. PCCOE Pune. All Rights Reserved.</span>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-white/70 hover:text-[#de1615] transition-colors"
          >
            BACK TO TOP <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
}
