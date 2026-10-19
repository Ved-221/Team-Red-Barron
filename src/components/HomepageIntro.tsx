"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

// ==================================================
// CONFIGURABLE ANIMATION TIMELINE CONSTANTS (ms)
// ==================================================
export const INTRO_TIMELINE = {
  ENTER_START: 500,       // 0.5s: Vehicle starts moving in from outside left
  CENTER_STAGE: 1800,     // 1.8s: Vehicle settles in center
  MOVING_RIGHT: 3200,     // 3.2s: Vehicle transitions right
  EXIT_START: 4200,       // 4.2s: Vehicle accelerates
  VEHICLE_EXITED: 4900,   // 4.9s: Vehicle completely exits right side

  // ONLY after vehicle exits (4.95s+), FLY HIGH appears
  FLY_HIGH_START: 4950,   // 4.95s: Rapid sequential letter reveal

  FADE_START: 6600,       // 6.6s: Smooth transition to homepage
  UNMOUNT: 7400,          // 7.4s: Component unmounts
};

// Zero-allocation particle structure
interface DustParticle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  decay: number;
  type: "smoke" | "debris" | "spark";
  stampType: 0 | 1 | 2; // 0: smoke, 1: dust, 2: heat
  color: string;
}

const PARTICLE_POOL_SIZE = 700;

