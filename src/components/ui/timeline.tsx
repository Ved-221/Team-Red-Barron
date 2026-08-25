"use client";
import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref, data]);

  // Recalculate height on window resize
  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setHeight(ref.current.getBoundingClientRect().height);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 90%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <div
      className="w-full bg-[#000000] font-sans overflow-hidden py-16"
      ref={containerRef}
    >
      {/* Header section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#de1615]/20 border border-[#de1615]/50 text-[#de1615] font-mono-tech text-xs tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(222,22,21,0.3)]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#de1615] animate-ping" />
          CHASSIS EVOLUTION MATRIX
        </div>
        <h2 className="font-sora font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight max-w-4xl mx-auto">
          EVOLUTIONARY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#de1615] via-[#ff6534] to-white">TIMELINE</span>
        </h2>
        <p className="font-inter text-sm sm:text-base text-[#e8bdb6]/90 max-w-2xl mx-auto mt-4 leading-relaxed">
          13+ Generations of untamed offroad endurance engineering. Explore the progression of Team Red Baron ATVs designed and manufactured at PCCOE Pune.
        </p>
      </div>

      {/* Timeline track container */}
      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* CENTERED BEAM TRACK BACKGROUND RAIL */}
        <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-[4px] bg-[#1a202c] border-x border-white/10 rounded-full z-0" />

        {/* BRIGHT GLOWING ANIMATED LASER BEAM */}
        <div
          style={{ height: height + "px" }}
          className="absolute left-6 md:left-1/2 -translate-x-1/2 top-0 overflow-hidden w-[4px] pointer-events-none z-10"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="w-full bg-gradient-to-b from-[#de1615] via-[#ff6534] to-[#ffffff] rounded-full shadow-[0_0_15px_#de1615,0_0_30px_#de1615,0_0_50px_#ff6534]"
          />
        </div>

        {/* TIMELINE ITEMS */}
        {data.map((item, index) => (
          <div
            key={index}
            className="relative z-20 mb-20 last:mb-0"
          >
            {/* Animated Year Node Marker */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0.8 }}
              whileInView={{ scale: 1.15, opacity: 1 }}
              viewport={{ amount: 0.6, margin: "-15% 0px -30% 0px" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute left-6 md:left-1/2 -translate-x-1/2 top-0 z-30 flex flex-col items-center group cursor-pointer"
            >
              <div className="px-4 py-1.5 rounded-full bg-[#0a0d12] border-2 border-[#de1615] flex items-center justify-center shadow-[0_0_25px_rgba(222,22,21,0.9)] backdrop-blur-md group-hover:scale-110 group-hover:shadow-[0_0_35px_#de1615] group-hover:border-[#ff6534] transition-all duration-300">
                <span className="font-sora font-extrabold text-sm sm:text-base tracking-wider text-white drop-shadow-[0_0_10px_#de1615]">
                  {item.title}
                </span>
              </div>
            </motion.div>

            {/* Content Slot */}
            <div className="pt-4 md:pt-2">
              {item.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
