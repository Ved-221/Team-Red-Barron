"use client";

import Image from "next/image";
import Link from "next/link";
import { Globe, Mail, ArrowUp } from "lucide-react";

function GithubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
              <a
                href="https://www.linkedin.com/company/team-red-baron"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-white/80 hover:text-[#de1615] hover:border-[#de1615] transition-colors"
                aria-label="LinkedIn"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/teamredbaron"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-white/80 hover:text-[#de1615] hover:border-[#de1615] transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/team_red_baron?igsh=dTEzOHQ0aWZid3A="
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-white/80 hover:text-[#de1615] hover:border-[#de1615] transition-colors"
                aria-label="Instagram"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="mailto:info@teamredbaron.com"
                className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-white/80 hover:text-[#de1615] hover:border-[#de1615] transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
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
            <div className="font-inter text-xs text-[#e8bdb6] space-y-2 leading-relaxed">
              <p className="font-bold text-white">Innovation Center</p>
              <p>Pimpri Chinchwad College of Engineering (PCCOE)</p>
              <p>Near Akurdi Railway Station, Nigdi</p>
              <p>Pune – 411044, Maharashtra, India</p>
              <p className="pt-2 font-mono text-[#de1615]">Email: info@teamredbaron.com</p>
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
