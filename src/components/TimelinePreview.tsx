"use client";

import { TRBEvolutionTimeline } from "@/components/TRBEvolutionTimeline";

export function TimelinePreview({ vehiclesData }: { vehiclesData: any[] }) {
  const sortedVehicles = [...vehiclesData].reverse();
  return <TRBEvolutionTimeline milestones={sortedVehicles} />;
}
