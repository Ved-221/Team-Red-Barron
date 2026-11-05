export interface AchievementStat {
  id: string;
  label: string;
  value: string;
  icon: string;
  detail?: string;
  sort_order: number;
}

export const DEFAULT_ACHIEVEMENTS: AchievementStat[] = [
  { id: "stat-legacy", label: "Years of Legacy", value: "15 YEARS", icon: "History", detail: "Active 2011 – Present", sort_order: 1 },
  { id: "stat-atvs", label: "Vehicles Built", value: "14 ATVs", icon: "Car", detail: "Albatros 1.0 to XIV", sort_order: 2 },
  { id: "stat-ebaja2025-1", label: "E-BAJA INDIA 2025", value: "1ST RANK", icon: "ShieldCheck", detail: "Overall Statics", sort_order: 3 },
  { id: "stat-ebaja2024-air1", label: "E-BAJA INDIA 2024", value: "AIR 1", icon: "Trophy", detail: "Engineering Design", sort_order: 4 },
  { id: "stat-ebaja2024-air2", label: "E-BAJA INDIA 2024", value: "AIR 2", icon: "Award", detail: "Overall National Rank", sort_order: 5 },
  { id: "stat-ebaja-4wd", label: "E-BAJA INDIA", value: "BEST 4WD", icon: "Zap", detail: "Performance Award", sort_order: 6 },
  { id: "stat-illinois2017", label: "Baja SAE Illinois 2017", value: "9TH RANK", icon: "Car", detail: "Overall Dynamics (USA)", sort_order: 7 },
  { id: "stat-rochester2019", label: "Baja SAE Rochester 2019", value: "7TH RANK", icon: "History", detail: "Hill Climbing (USA)", sort_order: 8 },
];
