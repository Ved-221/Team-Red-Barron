"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";

export interface LogoRadialDistortionRef {
  onMove: (movementIntensity: number) => void;
  triggerBurst: () => void;
}

export const LogoRadialDistortion = forwardRef<LogoRadialDistortionRef>(
  function LogoRadialDistortion(_, ref) {
    const filterId = "trb-logo-heat-distortion";
    const [intensity, setIntensity] = useState<number>(0);
    const [burstWaves, setBurstWaves] = useState<
      Array<{ id: number; startTime: number; duration: number }>
    >([]);
    
    const animFrameRef = useRef<number | null>(null);
    const intensityTargetRef = useRef<number>(0);
    const currentIntensityRef = useRef<number>(0);

    // Continuous smooth animation loop while active
    const updateLoop = useCallback(() => {
      const diff = intensityTargetRef.current - currentIntensityRef.current;
      currentIntensityRef.current += diff * 0.15;
      setIntensity(currentIntensityRef.current);

      // Decaying target
      intensityTargetRef.current *= 0.92;

      // Keep loop running if intensity > 0.005 or burst waves are animating
      if (
        Math.abs(currentIntensityRef.current) > 0.005 ||
        intensityTargetRef.current > 0.005 ||
        burstWaves.length > 0
      ) {
        animFrameRef.current = requestAnimationFrame(updateLoop);
      } else {
        setIntensity(0);
        animFrameRef.current = null;
      }
    }, [burstWaves.length]);

    const wakeUpLoop = useCallback(() => {
      if (!animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(updateLoop);
      }
    }, [updateLoop]);

    useImperativeHandle(
      ref,
      () => ({
        onMove(movementIntensity: number) {
          // Clamp intensity between 0 and 1.5
          intensityTargetRef.current = Math.min(1.5, movementIntensity * 1.8);
          wakeUpLoop();
        },
        triggerBurst() {
          const id = Date.now() + Math.random();
          const duration = 950; // ms
          setBurstWaves((prev) => [...prev.slice(-2), { id, startTime: Date.now(), duration }]);

          setTimeout(() => {
            setBurstWaves((prev) => prev.filter((w) => w.id !== id));
          }, duration);

          intensityTargetRef.current = 1.6;
          wakeUpLoop();
        },
      }),
      [wakeUpLoop]
    );

    useEffect(() => {
      return () => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      };
    }, []);

    // Calculate dynamic glow and scale properties
    const glowOpacity = Math.min(0.65, 0.15 + intensity * 0.4);

    return (
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 select-none">
        {/* Localized Atmospheric Shimmer & Air Glow Field */}
        <div
          className="relative w-[340px] h-[340px] sm:w-[380px] sm:h-[380px] md:w-[420px] md:h-[420px] flex items-center justify-center transition-opacity duration-300 transform-gpu"
          style={{
            opacity: 0.85 + intensity * 0.15,
          }}
        >
          {/* Crimson Atmospheric Pressure Backdrop */}
          <div
            className="absolute inset-4 rounded-full bg-[#de1615] blur-2xl transition-opacity duration-200 transform-gpu"
            style={{ opacity: glowOpacity }}
          />

          {/* Dynamic Motion Wisp Layer */}
          {intensity > 0.05 && (
            <div
              className="absolute inset-8 rounded-full bg-gradient-to-tr from-[#de1615]/30 via-[#ff6534]/15 to-transparent blur-xl transition-transform duration-150 transform-gpu"
              style={{
                transform: `scale(${1 + intensity * 0.18})`,
                opacity: intensity * 0.7,
              }}
            />
          )}

          {/* Click/Tap Atmospheric Shockwave Burst Waves */}
          {burstWaves.map((wave) => (
            <div
              key={wave.id}
              className="absolute inset-0 rounded-full bg-radial from-[#de1615]/30 via-[#b01010]/20 to-transparent blur-lg animate-shockwave-pulse transform-gpu"
              style={{
                animationDuration: `${wave.duration}ms`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }
);
