"use client";

import React, { useState, Suspense } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export interface StaggeredDropDownProps {
  onSelectSeason?: (year: string) => void;
}

function DropDownInner({ onSelectSeason }: StaggeredDropDownProps) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const currentSeasonId = searchParams.get("year");

  const [seasons, setSeasons] = useState<{ year: string; label: string; id: string }[]>([]);

  React.useEffect(() => {
    async function fetchYears() {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data } = await supabase
        .from("team_years")
        .select("id, year_label")
        .is("deleted_at", null)
        .order("sort_order", { ascending: true });
      
      if (data) {
        setSeasons(data.map(y => ({
          year: y.year_label,
          label: `TEAM ${y.year_label}`,
          id: y.year_label
        })));
      }
    }
    fetchYears();
  }, []);

  // Determine current season label
  const currentSeasonData = seasons.find(s => s.id === currentSeasonId) || seasons[0];
  const currentLabel = currentSeasonData ? currentSeasonData.label : "TEAM";

  return (
    <div className="relative inline-block">
      <motion.div animate={open ? "open" : "closed"} className="relative">
        <button
          onClick={() => setOpen((pv) => !pv)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono-tech uppercase font-medium tracking-wider text-white hover:text-[#de1615] transition-colors rounded-full cursor-pointer md:px-5 md:py-2 md:text-sm"
        >
          <span>TEAM</span>
          <motion.span variants={iconVariants}>
            <ChevronDown className="w-3.5 h-3.5 text-[#de1615]" />
          </motion.span>
        </button>

        <motion.ul
          initial={wrapperVariants.closed}
          variants={wrapperVariants}
          style={{ originY: "top", translateX: "-50%" }}
          className="flex flex-col gap-1 p-2 rounded-2xl bg-[#12151b] border border-white/15 shadow-2xl absolute top-[130%] left-[50%] w-48 overflow-hidden z-50 backdrop-blur-xl"
        >
          {seasons.map((s) => (
            <Option
              key={s.year}
              text={s.label}
              year={s.year}
              isActive={currentSeasonId === s.id}
              setOpen={setOpen}
              onSelectSeason={onSelectSeason}
            />
          ))}
        </motion.ul>
      </motion.div>
    </div>
  );
}

const Option = ({
  text,
  year,
  isActive,
  setOpen,
  onSelectSeason,
}: {
  text: string;
  year: string;
  isActive: boolean;
  setOpen: (val: boolean) => void;
  onSelectSeason?: (year: string) => void;
}) => {
  return (
    <motion.li variants={itemVariants}>
      <Link
        href={`/team?year=${year}`}
        onClick={() => {
          setOpen(false);
          if (onSelectSeason) onSelectSeason(year);
        }}
        className={`flex items-center justify-between w-full px-3 py-2 text-xs font-mono-tech uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
          isActive
            ? "bg-[#de1615] text-white font-bold shadow-md shadow-[#de1615]/30"
            : "text-gray-300 hover:bg-white/10 hover:text-white"
        }`}
      >
        <span>{text}</span>
        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
      </Link>
    </motion.li>
  );
};

export function StaggeredDropDown(props: StaggeredDropDownProps) {
  return (
    <Suspense fallback={
      <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono-tech uppercase font-medium tracking-wider text-white md:px-5 md:py-2 md:text-sm">
        <span>TEAM</span>
        <ChevronDown className="w-3.5 h-3.5 text-[#de1615]" />
      </button>
    }>
      <DropDownInner {...props} />
    </Suspense>
  );
}

export default StaggeredDropDown;

const wrapperVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.05,
    },
  },
};

const iconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
    },
  },
  closed: {
    opacity: 0,
    y: -12,
    transition: {
      when: "afterChildren",
    },
  },
};
