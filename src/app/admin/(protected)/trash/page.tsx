import { createClient } from "@/lib/supabase/server";
import { restoreItem, restoreBatch, permanentlyDeleteItem, permanentlyDeleteBatch } from "./actions";
import { Trash2, RotateCcw } from "lucide-react";
import Image from "next/image";

export default async function AdminTrashPage() {
  const supabase = await createClient();

  const [
    { data: vehicles },
    { data: teamYears },
    { data: teamMembers },
    { data: galleryImages },
    { data: sponsorTiers },
    { data: sponsors },
    { data: teamPhotos },
  ] = await Promise.all([
    supabase.from("vehicles").select("*").not("deleted_at", "is", null),
    supabase.from("team_years").select("*").not("deleted_at", "is", null),
    supabase.from("team_members").select("*").not("deleted_at", "is", null),
    supabase.from("gallery_images").select("*").not("deleted_at", "is", null),
    supabase.from("sponsor_tiers").select("*").not("deleted_at", "is", null),
    supabase.from("sponsors").select("*").not("deleted_at", "is", null),
    supabase.from("team_photos").select("*").not("deleted_at", "is", null),
  ]);

  const allDeletedItems = [
    ...(vehicles || []).map(v => ({ ...v, _type: "vehicles", _label: `Vehicle: ${v.year} ${v.vehicle_name}` })),
    ...(teamYears || []).map(y => ({ ...y, _type: "team_years", _label: `Team Year: ${y.year_label}` })),
    ...(teamMembers || []).map(m => ({ ...m, _type: "team_members", _label: `Team Member: ${m.name}` })),
    ...(galleryImages || []).map(g => ({ ...g, _type: "gallery_images", _label: `Gallery Image: ${g.title || "Untitled"}` })),
    ...(sponsorTiers || []).map(t => ({ ...t, _type: "sponsor_tiers", _label: `Sponsor Tier: ${t.tier_name}` })),
    ...(sponsors || []).map(s => ({ ...s, _type: "sponsors", _label: `Sponsor: ${s.name}` })),
    ...(teamPhotos || []).map(p => ({ ...p, _type: "team_photos", _label: `Team Photo: ${p.caption || "No caption"}` })),
  ].sort((a, b) => new Date(b.deleted_at).getTime() - new Date(a.deleted_at).getTime());

  // Group by batch if there is a batch ID
  const groupedByBatch = allDeletedItems.reduce((acc, item) => {
    if (item.deleted_batch_id) {
      if (!acc[item.deleted_batch_id]) acc[item.deleted_batch_id] = [];
      acc[item.deleted_batch_id].push(item);
    } else {
      if (!acc["individual"]) acc["individual"] = [];
      acc["individual"].push(item);
    }
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="font-sora font-bold text-3xl text-white tracking-tight">Trash</h1>
        <p className="text-[#ae8882] text-sm mt-2">Restore or permanently delete removed items.</p>
      </div>

      <div className="bg-[#12151b] border border-white/10 rounded-2xl p-6 space-y-6">
        {allDeletedItems.length === 0 ? (
          <div className="text-white/40 text-sm font-inter text-center py-10">
            Trash is empty.
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByBatch).map(([batchId, items]) => {
              if (batchId === "individual") {
                return (items as any[]).map((item: any) => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
                    <div className="flex items-center gap-4">
                      {(item.image_url || item.logo_url) && (
                        <div className="relative w-16 h-12 rounded bg-black">
                          <Image src={item.image_url || item.logo_url} alt="Thumbnail" fill unoptimized className="object-contain" />
                        </div>
                      )}
                      <div>
                        <p className="font-sora font-semibold text-white text-sm">{item._label}</p>
                        <p className="font-mono-tech text-[#ae8882] text-xs">Deleted At: {new Date(item.deleted_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <form action={restoreItem.bind(null, item._type, item.id)}>
                        <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors">
                          <RotateCcw className="w-3.5 h-3.5" /> Restore
                        </button>
                      </form>
                      <form action={permanentlyDeleteItem.bind(null, item._type, item.id, item.image_url || item.logo_url)}>
                        <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-semibold transition-colors border border-red-500/30">
                          <Trash2 className="w-3.5 h-3.5" /> Delete Forever
                        </button>
                      </form>
                    </div>
                  </div>
                ));
              }

              // Batched items
              return (
                <div key={batchId} className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <p className="font-sora font-semibold text-white text-sm">Grouped Deletion</p>
                      <p className="font-mono-tech text-[#ae8882] text-xs">{(items as any[]).length} items</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <form action={restoreBatch.bind(null, batchId)}>
                        <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors">
                          <RotateCcw className="w-3.5 h-3.5" /> Restore All
                        </button>
                      </form>
                      <form action={permanentlyDeleteBatch.bind(null, batchId)}>
                        <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-semibold transition-colors border border-red-500/30">
                          <Trash2 className="w-3.5 h-3.5" /> Delete All Forever
                        </button>
                      </form>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {(items as any[]).map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4 text-xs font-inter text-white/70">
                        <span className="w-2 h-2 rounded-full bg-[#de1615]" />
                        {item._label}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
