"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronRight, Mail } from "lucide-react";
import { SlideTabs } from "@/components/ui/SlideTabs";
import { FluidDropdown } from "@/components/ui/fluid-dropdown";
import { DonateModal, ContactModal } from "@/components/ui/SupportModals";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Team", href: "/team" },
    { name: "Gallery", href: "/gallery" },
    { name: "Sponsors", href: "/sponsors" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[#252e39]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 flex items-center justify-between">
          {/* Brand / Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-lg bg-black/40 border border-white/10 p-1 group-hover:border-[#de1615] transition-colors">
              <Image
                src="/logo.png"
                alt="Team Red Baron Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-sora font-extrabold text-xl tracking-tight text-white">
                TEAM <span className="text-[#de1615]">RED</span> BARON
              </span>
              <span className="font-mono-tech text-[10px] text-[#e8bdb6] tracking-widest uppercase">
                PCCOE Motorsport
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links with SlideTabs */}
          <div className="hidden lg:block">
            <SlideTabs items={navLinks} />
          </div>

          {/* Desktop Right Side Action CTAs: Donate Us */}
          <div className="hidden md:flex items-center gap-3">
            {/* Primary Red Donate Us Button */}
            <button
              onClick={() => setDonateOpen(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-[#de1615] to-[#ff6534] text-white px-6 py-2.5 rounded-full font-sora font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(222,22,21,0.4)] hover:shadow-[0_0_25px_rgba(222,22,21,0.6)] border border-white/20"
            >
              <span className="relative z-10">Donate Us</span>
              {/* Shine Sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 glass-card rounded-lg hover:border-[#de1615] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-card mt-3 mx-4 p-5 rounded-3xl border border-white/15 flex flex-col gap-4 animate-in slide-in-from-top duration-200 bg-black/95 backdrop-blur-2xl z-50">
            <FluidDropdown onItemSelect={() => setMobileMenuOpen(false)} />

            {/* Mobile Actions Container */}
            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setDonateOpen(true);
                }}
                className="group relative overflow-hidden w-full bg-gradient-to-r from-[#de1615] to-[#ff6534] text-white py-3.5 rounded-xl font-sora font-bold text-center transition-all shadow-[0_0_15px_rgba(222,22,21,0.4)] border border-white/20"
              >
                <span className="relative z-10">Donate Us</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Shared Interactive Modals */}
      <DonateModal isOpen={donateOpen} onClose={() => setDonateOpen(false)} />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
