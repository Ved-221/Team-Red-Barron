"use client";

import Image from "next/image";
import Link from "next/link";

export function SponsorsMarquee({ sponsors }: { sponsors: any[] }) {
  if (!sponsors || sponsors.length === 0) return null;

  return (
    <section className="py-14 bg-[#0a0c0e] border-y border-white/10 overflow-hidden relative">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 mb-8 text-center">
        <h3 className="font-sora font-extrabold text-2xl sm:text-3xl text-white tracking-tight uppercase">
          OUR <span className="text-[#de1615]">SPONSORS</span>
        </h3>
      </div>

      <div className="flex animate-marquee gap-16 items-center">
        {[...sponsors, ...sponsors, ...sponsors].map((s, idx) => (
          <Link
            key={idx}
            href={s.website_url || "/sponsors"}
            target={s.website_url ? "_blank" : undefined}
            rel={s.website_url ? "noreferrer" : undefined}
            className="flex items-center justify-center shrink-0 group filter hover:scale-110 transition-all duration-300"
          >
            <div className="relative w-36 h-14 flex items-center justify-center">
              <Image
                src={s.logo_url}
                alt={`${s.name} Logo`}
                width={150}
                height={55}
                unoptimized
                className="object-contain max-h-12 filter brightness-125"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
