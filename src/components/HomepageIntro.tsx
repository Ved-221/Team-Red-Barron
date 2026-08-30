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

interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  decay: number;
  color: string;
  type: "smoke" | "debris" | "spark";
  rotation: number;
  vRot: number;
}

export function HomepageIntro() {
  const [shouldPlay, setShouldPlay] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isFading, setIsFading] = useState(false);
  
  // Real-time animation coordinates
  const [vehicleXFrac, setVehicleXFrac] = useState<number>(-1.6); // Starts completely out of frame (-1.6 to +1.6)
  const [vehicleOpacity, setVehicleOpacity] = useState<number>(0);
  const [wheelRotationDeg, setWheelRotationDeg] = useState<number>(0);
  const [suspensionY, setSuspensionY] = useState<number>(0);
  const [motionBlurPx, setMotionBlurPx] = useState<number>(0);
  const [scaleFactor, setScaleFactor] = useState<number>(1.0);
  const [revealedLetters, setRevealedLetters] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevVehicleXRef = useRef<number>(-1.6);
  const totalTravelRef = useRef<number>(0);

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

  useEffect(() => {
    // 1. Accessibility: prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsFinished(true);
      return;
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
    setShouldPlay(play);
    if (!play) {
      setIsFinished(true);
      return;
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
      }, INTRO_TIMELINE.FLY_HIGH_START + (i - 1) * 80); // 80ms snappy reveal
      letterTimers.push(timer);
    }

    const tFade = setTimeout(() => setIsFading(true), INTRO_TIMELINE.FADE_START);
    const tFinish = setTimeout(() => setIsFinished(true), INTRO_TIMELINE.UNMOUNT);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      letterTimers.forEach(clearTimeout);
      clearTimeout(tFade);
      clearTimeout(tFinish);
    };
  }, []);

  // 3. Real-Time Physics & Vehicle Trajectory Loop
  useEffect(() => {
    if (!shouldPlay || isFinished) return;

    let animFrameId: number;
    const startTime = performance.now();

    const updatePhysics = (now: number) => {
      const elapsed = now - startTime;

      let currentXFrac = -1.6; // Deeply out of frame left
      let currentScale = 1.0;
      let currentBlur = 0;
      let currentOpacity = 0;

      if (elapsed < INTRO_TIMELINE.ENTER_START) {
        // 0 - 0.5s: Fully offscreen left
        currentXFrac = -1.6;
        currentScale = 0.98;
        currentBlur = 0;
        currentOpacity = 0;
      } else if (elapsed < INTRO_TIMELINE.CENTER_STAGE) {
        // 0.5s - 1.8s: Enters rapidly from out of frame (-1.6 -> 0.0)
        currentOpacity = 1;
        const t = (elapsed - INTRO_TIMELINE.ENTER_START) / (INTRO_TIMELINE.CENTER_STAGE - INTRO_TIMELINE.ENTER_START);
        const eased = 1 - Math.pow(1 - t, 3.2);
        currentXFrac = -1.6 * (1 - eased) + 0.0 * eased;
        currentScale = 0.98 + 0.02 * eased;
        currentBlur = Math.sin(t * Math.PI) * 2.0;
      } else if (elapsed < INTRO_TIMELINE.MOVING_RIGHT) {
        // 1.8s - 3.2s: Center stage subtle push-in
        currentOpacity = 1;
        const t = (elapsed - INTRO_TIMELINE.CENTER_STAGE) / (INTRO_TIMELINE.MOVING_RIGHT - INTRO_TIMELINE.CENTER_STAGE);
        currentXFrac = 0.0 + 0.03 * t;
        currentScale = 1.0 + 0.05 * Math.sin(t * Math.PI * 0.8);
        currentBlur = 0;
      } else if (elapsed < INTRO_TIMELINE.EXIT_START) {
        // 3.2s - 4.2s: Transitions rightward
        currentOpacity = 1;
        const t = (elapsed - INTRO_TIMELINE.MOVING_RIGHT) / (INTRO_TIMELINE.EXIT_START - INTRO_TIMELINE.MOVING_RIGHT);
        const eased = t * t * (3 - 2 * t);
        currentXFrac = 0.03 + 0.22 * eased;
        currentScale = 1.05 - 0.02 * eased;
        currentBlur = 0.6 * t;
      } else if (elapsed < INTRO_TIMELINE.VEHICLE_EXITED) {
        // 4.2s - 4.9s: Rapid acceleration & exits completely offscreen right (+1.6)
        currentOpacity = 1;
        const t = (elapsed - INTRO_TIMELINE.EXIT_START) / (INTRO_TIMELINE.VEHICLE_EXITED - INTRO_TIMELINE.EXIT_START);
        const eased = Math.pow(t, 2.4);
        currentXFrac = 0.25 + 1.35 * eased;
        currentScale = 1.03;
        currentBlur = Math.min(3.5, t * 4.0);
      } else {
        // Exited completely
        currentXFrac = 1.6;
        currentScale = 1.0;
        currentBlur = 0;
        currentOpacity = 0;
      }

      // Calculate distance travelled for proportional wheel rotation
      const deltaX = currentXFrac - prevVehicleXRef.current;
      prevVehicleXRef.current = currentXFrac;
      
      if (deltaX > 0) {
        const deltaPixels = deltaX * 1000;
        const deltaDegrees = (deltaPixels / (220 * Math.PI)) * 360 * 1.6;
        totalTravelRef.current += deltaDegrees;
        setWheelRotationDeg(totalTravelRef.current);
      }

      // Micro-suspension vibration (~9Hz)
      const isMoving = elapsed >= INTRO_TIMELINE.ENTER_START && elapsed <= INTRO_TIMELINE.VEHICLE_EXITED;
      const suspensionOffset = isMoving
        ? Math.sin(elapsed * 0.045) * 1.5 + Math.sin(elapsed * 0.08) * 0.8
        : 0;

      setVehicleXFrac(currentXFrac);
      setVehicleOpacity(currentOpacity);
      setScaleFactor(currentScale);
      setMotionBlurPx(currentBlur);
      setSuspensionY(suspensionOffset);

      if (!isFinished) {
        animFrameId = requestAnimationFrame(updatePhysics);
      }
    };

    animFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animFrameId);
  }, [shouldPlay, isFinished]);

  // 4. Dust, Smoke & Gravel Particle System
  useEffect(() => {
    if (!shouldPlay || isFinished) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles: DustParticle[] = [];
    const startTime = performance.now();

    const spawnParticles = (wheelX: number, wheelY: number, intensity: number) => {
      const count = Math.floor(intensity * 3.0);
      for (let i = 0; i < count; i++) {
        const isSmoke = Math.random() > 0.35;
        const isDebris = !isSmoke && Math.random() > 0.4;

        if (isSmoke) {
          const maxAlpha = Math.random() * 0.28 + 0.12;
          particles.push({
            x: wheelX + (Math.random() - 0.5) * 25,
            y: wheelY + (Math.random() - 0.5) * 12,
            vx: -(Math.random() * 4.2 + 2) + (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.65) * 2.0 - 0.5,
            radius: Math.random() * 10 + 6,
            maxRadius: Math.random() * 45 + 30,
            alpha: maxAlpha,
            decay: Math.random() * 0.012 + 0.009,
            color: "rgba(130, 110, 105, ",
            type: "smoke",
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.03,
          });
        } else if (isDebris) {
          particles.push({
            x: wheelX + (Math.random() - 0.5) * 18,
            y: wheelY + (Math.random() - 0.5) * 8,
            vx: -(Math.random() * 6.5 + 3.5),
            vy: (Math.random() - 0.8) * 4.0 - 1.0,
            radius: Math.random() * 2 + 1.2,
            maxRadius: 2.5,
            alpha: 0.8,
            decay: Math.random() * 0.025 + 0.018,
            color: "rgba(215, 195, 185, ",
            type: "debris",
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.2,
          });
        } else {
          // Heat spark
          particles.push({
            x: wheelX + (Math.random() - 0.5) * 10,
            y: wheelY + (Math.random() - 0.5) * 6,
            vx: -(Math.random() * 8 + 3.5),
            vy: (Math.random() - 0.7) * 3.0 - 0.8,
            radius: Math.random() * 1.8 + 0.8,
            maxRadius: 1.8,
            alpha: 1.0,
            decay: Math.random() * 0.04 + 0.028,
            color: Math.random() > 0.5 ? "rgba(222, 22, 21, " : "rgba(255, 101, 52, ",
            type: "spark",
            rotation: 0,
            vRot: 0,
          });
        }
      }
    };

    const render = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      const centerY = height * 0.5;
      const vehicleWidth = Math.min(width * 0.65, 660);
      const vehicleScreenPixelX = (width * 0.5) + (vehicleXFrac * width * 0.5);
      const rearTireContactX = vehicleScreenPixelX - (vehicleWidth * 0.36);
      const tireContactY = centerY + (vehicleWidth * 0.22);

      let isEmitting = false;
      let intensity = 0;

      if (elapsed >= INTRO_TIMELINE.ENTER_START && elapsed < INTRO_TIMELINE.CENTER_STAGE) {
        isEmitting = true;
        intensity = 2.2;
      } else if (elapsed >= INTRO_TIMELINE.CENTER_STAGE && elapsed < INTRO_TIMELINE.MOVING_RIGHT) {
        isEmitting = true;
        intensity = 0.35;
      } else if (elapsed >= INTRO_TIMELINE.MOVING_RIGHT && elapsed < INTRO_TIMELINE.EXIT_START) {
        isEmitting = true;
        intensity = 1.6;
      } else if (elapsed >= INTRO_TIMELINE.EXIT_START && elapsed < INTRO_TIMELINE.VEHICLE_EXITED) {
        isEmitting = true;
        intensity = 3.8;
      }

      if (isEmitting && rearTireContactX > -100 && rearTireContactX < width + 100) {
        spawnParticles(rearTireContactX, tireContactY, intensity);
      }

      // Update & draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;

        if (p.type === "smoke") {
          p.radius += (p.maxRadius - p.radius) * 0.045;
          p.vx *= 0.95;
          p.vy = p.vy * 0.94 - 0.08;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }

          const grad = ctx.createRadialGradient(p.x, p.y, p.radius * 0.1, p.x, p.y, p.radius);
          grad.addColorStop(0, `${p.color}${p.alpha})`);
          grad.addColorStop(0.5, `${p.color}${p.alpha * 0.45})`);
          grad.addColorStop(1, `${p.color}0)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "debris") {
          p.vy += 0.18;
          p.vx *= 0.97;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.fillStyle = `${p.color}${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          p.vy += 0.14;
          p.vx *= 0.96;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.fillStyle = `${p.color}${p.alpha})`;
          ctx.shadowColor = p.color.includes("222") ? "#DE1615" : "#FF6534";
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      if (!isFinished) {
        animFrameId = requestAnimationFrame(render);
      }
    };

    animFrameId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrameId);
    };
  }, [shouldPlay, isFinished, vehicleXFrac]);

  const handleSkip = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsFinished(true);
    }, 400);
  };

  if (isFinished || !shouldPlay) return null;

  let nonSpaceIndex = 0;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#000000] flex items-center justify-center overflow-hidden select-none transition-opacity duration-700 ease-in-out ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* 1. CLEAN MINIMAL STATIC BACKGROUND */}
      <div className="absolute inset-0 bg-[#000000] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#121414_0%,_#000000_80%)] opacity-95" />
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
                }}
                className="uppercase tracking-wider inline-block leading-none select-none"
              >
                {item.char}
              </span>
            );
          })}
        </div>
      </div>

      {/* 4. COMPOSITE LAYERED 2D TRB VEHICLE ASSEMBLY (Reduced size & enters cleanly out of frame) */}
      <div
        className="relative z-20 flex items-center justify-center pointer-events-none will-change-transform"
        style={{
          transform: `translate3d(${vehicleXFrac * 50}vw, ${suspensionY}px, 0) scale(${scaleFactor})`,
          opacity: vehicleOpacity,
          filter: motionBlurPx > 0.2 ? `blur(${motionBlurPx.toFixed(1)}px)` : "none",
        }}
      >
        {/* Relative 1:1 Vehicle Master Box (Reduced size for cinematic scale) */}
        <div className="relative w-[62vw] max-w-[290px] sm:max-w-[390px] md:max-w-[480px] lg:max-w-[580px] xl:max-w-[660px] aspect-square flex items-center justify-center">
          
          {/* 4a. Ground Contact Shadow (Soft grounded anchor) */}
          <div className="absolute bottom-[16%] left-[10%] right-[8%] h-[12%] bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.85)_0%,_rgba(0,0,0,0.45)_50%,_transparent_75%)] blur-[4px] pointer-events-none z-0" />

          {/* 4b. Vehicle Body (Chassis, roll cage, driver, suspension, markings) */}
          <div className="absolute inset-0 z-10">
            <Image
              src="/trb_vehicle_body.png"
              alt="TRB Buggy Chassis #63"
              fill
              priority
              sizes="(max-width: 768px) 65vw, (max-width: 1200px) 55vw, 660px"
              className="object-contain select-none"
            />
          </div>

          {/* 4c. Independent Rear Wheel (Exact axle center: left 13.48%, top 72.07%, width 28.51%) */}
          <div
            className="absolute z-20 aspect-square"
            style={{
              left: "13.48%",
              top: "72.07%",
              width: "28.51%",
              transform: `translate(-50%, -50%) rotate(${wheelRotationDeg}deg)`,
              transformOrigin: "center center",
              willChange: "transform",
            }}
          >
            <Image
              src="/trb_rear_wheel.png"
              alt="TRB Rear Wheel"
              fill
              priority
              sizes="220px"
              className="object-contain select-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)]"
            />
          </div>

          {/* 4d. Independent Front Wheel (Exact axle center: left 86.72%, top 71.88%, width 28.03%) */}
          <div
            className="absolute z-20 aspect-square"
            style={{
              left: "86.72%",
              top: "71.88%",
              width: "28.03%",
              transform: `translate(-50%, -50%) rotate(${wheelRotationDeg}deg)`,
              transformOrigin: "center center",
              willChange: "transform",
            }}
          >
            <Image
              src="/trb_front_wheel.png"
              alt="TRB Front Wheel"
              fill
              priority
              sizes="220px"
              className="object-contain select-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
