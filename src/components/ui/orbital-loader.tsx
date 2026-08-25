"use client";

import React from "react";
import { cva } from "class-variance-authority";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

const orbitalLoaderVariants = cva("flex gap-4 items-center justify-center select-none", {
  variants: {
    messagePlacement: {
      bottom: "flex-col",
      top: "flex-col-reverse",
      right: "flex-row",
      left: "flex-row-reverse",
    },
  },
  defaultVariants: {
    messagePlacement: "bottom",
  },
});

export interface OrbitalLoaderProps {
  message?: string;
  showTitle?: boolean;
  /**
   * Position of the message relative to the spinner.
   * @default bottom
   */
  messagePlacement?: "top" | "bottom" | "left" | "right";
}

export function OrbitalLoader({
  className,
  message,
  messagePlacement,
  showTitle = true,
  ...props
}: React.ComponentProps<"div"> & OrbitalLoaderProps) {
  return (
    <div className={cn(orbitalLoaderVariants({ messagePlacement }))}>
      <div className={cn("relative w-12 h-12", className)} {...props}>
        {/* Outer Orbit Ring - Red */}
        <motion.div
          className="absolute inset-0 border-[1.5px] border-transparent border-t-[#de1615] border-r-[#de1615]/50 rounded-full shadow-[0_0_10px_rgba(222,22,21,0.4)]"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        {/* Middle Orbit Ring - Kinetic Orange */}
        <motion.div
          className="absolute inset-1.5 border-[1.5px] border-transparent border-t-[#ff6534] border-l-[#ff6534]/50 rounded-full shadow-[0_0_8px_rgba(255,101,52,0.3)]"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        {/* Inner Orbit Ring - White */}
        <motion.div
          className="absolute inset-3 border-[1.5px] border-transparent border-t-white/80 rounded-full shadow-[0_0_6px_rgba(255,255,255,0.6)]"
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.9,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        {/* Glowing Center Core */}
        <div className="absolute inset-[15px] bg-[#de1615] rounded-full blur-[1.5px] animate-pulse opacity-80" />
      </div>

      {/* Planet Kosmos Title */}
      {showTitle && (
        <div className="flex items-center gap-1.5 text-xs sm:text-sm tracking-wider select-none font-bold opacity-90">
          <span style={{ fontFamily: "'Planet Kosmos', sans-serif" }} className="text-white">
            TEAM
          </span>
          <span style={{ fontFamily: "'Planet Kosmos', sans-serif" }} className="text-[#de1615]">
            RED
          </span>
          <span style={{ fontFamily: "'Planet Kosmos', sans-serif" }} className="text-white">
            BARON
          </span>
        </div>
      )}

      {message && (
        <div className="font-mono-tech text-[10px] text-[#e8bdb6] tracking-widest uppercase animate-pulse mt-0.5 opacity-80">
          {message}
        </div>
      )}
    </div>
  );
}

export default OrbitalLoader;