export function HomepageIntro() {
  const [shouldPlay, setShouldPlay] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [revealedLetters, setRevealedLetters] = useState<number>(0);

  // Direct DOM references for 60/120fps hardware-accelerated transforms without React re-renders
  const vehicleContainerRef = useRef<HTMLDivElement | null>(null);
  const rearWheelRef = useRef<HTMLDivElement | null>(null);
  const frontWheelRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const prevVehicleXRef = useRef<number>(-1.6);
  const wheelAngleRef = useRef<number>(0);
  const isFinishedRef = useRef<boolean>(false);

  // Exact letter sequence with TRB color mapping
  // "FLY" (White #F5F5F5) + "HIGH" (Primary Red #DE1615)
  const characters = [
    { char: "F", color: "#F5F5F5", glow: "0 0 25px rgba(245,245,245,0.3)" },
    { char: "L", color: "#F5F5F5", glow: "0 0 25px rgba(245,245,245,0.3)" },
    { char: "Y", color: "#F5F5F5", glow: "0 0 25px rgba(245,245,245,0.3)" },
    { char: " ", color: "transparent", glow: "none" },
    { char: "H", color: "#DE1615", glow: "0 0 35px rgba(222,22,21,0.55), 0 0 70px rgba(222,22,21,0.25)" },
    { char: "I", color: "#DE1615", glow: "0 0 35px rgba(222,22,21,0.55), 0 0 70px rgba(222,22,21,0.25)" },
    { char: "G", color: "#DE1615", glow: "0 0 35px rgba(222,22,21,0.55), 0 0 70px rgba(222,22,21,0.25)" },
    { char: "H", color: "#DE1615", glow: "0 0 35px rgba(222,22,21,0.55), 0 0 70px rgba(222,22,21,0.25)" },
  ];

  const totalNonSpaceLetters = characters.filter((c) => c.char !== " ").length;

  const handleSkip = React.useCallback(() => {
    isFinishedRef.current = true;
    setIsFading(true);
    setTimeout(() => {
      setIsFinished(true);
    }, 400);
  }, []);

  useEffect(() => {
    // 1. Accessibility: prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      isFinishedRef.current = true;
      const t = setTimeout(() => {
        setIsFinished(true);
      }, 0);
      return () => clearTimeout(t);
    }

    // 2. Session & Reload Logic
    const checkShouldPlay = () => {
      const navEntries = window.performance.getEntriesByType("navigation");
      let isReload = false;
      if (navEntries.length > 0) {
        const p = navEntries[0] as PerformanceNavigationTiming;
        isReload = p.type === "reload";
      }

      if (isReload) {
        sessionStorage.setItem("trbIntroPlayed", "true");
        return true;
      }

      const hasPlayed = sessionStorage.getItem("trbIntroPlayed");
      if (!hasPlayed) {
        sessionStorage.setItem("trbIntroPlayed", "true");
        return true;
      }

      return false;
    };

    const play = checkShouldPlay();
    if (!play) {
      isFinishedRef.current = true;
      const t = setTimeout(() => {
        setShouldPlay(false);
        setIsFinished(true);
      }, 0);
      return () => clearTimeout(t);
    }

    // ESC key listener for instant skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Staggered reveal of FLY HIGH: ONLY after vehicle exits (4.95s+)
    const letterTimers: NodeJS.Timeout[] = [];
    for (let i = 1; i <= totalNonSpaceLetters; i++) {
      const timer = setTimeout(() => {
        setRevealedLetters(i);
      }, INTRO_TIMELINE.FLY_HIGH_START + (i - 1) * 80);
      letterTimers.push(timer);
    }

    const tFade = setTimeout(() => setIsFading(true), INTRO_TIMELINE.FADE_START);
    const tFinish = setTimeout(() => {
      setIsFinished(true);
      isFinishedRef.current = true;
    }, INTRO_TIMELINE.UNMOUNT);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      letterTimers.forEach(clearTimeout);
      clearTimeout(tFade);
      clearTimeout(tFinish);
    };
  }, [handleSkip, totalNonSpaceLetters]);

  // 3. UNIFIED HIGH-PERFORMANCE 60/120 FPS ANIMATION LOOP
  // Uses direct DOM transform updates on refs without triggering React virtual DOM re-renders
  useEffect(() => {
    if (!shouldPlay || isFinished) return;

    let animFrameId: number;
    const startTime = performance.now();

    // Canvas setup
    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext("2d", { alpha: true }) : null;
    let width = canvas ? (canvas.width = window.innerWidth) : window.innerWidth;
    let height = canvas ? (canvas.height = window.innerHeight) : window.innerHeight;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Pre-rendered offscreen stamps for zero-allocation GPU-accelerated particle blits
    function makeStamp(c1: string, c2: string, c3: string): HTMLCanvasElement | null {
      if (typeof document === "undefined") return null;
      const c = document.createElement("canvas");
      c.width = 64;
      c.height = 64;
      const x = c.getContext("2d");
      if (!x) return null;
      const g = x.createRadialGradient(32, 32, 2, 32, 32, 32);
      g.addColorStop(0, c1);
      g.addColorStop(0.4, c2);
      g.addColorStop(1, c3);
      x.fillStyle = g;
      x.beginPath();
      x.arc(32, 32, 32, 0, Math.PI * 2);
      x.fill();
      return c;
    }

    const stampSmoke = makeStamp("rgba(145, 125, 120, 0.55)", "rgba(130, 110, 105, 0.22)", "rgba(130, 110, 105, 0)");
    const stampDust = makeStamp("rgba(195, 160, 135, 0.5)", "rgba(175, 140, 115, 0.2)", "rgba(175, 140, 115, 0)");
    const stampHeat = makeStamp("rgba(255, 95, 45, 0.45)", "rgba(222, 22, 21, 0.18)", "rgba(222, 22, 21, 0)");

    // Pre-allocated Particle Pool (ZERO heap allocations during animation loop)
    const particlePool: DustParticle[] = Array.from({ length: PARTICLE_POOL_SIZE }, () => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      radius: 0,
      maxRadius: 0,
      alpha: 0,
      decay: 0,
      type: "smoke",
      stampType: 0,
      color: "",
    }));

    let poolHead = 0;

    const spawnFromPool = (
      x: number,
      y: number,
      vx: number,
      vy: number,
      radius: number,
      maxRadius: number,
      alpha: number,
      decay: number,
      type: "smoke" | "debris" | "spark",
      stampType: 0 | 1 | 2 = 0,
      color: string = ""
    ) => {
      let p = particlePool[poolHead];
      if (p.active && p.alpha > 0.05) {
        for (let i = 1; i <= 30; i++) {
          const nextIdx = (poolHead + i) % PARTICLE_POOL_SIZE;
          if (!particlePool[nextIdx].active) {
            poolHead = nextIdx;
            p = particlePool[poolHead];
            break;
          }
        }
      }
      poolHead = (poolHead + 1) % PARTICLE_POOL_SIZE;

      p.active = true;
      p.x = x;
      p.y = y;
      p.vx = vx;
      p.vy = vy;
      p.radius = radius;
      p.maxRadius = maxRadius;
      p.alpha = alpha;
      p.decay = decay;
      p.type = type;
      p.stampType = stampType;
      p.color = color;
    };

    const emitParticles = (rearX: number, frontX: number, tireY: number, intensity: number) => {
      // 1. Heavy rear tire rooster tail & smoke clouds
      const smokeCount = Math.min(6, Math.floor(intensity * 1.6));
      for (let i = 0; i < smokeCount; i++) {
        const isDust = Math.random() > 0.45;
        const isHeat = !isDust && Math.random() > 0.6;
        const stampIdx: 0 | 1 | 2 = isHeat ? 2 : isDust ? 1 : 0;

        spawnFromPool(
          rearX + (Math.random() - 0.5) * 24,
          tireY + (Math.random() - 0.5) * 12,
          -(Math.random() * 4.2 + 2.0),
          (Math.random() - 0.65) * 2.2 - 0.5,
          Math.random() * 10 + 7,
          Math.random() * 42 + 26,
          Math.random() * 0.35 + 0.18,
          Math.random() * 0.012 + 0.008,
          "smoke",
          stampIdx
        );
      }

      // 2. Flying dirt pebbles & gravel
      const debrisCount = Math.min(4, Math.floor(intensity * 1.2));
      for (let i = 0; i < debrisCount; i++) {
        spawnFromPool(
          rearX + (Math.random() - 0.5) * 18,
          tireY + (Math.random() - 0.5) * 8,
          -(Math.random() * 6.5 + 3.2),
          (Math.random() - 0.8) * 3.8 - 0.8,
          Math.random() * 2.2 + 1.2,
          2.5,
          0.85,
          Math.random() * 0.024 + 0.016,
          "debris",
          0,
          "rgba(205, 180, 165, "
        );
      }

      // 3. Friction heat sparks (intense offroad acceleration)
      if (intensity > 1.2) {
        const sparkCount = Math.floor(intensity * 0.8);
        for (let i = 0; i < sparkCount; i++) {
          spawnFromPool(
            rearX + (Math.random() - 0.5) * 12,
            tireY + (Math.random() - 0.5) * 6,
            -(Math.random() * 8.0 + 3.5),
            (Math.random() - 0.7) * 3.0 - 0.8,
            Math.random() * 1.8 + 0.8,
            1.8,
            1.0,
            Math.random() * 0.04 + 0.025,
            "spark",
            0,
            Math.random() > 0.5 ? "rgba(222, 22, 21, " : "rgba(255, 101, 52, "
          );
        }
      }

      // 4. Subtle front wheel ground dust kick-up
      if (frontX > -50 && frontX < width + 50 && Math.random() > 0.4) {
        spawnFromPool(
          frontX + (Math.random() - 0.5) * 15,
          tireY + (Math.random() - 0.5) * 6,
          -(Math.random() * 2.0 + 1.0),
          (Math.random() - 0.5) * 1.2 - 0.3,
          Math.random() * 6 + 5,
          Math.random() * 24 + 16,
          Math.random() * 0.2 + 0.1,
          Math.random() * 0.018 + 0.012,
          "smoke",
          1
        );
      }
    };

    const renderLoop = (now: number) => {
      if (isFinishedRef.current) return;
      const elapsed = now - startTime;

      // 1. Trajectory Coordinates
      let currentXFrac = -1.6;
      let currentScale = 1.0;
      let currentOpacity = 0;

      if (elapsed < INTRO_TIMELINE.ENTER_START) {
        currentXFrac = -1.6;
        currentScale = 0.98;
        currentOpacity = 0;
      } else if (elapsed < INTRO_TIMELINE.CENTER_STAGE) {
        currentOpacity = 1;
        const t = (elapsed - INTRO_TIMELINE.ENTER_START) / (INTRO_TIMELINE.CENTER_STAGE - INTRO_TIMELINE.ENTER_START);
        const eased = 1 - Math.pow(1 - t, 3.2);
        currentXFrac = -1.6 * (1 - eased);
        currentScale = 0.98 + 0.02 * eased;
      } else if (elapsed < INTRO_TIMELINE.MOVING_RIGHT) {
        currentOpacity = 1;
        const t = (elapsed - INTRO_TIMELINE.CENTER_STAGE) / (INTRO_TIMELINE.MOVING_RIGHT - INTRO_TIMELINE.CENTER_STAGE);
        currentXFrac = 0.03 * t;
        currentScale = 1.0 + 0.05 * Math.sin(t * Math.PI * 0.8);
      } else if (elapsed < INTRO_TIMELINE.EXIT_START) {
        currentOpacity = 1;
        const t = (elapsed - INTRO_TIMELINE.MOVING_RIGHT) / (INTRO_TIMELINE.EXIT_START - INTRO_TIMELINE.MOVING_RIGHT);
        const eased = t * t * (3 - 2 * t);
        currentXFrac = 0.03 + 0.22 * eased;
        currentScale = 1.05 - 0.02 * eased;
      } else if (elapsed < INTRO_TIMELINE.VEHICLE_EXITED) {
        currentOpacity = 1;
        const t = (elapsed - INTRO_TIMELINE.EXIT_START) / (INTRO_TIMELINE.VEHICLE_EXITED - INTRO_TIMELINE.EXIT_START);
        const eased = Math.pow(t, 2.4);
        currentXFrac = 0.25 + 1.35 * eased;
        currentScale = 1.03;
      } else {
        currentXFrac = 1.6;
        currentScale = 1.0;
        currentOpacity = 0;
      }

      // Proportional wheel spin calculation
      const deltaX = currentXFrac - prevVehicleXRef.current;
      prevVehicleXRef.current = currentXFrac;
      if (deltaX > 0) {
        const deltaPixels = deltaX * 1000;
        const deltaDegrees = (deltaPixels / (220 * Math.PI)) * 360 * 1.6;
        wheelAngleRef.current += deltaDegrees;
      }

      // Micro-suspension vibration
      const isMoving = elapsed >= INTRO_TIMELINE.ENTER_START && elapsed <= INTRO_TIMELINE.VEHICLE_EXITED;
      const suspensionY = isMoving
        ? Math.sin(elapsed * 0.045) * 1.5 + Math.sin(elapsed * 0.08) * 0.8
        : 0;

      // DIRECT GPU HARDWARE TRANSFORM UPDATES (Composited without triggering React render)
      if (vehicleContainerRef.current) {
        vehicleContainerRef.current.style.transform = `translate3d(${currentXFrac * 50}vw, ${suspensionY.toFixed(2)}px, 0) scale(${currentScale.toFixed(4)})`;
        vehicleContainerRef.current.style.opacity = `${currentOpacity}`;
      }

      const wheelRot = `translate(-50%, -50%) rotate(${wheelAngleRef.current.toFixed(2)}deg)`;
      if (rearWheelRef.current) {
        rearWheelRef.current.style.transform = wheelRot;
      }
      if (frontWheelRef.current) {
        frontWheelRef.current.style.transform = wheelRot;
      }

      // 2. HIGH-PERFORMANCE DENSE PARTICLE SYSTEM
      if (ctx && canvas) {
        ctx.clearRect(0, 0, width, height);

        const centerY = height * 0.5;
        const vehicleWidth = Math.min(width * 0.65, 660);
        const vehicleScreenPixelX = (width * 0.5) + (currentXFrac * width * 0.5);
        const rearTireContactX = vehicleScreenPixelX - (vehicleWidth * 0.355);
        const frontTireContactX = vehicleScreenPixelX + (vehicleWidth * 0.328);
        const tireContactY = centerY + (vehicleWidth * 0.22);

        let isEmitting = false;
        let intensity = 0;

        if (elapsed >= INTRO_TIMELINE.ENTER_START && elapsed < INTRO_TIMELINE.CENTER_STAGE) {
          isEmitting = true;
          intensity = 2.6;
        } else if (elapsed >= INTRO_TIMELINE.CENTER_STAGE && elapsed < INTRO_TIMELINE.MOVING_RIGHT) {
          isEmitting = true;
          intensity = 0.5;
        } else if (elapsed >= INTRO_TIMELINE.MOVING_RIGHT && elapsed < INTRO_TIMELINE.EXIT_START) {
          isEmitting = true;
          intensity = 2.0;
        } else if (elapsed >= INTRO_TIMELINE.EXIT_START && elapsed < INTRO_TIMELINE.VEHICLE_EXITED) {
          isEmitting = true;
          intensity = 4.2;
        }

        if (isEmitting && rearTireContactX > -120 && rearTireContactX < width + 120) {
          emitParticles(rearTireContactX, frontTireContactX, tireContactY, intensity);
        }

        // BATCH DRAWING: Draw active particles with minimal state switches
        // Pass A: Draw all smoke & dust stamps (hardware texture blit)
        for (let i = 0; i < PARTICLE_POOL_SIZE; i++) {
          const p = particlePool[i];
          if (!p.active) continue;

          p.x += p.vx;
          p.y += p.vy;

          if (p.type === "smoke") {
            p.radius += (p.maxRadius - p.radius) * 0.045;
            p.vx *= 0.95;
            p.vy = p.vy * 0.94 - 0.07;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
              p.active = false;
              continue;
            }

            const stamp = p.stampType === 2 ? stampHeat : p.stampType === 1 ? stampDust : stampSmoke;
            if (stamp) {
              ctx.globalAlpha = p.alpha;
              ctx.drawImage(stamp, p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
            }
          }
        }

        // Pass B: Batch draw debris / flying dirt pebbles
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = "#c5ab9a";
        ctx.beginPath();
        for (let i = 0; i < PARTICLE_POOL_SIZE; i++) {
          const p = particlePool[i];
          if (!p.active || p.type !== "debris") continue;

          p.vy += 0.18;
          p.vx *= 0.97;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            p.active = false;
            continue;
          }

          ctx.moveTo(p.x + p.radius, p.y);
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        }
        ctx.fill();

        // Pass C: Batch draw sparks
        for (let i = 0; i < PARTICLE_POOL_SIZE; i++) {
          const p = particlePool[i];
          if (!p.active || p.type !== "spark") continue;

          p.vy += 0.14;
          p.vx *= 0.96;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            p.active = false;
            continue;
          }

          // Orange glow aura
          ctx.globalAlpha = p.alpha * 0.45;
          ctx.fillStyle = "#FF6534";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
          ctx.fill();

          // Saturated Mach-Red core
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = "#DE1615";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1.0;
      }

      if (elapsed < INTRO_TIMELINE.UNMOUNT && !isFinishedRef.current) {
        animFrameId = requestAnimationFrame(renderLoop);
      }
    };

    animFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrameId);
    };
  }, [shouldPlay, isFinished]);

  if (isFinished || !shouldPlay) return null;

  let nonSpaceIndex = 0;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#000000] flex items-center justify-center overflow-hidden select-none transition-opacity duration-700 ease-in-out ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* 1. MOTORSPORT TEXTURED BACKGROUND (Tarmac Noise, Grid Mesh & Vignette) */}
      <div className="absolute inset-0 bg-[#000000] pointer-events-none">
        {/* Radial spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,_#15181b_0%,_#000000_80%)] opacity-95" />

        {/* Engineering telemetry grid mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] opacity-70" />

        {/* Gritty tarmac / film grain texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25 mix-blend-screen"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
          }}
        />

        {/* Low horizontal track speed atmosphere */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(222,22,21,0.025)_50%,transparent_100%)] pointer-events-none" />
      </div>

      {/* 2. DUST & SMOKE PARTICLES CANVAS (Behind Vehicle) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* 3. REAL HTML / CSS PLANET KOSMOS TYPOGRAPHY: "FLY HIGH" (Appears strictly after vehicle exits) */}
      <div className="absolute inset-0 flex items-center justify-center z-15 pointer-events-none px-4">
        <div className="flex items-center justify-center max-w-[95vw]">
          {characters.map((item, index) => {
            if (item.char === " ") {
              return (
                <span
                  key={index}
                  className="w-3 sm:w-6 md:w-8 lg:w-12 inline-block"
                  aria-hidden="true"
                />
              );
            }

            nonSpaceIndex++;
            const isRevealed = nonSpaceIndex <= revealedLetters;

            return (
              <span
                key={index}
                style={{
                  fontFamily: "'Planet Kosmos', sans-serif",
                  fontSize: "clamp(38px, 9.5vw, 125px)",
                  color: item.color,
                  transform: isRevealed ? "translateX(0)" : "translateX(-20px)",
                  opacity: isRevealed ? 1 : 0,
                  filter: isRevealed ? "blur(0px)" : "blur(8px)",
                  transition:
                    "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  textShadow: isRevealed ? item.glow : "none",
                  marginRight:
                    index < characters.length - 1 && characters[index + 1].char !== " " && item.char !== " "
                      ? "0.08em"
                      : "0",
                }}
                className="uppercase inline-block leading-none select-none"
              >
                {item.char}
              </span>
            );
          })}
        </div>
      </div>

      {/* 4. COMPOSITE LAYERED 2D TRB VEHICLE ASSEMBLY */}
      {/* Hardware-accelerated GPU layer with direct ref transforms */}
      <div
        ref={vehicleContainerRef}
        className="relative z-20 flex items-center justify-center pointer-events-none will-change-transform [transform:translateZ(0)] [backface-visibility:hidden]"
        style={{
          transform: "translate3d(-160vw, 0px, 0) scale(0.98)",
          opacity: 0,
        }}
      >
        {/* Relative 1:1 Vehicle Master Box */}
        <div className="relative w-[62vw] max-w-[290px] sm:max-w-[390px] md:max-w-[480px] lg:max-w-[580px] xl:max-w-[660px] aspect-square flex items-center justify-center">

          {/* 4a. Ground Contact Shadow (Soft grounded anchor) */}
          <div className="absolute bottom-[13.5%] left-[4%] right-[4%] h-[11%] bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.85)_0%,_rgba(0,0,0,0.45)_50%,_transparent_75%)] blur-[4px] pointer-events-none z-0" />

          {/* 4b. Vehicle Body (Chassis, roll cage, driver, suspension, markings) */}
          <div className="absolute inset-0 z-10 [transform:translateZ(0)]">
            <Image
              src="/vehicle-image-new.png"
              alt="TRB Buggy Chassis"
              fill
              priority
              sizes="(max-width: 768px) 65vw, (max-width: 1200px) 55vw, 660px"
              className="object-contain select-none"
            />
          </div>

          {/* 4c. Independent Rear Wheel (Exact axle center: left 14.67%, top 72.17%, width 32.22%) */}
          <div
            ref={rearWheelRef}
            className="absolute z-20 aspect-square will-change-transform [transform:translateZ(0)] [backface-visibility:hidden]"
            style={{
              left: "14.67%",
              top: "72.17%",
              width: "32.22%",
              transform: "translate(-50%, -50%) rotate(0deg)",
              transformOrigin: "center center",
            }}
          >
            <Image
              src="/tire-new.png"
              alt="TRB Rear Wheel"
              fill
              priority
              sizes="260px"
              className="object-contain select-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)]"
            />
          </div>

          {/* 4d. Independent Front Wheel (Exact axle center: left 82.85%, top 73.36%, width 32.38%) */}
          <div
            ref={frontWheelRef}
            className="absolute z-20 aspect-square will-change-transform [transform:translateZ(0)] [backface-visibility:hidden]"
            style={{
              left: "82.85%",
              top: "73.36%",
              width: "32.38%",
              transform: "translate(-50%, -50%) rotate(0deg)",
              transformOrigin: "center center",
            }}
          >
            <Image
              src="/tire-new.png"
              alt="TRB Front Wheel"
              fill
              priority
              sizes="260px"
              className="object-contain select-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)]"
            />
          </div>

          {/* 4e. Top Red Siren Alarm Glow Effect */}
          <div
            className="absolute z-30 pointer-events-none [transform:translateZ(0)]"
            style={{
              left: "30.42%",
              top: "12.3%",
              transform: "translate(-50%, -50%)",
              width: "5.5%",
              height: "4%",
            }}
          >
            {/* Ambient wide red aura */}
            <div
              className="absolute inset-[-140%] rounded-full mix-blend-screen pointer-events-none animate-siren-ambient"
              style={{
                background: "radial-gradient(circle, rgba(222,22,21,0.9) 0%, rgba(255,60,40,0.55) 35%, rgba(222,22,21,0.2) 65%, transparent 85%)",
                filter: "blur(8px)",
              }}
            />
            {/* High-intensity glowing red core */}
            <div
              className="absolute inset-0 rounded-full mix-blend-screen pointer-events-none animate-siren-core"
              style={{
                background: "radial-gradient(ellipse at center, rgba(255,255,255,0.98) 0%, rgba(255,100,80,0.92) 35%, rgba(222,22,21,0.85) 70%, transparent 100%)",
                boxShadow: "0 0 18px 5px #DE1615, 0 0 35px 12px rgba(222,22,21,0.75), 0 0 55px 20px rgba(255,50,30,0.45)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
