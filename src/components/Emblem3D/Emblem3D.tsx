"use client";

import React, {
  Suspense,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import * as THREE from "three";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Bounds, Center, Environment } from "@react-three/drei";
import { FACE_BLACK, FACE_RED, OUTER_SHIELD, WHITE_RING, pathToShape } from "./emblemPaths";

/* ────────────────────────────────────────────────────────────────────────
 * Material config — every visual "look" knob lives here in one place.
 * ──────────────────────────────────────────────────────────────────────── */
export const EMBLEM_MATERIAL = {
  black: { color: "#141414", metalness: 0.88, roughness: 0.26 },
  white: { color: "#f3f2ee", metalness: 0.3, roughness: 0.38 },
  red: { color: "#c31f26", metalness: 0.55, roughness: 0.3 },
  clearcoat: 0.5,
  clearcoatRoughness: 0.18,
  envMapIntensity: 1.1,
} as const;

export interface Emblem3DProps {
  /** Overall scale multiplier. Default 1. */
  scale?: number;
  /** How far the emblem tilts to follow the pointer (0–1 range is sane). Default 0.18. */
  rotationIntensity?: number;
  /** Extra tilt applied while hovered. Default 0.08. */
  hoverIntensity?: number;
  /** Extrusion depth of the outer rim (design-space units). Default 0.9. */
  thickness?: number;
  /** Overrides metalness on all materials. Optional. */
  metalness?: number;
  /** Overrides roughness on all materials. Optional. */
  roughness?: number;
  bevelSize?: number;
  bevelThickness?: number;
  bevelSegments?: number;
  curveSegments?: number;
  /** Continuous slow spin — off by default, per spec. */
  autoRotate?: boolean;
  /** Gentle idle bob/float when the pointer is idle. Default true. */
  idleFloat?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Canvas clear color; leave undefined for a transparent canvas. */
  backgroundColor?: string;
}

const DEFAULTS: Required<
  Pick<
    Emblem3DProps,
    | "scale"
    | "rotationIntensity"
    | "hoverIntensity"
    | "thickness"
    | "bevelSize"
    | "bevelThickness"
    | "bevelSegments"
    | "curveSegments"
    | "autoRotate"
    | "idleFloat"
  >
> = {
  scale: 1,
  rotationIntensity: 0.18,
  hoverIntensity: 0.08,
  thickness: 0.9,
  bevelSize: 0.35,
  bevelThickness: 0.3,
  bevelSegments: 6,
  curveSegments: 24,
  autoRotate: false,
  idleFloat: true,
};

/* ────────────────────────────────────────────────────────────────────────
 * Geometry construction
 * ──────────────────────────────────────────────────────────────────────── */
interface LayerConfig {
  depth: number;
  raise: number; // z offset of this layer's back face, stacks depth visually
}

function useEmblemGeometry(opts: {
  thickness: number;
  bevelSize: number;
  bevelThickness: number;
  bevelSegments: number;
  curveSegments: number;
}) {
  const { thickness, bevelSize, bevelThickness, bevelSegments, curveSegments } = opts;

  return useMemo(() => {
    const extrude = (
      commands: Parameters<typeof pathToShape>[0],
      layer: LayerConfig,
      bevelEnabled = true
    ) => {
      const shape = pathToShape(commands);
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: layer.depth,
        bevelEnabled,
        bevelSize: Math.min(bevelSize, layer.depth * 0.4),
        bevelThickness: Math.min(bevelThickness, layer.depth * 0.4),
        bevelSegments,
        curveSegments,
        steps: 1,
      });
      geometry.translate(0, 0, layer.raise);
      geometry.computeVertexNormals();
      return geometry;
    };

    // Layers stack front-to-back: each one's back face starts exactly where
    // the previous layer's FRONT face ends, so every layer sits visibly
    // proud of the one behind it (camera looks down +z toward the badge).
    const rimDepth = thickness;
    const ringDepth = thickness * 0.4;
    const faceDepth = thickness * 0.35;

    const rimRaise = 0;
    const ringRaise = rimRaise + rimDepth; // starts at the rim's front face
    const faceRaise = ringRaise + ringDepth; // starts at the ring's front face

    return {
      rim: extrude(OUTER_SHIELD, { depth: rimDepth, raise: rimRaise }),
      ring: extrude(WHITE_RING, { depth: ringDepth, raise: ringRaise }),
      black: extrude(FACE_BLACK, { depth: faceDepth, raise: faceRaise }),
      red: extrude(FACE_RED, { depth: faceDepth, raise: faceRaise }),
    };
  }, [thickness, bevelSize, bevelThickness, bevelSegments, curveSegments]);
}

/* ────────────────────────────────────────────────────────────────────────
 * The interactive, rotating badge mesh group
 * ──────────────────────────────────────────────────────────────────────── */
