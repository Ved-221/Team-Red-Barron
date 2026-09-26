import { createClient } from "@/lib/supabase/server";
import { updateContactInfo } from "./actions";
import { SubmitButton } from "@/components/admin/SubmitButton";

export default async function AdminContactPage() {
  const supabase = await createClient();
  const { data: contact } = await supabase.from("contact_info").select("*").eq("id", 1).single();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="font-sora font-bold text-3xl text-white tracking-tight">Contact Info</h1>
        <p className="text-[#ae8882] text-sm mt-2">Manage email, address, and social media links displayed in the footer and contact page.</p>
      </div>

      <form action={updateContactInfo} className="space-y-8 glass-card p-8 rounded-2xl border border-white/10 relative overflow-hidden bg-[#12151b]">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              key={contact?.email || "email"}
              type="email"
              name="email"
              defaultValue={contact?.email}
              required
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
            />
          </div>
          <div>
            <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
              Physical Address
            </label>
            <textarea
              key={contact?.address?.slice(0, 10) || "address"}
              name="address"
              defaultValue={contact?.address}
              required
              rows={3}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter resize-none"
            />
          </div>
        </div>

        <div className="pt-8 border-t border-white/10">
          <h2 className="font-sora font-bold text-lg text-white mb-6">Team Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
                  Managing Director Name
                </label>
                <input
                  key={contact?.managing_director_name || "managing_director_name"}
                  type="text"
                  name="managing_director_name"
                  defaultValue={contact?.managing_director_name}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
                />
              </div>
              <div>
                <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
                  Managing Director Email
                </label>
                <input
                  key={contact?.managing_director_email || "managing_director_email"}
                  type="email"
                  name="managing_director_email"
                  defaultValue={contact?.managing_director_email}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
                  Marketing Director Name
                </label>
                <input
                  key={contact?.marketing_director_name || "marketing_director_name"}
                  type="text"
                  name="marketing_director_name"
                  defaultValue={contact?.marketing_director_name}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
                />
              </div>
              <div>
                <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
                  Marketing Director Email
                </label>
                <input
                  key={contact?.marketing_director_email || "marketing_director_email"}
                  type="email"
                  name="marketing_director_email"
                  defaultValue={contact?.marketing_director_email}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10">
          <h2 className="font-sora font-bold text-lg text-white mb-6">Social Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
                Instagram URL
              </label>
              <input
                key={contact?.instagram_url || "instagram_url"}
                type="url"
                name="instagram_url"
                defaultValue={contact?.instagram_url}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
              />
            </div>
            <div>
              <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
                LinkedIn URL
              </label>
              <input
                key={contact?.linkedin_url || "linkedin_url"}
                type="url"
                name="linkedin_url"
                defaultValue={contact?.linkedin_url}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
              />
            </div>
            <div>
              <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
                YouTube URL
              </label>
              <input
                key={contact?.youtube_url || "youtube_url"}
                type="url"
                name="youtube_url"
                defaultValue={contact?.youtube_url}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
              />
            </div>
            <div>
              <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
                Twitter/X URL
              </label>
              <input
                key={contact?.twitter_url || "twitter_url"}
                type="url"
                name="twitter_url"
                defaultValue={contact?.twitter_url}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 transition-all font-inter"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
