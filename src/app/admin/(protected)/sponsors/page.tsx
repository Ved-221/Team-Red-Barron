import { createClient } from "@/lib/supabase/server";
import { addSponsorTier, deleteSponsorTier, updateSponsorTier, addSponsor, updateSponsor, deleteSponsor } from "./actions";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import Link from "next/link";
import { Trash2 } from "lucide-react";

export default async function AdminSponsorsPage(props: { searchParams: Promise<{ tier?: string }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const { data: sponsorTiers } = await supabase.from("sponsor_tiers").select("*").order("sort_order", { ascending: true });

  const selectedTierId = searchParams.tier || (sponsorTiers?.[0]?.id);

  let sponsors: any[] = [];
  if (selectedTierId) {
    const { data: s } = await supabase.from("sponsors").select("*").eq("tier_id", selectedTierId).order("sort_order", { ascending: true });
    sponsors = s || [];
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="font-sora font-bold text-3xl text-white tracking-tight">Sponsors</h1>
        <p className="text-[#ae8882] text-sm mt-2">Manage sponsor tiers and partners.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar for Tiers */}
        <div className="space-y-6">
          <div className="bg-[#12151b] border border-white/10 rounded-2xl p-4">
            <h2 className="font-sora font-bold text-lg text-white mb-4">Sponsor Tiers</h2>
            <div className="space-y-2">
              {sponsorTiers?.map(t => (
                <div key={t.id} className="flex flex-col gap-2 bg-black/50 p-2 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/sponsors?tier=${t.id}`}
                      className={`flex-1 px-2 py-1.5 rounded text-sm transition-colors ${selectedTierId === t.id ? "bg-[#de1615] text-white" : "text-white/70 hover:bg-white/5"}`}
                    >
                      {t.tier_name}
                    </Link>
                    <form action={deleteSponsorTier.bind(null, t.id)}>
                      <button type="submit" className="p-1.5 text-white/40 hover:text-red-500 rounded hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                  <form action={updateSponsorTier.bind(null, t.id)} className="flex gap-2">
                    <input type="text" name="tier_name" defaultValue={t.tier_name} className="flex-1 bg-black border border-white/10 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
                    <input type="number" name="sort_order" defaultValue={t.sort_order} className="w-16 bg-black border border-white/10 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
                    <button type="submit" className="text-xs text-[#de1615] font-semibold px-2">Save</button>
                  </form>
                </div>
              ))}
            </div>

            <form action={addSponsorTier} className="mt-6 pt-6 border-t border-white/10 space-y-3">
              <input
                type="text"
                name="tier_name"
                required
                placeholder="New Tier Name"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
              />
              <input
                type="number"
                name="sort_order"
                defaultValue={0}
                required
                placeholder="Sort Order"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
              />
              <button type="submit" className="w-full bg-white/10 hover:bg-white/20 text-white font-sora font-bold text-xs uppercase py-2 rounded-lg transition-colors">
                Add Tier
              </button>
            </form>
          </div>
        </div>

        {/* Main Content for Sponsors */}
        <div className="lg:col-span-3 space-y-8">
          {selectedTierId ? (
            <>
              <div className="bg-[#12151b] border border-white/10 rounded-2xl p-6">
                <h2 className="font-sora font-bold text-xl text-white mb-6">Sponsors</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sponsors.map(sponsor => (
                    <form encType="multipart/form-data" key={sponsor.id} action={updateSponsor.bind(null, sponsor.id)} className="glass-card p-4 rounded-xl border border-white/5 bg-black/40 flex flex-col">
                      <ImageUploadField name="logo" label="Sponsor Logo" defaultValue={sponsor.logo_url} className="mb-4" />
                      <div className="space-y-3 flex-1">
                        <input type="text" name="name" defaultValue={sponsor.name} required placeholder="Sponsor Name" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
                        <input type="url" name="website_url" defaultValue={sponsor.website_url} placeholder="Website URL" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
                        <input type="number" name="sort_order" defaultValue={sponsor.sort_order} required placeholder="Sort Order" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
                      </div>
                      <div className="mt-4 flex gap-2 pt-4 border-t border-white/5">
                        <button type="submit" className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-2 rounded-lg transition-colors">Update</button>
                        <button formAction={deleteSponsor.bind(null, sponsor.id, sponsor.logo_url)} className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  ))}
                </div>
              </div>

              <div className="bg-[#12151b] border border-white/10 rounded-2xl p-6">
                <h2 className="font-sora font-bold text-xl text-white mb-6">Add New Sponsor</h2>
                <form encType="multipart/form-data" action={addSponsor} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="hidden" name="tier_id" value={selectedTierId} />
                  <div>
                    <ImageUploadField name="logo" label="Sponsor Logo" />
                  </div>
                  <div className="space-y-3">
                    <input type="text" name="name" required placeholder="Sponsor Name" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
                    <input type="url" name="website_url" placeholder="Website URL" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
                    <input type="number" name="sort_order" defaultValue={0} required placeholder="Sort Order" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
                    <button type="submit" className="w-full bg-[#de1615] hover:bg-[#b81211] text-white font-sora font-bold text-xs uppercase tracking-wider py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(222,22,21,0.3)] mt-2">
                      Add Sponsor
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 bg-[#12151b] border border-white/10 rounded-2xl text-white/40 font-inter">
              Create or select a Sponsor Tier to manage sponsors.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
