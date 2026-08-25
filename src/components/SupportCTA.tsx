"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { ArrowRight, Heart, Mail, Sparkles, Handshake, ShieldCheck } from "lucide-react";
import GradientWaves from "@/components/ui/GradientWaves";
import BorderGlow from "@/components/ui/BorderGlow";
import { DonateModal, ContactModal } from "@/components/ui/SupportModals";

export function SupportCTA() {
  const [donateOpen, setDonateOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 relative z-10">

          <BorderGlow
            edgeSensitivity={35}
            glowColor="0 90 48"
            backgroundColor="#07090b"
            borderRadius={48}
            glowRadius={45}
            glowIntensity={1.2}
            coneSpread={28}
            animated={true}
            colors={["#de1615", "#ff6534", "#ffffff"]}
            className="w-full"
          >
            <div className="relative p-10 sm:p-16 lg:p-20 text-center overflow-hidden bg-black/60 backdrop-blur-2xl">

              {/* Background Layer 1: WebGL Animated Gradient Waves */}
              <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <GradientWaves
                  horizonColor="#de1615"
                  waveColor="#0e1114"
                  crestColor="#ff6534"
                  speed={0.3}
                  amplitude={2.0}
                  waveScale={0.5}
                  waveRatio={0.8}
                  swell={25}
                  turbulence={15}
                  tilt={1.0}
                  zoom={1.0}
                  height={5.0}
                  fogDepth={12}
                  detail="medium"
                  brightness={0.9}
                  opacity={0.7}
                  mouseInteraction={true}
                  parallaxStrength={0.4}
                  grain={true}
                  grainIntensity={0.03}
                />
              </div>

              {/* Background Layer 2: Faint Formula Student / Baja Vehicle Silhouette (5-10% Opacity) */}
              <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-[0.07] overflow-hidden">
                <div className="relative w-[700px] h-[500px]">
                  <Image
                    src="/media/buggyy.png"
                    alt="Formula Student Vehicle Background Silhouette"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Background Layer 3: Faint Motorsport Racing-Line SVG Graphic */}
              <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <svg className="w-full h-full stroke-[#de1615]/40 fill-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M-100 300 C 300 100, 800 500, 1600 200" strokeWidth="2" strokeDasharray="8 8" />
                  <path d="M-100 320 C 300 120, 800 520, 1600 220" strokeWidth="1" strokeDasharray="4 4" />
                </svg>
              </div>

              {/* Background Layer 4: Breathing Animated Red Ambient Radial Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#de1615]/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />

              {/* CONTENT CONTAINER */}
              <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">

                {/* Main Heading */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="font-sora font-black text-3xl sm:text-5xl lg:text-6xl text-white mb-6 uppercase tracking-tight leading-none drop-shadow-md"
                >
                  Power the Dream. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6534] via-[#de1615] to-[#ff6534] drop-shadow-[0_0_30px_rgba(222,22,21,0.6)]">
                    Support the Team.
                  </span>
                </motion.h2>

                {/* Description Paragraph */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="font-inter text-base sm:text-lg text-[#e2e2e2]/90 mb-10 leading-relaxed max-w-2xl font-normal"
                >
                  Team Red Baron is driven by innovation, engineering excellence, and relentless motorsport passion. Connect with us, collaborate, sponsor our journey, or contribute towards building the next generation Formula Student race car.
                </motion.p>

                {/* Centered CTA Buttons & Partnership Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col items-center gap-6 w-full"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-5 justify-center w-full sm:w-auto">
                    <button
                      onClick={() => setDonateOpen(true)}
                      className="group relative overflow-hidden w-full sm:w-auto bg-gradient-to-r from-[#de1615] to-[#ff6534] text-white px-9 py-4 rounded-full font-sora font-extrabold text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(222,22,21,0.4)] hover:shadow-[0_0_40px_rgba(222,22,21,0.6)] flex items-center justify-center gap-3 border border-white/20"
                    >
                      <span className="relative z-10">Donate Us</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform relative z-10" />
                      {/* Shine Sweep */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                    </button>

                    {/* Secondary CTA: Contact Us */}
                    <button
                      onClick={() => setContactOpen(true)}
                      className="w-full sm:w-auto relative group overflow-hidden glass-card text-white px-9 py-4 rounded-full font-sora font-extrabold text-lg border border-white/25 hover:border-[#de1615] hover:bg-white/10 transition-all flex items-center justify-center gap-3 shadow-lg"
                    >
                      <Mail className="w-5 h-5 text-[#de1615]" />
                      <span>Contact Us</span>
                      {/* Border Illumination Sweep */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                    </button>
                  </div>

                  {/* Third Badge: Industry Collaborations */}
                  <div className="flex items-center gap-2.5 glass-card px-5 py-2 rounded-full border border-white/10 text-xs font-mono-tech text-[#e8bdb6] bg-black/40">
                    <Handshake className="w-4 h-4 text-[#de1615]" />
                    <span>25+ INDUSTRY COLLABORATIONS & SPONSORS</span>
                  </div>
                </motion.div>

              </div>
            </div>
          </BorderGlow>

        </div>
      </section>

      {/* Interactive Modals */}
      <DonateModal isOpen={donateOpen} onClose={() => setDonateOpen(false)} />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
