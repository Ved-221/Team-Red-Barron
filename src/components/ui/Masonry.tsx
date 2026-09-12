"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

import './Masonry.css';

export interface MasonryItem {
  id: string;
  img: string;
  url?: string;
  title?: string;
  category?: string;
  height: number;
}

export interface MasonryProps {
  items: MasonryItem[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'random';
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  showTextOnHover?: boolean;
  onItemClick?: (item: MasonryItem) => void;
}

const useMedia = (queries: string[], values: number[], defaultValue: number) => {
  const get = () => {
    if (typeof window === 'undefined') return defaultValue;
    const index = queries.findIndex(q => matchMedia(q).matches);
    return values[index] ?? defaultValue;
  };

  const [value, setValue] = useState(get);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => setValue(get);
    queries.forEach(q => matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach(q => matchMedia(q).removeEventListener('change', handler));
  }, [queries]);

  return value;
};

const useMeasure = (): [React.RefObject<HTMLDivElement | null>, { width: number; height: number }] => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size];
};


export default function Masonry({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = false,
  hoverScale = 1.0,
  blurToFocus = true,
  colorShiftOnHover = false,
  showTextOnHover = false,
  onItemClick
}: MasonryProps) {
  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
    [5, 4, 3, 2],
    1
  );

  const [containerRef, { width }] = useMeasure();
  const revealedIds = useRef<Set<string>>(new Set());

  const getInitialPosition = (item: { x: number; y: number; w: number; h: number }) => {
    let direction = animateFrom;

    if (animateFrom === 'random') {
      const directions = ['top', 'bottom', 'left', 'right'];
      direction = directions[Math.floor(Math.random() * directions.length)] as typeof animateFrom;
    }

    switch (direction) {
      case 'top':
        return { x: item.x, y: item.y - 120 };
      case 'bottom':
        return { x: item.x, y: item.y + 120 };
      case 'left':
        return { x: item.x - 120, y: item.y };
      case 'right':
        return { x: item.x + 120, y: item.y };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };


  const { grid, totalHeight } = useMemo(() => {
    if (!width) return { grid: [], totalHeight: 0 };

    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;

    const calculatedGrid = items.map(child => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col;
      const height = child.height / 2;
      const y = colHeights[col];

      colHeights[col] += height;

      return { ...child, x, y, w: columnWidth, h: height };
    });

    const maxH = Math.max(...colHeights, 400);

    return { grid: calculatedGrid, totalHeight: maxH };
  }, [columns, items, width]);

  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    if (!hasMounted.current) {
      grid.forEach((item) => {
        const selector = `[data-key="${item.id}"]`;
        const initialPos = getInitialPosition(item);
        gsap.set(selector, {
          opacity: 0,
          x: initialPos.x,
          y: initialPos.y,
          width: item.w,
          height: item.h,
          ...(blurToFocus && { filter: 'blur(10px)' })
        });
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute('data-key');
              if (id && !revealedIds.current.has(id)) {
                revealedIds.current.add(id);
                const item = grid.find(g => g.id === id);
                if (item) {
                  gsap.to(entry.target, {
                    opacity: 1,
                    x: item.x,
                    y: item.y,
                    width: item.w,
                    height: item.h,
                    ...(blurToFocus && { filter: 'blur(0px)' }),
                    duration: duration,
                    ease: ease
                  });
                }
              }
            }
          });
        },
        {
          rootMargin: '0px 0px -40px 0px',
          threshold: 0.05
        }
      );

      grid.forEach(item => {
        const el = containerRef.current?.querySelector(`[data-key="${item.id}"]`);
        if (el) observer.observe(el);
      });

      hasMounted.current = true;

      return () => observer.disconnect();
    } else {
      grid.forEach((item) => {
        const selector = `[data-key="${item.id}"]`;
        if (revealedIds.current.has(item.id)) {
          gsap.to(selector, {
            x: item.x,
            y: item.y,
            width: item.w,
            height: item.h,
            duration: duration,
            ease: ease,
            overwrite: 'auto'
          });
        } else {
          const initialPos = getInitialPosition(item);
          gsap.set(selector, {
            x: initialPos.x,
            y: initialPos.y,
            width: item.w,
            height: item.h
          });
        }
      });
    }
  }, [grid, duration, ease, blurToFocus]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, item: MasonryItem) => {
    if (!scaleOnHover) return;
    const selector = `[data-key="${item.id}"]`;
    gsap.to(selector, {
      scale: hoverScale,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>, item: MasonryItem) => {
    if (!scaleOnHover) return;
    const selector = `[data-key="${item.id}"]`;
    gsap.to(selector, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  return (
    <div ref={containerRef} className="list" style={{ minHeight: `${totalHeight}px` }}>
      {grid.map(item => {
        return (
          <div
            key={item.id}
            data-key={item.id}
            className="item-wrapper"
            onClick={() => {
              if (onItemClick) {
                onItemClick(item);
              } else if (item.url) {
                window.open(item.url, '_blank', 'noopener');
              }
            }}
            onMouseEnter={e => handleMouseEnter(e, item)}
            onMouseLeave={e => handleMouseLeave(e, item)}
          >
            <div className="item-img">
              <Image src={item.img} alt={item.title || "Gallery item"} fill className="object-cover" sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" />
              {colorShiftOnHover && (
                <div
                  className="color-overlay"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(45deg, rgba(222,22,21,0.4), rgba(255,101,52,0.4))',
                    opacity: 0,
                    pointerEvents: 'none',
                    borderRadius: '16px'
                  }}
                />
              )}

              {showTextOnHover && (item.title || item.category) && (
                <div className="item-overlay-content">
                  {item.category && (
                    <span className="font-mono-tech text-[10px] text-[#de1615] uppercase tracking-wider mb-1 block">
                      {item.category}
                    </span>
                  )}
                  {item.title && (
                    <h3 className="font-sora font-bold text-sm text-white drop-shadow-md">
                      {item.title}
                    </h3>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
