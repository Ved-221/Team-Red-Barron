import { createClient } from "@/lib/supabase/server";
import {
  updateHomeSettings,
  addAchievement,
  updateAchievement,
  deleteAchievementAction,
} from "./actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { getAchievements } from "@/lib/achievements";
import {
  Trophy,
  Award,
  History,
  Car,
  ShieldCheck,
  Zap,
  Flame,
  Gauge,
  Medal,
  Crown,
  Flag,
  Target,
  Star,
  Trash2,
  Plus,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

const ICON_OPTIONS = [
  { value: "Trophy", label: "Trophy" },
  { value: "Award", label: "Award / Ribbon" },
  { value: "Car", label: "Car / ATV Build" },
  { value: "ShieldCheck", label: "Shield / Statics" },
  { value: "Zap", label: "Lightning / 4WD / Electric" },
  { value: "History", label: "History / Legacy" },
  { value: "Flame", label: "Flame / High Performance" },
  { value: "Gauge", label: "Gauge / Speed & Dynamics" },
  { value: "Medal", label: "Medal" },
  { value: "Crown", label: "Crown / 1st Place" },
  { value: "Flag", label: "Racing Flag" },
  { value: "Target", label: "Target / Precision" },
  { value: "Star", label: "Star / Special Honor" },
];

const ICON_COMPONENTS: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Award,
  History,
  Car,
  ShieldCheck,
  Zap,
  Flame,
  Gauge,
  Medal,
  Crown,
  Flag,
  Target,
  Star,
};

function getIcon(name?: string) {
  if (!name) return Trophy;
  return ICON_COMPONENTS[name] || Trophy;
}

