import { createClient } from "@/lib/supabase/server";
import { addTeamPhoto, deleteTeamPhoto, updateTeamPhoto } from "./actions";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Trash2 } from "lucide-react";

export default async function OffTheMapPage() {
  const supabase = await createClient();
  const { data: photos } = await supabase.from("team_photos").select("*").order("sort_order", { ascending: true });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="font-sora font-bold text-3xl text-white tracking-tight">Off The Map Photos</h1>
        <p className="text-[#ae8882] text-sm mt-2">Manage the 6 team photos displayed in the morph slider on the homepage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos?.map(photo => (
          <form key={photo.id} action={updateTeamPhoto.bind(null, photo.id)} className="glass-card p-6 rounded-2xl border border-white/10 bg-[#12151b] flex flex-col">
            <ImageUploadField name="image" defaultValue={photo.image_url} />
            <div className="mt-4 space-y-4 flex-1">
              <div>
                <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">Caption</label>
                <input
                  type="text"
                  name="caption"
                  defaultValue={photo.caption || ""}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#de1615]/50 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">Sort Order</label>
                <input
                  type="number"
                  name="sort_order"
                  defaultValue={photo.sort_order}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#de1615]/50 transition-all text-sm"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3 pt-4 border-t border-white/10">
              <button type="submit" className="flex-1 bg-[#de1615]/20 hover:bg-[#de1615] text-[#de1615] hover:text-white border border-[#de1615]/50 text-sm font-semibold py-2 rounded-lg transition-colors">
                Update
              </button>
              <button formAction={deleteTeamPhoto.bind(null, photo.id, photo.image_url)} className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors border border-red-500/30">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </form>
        ))}
      </div>

      <div className="pt-8 mt-8 border-t border-white/10">
        <h2 className="font-sora font-bold text-xl text-white mb-6">Add New Photo</h2>
        <form action={addTeamPhoto} className="glass-card p-6 rounded-2xl border border-white/10 bg-[#12151b] max-w-md">
          <ImageUploadField name="image" />
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">Caption</label>
              <input
                type="text"
                name="caption"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#de1615]/50 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">Sort Order</label>
              <input
                type="number"
                name="sort_order"
                defaultValue={0}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#de1615]/50 transition-all text-sm"
              />
            </div>
          </div>
          <button type="submit" className="mt-6 w-full bg-[#de1615] hover:bg-[#b81211] text-white font-sora font-bold text-sm uppercase tracking-wider py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(222,22,21,0.3)]">
            Add Photo
          </button>
        </form>
      </div>
    </div>
  );
}
