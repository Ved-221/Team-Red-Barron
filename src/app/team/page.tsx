import { supabase } from "@/lib/supabase";
import TeamClient, { TeamMemberItem } from "./TeamClient";
import { Metadata } from "next";

import { getSharedChromeData } from "@/lib/server-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Team Members",
  description: "Meet the engineers, drivers, and technical departments behind Team Red Baron's championship All-Terrain Vehicles at PCCOE Pune.",
  alternates: {
    canonical: "/team",
  },
};

export default async function TeamPage() {
  const [chrome, { data: years, error: yearsError }, { data: members, error: membersError }] = await Promise.all([
    getSharedChromeData(),
    supabase
      .from("team_years")
      .select("id, year_label, sort_order")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
    supabase
      .from("team_members")
      .select(`
        id, name, department, linkedin_url, image_url, team_year_id, sort_order,
        team_years (year_label)
      `)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
  ]);

  if (yearsError) console.error("Error fetching team_years:", yearsError);
  if (membersError) console.error("Error fetching team_members:", membersError);

  const teamData: Record<string, TeamMemberItem[]> = {};

  if (years && members) {
    years.forEach((y) => {
      teamData[y.year_label] = members.filter((m) => m.team_year_id === y.id).map(m => ({
        ...m,
        photo_url: m.image_url
      }));
    });
  }

  return <TeamClient teamData={teamData} chromeData={chrome} />;
}
