"use client";

import Image from "next/image";
import Link from "next/link";

export function SponsorsMarquee() {
  const sponsors = [
    { name: "VARROC", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/TITLE/VARROC.png", url: "https://www.instagram.com/p/DZB2W0oEhQW/" },
    { name: "ALTIUM", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/TITLE/ALTIUM.png", url: "https://www.altium.com/education/sponsorships/team-stories/team-red-baron" },
    { name: "MAHLE", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/TITLE/MAHLE.png" },
    { name: "SKF", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/PLATINUM/SKF.png" },
    { name: "FLUKE", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/PLATINUM/FLUKE.png" },
    { name: "GEFRAN", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/TITLE/GEFRAN.png" },
    { name: "STAR ENGINEERS", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/TITLE/STAR ENGINEERS.png" },
    { name: "MITUTOYO", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/GOLD/MITUTOYO.png" },
    { name: "MOLEX", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/SILVER/MOLEX.png" },
    { name: "ROSENBERGER", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/TITLE/rosenberger.png" },
    { name: "ESBEE", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/PLATINUM/ESBEE.png" },
    { name: "BEICO", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/SILVER/BEICO.png" },
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
            href={s.url || "/sponsors"}
            target={s.url ? "_blank" : undefined}
            rel={s.url ? "noreferrer" : undefined}
            className="flex items-center justify-center shrink-0 group filter grayscale opacity-75 hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-300"
          >
            <div className="relative w-36 h-14 flex items-center justify-center">
              <Image
                src={s.logo}
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
