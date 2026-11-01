"use client";

import React, { Suspense, useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center, Bounds } from "@react-three/drei";
import type { LogoRadialDistortionRef } from "./LogoRadialDistortion";

const GLB_PATH = "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/logo_3d_emblem_website_colours.glb";

useGLTF.preload(GLB_PATH);

const MAX_ROT_Y = (35 * Math.PI) / 180; // ±35°
const MAX_ROT_X = (20 * Math.PI) / 180; // ±20°
const MAX_ROT_Z = (10 * Math.PI) / 180; // ±10°

function EmblemModel({ pointerRef }: { pointerRef: React.RefObject<{ x: number; y: number; active: boolean }> }) {
  const { scene } = useGLTF(GLB_PATH);
  const groupRef = useRef<THREE.Group>(null);

  const clonedScene = useMemo(() => {
    const s = scene.clone(true);
    s.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const name = (mesh.name || "").toLowerCase();
        const matName = (mesh.material && (mesh.material as THREE.Material).name)
          ? (mesh.material as THREE.Material).name.toLowerCase()
          : "";

        const mat = (mesh.material as THREE.MeshStandardMaterial).clone();

        if (name.includes("red") || matName.includes("red")) {
          mat.color = new THREE.Color("#de1615");
          mat.emissive = new THREE.Color("#b01010");
          mat.emissiveIntensity = 0.22;
          mat.roughness = 0.42;
          mat.metalness = 0.05;
        } else if (name.includes("white") || matName.includes("white") || name.includes("inlay")) {
          mat.color = new THREE.Color("#ffffff");
          mat.emissive = new THREE.Color("#ffffff");
          mat.emissiveIntensity = 0.02;
          mat.roughness = 0.45;
          mat.metalness = 0.0;
        } else {
          mat.color = new THREE.Color("#111114");
          mat.emissive = new THREE.Color("#000000");
          mat.emissiveIntensity = 0;
          mat.roughness = 0.55;
          mat.metalness = 0.1;
        }

        mesh.material = mat;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return s;
  }, [scene]);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;

    const pointer = pointerRef.current || { x: 0, y: 0, active: false };
    const t = state.clock.elapsedTime;

    const targetX = Math.max(-MAX_ROT_X, Math.min(MAX_ROT_X, -pointer.y * MAX_ROT_X));
    const targetY = Math.max(-MAX_ROT_Y, Math.min(MAX_ROT_Y, pointer.x * MAX_ROT_Y));
    const targetZ = -pointer.x * pointer.y * MAX_ROT_Z;

    const targetPosX = pointer.x * 0.22;
    const targetPosY = -pointer.y * 0.18 + Math.sin(t * 1.6) * 0.04;
    const targetPosZ = (1 - Math.hypot(pointer.x, pointer.y)) * 0.15;

    const damp = 1 - Math.pow(0.00001, delta);
    g.rotation.x += (targetX - g.rotation.x) * damp;
    g.rotation.y += (targetY - g.rotation.y) * damp;
    g.rotation.z += (targetZ - g.rotation.z) * damp;

    g.position.x += (targetPosX - g.position.x) * damp;
    g.position.y += (targetPosY - g.position.y) * damp;
    g.position.z += (targetPosZ - g.position.z) * damp;
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={clonedScene} scale={28} />
      </Center>
    </group>
  );
}

function SoftLighting() {
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-4, 2, 4]} intensity={0.6} color="#e0e8ff" />
      <directionalLight position={[0, 4, -4]} intensity={0.8} color="#ff8877" />
    </>
  );
}

export interface Hero3DLogoProps {
  distortionRef?: React.RefObject<LogoRadialDistortionRef | null>;
}

