import { supabase } from "@/lib/supabase";
import TeamClient, { TeamMemberItem } from "./TeamClient";
import { Metadata } from "next";

import { getSharedChromeData } from "@/lib/server-data";
import { getDepartmentDetails } from "@/lib/departments";
import { getMemberPositions, isColumnMissingError } from "@/lib/team-members-meta";
import { toLocalMediaUrl } from "@/lib/media";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Team Members",
  description: "Meet the engineers, drivers, and technical departments behind Team Red Baron's championship All-Terrain Vehicles at PCCOE Pune.",
  alternates: {
    canonical: "/team",
  },
};

interface DbMemberRow {
  id: string;
  name: string;
  department: string;
  linkedin_url?: string | null;
  image_url?: string | null;
  team_year_id: string;
  sort_order?: number;
  position?: string | null;
  team_years?: { year_label: string }[] | null;
}

export default async function TeamPage() {
  const [chrome, { data: years, error: yearsError }, departments, memberPositions] = await Promise.all([
    getSharedChromeData(),
    supabase
      .from("team_years")
      .select("id, year_label, sort_order")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
    getDepartmentDetails(),
    getMemberPositions(),
  ]);

  if (yearsError) console.error("Error fetching team_years:", yearsError);

  // Safely query team_members with position, gracefully falling back if column is pending migration
  let members: DbMemberRow[] | null = null;
  const initialQuery = await supabase
    .from("team_members")
    .select(`
      id, name, position, department, linkedin_url, image_url, team_year_id, sort_order,
      team_years (year_label)
    `)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (initialQuery.error && isColumnMissingError(initialQuery.error)) {
    const fallbackQuery = await supabase
      .from("team_members")
      .select(`
        id, name, department, linkedin_url, image_url, team_year_id, sort_order,
        team_years (year_label)
      `)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true });
    members = (fallbackQuery.data as DbMemberRow[]) || null;
    if (fallbackQuery.error) console.error("Error fetching team_members (fallback):", fallbackQuery.error);
  } else {
    members = (initialQuery.data as DbMemberRow[]) || null;
    if (initialQuery.error) console.error("Error fetching team_members:", initialQuery.error);
  }

  const teamData: Record<string, TeamMemberItem[]> = {};

  if (years && members) {
    years.forEach((y) => {
      const yearMembers: TeamMemberItem[] = members
        .filter((m) => m.team_year_id === y.id)
        .map((m) => {
          let photoUrl = toLocalMediaUrl(m.image_url);
          // If Nimisha Pandey, link her newly provided photo
          if (m.name.toLowerCase().includes("nimisha") && (!photoUrl || photoUrl === "/team_person.webp")) {
            photoUrl = "/media/team/nimisha_pandey.webp?v=2";
          }
          return {
            id: m.id,
            name: m.name,
            department: m.department,
            position: (m.position && m.position.trim()) || memberPositions[m.id] || "",
            linkedin_url: m.linkedin_url,
            image_url: photoUrl,
            photo_url: photoUrl,
            team_year_id: m.team_year_id,
            sort_order: m.sort_order,
          };
        });

      // Ensure Faculty Advisor Dr. Ummid Shaikh is included at the top above Directors
      const hasFaculty = yearMembers.some(
        (m) => m.name.toLowerCase().includes("ummid") || m.name.toLowerCase().includes("shaikh")
      );
      if (!hasFaculty) {
        yearMembers.unshift({
          id: "faculty-advisor-dr-ummid-shaikh",
          name: "Dr. Ummid Shaikh",
          department: "FACULTY ADVISOR",
          position: "Faculty Advisor",
          linkedin_url: "https://www.linkedin.com/in/dr-ummid-shaikh-55886467/",
          image_url: "/media/team/dr_ummid_shaikh.webp?v=2",
          photo_url: "/media/team/dr_ummid_shaikh.webp?v=2",
          team_year_id: y.id,
          sort_order: 0,
        });
      }

      teamData[y.year_label] = yearMembers;
    });
  }

  return <TeamClient teamData={teamData} chromeData={chrome} departments={departments} />;
}
