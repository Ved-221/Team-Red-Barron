"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
  </svg>
);

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function FooterClient({ contactData }: { contactData: any }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasData = contactData !== null && contactData !== undefined;

  const email = hasData ? contactData.email : "teamredbaron07@gmail.com";
  const address = hasData ? contactData.address : "Pimpri Chinchwad College of Engineering (PCCOE)\nSector 26, Pradhikaran, Nigdi, Pune, Maharashtra 411044";
  const mdName = hasData ? contactData.managing_director_name : "Tanmay Chaskar";
  const mdEmail = hasData ? contactData.managing_director_email : "teamredbaron07@gmail.com";
  const mdPhone = hasData ? contactData.managing_director_phone : "+91 84829 88462";

  const mktName = hasData ? contactData.marketing_director_name : "Atharva Patil";
  const mktEmail = hasData ? contactData.marketing_director_email : "marketingteamredbaron@gmail.com";
  const mktPhone = hasData ? contactData.marketing_director_phone : "+91 88301 34073";

  const instagramUrl = hasData ? contactData.instagram_url : "https://www.instagram.com/team_red_baron";
  const linkedinUrl = hasData ? contactData.linkedin_url : "https://www.linkedin.com/company/team-red-baron";
  const youtubeUrl = hasData ? contactData.youtube_url : "https://youtube.com/@teamredbaron4316";
  const twitterUrl = hasData ? contactData.twitter_url : null;

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
              &quot;Inspired To Build, Determined To Win.&quot;
            </p>

            <p className="font-inter text-sm text-[#e2e2e2]/70 max-w-md leading-relaxed mb-6">
              A high-performance motorsports team from Pimpri Chinchwad College of Engineering (PCCOE), Pune. Designing and manufacturing champion All-Terrain Vehicles (ATVs) for national and international competitions.
            </p>

            <div className="flex items-center gap-3">
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-white/80 hover:text-[#de1615] hover:border-[#de1615] transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-white/80 hover:text-[#de1615] hover:border-[#de1615] transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon className="w-4 h-4" />
                </a>
              )}
              {youtubeUrl && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-white/80 hover:text-[#de1615] hover:border-[#de1615] transition-colors"
                  aria-label="YouTube"
                >
                  <YouTubeIcon className="w-4 h-4" />
                </a>
              )}
              {twitterUrl && (
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-white/80 hover:text-[#de1615] hover:border-[#de1615] transition-colors"
                  aria-label="Twitter / X"
                >
                  <TwitterIcon className="w-4 h-4" />
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
                <Link href="/team" className="hover:text-[#de1615] transition-colors">
                  Team Members & Faculty
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#de1615] transition-colors">
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
              <div>{address}</div>
              {email && (
                <div className="pt-1">
                  <a href={`mailto:${email}`} className="font-mono text-[#de1615] hover:underline text-xs">
                    {email}
                  </a>
                </div>
              )}
              <div className="pt-4 space-y-4">
                {mdName && (
                  <div>
                    <p className="font-bold text-white uppercase text-[10px] tracking-wider">Managing Director</p>
                    <p className="font-bold text-white text-sm">{mdName}</p>
                    {mdPhone && <p className="text-[#e8bdb6] text-[10px]">{mdPhone}</p>}
                    {mdEmail && (
                      <a href={`mailto:${mdEmail}`} className="font-mono text-[#de1615] hover:underline text-[10px] block">
                        {mdEmail}
                      </a>
                    )}
                  </div>
                )}
                {mktName && (
                  <div>
                    <p className="font-bold text-white uppercase text-[10px] tracking-wider">Marketing Director</p>
                    <p className="font-bold text-white text-sm">{mktName}</p>
                    {mktPhone && <p className="text-[#e8bdb6] text-[10px]">{mktPhone}</p>}
                    {mktEmail && (
                      <a href={`mailto:${mktEmail}`} className="font-mono text-[#de1615] hover:underline text-[10px] block">
                        {mktEmail}
                      </a>
                    )}
                  </div>
                )}
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
