"use client";

import * as React from "react";
import { useState, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import {
  ChevronDown,
  Home,
  Users,
  Camera,
  Award,
  Mail,
  Info,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function useClickAway(ref: React.RefObject<HTMLElement | null>, handler: (event: MouseEvent | TouchEvent) => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export interface NavCategory {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; color?: string }>;
  color: string;
  isTeamMaster?: boolean;
  subItems?: { id: string; label: string; href: string }[];
}

export interface FluidDropdownProps {
  onItemSelect?: () => void;
  className?: string;
}

function FluidDropdownInner({ onItemSelect, className = "" }: FluidDropdownProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [teamOpen, setTeamOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentYear = searchParams.get("year");

  useClickAway(dropdownRef, () => setIsOpen(false));

  // Determine active route label and ID
  const getActiveState = () => {
    if (pathname === "/about") return { label: "ABOUT", id: "about", icon: Info, color: "#ff6534" };
    if (pathname === "/team") {
      if (currentYear === "2024-25") return { label: "TEAM 2024-25", id: "team-2024", icon: Users, color: "#ff6534" };
      if (currentYear === "2023-24") return { label: "TEAM 2023-24", id: "team-2023", icon: Users, color: "#de1615" };
      return { label: "TEAM 2025-26", id: "team-2025", icon: Users, color: "#de1615" };
    }
    if (pathname === "/gallery") return { label: "GALLERY", id: "gallery", icon: Camera, color: "#ff6534" };
    if (pathname === "/sponsors") return { label: "SPONSORS", id: "sponsors", icon: Award, color: "#de1615" };
    if (pathname === "/contact") return { label: "CONTACT", id: "contact", icon: Mail, color: "#ffb59f" };
    return { label: "HOME", id: "home", icon: Home, color: "#ffffff" };
  };

  const activeState = getActiveState();

  const categories: NavCategory[] = [
    { id: "home", label: "HOME", href: "/", icon: Home, color: "#ffffff" },
    { id: "about", label: "ABOUT", href: "/about", icon: Info, color: "#ff6534" },
    {
      id: "team",
      label: "TEAM",
      href: "/team?year=2025-26",
      icon: Users,
      color: "#de1615",
      isTeamMaster: true,
      subItems: [
        { id: "team-2025", label: "TEAM 2025-26", href: "/team?year=2025-26" },
        { id: "team-2024", label: "TEAM 2024-25", href: "/team?year=2024-25" },
        { id: "team-2023", label: "TEAM 2023-24", href: "/team?year=2023-24" },
      ],
    },
    { id: "gallery", label: "GALLERY", href: "/gallery", icon: Camera, color: "#ff6534" },
    { id: "sponsors", label: "SPONSORS", href: "/sponsors", icon: Award, color: "#de1615" },
    { id: "contact", label: "CONTACT", href: "/contact", icon: Mail, color: "#ffb59f" },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <div className={cn("w-full relative", className)} ref={dropdownRef}>
        {/* Header Button Trigger - Centered */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-[#12151b] text-white",
            "border border-white/15 hover:border-[#de1615]/50 transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-[#de1615]",
            isOpen && "bg-[#181c24] border-[#de1615]"
          )}
          aria-expanded={isOpen}
        >
          <div className="w-5 h-5" />
          <span className="flex items-center gap-2 font-mono-tech uppercase font-bold text-sm tracking-wider text-center">
            <activeState.icon className="w-4 h-4" color={activeState.color} />
            {activeState.label}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center w-5 h-5 text-[#de1615]"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 1, y: 0, height: 0 }}
              animate={{
                opacity: 1,
                y: 0,
                height: "auto",
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 1,
                },
              }}
              exit={{
                opacity: 0,
                y: 0,
                height: 0,
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 1,
                },
              }}
              className="relative left-0 right-0 top-full mt-2 z-50 overflow-hidden"
            >
              <div className="w-full rounded-2xl border border-white/15 bg-[#12151b] p-2 shadow-2xl backdrop-blur-2xl">
                <div className="py-1 flex flex-col gap-1">
                  {categories.map((cat) => {
                    const isCatActive =
                      (cat.id === "home" && pathname === "/") ||
                      (cat.id === "about" && pathname === "/about") ||
                      (cat.id === "gallery" && pathname === "/gallery") ||
                      (cat.id === "sponsors" && pathname === "/sponsors") ||
                      (cat.id === "contact" && pathname === "/contact") ||
                      (cat.id === "team" && pathname === "/team");

                    if (cat.isTeamMaster) {
                      return (
                        <div key={cat.id} className="flex flex-col">
                          <button
                            onClick={() => setTeamOpen(!teamOpen)}
                            className={cn(
                              "w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all",
                              isCatActive
                                ? "bg-[#de1615]/20 text-white border border-[#de1615]/50 font-bold"
                                : "text-gray-300 hover:bg-white/10 hover:text-white"
                            )}
                          >
                            <div className="w-4 h-4" />
                            <span className="font-mono-tech uppercase font-bold text-sm tracking-wider text-center flex items-center gap-2">
                              <cat.icon className="w-4 h-4 text-[#de1615]" />
                              {cat.label}
                            </span>
                            <motion.div
                              animate={{ rotate: teamOpen ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="w-4 h-4 text-[#de1615]" />
                            </motion.div>
                          </button>

                          <AnimatePresence>
                            {(teamOpen || pathname === "/team") && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex flex-col gap-1 pl-4 pt-1 pb-1"
                              >
                                {cat.subItems?.map((sub) => {
                                  const isSubActive =
                                    pathname === "/team" &&
                                    (currentYear === sub.href.split("year=")[1] ||
                                      (!currentYear && sub.id === "team-2025"));

                                  return (
                                    <Link
                                      key={sub.id}
                                      href={sub.href}
                                      onClick={() => {
                                        setIsOpen(false);
                                        if (onItemSelect) onItemSelect();
                                      }}
                                      className={cn(
                                        "flex items-center justify-center px-4 py-2 text-xs font-mono-tech uppercase tracking-wider rounded-xl transition-all text-center",
                                        isSubActive
                                          ? "bg-[#de1615] text-white font-bold shadow-md shadow-[#de1615]/40"
                                          : "text-gray-400 hover:text-white hover:bg-white/10"
                                      )}
                                    >
                                      {sub.label}
                                    </Link>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={cat.id}
                        href={cat.href}
                        onClick={() => {
                          setIsOpen(false);
                          if (onItemSelect) onItemSelect();
                        }}
                        className={cn(
                          "w-full flex items-center justify-center px-4 py-2.5 rounded-xl transition-all text-center font-mono-tech uppercase font-bold text-sm tracking-wider gap-2",
                          isCatActive
                            ? "bg-[#de1615] text-white font-bold shadow-md shadow-[#de1615]/40"
                            : "text-gray-300 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <cat.icon className="w-4 h-4" color={cat.color} />
                        <span>{cat.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

export function FluidDropdown(props: FluidDropdownProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full px-4 py-3 rounded-2xl bg-[#12151b] text-white border border-white/15 flex items-center justify-center font-mono-tech uppercase font-bold text-sm tracking-wider">
          MENU
        </div>
      }
    >
      <FluidDropdownInner {...props} />
    </Suspense>
  );
}

export default FluidDropdown;
