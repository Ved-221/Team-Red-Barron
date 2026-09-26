"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin/home");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card p-8 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(222,22,21,0.3),transparent_70%)] pointer-events-none" />
        
        <div className="text-center mb-8 relative z-10">
          <h1 className="font-sora font-extrabold text-3xl text-white tracking-tight uppercase">
            TRB <span className="text-[#de1615]">Admin</span>
          </h1>
          <p className="font-mono-tech text-xs text-[#ae8882] tracking-widest mt-2 uppercase">
            Restricted Access
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
          {error && (
            <div className="bg-[#de1615]/20 border border-[#de1615]/50 text-[#ff8f8f] text-sm p-3 rounded-lg">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#12151b] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 focus:ring-1 focus:ring-[#de1615]/50 transition-all font-inter"
              placeholder="admin@teamredbaron.com"
            />
          </div>

          <div>
            <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#12151b] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#de1615]/50 focus:ring-1 focus:ring-[#de1615]/50 transition-all font-inter"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#de1615] hover:bg-[#b81211] text-white font-sora font-bold text-sm uppercase tracking-wider py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-[0_0_15px_rgba(222,22,21,0.3)] hover:shadow-[0_0_25px_rgba(222,22,21,0.5)]"
          >
            {loading ? "Authenticating..." : "Login to CMS"}
          </button>
        </form>
      </div>
    </div>
  );
}