export default async function AdminHomePage() {
  const supabase = await createClient();

  const [{ data: settings }, { data: vehicles }, achievements] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).single(),
    supabase
      .from("vehicles")
      .select("id, vehicle_name, year")
      .is("deleted_at", null)
      .order("year", { ascending: false }),
    getAchievements(),
  ]);

  const activeVehicles = vehicles || [];

  const selectedVehicleId = activeVehicles.some((v) => v.id === settings?.flagship_vehicle_id)
    ? settings?.flagship_vehicle_id
    : activeVehicles[0]?.id || "";

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-16">
      <div>
        <h1 className="font-sora font-bold text-3xl text-white tracking-tight">Home Settings</h1>
        <p className="text-[#ae8882] text-sm mt-2">
          Manage the hero tagline, homepage stats ticker cards, and flagship vehicle spotlight.
        </p>
      </div>

      {/* Hero & Flagship Vehicle Settings */}
      <form
        action={updateHomeSettings}
        className="space-y-6 glass-card p-6 md:p-8 rounded-2xl border border-white/10 relative overflow-hidden bg-[#12151b]"
      >
        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          <Sparkles className="w-5 h-5 text-[#de1615]" />
          <h2 className="font-sora font-bold text-lg text-white">Hero & Spotlight Configuration</h2>
        </div>

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
            key={selectedVehicleId || "none"}
            name="flagship_vehicle_id"
            defaultValue={selectedVehicleId}
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
          >
            <option value="" disabled>
              Select a vehicle
            </option>
            {activeVehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.year} — {v.vehicle_name}
              </option>
            ))}
          </select>
          <p className="text-xs text-white/40 mt-2">
            The selected vehicle will be displayed in the Vehicle Spotlight section.
          </p>
        </div>

        <div className="pt-2">
          <SubmitButton />
        </div>
      </form>

      {/* Homepage Achievements & Stats Ticker Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="font-sora font-bold text-2xl text-white">
              Stats & Achievements Ticker Cards
            </h2>
            <p className="text-[#ae8882] text-xs font-mono-tech uppercase tracking-wider mt-1">
              Live marquee cards below hero section ({achievements.length} active)
            </p>
          </div>
        </div>

        {/* Existing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <form
                key={item.id}
                action={updateAchievement.bind(null, item.id)}
                className="glass-card p-5 rounded-2xl border border-white/10 bg-[#12151b] flex flex-col justify-between space-y-4 hover:border-[#de1615]/50 transition-colors"
              >
                {/* Live Card Mini-Preview */}
                <div className="bg-black/60 border border-white/10 rounded-xl p-3.5 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#de1615]/20 border border-[#de1615]/40 flex items-center justify-center text-[#de1615] shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-sora font-extrabold text-lg text-white leading-tight truncate">
                      {item.value}
                    </div>
                    <div className="font-mono-tech text-[11px] text-[#e8bdb6] tracking-wider uppercase font-semibold truncate">
                      {item.label}
                    </div>
                    {item.detail && (
                      <div className="text-[10px] text-white/40 truncate font-inter">
                        {item.detail}
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-xs text-white/40 border border-white/10 px-2 py-0.5 rounded">
                    #{item.sort_order}
                  </span>
                </div>

                {/* Edit Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-1">
                      Main Value (e.g. 14 ATVs, 1ST RANK, AIR 1)
                    </label>
                    <input
                      type="text"
                      name="value"
                      defaultValue={item.value}
                      required
                      placeholder="e.g. 14 ATVs"
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-sora font-bold focus:outline-none focus:border-[#de1615]/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-1">
                      Label / Competition (e.g. VEHICLES BUILT, E-BAJA INDIA 2025)
                    </label>
                    <input
                      type="text"
                      name="label"
                      defaultValue={item.label}
                      required
                      placeholder="e.g. VEHICLES BUILT"
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-1">
                      Detail / Description (optional)
                    </label>
                    <input
                      type="text"
                      name="detail"
                      defaultValue={item.detail || ""}
                      placeholder="e.g. Albatros 1.0 to XIV"
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-1">
                        Icon
                      </label>
                      <select
                        name="icon"
                        defaultValue={item.icon || "Trophy"}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
                      >
                        {ICON_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-[#12151b] text-white">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-1">
                        Order
                      </label>
                      <input
                        type="number"
                        name="sort_order"
                        defaultValue={item.sort_order}
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-2 text-white text-xs font-mono focus:outline-none focus:border-[#de1615]/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t border-white/5">
                  <button
                    type="submit"
                    className="flex-1 bg-white/10 hover:bg-[#de1615] text-white text-xs font-semibold py-2 rounded-lg transition-colors font-sora"
                  >
                    Save Changes
                  </button>
                  <button
                    formAction={deleteAchievementAction.bind(null, item.id)}
                    title="Delete card"
                    className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </form>
            );
          })}
        </div>

        {/* Add New Achievement Card Form */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 bg-[#12151b] space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Plus className="w-4 h-4 text-[#de1615]" />
            <h3 className="font-sora font-bold text-lg text-white">Add New Achievement Card</h3>
          </div>

          <form action={addAchievement} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-1">
                Main Value (Bold) *
              </label>
              <input
                type="text"
                name="value"
                required
                placeholder="e.g. 15 YEARS, 1ST RANK, AIR 1"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-sora font-bold focus:outline-none focus:border-[#de1615]/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-1">
                Label / Subtitle *
              </label>
              <input
                type="text"
                name="label"
                required
                placeholder="e.g. VEHICLES BUILT, E-BAJA INDIA"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-1">
                Detail (Optional)
              </label>
              <input
                type="text"
                name="detail"
                placeholder="e.g. Overall National Rank, Statics"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-1">
                  Icon
                </label>
                <select
                  name="icon"
                  defaultValue="Trophy"
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#12151b] text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  name="sort_order"
                  defaultValue={achievements.length + 1}
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-[#de1615]/50 transition-all"
                />
              </div>
            </div>

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full bg-[#de1615] hover:bg-[#b81211] text-white font-sora font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(222,22,21,0.3)] flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Achievement Card
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
