"use client";

import React from "react";
import { motion } from "motion/react";

export const BackgroundBeams = ({ className = "" }: { className?: string }) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden bg-black ${className}`}
    >
      {/* High-visibility ambient light backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#de1615]/25 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-2/3 right-1/4 w-[600px] h-[400px] bg-[#ff6534]/20 rounded-full blur-[140px] pointer-events-none" />

      {/* SVG Beams Network */}
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none opacity-80"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        fill="none"
      >
        <g filter="url(#beams-glow)">
          {/* Beam 1 */}
          <motion.path
            initial={{ pathLength: 0.2, opacity: 0.4 }}
            animate={{ pathLength: [0.2, 1, 0.2], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            d="M-100 -50 L720 450 L1540 -50"
            stroke="url(#beam-primary)"
            strokeWidth="3"
          />
          {/* Beam 2 */}
          <motion.path
            initial={{ pathLength: 0.4, opacity: 0.3 }}
            animate={{ pathLength: [0.4, 1, 0.4], opacity: [0.3, 0.85, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            d="M-200 300 L720 500 L1640 100"
            stroke="url(#beam-secondary)"
            strokeWidth="2.5"
          />
          {/* Beam 3 */}
          <motion.path
            initial={{ pathLength: 0.1, opacity: 0.5 }}
            animate={{ pathLength: [0.1, 0.9, 0.1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            d="M100 -100 L720 400 L1340 1000"
            stroke="url(#beam-primary)"
            strokeWidth="3"
            strokeDasharray="12 12"
          />
          {/* Beam 4 */}
          <motion.path
            initial={{ pathLength: 0.3, opacity: 0.4 }}
            animate={{ pathLength: [0.3, 1, 0.3], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            d="M-50 600 L720 350 L1500 700"
            stroke="url(#beam-secondary)"
            strokeWidth="2"
          />
          {/* Beam 5 */}
          <motion.path
            initial={{ pathLength: 0.5, opacity: 0.6 }}
            animate={{ pathLength: [0.5, 1, 0.5], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            d="M300 -200 L720 600 L1100 1100"
            stroke="url(#beam-primary)"
            strokeWidth="3.5"
          />
        </g>

        <defs>
          <linearGradient id="beam-primary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#de1615" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#ff6534" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="beam-secondary" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff6534" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#de1615" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#de1615" stopOpacity="0.1" />
          </linearGradient>
          <filter id="beams-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Pulsing Light Orbs */}
      <motion.div
        initial={{ opacity: 0.4, scale: 0.9 }}
        animate={{ opacity: [0.4, 0.85, 0.4], scale: [0.9, 1.25, 0.9] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-[#de1615]/30 via-[#ff6534]/15 to-transparent blur-[140px] pointer-events-none"
      />
    </div>
  );
};
