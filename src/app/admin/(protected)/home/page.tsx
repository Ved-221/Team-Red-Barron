import { createClient } from "@/lib/supabase/server";
import { updateHomeSettings } from "./actions";
import { SubmitButton } from "@/components/admin/SubmitButton";

export default async function AdminHomePage() {
  const supabase = await createClient();
  
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  const { data: vehicles } = await supabase.from("vehicles").select("id, vehicle_name, year").order("year", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-sora font-bold text-3xl text-white tracking-tight">Home Settings</h1>
        <p className="text-[#ae8882] text-sm mt-2">Manage the hero tagline and flagship vehicle.</p>
      </div>

      <form action={updateHomeSettings} className="space-y-8 glass-card p-8 rounded-2xl border border-white/10 relative overflow-hidden bg-[#12151b]">
        
        <div>
          <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
            Hero Tagline
          </label>
          <input
            key={settings?.hero_tagline || "empty"}
            type="text"
            name="hero_tagline"
            defaultValue={settings?.hero_tagline}
            required
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
          />
          <p className="text-xs text-white/40 mt-2">Displayed in the Hero section of the homepage.</p>
        </div>

        <div>
          <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
            Flagship Vehicle
          </label>
          <select
            key={settings?.flagship_vehicle_id || "none"}
            name="flagship_vehicle_id"
            defaultValue={settings?.flagship_vehicle_id || ""}
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
          >
            <option value="" disabled>Select a vehicle</option>
            {vehicles?.map(v => (
              <option key={v.id} value={v.id}>
                {v.year} — {v.vehicle_name}
              </option>
            ))}
          </select>
          <p className="text-xs text-white/40 mt-2">The selected vehicle will be displayed in the Vehicle Spotlight section.</p>
        </div>

        <div className="pt-4 border-t border-white/10">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