export function Hero3DLogo({ distortionRef }: Hero3DLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });
  const [isVisible, setIsVisible] = useState(true);

  // Calibration baseline for gyroscope tilt
  const baseBetaRef = useRef<number | null>(null);
  const baseGammaRef = useRef<number | null>(null);
  const hasGyroscopeRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );
    io.observe(el);

    // Desktop mouse pointer tracking (frozen & untouched)
    const handlePointerMove = (e: PointerEvent) => {
      const isDesktop = window.innerWidth >= 1024;
      const isMouse = e.pointerType === "mouse";

      if (isDesktop || isMouse || !hasGyroscopeRef.current) {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const normX = (e.clientX - centerX) / (window.innerWidth * 0.35);
        const normY = (e.clientY - centerY) / (window.innerHeight * 0.35);

        const clampedX = Math.max(-1, Math.min(1, normX));
        const clampedY = Math.max(-1, Math.min(1, normY));

        pointerRef.current = {
          x: clampedX,
          y: clampedY,
          active: true,
        };

        const isOverLogo =
          e.clientX >= rect.left - 60 &&
          e.clientX <= rect.right + 60 &&
          e.clientY >= rect.top - 60 &&
          e.clientY <= rect.bottom + 60;

        if (isOverLogo && distortionRef?.current) {
          const movementIntensity = Math.abs(clampedX) + Math.abs(clampedY);
          distortionRef.current.onMove(movementIntensity);
        }
      }
    };

    const handlePointerLeave = (e?: Event) => {
      const pointerType = (e as PointerEvent)?.pointerType;
      // Only reset when pointer was a mouse or on desktop, not when mobile touch lifts while gyro is active
      if (window.innerWidth >= 1024 || pointerType === "mouse" || !hasGyroscopeRef.current) {
        pointerRef.current = { x: 0, y: 0, active: false };
      }
    };

    // Low-pass filter references for gyroscope smoothing
    let smoothedGamma = 0;
    let smoothedBeta = 0;
    let initializedSmoother = false;

    // Mobile Device Orientation / Gyroscope Tilt Parallax handler
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      hasGyroscopeRef.current = true;

      // Desktop rule: keep desktop mouse-driven only
      if (window.innerWidth >= 1024) return;

      // Initialize resting baseline angle to current user hold
      if (baseBetaRef.current === null) {
        baseBetaRef.current = e.beta;
        baseGammaRef.current = e.gamma;
        smoothedGamma = e.gamma;
        smoothedBeta = e.beta;
        initializedSmoother = true;
      }

      // Smooth sensor input with exponential moving average to eliminate sensor jitter
      if (!initializedSmoother) {
        smoothedGamma = e.gamma;
        smoothedBeta = e.beta;
        initializedSmoother = true;
      } else {
        smoothedGamma += (e.gamma - smoothedGamma) * 0.18;
        smoothedBeta += (e.beta - smoothedBeta) * 0.18;
      }

      // Delta relative to calibrated hand-held posture
      let deltaGamma = smoothedGamma - (baseGammaRef.current ?? 0);
      let deltaBeta = smoothedBeta - (baseBetaRef.current ?? 45);

      // Deadzone threshold (ignore micro hand tremors under 1.5 degrees)
      const DEADZONE = 1.5;
      if (Math.abs(deltaGamma) < DEADZONE) deltaGamma = 0;
      else deltaGamma -= Math.sign(deltaGamma) * DEADZONE;

      if (Math.abs(deltaBeta) < DEADZONE) deltaBeta = 0;
      else deltaBeta -= Math.sign(deltaBeta) * DEADZONE;

      // Reduced sensitivity: widened range (55 deg) + 0.6 scale factor
      // This makes the tilt feel calm, grounded, and premium rather than hyper-reactive
      const SENSITIVITY_DIVISOR = 55;
      const MAX_MOBILE_SCALE = 0.6;

      const normX = Math.max(-MAX_MOBILE_SCALE, Math.min(MAX_MOBILE_SCALE, (deltaGamma / SENSITIVITY_DIVISOR) * MAX_MOBILE_SCALE));
      const normY = Math.max(-MAX_MOBILE_SCALE, Math.min(MAX_MOBILE_SCALE, (deltaBeta / SENSITIVITY_DIVISOR) * MAX_MOBILE_SCALE));

      pointerRef.current = {
        x: normX,
        y: normY,
        active: true,
      };

      if (distortionRef?.current) {
        const movementIntensity = (Math.abs(normX) + Math.abs(normY)) * 0.15;
        distortionRef.current.onMove(movementIntensity);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("mouseleave", handlePointerLeave, { passive: true });
    window.addEventListener("pointerup", handlePointerLeave, { passive: true });
    window.addEventListener("pointercancel", handlePointerLeave, { passive: true });

    // Attach gyroscope listener (works out-of-the-box on Android / HTTPS)
    window.addEventListener("deviceorientation", handleOrientation, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("pointerup", handlePointerLeave);
      window.removeEventListener("pointercancel", handlePointerLeave);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [distortionRef]);

  const handlePointerDown = async () => {
    if (distortionRef?.current) {
      distortionRef.current.triggerBurst();
    }

    // Re-center gyroscope baseline on tap to accommodate posture changes
    baseBetaRef.current = null;
    baseGammaRef.current = null;

    // iOS 13+ permission request if needed
    if (
      typeof window !== "undefined" &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === "function"
    ) {
      try {
        const permissionState = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
        if (permissionState === "granted") {
          // Permission granted, event listener will receive events
        }
      } catch {
        // User dismissed or already granted
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className="relative z-30 w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[340px] md:h-[340px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
    >
      {isVisible && (
        <Canvas
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ fov: 35, position: [0, 0, 4.2] }}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <SoftLighting />
            <Bounds fit clip margin={1.05}>
              <EmblemModel pointerRef={pointerRef} />
            </Bounds>
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
