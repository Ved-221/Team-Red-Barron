import { createClient } from "@/lib/supabase/server";
import { addVehicle, updateVehicle } from "../actions";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SpecsManager from "./SpecsManager";
import { notFound } from "next/navigation";

export default async function AdminTimelineFormPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const isNew = params.id === "new";
  const supabase = await createClient();
  let vehicle: any = null;
  let specs: any[] = [];

  if (!isNew) {
    const { data: v } = await supabase.from("vehicles").select("*").eq("id", params.id).single();
    if (!v) notFound();
    vehicle = v;

    const { data: s } = await supabase.from("vehicle_specs").select("*").eq("vehicle_id", params.id).order("sort_order", { ascending: true });
    specs = s || [];
  }

  const ICONS = ["Flag", "Cpu", "Trophy", "ShieldCheck", "Zap", "Sparkles"];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex items-center gap-4">
        <Link href="/admin/timeline" className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-sora font-bold text-3xl text-white tracking-tight">{isNew ? "Add Vehicle" : "Edit Vehicle"}</h1>
        </div>
      </div>

      <form encType="multipart/form-data" action={isNew ? addVehicle : updateVehicle.bind(null, params.id)} className="space-y-8 glass-card p-8 rounded-2xl border border-white/10 relative overflow-hidden bg-[#12151b]">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">Year</label>
            <input type="text" name="year" defaultValue={vehicle?.year} required placeholder="e.g. 2026" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
          </div>
          <div>
            <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">Era Label</label>
            <input type="text" name="era_label" defaultValue={vehicle?.era_label || "MODERN ERA"} required placeholder="e.g. MODERN ERA" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
          </div>
          <div>
            <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">Vehicle Name</label>
            <input type="text" name="vehicle_name" defaultValue={vehicle?.vehicle_name} required placeholder="e.g. Albatros XIV" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">Chassis Serial (Optional)</label>
            <input type="text" name="chassis_serial" defaultValue={vehicle?.chassis_serial} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
          </div>
          <div>
            <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">Timeline Order</label>
            <input type="number" name="timeline_order" defaultValue={vehicle?.timeline_order || 0} required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">Subtitle</label>
            <input type="text" name="subtitle" defaultValue={vehicle?.subtitle} required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
          </div>
          <div>
            <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">Rank Text</label>
            <input type="text" name="rank_text" defaultValue={vehicle?.rank_text} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">Badge Text</label>
            <input type="text" name="badge_text" defaultValue={vehicle?.badge_text} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
          </div>
          <div>
            <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">Icon</label>
            <select name="icon_key" defaultValue={vehicle?.icon_key || "Trophy"} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter">
              {ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">Description</label>
          <textarea name="description" defaultValue={vehicle?.description} required rows={3} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter resize-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/10">
          <div>
            <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">Status Badge (Flagship Only)</label>
            <input type="text" name="status_badge" defaultValue={vehicle?.status_badge} placeholder="e.g. RACE READY" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
          </div>
          <div>
            <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">Background Video URL (Flagship Only)</label>
            <input type="text" name="background_video_url" defaultValue={vehicle?.background_video_url} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter" />
          </div>
        </div>

        <div className="pt-6 border-t border-white/10">
          <ImageUploadField name="image" label="Vehicle Image" defaultValue={vehicle?.image_url} />
        </div>

        <div className="pt-8 border-t border-white/10 flex justify-end">
          <button type="submit" className="bg-[#de1615] hover:bg-[#b81211] text-white font-sora font-bold text-sm uppercase tracking-wider px-8 py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(222,22,21,0.3)]">
            {isNew ? "Create Vehicle" : "Save Changes"}
          </button>
        </div>
      </form>

      {!isNew && (
        <SpecsManager vehicleId={params.id} initialSpecs={specs} />
      )}
    </div>
  );
}
