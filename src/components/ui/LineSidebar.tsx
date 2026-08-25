"use client";

import React, { useState } from "react";
import "./LineSidebar.css";

export interface LineSidebarProps {
  items: string[];
  accentColor?: string; // Active selected color (Primary Red)
  hoverColor?: string;  // Hovered color (Kinetic Orange)
  textColor?: string;
  markerColor?: string;
  showIndex?: boolean;
  showMarker?: boolean;
  markerLength?: number;
  itemGap?: number;
  defaultActive?: number;
  onItemClick?: (index: number, label: string) => void;
  className?: string;
}

export default function LineSidebar({
  items,
  accentColor = "#de1615",
  hoverColor = "#ff6534",
  textColor = "#c4c4c4",
  markerColor = "#6c6c6c",
  showIndex = true,
  showMarker = true,
  markerLength = 40,
  itemGap = 24,
  defaultActive = 0,
  onItemClick,
  className = "",
}: LineSidebarProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState<number>(defaultActive);

  const handleSelect = (index: number, label: string) => {
    setActiveIdx(index);
    onItemClick?.(index, label);
  };

  return (
    <nav className={`line-sidebar-nav ${className}`}>
      <ul className="flex flex-col" style={{ gap: `${itemGap}px` }}>
        {items.map((label, index) => {
          const isActive = activeIdx === index;
          const isHovered = hoveredIdx === index && !isActive;
          const isHighlighted = isActive || isHovered;

          // Distinct color: Red for Active, Kinetic Orange for Hover
          const currentColor = isActive ? accentColor : isHovered ? hoverColor : textColor;
          const currentMarkerColor = isActive ? accentColor : isHovered ? hoverColor : markerColor;

          return (
            <li
              key={`${label}-${index}`}
              onClick={() => handleSelect(index, label)}
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="group relative flex items-center cursor-pointer select-none py-1 transition-all duration-300"
            >
              {/* Marker Line */}
              {showMarker && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full transition-all duration-300 pointer-events-none"
                  style={{
                    width: `${markerLength}px`,
                    height: isHighlighted ? "2px" : "1px",
                    backgroundColor: currentMarkerColor,
                    transform: isHighlighted ? "scaleX(1.25)" : "scaleX(0.8)",
                    transformOrigin: "left center",
                    boxShadow: isHighlighted ? `0 0 10px ${currentMarkerColor}` : "none",
                  }}
                />
              )}

              {/* Label */}
              <div
                className="flex items-center font-sora font-bold text-sm sm:text-base transition-all duration-300 pointer-events-none"
                style={{
                  paddingLeft: showMarker ? `${markerLength + 16}px` : "0px",
                  transform: isHighlighted ? "translateX(10px)" : "translateX(0px)",
                  color: currentColor,
                }}
              >
                {showIndex && (
                  <span
                    className="font-mono text-xs mr-2.5 transition-colors duration-300"
                    style={{
                      color: currentMarkerColor,
                      opacity: isHighlighted ? 1 : 0.6,
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
                <span className="tracking-tight">{label}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
