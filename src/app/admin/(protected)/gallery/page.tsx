import { createClient } from "@/lib/supabase/server";
import { addGalleryImage, updateGalleryImage, deleteGalleryImage } from "./actions";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Trash2 } from "lucide-react";

export default async function AdminGalleryPage() {
  const supabase = await createClient();
  const { data: images } = await supabase.from("gallery_images").select("*").order("sort_order", { ascending: true });

  const CATEGORIES = ["ALL", "COMPETITION", "WORKSHOP", "VEHICLE", "EVENTS"];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="font-sora font-bold text-3xl text-white tracking-tight">Full Gallery</h1>
        <p className="text-[#ae8882] text-sm mt-2">Manage photos displayed on the dedicated Gallery page.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images?.map(image => (
          <form encType="multipart/form-data" key={image.id} action={updateGalleryImage.bind(null, image.id)} className="glass-card p-6 rounded-2xl border border-white/10 bg-[#12151b] flex flex-col">
            <ImageUploadField name="image" defaultValue={image.image_url} />
            <div className="mt-4 space-y-4 flex-1">
              <div>
                <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={image.title || ""}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#de1615]/50 transition-all text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">Category</label>
                  <select name="category" defaultValue={image.category || "ALL"} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#de1615]/50 transition-all text-sm">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">Sort Order</label>
                  <input
                    type="number"
                    name="sort_order"
                    defaultValue={image.sort_order}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#de1615]/50 transition-all text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3 pt-4 border-t border-white/10">
              <button type="submit" className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold py-2 rounded-lg transition-colors">
                Update
              </button>
              <button formAction={deleteGalleryImage.bind(null, image.id, image.image_url)} className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors border border-red-500/30">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </form>
        ))}
      </div>

      <div className="pt-8 mt-8 border-t border-white/10">
        <h2 className="font-sora font-bold text-xl text-white mb-6">Add New Image</h2>
        <form encType="multipart/form-data" action={addGalleryImage} className="glass-card p-6 rounded-2xl border border-white/10 bg-[#12151b] max-w-md">
          <ImageUploadField name="image" />
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">Title</label>
              <input
                type="text"
                name="title"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#de1615]/50 transition-all text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">Category</label>
                <select name="category" defaultValue="ALL" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#de1615]/50 transition-all text-sm">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
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
          </div>
          <button type="submit" className="mt-6 w-full bg-[#de1615] hover:bg-[#b81211] text-white font-sora font-bold text-sm uppercase tracking-wider py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(222,22,21,0.3)]">
            Add Image
          </button>
        </form>
      </div>
    </div>
  );
}