function EmblemMesh({
  rotationIntensity,
  hoverIntensity,
  autoRotate,
  idleFloat,
  metalness,
  roughness,
  thickness,
  bevelSize,
  bevelThickness,
  bevelSegments,
  curveSegments,
}: Required<
  Pick<
    Emblem3DProps,
    | "rotationIntensity"
    | "hoverIntensity"
    | "autoRotate"
    | "idleFloat"
    | "thickness"
    | "bevelSize"
    | "bevelThickness"
    | "bevelSegments"
    | "curveSegments"
  >
> &
  Pick<Emblem3DProps, "metalness" | "roughness">) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const target = useRef({ x: 0, y: 0 });

  const geometry = useEmblemGeometry({
    thickness,
    bevelSize,
    bevelThickness,
    bevelSegments,
    curveSegments,
  });

  const materials = useMemo(() => {
    const build = (base: { color: string; metalness: number; roughness: number }) =>
      new THREE.MeshPhysicalMaterial({
        color: base.color,
        metalness: metalness ?? base.metalness,
        roughness: roughness ?? base.roughness,
        clearcoat: EMBLEM_MATERIAL.clearcoat,
        clearcoatRoughness: EMBLEM_MATERIAL.clearcoatRoughness,
        envMapIntensity: EMBLEM_MATERIAL.envMapIntensity,
      });
    return {
      black: build(EMBLEM_MATERIAL.black),
      white: build(EMBLEM_MATERIAL.white),
      red: build(EMBLEM_MATERIAL.red),
    };
  }, [metalness, roughness]);

  const handlePointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    target.current.x = (e.pointer?.y ?? 0) * -1;
    target.current.y = (e.pointer?.x ?? 0) * 1;
  }, []);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;

    const t = state.clock.elapsedTime;
    const hoverBoost = hovered ? 1 + hoverIntensity : 1;

    const targetX = target.current.x * rotationIntensity * hoverBoost;
    const targetY =
      target.current.y * rotationIntensity * hoverBoost +
      (autoRotate ? t * 0.25 : 0);

    // Critically-damped smoothing toward target orientation.
    const smoothing = 1 - Math.pow(0.001, delta);
    g.rotation.x += (targetX - g.rotation.x) * smoothing;
    g.rotation.y += (targetY - g.rotation.y) * smoothing;

    if (idleFloat) {
      g.position.y = Math.sin(t * 0.8) * 0.04;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerMove={handlePointerMove}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => {
        setHovered(false);
        target.current = { x: 0, y: 0 };
      }}
    >
      <mesh geometry={geometry.rim} material={materials.black} castShadow receiveShadow />
      <mesh geometry={geometry.ring} material={materials.white} castShadow receiveShadow />
      <mesh geometry={geometry.black} material={materials.black} castShadow receiveShadow />
      <mesh geometry={geometry.red} material={materials.red} castShadow receiveShadow />
    </group>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Studio lighting rig
 * ──────────────────────────────────────────────────────────────────────── */
function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.25} />
      {/* Key light */}
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      {/* Fill light — softer, opposite side */}
      <directionalLight position={[-5, 2, 3]} intensity={0.45} color="#dbe6ff" />
      {/* Rim / edge light — behind, reveals the bevels */}
      <directionalLight position={[-2, -3, -6]} intensity={0.6} color="#ffffff" />
      <Environment preset="studio" />
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Public component
 * ──────────────────────────────────────────────────────────────────────── */
export default function Emblem3D(props: Emblem3DProps) {
  const {
    scale = DEFAULTS.scale,
    rotationIntensity = DEFAULTS.rotationIntensity,
    hoverIntensity = DEFAULTS.hoverIntensity,
    thickness = DEFAULTS.thickness,
    metalness,
    roughness,
    bevelSize = DEFAULTS.bevelSize,
    bevelThickness = DEFAULTS.bevelThickness,
    bevelSegments = DEFAULTS.bevelSegments,
    curveSegments = DEFAULTS.curveSegments,
    autoRotate = DEFAULTS.autoRotate,
    idleFloat = DEFAULTS.idleFloat,
    className,
    style,
    backgroundColor,
  } = props;

  return (
    <div
      className={className}
      style={{ width: "100%", height: "100%", minHeight: 240, ...style }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: backgroundColor === undefined }}
        camera={{ fov: 32, near: 0.1, far: 100, position: [0, 0, 10] }}
        onCreated={({ gl }) => {
          if (backgroundColor) gl.setClearColor(backgroundColor, 1);
        }}
      >
        {backgroundColor && <color attach="background" args={[backgroundColor]} />}
        <Suspense fallback={null}>
          <StudioLighting />
          {/* Bounds auto-fits the camera to the emblem's bounding box —
              no manual camera-distance math required. */}
          <Bounds fit clip observe margin={1.35}>
            <Center>
              <group scale={scale * 0.05}>
                <EmblemMesh
                  rotationIntensity={rotationIntensity}
                  hoverIntensity={hoverIntensity}
                  autoRotate={autoRotate}
                  idleFloat={idleFloat}
                  metalness={metalness}
                  roughness={roughness}
                  thickness={thickness}
                  bevelSize={bevelSize}
                  bevelThickness={bevelThickness}
                  bevelSegments={bevelSegments}
                  curveSegments={curveSegments}
                />
              </group>
            </Center>
          </Bounds>
        </Suspense>
      </Canvas>
    </div>
  );
}
