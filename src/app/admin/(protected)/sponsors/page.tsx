import { createClient } from "@/lib/supabase/server";
import {
  addSponsorTier,
  deleteSponsorTier,
  updateSponsorTier,
  addSponsor,
  updateSponsor,
  deleteSponsor,
  updateSponsorHeroBg,
  addSponsorTestimonial,
  updateSponsorTestimonial,
  deleteSponsorTestimonial
} from "./actions";
import { getTestimonials } from "@/lib/testimonials";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import Link from "next/link";
import { Trash2, Sparkles, Quote, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSponsorsPage(props: { searchParams: Promise<{ tier?: string }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const { data: sponsorTiers } = await supabase
    .from("sponsor_tiers")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  const { data: siteSettings } = await supabase
    .from("site_settings")
    .select("sponsors_bg_url")
    .eq("id", 1)
    .single();

  const testimonials = await getTestimonials();

  const selectedTierId = searchParams.tier || (sponsorTiers?.[0]?.id);

  let sponsors: any[] = [];
  if (selectedTierId) {
    const { data: s } = await supabase
      .from("sponsors")
      .select("*")
      .is("deleted_at", null)
      .eq("tier_id", selectedTierId)
      .order("sort_order", { ascending: true });
    sponsors = s || [];
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="font-sora font-bold text-3xl text-white tracking-tight">Sponsors</h1>
        <p className="text-[#ae8882] text-sm mt-2">Manage sponsor tiers, partners, testimonials, and the public page hero background.</p>
      </div>

      {/* Sponsor Hero Background Management */}
      <div className="bg-[#12151b] border border-white/10 rounded-2xl p-6 glass-card">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-[#de1615]" />
          <h2 className="font-sora font-bold text-lg text-white">Sponsor Page Hero Background</h2>
        </div>
        <p className="text-xs text-[#ae8882] mb-6">
          Change the full-width high-resolution background wallpaper displayed in the hero section of the public /sponsors page.
        </p>
        <form action={updateSponsorHeroBg} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <ImageUploadField
            name="hero_bg"
            label="Sponsors Hero Wallpaper"
            defaultValue={siteSettings?.sponsors_bg_url || "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/hero/IMG_4588.png"}
          />
          <div>
            <button
              type="submit"
              className="w-full bg-[#de1615] hover:bg-[#b81211] text-white font-sora font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(222,22,21,0.3)]"
            >
              Update Hero Background
            </button>
          </div>
        </form>
      </div>

      {/* Sponsor Testimonials Management */}
      <div className="bg-[#12151b] border border-white/10 rounded-2xl p-6 glass-card space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Quote className="w-5 h-5 text-[#de1615]" />
            <div>
              <h2 className="font-sora font-bold text-lg text-white">Sponsor Testimonials</h2>
              <p className="text-xs text-[#ae8882] mt-0.5">Manage executive statements, quotes, and sponsor website links displayed on the public page.</p>
            </div>
          </div>
          <span className="font-mono-tech text-xs text-[#ae8882] bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase">
            {testimonials.length} Testimonials
          </span>
        </div>

        {/* Existing Testimonials List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <form key={t.id} action={updateSponsorTestimonial.bind(null, t.id)} className="glass-card p-4 rounded-xl border border-white/5 bg-black/40 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono-tech text-[10px] text-[#ff6534] bg-[#ff6534]/10 border border-[#ff6534]/20 px-2 py-0.5 rounded font-semibold uppercase truncate max-w-[180px]">
                    {t.company}
                  </span>
                  <button
                    formAction={deleteSponsorTestimonial.bind(null, t.id)}
                    className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors cursor-pointer"
                    title="Delete Testimonial"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-mono-tech text-white/50 block mb-1">Company / Organization *</label>
                    <input
                      type="text"
                      name="company"
                      defaultValue={t.company}
                      required
                      placeholder="e.g. Varroc Engineering"
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono-tech text-white/50 block mb-1">Speaker Name & Title *</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={t.name}
                      required
                      placeholder="e.g. Senior Engineering Director"
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono-tech text-white/50 block mb-1">Sponsor Tier / Label</label>
                    <input
                      type="text"
                      name="tier"
                      defaultValue={t.tier}
                      placeholder="e.g. Title Sponsor Partner"
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono-tech text-white/50 block mb-1">Sponsor Link (Leave blank if none)</label>
                    <input
                      type="url"
                      name="website_url"
                      defaultValue={t.website_url || ""}
                      placeholder="https://example.com"
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono-tech text-white/50 block mb-1">Quote Statement *</label>
                    <textarea
                      name="quote"
                      defaultValue={t.quote}
                      required
                      rows={3}
                      placeholder="Testimonial quote text..."
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-[#de1615]/50 transition-all font-inter resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono-tech text-white/50 block mb-1">Sort Order</label>
                    <input
                      type="number"
                      name="sort_order"
                      defaultValue={t.sort_order ?? 0}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-2 rounded-lg transition-colors mt-2"
              >
                Save Changes
              </button>
            </form>
          ))}
        </div>

        {/* Add New Testimonial Form */}
        <div className="bg-black/40 border border-white/10 rounded-xl p-5 mt-4">
          <h3 className="font-sora font-bold text-sm text-white mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#de1615]" /> Add New Sponsor Testimonial
          </h3>
          <form action={addSponsorTestimonial} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-[10px] font-mono-tech text-white/60 block mb-1">Company / Sponsor Name *</label>
              <input
                type="text"
                name="company"
                required
                placeholder="e.g. Varroc Engineering Limited"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono-tech text-white/60 block mb-1">Speaker Name & Designation *</label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Senior Engineering Director"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono-tech text-white/60 block mb-1">Partnership Tier / Role</label>
              <input
                type="text"
                name="tier"
                placeholder="e.g. Title Sponsor Partner"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="text-[10px] font-mono-tech text-white/60 block mb-1">Sponsor Website Link (Leave blank if adding later)</label>
              <input
                type="url"
                name="website_url"
                placeholder="https://example.com"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono-tech text-white/60 block mb-1">Display Sort Order</label>
              <input
                type="number"
                name="sort_order"
                defaultValue={testimonials.length}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className="text-[10px] font-mono-tech text-white/60 block mb-1">Testimonial Quote *</label>
              <textarea
                name="quote"
                required
                rows={2}
                placeholder="Enter what the sponsor or partner says about Team Red Baron..."
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#de1615]/50 transition-all font-inter resize-none"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <button
                type="submit"
                className="w-full bg-[#de1615] hover:bg-[#b81211] text-white font-sora font-bold text-xs uppercase tracking-wider py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(222,22,21,0.3)] cursor-pointer"
              >
                Add Sponsor Testimonial
              </button>
            </div>
          </form>
        </div>
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
                    <form key={sponsor.id} action={updateSponsor.bind(null, sponsor.id)} className="glass-card p-4 rounded-xl border border-white/5 bg-black/40 flex flex-col">
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
                <form action={addSponsor} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
