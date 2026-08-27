"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function TRBLoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // We do NOT wait for every asset (like heavy 3D models or Supabase videos).
    // We just want to ensure the initial DOM, CSS, and critical fonts are ready.
    // A maximum 1500ms timeout prevents hanging if non-critical assets fail.
    const maxTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    const handleLoad = () => {
      // Ensure a minimum 600ms display to prevent a jarring 1-frame flash
      setTimeout(() => setIsLoading(false), 600);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      clearTimeout(maxTimer);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="trb-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-[#050608] flex flex-col items-center justify-center pointer-events-auto"
        >
          {/* Subtle grid and gradient background for premium feel */}
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(222,22,21,0.08)_0%,transparent_60%)] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* TRB Logo */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-8">
              <Image
                src="/logo.png"
                alt="Team Red Baron Logo"
                fill
                priority
                className="object-contain drop-shadow-[0_0_20px_rgba(222,22,21,0.4)]"
              />
            </div>
            
            {/* Loading Indicator */}
            <div className="flex items-center gap-3 glass-card px-5 py-2 rounded-full border border-white/10">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#de1615] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#de1615]" />
              </span>
              <span className="font-mono-tech text-[10px] sm:text-xs tracking-widest text-[#ffb59f] uppercase font-bold animate-pulse">
                INITIALIZING TELEMETRY...
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
