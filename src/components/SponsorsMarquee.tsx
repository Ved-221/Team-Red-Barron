"use client";

import Image from "next/image";
import Link from "next/link";

export function SponsorsMarquee() {
  const sponsors = [
    { name: "VARROC", logo: "/media/sponsors/TITLE/VARROC.png" },
    { name: "ALTIUM", logo: "/media/sponsors/TITLE/ALTIUM.png" },
    { name: "MAHLE", logo: "/media/sponsors/TITLE/MAHLE.png" },
    { name: "SKF", logo: "/media/sponsors/PLATINUM/SKF.png" },
    { name: "FLUKE", logo: "/media/sponsors/PLATINUM/FLUKE.png" },
    { name: "GEFRAN", logo: "/media/sponsors/TITLE/GEFRAN.png" },
    { name: "STAR ENGINEERS", logo: "/media/sponsors/TITLE/STAR ENGINEERS.png" },
    { name: "MITUTOYO", logo: "/media/sponsors/GOLD/MITUTOYO.png" },
    { name: "MOLEX", logo: "/media/sponsors/SILVER/MOLEX.png" },
    { name: "ROSENBERGER", logo: "/media/sponsors/TITLE/rosenberger.png" },
    { name: "ESBEE", logo: "/media/sponsors/PLATINUM/ESBEE.png" },
    { name: "BEICO", logo: "/media/sponsors/SILVER/BEICO.png" },
  ];

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
            href="/sponsors"
            className="flex items-center justify-center shrink-0 group filter grayscale opacity-75 hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-300"
          >
            <div className="relative w-36 h-14 flex items-center justify-center">
              <Image
                src={s.logo}
                alt={`${s.name} Logo`}
                width={150}
                height={55}
                className="object-contain max-h-12 filter brightness-125"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
