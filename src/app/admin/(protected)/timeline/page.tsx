import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { deleteVehicle } from "./actions";

export default async function AdminTimelinePage() {
  const supabase = await createClient();
  const { data: vehicles } = await supabase.from("vehicles").select("*").order("timeline_order", { ascending: true });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sora font-bold text-3xl text-white tracking-tight">Vehicle Timeline</h1>
          <p className="text-[#ae8882] text-sm mt-2">Manage the vehicles displayed in the timeline.</p>
        </div>
        <Link href="/admin/timeline/new" className="bg-[#de1615] hover:bg-[#b81211] text-white flex items-center gap-2 px-5 py-2.5 rounded-lg font-sora font-bold text-sm uppercase transition-colors shadow-[0_0_15px_rgba(222,22,21,0.3)]">
          <Plus className="w-4 h-4" />
          Add Vehicle
        </Link>
      </div>

      <div className="bg-[#12151b] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 bg-black/50">
              <th className="p-4 text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider">Order</th>
              <th className="p-4 text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider">Year</th>
              <th className="p-4 text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider">Vehicle Name</th>
              <th className="p-4 text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider">Rank</th>
              <th className="p-4 text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {vehicles?.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-mono-tech text-sm text-white/70">{vehicle.timeline_order}</td>
                <td className="p-4 font-inter text-sm text-white font-semibold">{vehicle.year}</td>
                <td className="p-4 font-inter text-sm text-white">{vehicle.vehicle_name}</td>
                <td className="p-4 font-inter text-sm text-white/70">{vehicle.rank_text}</td>
                <td className="p-4 flex items-center justify-end gap-3">
                  <Link href={`/admin/timeline/${vehicle.id}`} className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10">
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <form action={deleteVehicle.bind(null, vehicle.id, vehicle.image_url)}>
                    <button type="submit" className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors border border-red-500/30">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {(!vehicles || vehicles.length === 0) && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-white/40 text-sm font-inter">
                  No vehicles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
