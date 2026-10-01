import { createClient } from "@/lib/supabase/server";
import { updateAboutContent } from "./actions";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SubmitButton } from "@/components/admin/SubmitButton";

export default async function AdminAboutPage() {
  const supabase = await createClient();
  const { data: about } = await supabase.from("about_content").select("*").eq("id", 1).single();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="font-sora font-bold text-3xl text-white tracking-tight">About Page Content</h1>
        <p className="text-[#ae8882] text-sm mt-2">Manage the main text, vision, mission, and the team photo.</p>
      </div>

      <form action={updateAboutContent} className="space-y-8 glass-card p-8 rounded-2xl border border-white/10 relative overflow-hidden bg-[#12151b]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
                Intro Headline
              </label>
              <input
                key={about?.intro_headline || "intro_headline"}
                type="text"
                name="intro_headline"
                defaultValue={about?.intro_headline}
                required
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
              />
            </div>
            <div>
              <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
                Intro Summary
              </label>
              <textarea
                key={about?.intro_summary?.slice(0, 10) || "intro_summary"}
                name="intro_summary"
                defaultValue={about?.intro_summary}
                required
                rows={4}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter resize-none"
              />
            </div>
          </div>
          <div>
            <ImageUploadField
              key={about?.team_photo_url || "team_photo_url"}
              name="team_photo"
              label="Team Photo"
              defaultValue={about?.team_photo_url}
            />
            <div className="mt-4">
              <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
                Photo Caption
              </label>
              <input
                key={about?.team_photo_caption || "team_photo_caption"}
                type="text"
                name="team_photo_caption"
                defaultValue={about?.team_photo_caption}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
              />
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10">
          <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
            Main Body Text
          </label>
          <textarea
            key={about?.main_body_text?.slice(0, 10) || "main_body_text"}
            name="main_body_text"
            defaultValue={about?.main_body_text}
            required
            rows={5}
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
          <div>
            <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
              Vision Text
            </label>
            <textarea
              key={about?.vision_text?.slice(0, 10) || "vision_text"}
              name="vision_text"
              defaultValue={about?.vision_text}
              required
              rows={5}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
              Mission Text
            </label>
            <textarea
              key={about?.mission_text?.slice(0, 10) || "mission_text"}
              name="mission_text"
              defaultValue={about?.mission_text}
              required
              rows={5}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter resize-none"
            />
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 space-y-8">
          <h2 className="font-sora font-bold text-lg text-white mb-6">Statistic Cards</h2>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border border-white/5 bg-black/20">
              <div>
                <label className="block text-[10px] font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
                  Card {i + 1} Value
                </label>
                <input
                  key={about?.stats_cards?.[i]?.value || `stat${i + 1}_value`}
                  type="text"
                  name={`stat${i + 1}_value`}
                  defaultValue={about?.stats_cards?.[i]?.value || ""}
                  placeholder="e.g. 14+"
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
                  Card {i + 1} Label
                </label>
                <input
                  key={about?.stats_cards?.[i]?.label || `stat${i + 1}_label`}
                  type="text"
                  name={`stat${i + 1}_label`}
                  defaultValue={about?.stats_cards?.[i]?.label || ""}
                  placeholder="e.g. Years Active"
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
                  Card {i + 1} Subnote
                </label>
                <input
                  key={about?.stats_cards?.[i]?.note || `stat${i + 1}_note`}
                  type="text"
                  name={`stat${i + 1}_note`}
                  defaultValue={about?.stats_cards?.[i]?.note || ""}
                  placeholder="e.g. Estd. In 2011"
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
