import { createClient } from "@/lib/supabase/server";
import { addTeamYear, deleteTeamYear, updateTeamYear, addTeamMember, updateTeamMember, deleteTeamMember } from "./actions";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import Link from "next/link";
import { Trash2 } from "lucide-react";

export default async function AdminTeamPage(props: { searchParams: Promise<{ year?: string }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const { data: teamYears } = await supabase.from("team_years").select("*").is("deleted_at", null).order("sort_order", { ascending: false });
  const { data: allMembers } = await supabase.from("team_members").select("team_year_id").is("deleted_at", null);

  const selectedYearId = searchParams.year || (teamYears?.[0]?.id);

  let members: any[] = [];
  if (selectedYearId) {
    const { data: m } = await supabase.from("team_members").select("*").is("deleted_at", null).eq("team_year_id", selectedYearId).order("sort_order", { ascending: true });
    members = m || [];
  }

  const DEPARTMENTS = ["TRANSMISSION", "ACCUMULATOR", "ELECTRIC POWERTRAIN", "ROLLCAGE", "VEHICLE DYNAMICS", "MECHANICAL POWERTRAIN"];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="font-sora font-bold text-3xl text-white tracking-tight">Team Members</h1>
        <p className="text-[#ae8882] text-sm mt-2">Manage team years and members for each department.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar for Years */}
        <div className="space-y-6">
          <div className="bg-[#12151b] border border-white/10 rounded-2xl p-4">
            <h2 className="font-sora font-bold text-lg text-white mb-4">Team Years</h2>
            <div className="space-y-2">
              {teamYears?.map(y => (
                <div key={y.id} className="flex flex-col gap-2 bg-black/50 p-2 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/team?year=${y.id}`}
                      className={`flex-1 px-2 py-1.5 rounded text-sm transition-colors ${selectedYearId === y.id ? "bg-[#de1615] text-white" : "text-white/70 hover:bg-white/5"}`}
                    >
                      {y.year_label}
                    </Link>
                    <form action={deleteTeamYear.bind(null, y.id)}>
                      {(() => {
                        const hasMembers = allMembers?.some(m => m.team_year_id === y.id);
                        return (
                          <button 
                            type="submit" 
                            disabled={hasMembers}
                            title={hasMembers ? "Cannot delete year with members" : "Delete year"}
                            className={`p-1.5 rounded transition-colors ${hasMembers ? "text-white/20 cursor-not-allowed" : "text-white/40 hover:text-red-500 hover:bg-red-500/10"}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        );
                      })()}
                    </form>
                  </div>
                  <form action={updateTeamYear.bind(null, y.id)} className="flex gap-2">
                    <input type="text" name="year_label" defaultValue={y.year_label} className="flex-1 bg-black border border-white/10 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
                    <input type="number" name="sort_order" defaultValue={y.sort_order} className="w-16 bg-black border border-white/10 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
                    <button type="submit" className="text-xs text-[#de1615] font-semibold px-2">Save</button>
                  </form>
                </div>
              ))}
            </div>

            <form action={addTeamYear} className="mt-6 pt-6 border-t border-white/10 space-y-3">
              <input
                type="text"
                name="year_label"
                required
                placeholder="New Year (e.g. 2025-26)"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
              />
              <input
                type="number"
                name="sort_order"
                defaultValue={1}
                required
                placeholder="Sort Order"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
              />
              <button type="submit" className="w-full bg-white/10 hover:bg-white/20 text-white font-sora font-bold text-xs uppercase py-2 rounded-lg transition-colors">
                Add Year
              </button>
            </form>
          </div>
        </div>

        {/* Main Content for Members */}
        <div className="lg:col-span-3 space-y-8">
          {selectedYearId ? (
            <>
              <div className="bg-[#12151b] border border-white/10 rounded-2xl p-6">
                <h2 className="font-sora font-bold text-xl text-white mb-6">Members</h2>
                
                <div className="space-y-12">
                  {DEPARTMENTS.map(dept => {
                    const deptMembers = members.filter(m => m.department === dept);
                    if (deptMembers.length === 0) return null;
                    return (
                      <div key={dept} className="space-y-4">
                        <h3 className="font-sora font-bold text-lg text-[#de1615] border-b border-white/10 pb-2">{dept}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {deptMembers.map(member => (
                            <form encType="multipart/form-data" key={member.id} action={updateTeamMember.bind(null, member.id)} className="glass-card p-4 rounded-xl border border-white/5 bg-black/40 flex flex-col">
                              <ImageUploadField name="image" defaultValue={member.image_url} />
                              <div className="mt-4 space-y-3 flex-1">
                                <input type="text" name="name" defaultValue={member.name} required placeholder="Name" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
                                <select name="department" defaultValue={member.department} required className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter">
                                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <input type="text" name="linkedin_url" defaultValue={member.linkedin_url} placeholder="LinkedIn URL" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
                                <input type="number" name="sort_order" defaultValue={member.sort_order} required placeholder="Sort Order" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
                              </div>
                              <div className="mt-4 flex gap-2 pt-4 border-t border-white/5">
                                <button type="submit" className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-2 rounded-lg transition-colors">Update</button>
                                <button formAction={deleteTeamMember.bind(null, member.id, member.image_url)} className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </form>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  
                  {(() => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const unassigned = members.filter(m => !DEPARTMENTS.includes(m.department as any));
                    if (unassigned.length === 0) return null;
                    return (
                      <div className="space-y-4">
                        <h3 className="font-sora font-bold text-lg text-gray-400 border-b border-white/10 pb-2">UNASSIGNED</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {unassigned.map(member => (
                            <form encType="multipart/form-data" key={member.id} action={updateTeamMember.bind(null, member.id)} className="glass-card p-4 rounded-xl border border-white/5 bg-black/40 flex flex-col">
                              <ImageUploadField name="image" defaultValue={member.image_url} />
                              <div className="mt-4 space-y-3 flex-1">
                                <input type="text" name="name" defaultValue={member.name} required placeholder="Name" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
                                <select name="department" defaultValue={member.department} required className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter">
                                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <input type="text" name="linkedin_url" defaultValue={member.linkedin_url} placeholder="LinkedIn URL" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
                                <input type="number" name="sort_order" defaultValue={member.sort_order} required placeholder="Sort Order" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
                              </div>
                              <div className="mt-4 flex gap-2 pt-4 border-t border-white/5">
                                <button type="submit" className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-2 rounded-lg transition-colors">Update</button>
                                <button formAction={deleteTeamMember.bind(null, member.id, member.image_url)} className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </form>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="bg-[#12151b] border border-white/10 rounded-2xl p-6">
                <h2 className="font-sora font-bold text-xl text-white mb-6">Add New Member</h2>
                <form encType="multipart/form-data" action={addTeamMember} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="hidden" name="team_year_id" value={selectedYearId} />
                  <div>
                    <ImageUploadField name="image" />
                  </div>
                  <div className="space-y-3">
                    <input type="text" name="name" required placeholder="Name" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
                    <select name="department" defaultValue="TRANSMISSION" required className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter">
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <input type="text" name="linkedin_url" placeholder="LinkedIn URL" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
                    <input type="number" name="sort_order" defaultValue={1} required placeholder="Sort Order" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
                    <button type="submit" className="w-full bg-[#de1615] hover:bg-[#b81211] text-white font-sora font-bold text-xs uppercase tracking-wider py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(222,22,21,0.3)] mt-2">
                      Add Member
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 bg-[#12151b] border border-white/10 rounded-2xl text-white/40 font-inter">
              Create or select a Team Year to manage members.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
