import { supabase } from "@/lib/supabase";
import TeamClient from "./TeamClient";
import { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Team Members | Team Red Baron",
  description: "The engineers behind the Albatross ATV.",
};

export default async function TeamPage() {
  const { data: years } = await supabase
    .from("team_years")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  const { data: members } = await supabase
    .from("team_members")
    .select(`
      *,
      team_years (
        year_label
      )
    `)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  const teamData: Record<string, any[]> = {};

  if (years && members) {
    years.forEach((y) => {
      teamData[y.year_label] = members.filter((m) => m.team_year_id === y.id).map(m => ({
        ...m,
        photo_url: m.image_url
      }));
    });
  }

  return <TeamClient teamData={teamData} />;
}
