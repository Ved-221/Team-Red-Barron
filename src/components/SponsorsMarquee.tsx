"use client";

import { SmartImage } from "@/components/SmartImage";
import Link from "next/link";

interface SponsorMarqueeItem {
  id?: string | number;
  name?: string;
  logo_url: string;
  website_url?: string | null;
}

export function SponsorsMarquee({ sponsors }: { sponsors: SponsorMarqueeItem[] }) {
  if (!sponsors || sponsors.length === 0) return null;

  return (
    <section className="py-14 max-md:py-8 bg-[#0a0c0e] border-y border-white/10 overflow-hidden relative">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 max-md:px-4 mb-8 max-md:mb-5 text-center">
        <h3 className="font-sora font-extrabold text-2xl sm:text-3xl text-white tracking-tight uppercase">
          OUR <span className="text-[#de1615]">SPONSORS</span>
        </h3>
      </div>

      {/* Desktop Sponsors Marquee (>= 768px) */}
      <div className="flex animate-marquee gap-16 items-center max-md:hidden">
        {[...sponsors, ...sponsors, ...sponsors].map((s, idx) => (
          <Link
            key={idx}
            href={s.website_url || "/sponsors"}
            target={s.website_url ? "_blank" : undefined}
            rel={s.website_url ? "noreferrer" : undefined}
            className="flex items-center justify-center shrink-0 group filter hover:scale-110 transition-all duration-300"
          >
            <div className="relative w-36 h-14 flex items-center justify-center">
              <SmartImage
                src={s.logo_url}
                alt={`${s.name} Logo`}
                width={150}
                height={55}
                sizes="150px"
                className="object-contain max-h-12 filter brightness-125"
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile Sponsors Marquee (< 768px): 40px high logos in a slower marquee */}
      <div className="hidden max-md:flex animate-marquee gap-8 items-center [animation-duration:35s]">
        {[...sponsors, ...sponsors].map((s, idx) => (
          <Link
            key={idx}
            href={s.website_url || "/sponsors"}
            target={s.website_url ? "_blank" : undefined}
            rel={s.website_url ? "noreferrer" : undefined}
            className="flex items-center justify-center shrink-0 group filter"
          >
            <div className="relative w-28 h-10 flex items-center justify-center">
              <SmartImage
                src={s.logo_url}
                alt={`${s.name} Logo`}
                width={112}
                height={40}
                sizes="112px"
                className="object-contain max-h-10 filter brightness-125"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
