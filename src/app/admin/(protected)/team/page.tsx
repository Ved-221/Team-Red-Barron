import { createClient } from "@/lib/supabase/server";
import { addTeamYear, deleteTeamYear, updateTeamYear, addTeamMember, updateTeamMember, deleteTeamMember, addDomain, updateDomain, deleteDomain } from "./actions";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import Link from "next/link";
import { Trash2, Layers, Plus } from "lucide-react";
import { getDepartmentDetails, DepartmentItem } from "@/lib/departments";

export const dynamic = "force-dynamic";

interface TeamMemberItem {
  id: string;
  name: string;
  image_url?: string;
  department?: string;
  linkedin_url?: string;
  sort_order: number;
}

export default async function AdminTeamPage(props: { searchParams: Promise<{ year?: string }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const { data: teamYears } = await supabase.from("team_years").select("*").is("deleted_at", null).order("sort_order", { ascending: false });
  const { data: allMembers } = await supabase.from("team_members").select("team_year_id, department").is("deleted_at", null);

  const selectedYearId = searchParams.year || (teamYears?.[0]?.id);

  let members: TeamMemberItem[] = [];
  if (selectedYearId) {
    const { data: m } = await supabase.from("team_members").select("*").is("deleted_at", null).eq("team_year_id", selectedYearId).order("sort_order", { ascending: true });
    members = (m as unknown as TeamMemberItem[]) || [];
  }

  const normDept = (d?: string | null) => (d || "").trim().toUpperCase() || "GENERAL";
  const savedDepts = await getDepartmentDetails();
  const savedDeptNames = new Set(savedDepts.map(d => d.name));

  const existingMemberDepts = Array.from(new Set(allMembers?.map(m => normDept(m.department)) || []));
  const missingDepts: DepartmentItem[] = existingMemberDepts
    .filter(d => !savedDeptNames.has(d))
    .map((d, idx) => ({
      name: d,
      sort_order: savedDepts.length + idx + 1,
      description: `Specialized engineering and operational domain for ${d}.`,
    }));

  const allDepts: DepartmentItem[] = [...savedDepts, ...missingDepts].sort(
    (a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="font-sora font-bold text-3xl text-white tracking-tight">Team Members</h1>
        <p className="text-[#ae8882] text-sm mt-2">Manage team years, domains, and members with automatic ordering.</p>
      </div>

      {/* Global datalist for department suggestions */}
      <datalist id="departments-list">
        {allDepts.map(d => (
          <option key={d.name} value={d.name} />
        ))}
      </datalist>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar for Years & Domains */}
        <div className="space-y-6">
          {/* Team Years */}
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
                placeholder="New Year (e.g. 2026-27)"
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

          {/* Dedicated Domains / Departments Section */}
          <div className="bg-[#12151b] border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-sora font-bold text-lg text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#de1615]" />
                <span>Domains</span>
              </h2>
              <span className="text-[10px] font-mono-tech text-[#ae8882] bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                {allDepts.length} total
              </span>
            </div>
            <p className="text-xs text-[#ae8882] mb-3 leading-relaxed">
              Set sort order & public descriptions displayed on the team website.
            </p>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {allDepts.map(dept => {
                const memberCount = allMembers?.filter(m => normDept(m.department) === dept.name).length || 0;
                return (
                  <div key={dept.name} className="bg-black/60 p-3 rounded-xl border border-white/10 space-y-2 hover:border-[#de1615]/30 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="font-sora font-bold text-white text-xs tracking-wider uppercase truncate mr-2" title={dept.name}>
                        {dept.name}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-mono text-[10px] text-white/50 bg-white/5 px-1.5 py-0.5 rounded">
                          {memberCount} {memberCount === 1 ? "member" : "members"}
                        </span>
                        {memberCount === 0 && (
                          <form action={deleteDomain.bind(null, dept.name)}>
                            <button
                              type="submit"
                              title={`Delete ${dept.name} domain`}
                              className="text-white/30 hover:text-red-500 transition-colors p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </form>
                        )}
                      </div>
                    </div>

                    <form action={updateDomain.bind(null, dept.name)} className="space-y-2 pt-1 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-mono text-[#e8bdb6] uppercase tracking-wider shrink-0">Order:</label>
                        <input
                          type="number"
                          name="sort_order"
                          defaultValue={dept.sort_order}
                          required
                          className="w-16 bg-black border border-white/10 rounded px-2 py-1 text-white text-xs font-mono focus:outline-none focus:border-[#de1615]"
                        />
                        <button
                          type="submit"
                          className="ml-auto text-xs font-sora font-bold bg-[#de1615]/20 hover:bg-[#de1615] text-[#de1615] hover:text-white px-2.5 py-1 rounded transition-colors"
                        >
                          Save
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-[#e8bdb6] uppercase tracking-wider block">Description:</label>
                        <textarea
                          name="description"
                          defaultValue={dept.description}
                          rows={2}
                          placeholder="Domain description displayed on website..."
                          className="w-full bg-black border border-white/10 rounded p-1.5 text-white text-xs font-inter focus:outline-none focus:border-[#de1615] resize-none leading-relaxed"
                        />
                      </div>
                    </form>
                  </div>
                );
              })}
            </div>

            <form action={addDomain} className="mt-4 pt-4 border-t border-white/10 space-y-2.5">
              <label className="block text-[11px] font-mono-tech text-[#e8bdb6] uppercase tracking-wider">
                Add New Domain
              </label>
              <input
                type="text"
                name="domain_name"
                required
                placeholder="Domain Name (e.g. TRANSMISSION)"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#de1615]/50 transition-all font-inter uppercase"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  name="sort_order"
                  defaultValue={allDepts.length + 1}
                  required
                  placeholder="Sort Order"
                  className="w-20 bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs font-mono focus:outline-none focus:border-[#de1615]/50 transition-all"
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description (optional)"
                  className="flex-1 bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#de1615] hover:bg-[#b81211] text-white font-sora font-bold text-xs uppercase py-2 rounded-lg transition-all shadow-[0_0_12px_rgba(222,22,21,0.25)] flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Domain
              </button>
            </form>
          </div>
        </div>

        {/* Main Content for Members */}
        <div className="lg:col-span-3 space-y-8">
          {selectedYearId ? (
            <>
              <div className="bg-[#12151b] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-sora font-bold text-xl text-white">Team Members by Domain</h2>
                  <span className="text-xs font-mono-tech text-[#ae8882]">
                    Total Members: {members.length}
                  </span>
                </div>
                
                <div className="space-y-12">
                  {allDepts.map(dept => {
                    const deptMembers = members.filter(m => normDept(m.department) === dept.name);
                    if (deptMembers.length === 0) return null;
                    return (
                      <div key={dept.name} className="space-y-4">
                        <div className="border-b border-white/10 pb-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-sora font-bold text-lg text-[#de1615] flex items-center gap-2">
                              <span>{dept.name}</span>
                              <span className="text-xs font-mono-tech bg-white/10 text-white/80 px-2 py-0.5 rounded-full">{deptMembers.length}</span>
                              <span className="text-[10px] font-mono text-white/40 border border-white/10 px-1.5 py-0.5 rounded">Order: {dept.sort_order}</span>
                            </h3>
                          </div>
                          {dept.description && (
                            <p className="text-xs text-white/60 mt-1.5 font-inter max-w-3xl leading-relaxed">
                              {dept.description}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {deptMembers.map(member => (
                            <form key={member.id} action={updateTeamMember.bind(null, member.id)} className="glass-card p-4 rounded-xl border border-white/5 bg-black/40 flex flex-col">
                              <ImageUploadField name="image" label="Member Photo (Max 1 MB)" defaultValue={member.image_url} maxDimension={800} maxSizeMb={1.0} />
                              <div className="mt-4 space-y-3 flex-1">
                                <input type="text" name="name" defaultValue={member.name} required placeholder="Name" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
                                <div>
                                  <label className="block text-[10px] font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-1">Domain</label>
                                  <select
                                    name="department"
                                    defaultValue={normDept(member.department)}
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter uppercase"
                                  >
                                    {allDepts.map(d => (
                                      <option key={d.name} value={d.name} className="bg-[#12151b] text-white">
                                        {d.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <input type="text" name="linkedin_url" defaultValue={member.linkedin_url} placeholder="LinkedIn URL" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
                                <input type="number" name="sort_order" defaultValue={member.sort_order} required placeholder="Sort Order" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
                              </div>
                              <div className="mt-4 flex gap-2 pt-4 border-t border-white/5">
                                <button type="submit" className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-2 rounded-lg transition-colors">Update</button>
                                <button formAction={deleteTeamMember.bind(null, member.id, member.image_url || "")} className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </form>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#12151b] border border-white/10 rounded-2xl p-6">
                <h2 className="font-sora font-bold text-xl text-white mb-6">Add New Member</h2>
                <form action={addTeamMember} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="hidden" name="team_year_id" value={selectedYearId} />
                  <div>
                    <ImageUploadField name="image" label="Member Photo (Max 1 MB)" maxDimension={800} maxSizeMb={1.0} />
                  </div>
                  <div className="space-y-3">
                    <input type="text" name="name" required placeholder="Member Full Name" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
                    <div>
                      <label className="block text-[11px] font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-1">Domain / Department</label>
                      <select
                        name="department"
                        defaultValue={allDepts[0]?.name || "TRANSMISSION"}
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter uppercase"
                      >
                        {allDepts.map(d => (
                          <option key={d.name} value={d.name} className="bg-[#12151b] text-white">
                            {d.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-white/40 mt-1">Select from your registered domains or create a new one in the Domains card on the left.</p>
                    </div>
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
