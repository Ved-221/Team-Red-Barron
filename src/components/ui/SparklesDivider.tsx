"use client";
import React from "react";
import { SparklesCore } from "./sparkles";

export interface SparklesDividerProps {
  title?: string;
  className?: string;
}

export function SparklesDivider({ title, className = "" }: SparklesDividerProps) {
  return (
    <div className={`w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md py-4 ${className}`}>
      {title && (
        <h2 className="md:text-3xl text-xl font-bold text-center text-white relative z-20 font-sora uppercase tracking-wider mb-3">
          {title}
        </h2>
      )}
      <div className="w-full max-w-5xl sm:max-w-6xl h-28 relative flex items-center justify-center">
        {/* Mach-Red Kinetic Theme Gradients */}
        <div className="absolute inset-x-4 sm:inset-x-12 top-0 bg-gradient-to-r from-transparent via-[#de1615] to-transparent h-[2px] w-full blur-sm" />
        <div className="absolute inset-x-4 sm:inset-x-12 top-0 bg-gradient-to-r from-transparent via-[#de1615] to-transparent h-px w-full" />
        <div className="absolute inset-x-16 sm:inset-x-32 top-0 bg-gradient-to-r from-transparent via-[#ff6534] to-transparent h-[4px] w-3/4 blur-sm mx-auto" />
        <div className="absolute inset-x-16 sm:inset-x-32 top-0 bg-gradient-to-r from-transparent via-[#ff6534] to-transparent h-px w-3/4 mx-auto" />

        {/* Core Particle Sparkles Component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1.4}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#de1615"
        />

        {/* Radial Gradient Mask to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(700px_250px_at_top,transparent_20%,white)] pointer-events-none" />
      </div>
    </div>
  );
}
