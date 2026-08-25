"use client";

import React, { useRef, useState, ReactNode } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { StaggeredDropDown } from "./animated-staggered-dropdown";

export interface TabItem {
  name: string;
  href: string;
}

interface Position {
  left: number;
  width: number;
  opacity: number;
}

interface SlideTabsProps {
  items: TabItem[];
}

export function SlideTabs({ items }: SlideTabsProps) {
  const [position, setPosition] = useState<Position>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <div
      className="relative"
      onMouseLeave={() => {
        setPosition((pv) => ({
          ...pv,
          opacity: 0,
        }));
      }}
    >
      <ul className="relative mx-auto flex w-fit items-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md p-1 shadow-2xl">
        {items.map((item) => {
          if (item.name === "Team") {
            return (
              <TabContainer key={item.name} setPosition={setPosition}>
                <StaggeredDropDown />
              </TabContainer>
            );
          }

          return (
            <TabContainer key={item.name} setPosition={setPosition}>
              <Link href={item.href} className="block w-full h-full px-3 py-1.5 md:px-5 md:py-2">
                {item.name}
              </Link>
            </TabContainer>
          );
        })}

        <Cursor position={position} />
      </ul>
    </div>
  );
}

interface TabContainerProps {
  children: ReactNode;
  setPosition: React.Dispatch<React.SetStateAction<Position>>;
}

const TabContainer = ({ children, setPosition }: TabContainerProps) => {
  const ref = useRef<HTMLLIElement>(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className="relative z-10 block cursor-pointer text-xs font-mono-tech uppercase font-medium tracking-wider text-white mix-blend-difference md:text-sm"
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }: { position: Position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
      className="absolute z-0 h-7 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.4)] md:h-9"
    />
  );
};
