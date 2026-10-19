"use client";

import { TRBEvolutionTimeline, Milestone } from "@/components/TRBEvolutionTimeline";

export function TimelinePreview({ vehiclesData }: { vehiclesData: Milestone[] }) {
  const sortedVehicles = [...vehiclesData].reverse();
  return <TRBEvolutionTimeline milestones={sortedVehicles} />;
}
