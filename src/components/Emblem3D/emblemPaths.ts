import * as THREE from "three";

/**
 * ────────────────────────────────────────────────────────────────────────
 * Emblem path data
 * ────────────────────────────────────────────────────────────────────────
 * Hand-approximated from the uploaded reference PNG. Coordinates live in a
 * flat 2D "design space" (SVG-style: x → right, y → down, viewBox roughly
 * 220 × 180) that mirrors the emblem's proportions — wide rounded shoulder
 * top-left, tapering to a point bottom-right, with a white inset border
 * and a black/red split face.
 *
 * IMPORTANT: This is a close manual approximation, not a pixel-traced
 * vector export — a raster PNG has no path data to extract automatically.
 * Every other file in this component only consumes the THREE.Shape objects
 * this module produces, so if you get an exact vector trace of the logo
 * later (Illustrator "Image Trace", Figma "Vectorize", or the original
 * source file), you only need to replace the coordinate arrays below —
 * nothing in Emblem3D.tsx needs to change.
 * ────────────────────────────────────────────────────────────────────────
 */

export type PathCommand =
  | { cmd: "M"; x: number; y: number }
  | { cmd: "L"; x: number; y: number }
  | { cmd: "Q"; x1: number; y1: number; x: number; y: number }
  | { cmd: "C"; x1: number; y1: number; x2: number; y2: number; x: number; y: number }
  | { cmd: "Z" };

// Approximate centroid of the overall silhouette, used to scale layers
// (e.g. the white border ring) uniformly toward the emblem's visual center.
export const CENTROID = { x: 124, y: 96 };

// Outer shield / badge silhouette (the black rim).
export const OUTER_SHIELD: PathCommand[] = [
  { cmd: "M", x: 18, y: 82 },
  { cmd: "C", x1: 40, y1: 20, x2: 140, y2: 10, x: 205, y: 40 },
  { cmd: "C", x1: 230, y1: 90, x2: 190, y2: 140, x: 150, y: 165 },
  { cmd: "C", x1: 90, y1: 175, x2: 10, y2: 140, x: 18, y: 82 },
  { cmd: "Z" },
];

// Black "wing" region of the face (upper-right of the emblem).
export const FACE_BLACK: PathCommand[] = [
  { cmd: "M", x: 60, y: 60 },
  { cmd: "C", x1: 100, y1: 45, x2: 150, y2: 50, x: 185, y: 70 },
  { cmd: "C", x1: 195, y1: 85, x2: 190, y2: 95, x: 175, y: 100 },
  { cmd: "C", x1: 190, y1: 105, x2: 195, y2: 115, x: 180, y: 120 },
  { cmd: "C", x1: 150, y1: 140, x2: 120, y2: 150, x: 100, y: 150 },
  { cmd: "C", x1: 90, y1: 140, x2: 95, y2: 120, x: 110, y: 110 },
  { cmd: "C", x1: 90, y1: 105, x2: 70, y2: 95, x: 65, y: 80 },
  { cmd: "Z" },
];

// Red "hook" region of the face (lower-left, the emblem's letterform accent).
export const FACE_RED: PathCommand[] = [
  { cmd: "M", x: 55, y: 90 },
  { cmd: "C", x1: 70, y1: 70, x2: 100, y2: 68, x: 115, y: 85 },
  { cmd: "C", x1: 125, y1: 97, x2: 120, y2: 112, x: 105, y: 118 },
  { cmd: "C", x1: 120, y1: 120, x2: 140, y2: 118, x: 155, y: 105 },
  { cmd: "C", x1: 145, y1: 130, x2: 115, y2: 150, x: 90, y: 152 },
  { cmd: "C", x1: 65, y1: 153, x2: 45, y2: 135, x: 45, y: 110 },
  { cmd: "C", x1: 45, y1: 100, x2: 48, y2: 95, x: 55, y: 90 },
  { cmd: "Z" },
];

/** Converts an SVG-style command list into a THREE.Shape (flips Y to three.js-up). */
export function pathToShape(commands: PathCommand[]): THREE.Shape {
  const shape = new THREE.Shape();
  commands.forEach((c) => {
    switch (c.cmd) {
      case "M":
        shape.moveTo(c.x, -c.y);
        break;
      case "L":
        shape.lineTo(c.x, -c.y);
        break;
      case "Q":
        shape.quadraticCurveTo(c.x1, -c.y1, c.x, -c.y);
        break;
      case "C":
        shape.bezierCurveTo(c.x1, -c.y1, c.x2, -c.y2, c.x, -c.y);
        break;
      case "Z":
        shape.closePath();
        break;
    }
  });
  return shape;
}

/** Uniformly scales a command list toward (cx, cy) — used for the inset white ring. */
export function scaleCommands(
  commands: PathCommand[],
  factor: number,
  cx: number = CENTROID.x,
  cy: number = CENTROID.y
): PathCommand[] {
  const s = (v: number, c: number) => c + (v - c) * factor;
  return commands.map((c): PathCommand => {
    switch (c.cmd) {
      case "M":
        return { cmd: "M", x: s(c.x, cx), y: s(c.y, cy) };
      case "L":
        return { cmd: "L", x: s(c.x, cx), y: s(c.y, cy) };
      case "Q":
        return {
          cmd: "Q",
          x1: s(c.x1, cx),
          y1: s(c.y1, cy),
          x: s(c.x, cx),
          y: s(c.y, cy),
        };
      case "C":
        return {
          cmd: "C",
          x1: s(c.x1, cx),
          y1: s(c.y1, cy),
          x2: s(c.x2, cx),
          y2: s(c.y2, cy),
          x: s(c.x, cx),
          y: s(c.y, cy),
        };
      case "Z":
        return { cmd: "Z" };
    }
  });
}

// White inset border ring — 93% scale of the outer shield, about the centroid.
export const WHITE_RING: PathCommand[] = scaleCommands(OUTER_SHIELD, 0.93);
