import { ReactNode } from "react";
import Link from "next/link";
import { LogOut, Home, Users, Image as ImageIcon, Briefcase, Phone, Anchor, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0c0e] text-[#e2e2e2] flex font-inter">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#12151b] flex flex-col hidden md:flex">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="font-sora font-bold text-white tracking-wider">TRB Admin</h2>
            <p className="text-xs text-[#ae8882] mt-1">{user.email}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <Link href="/admin/home" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">
            <Home className="w-4 h-4 text-[#de1615]" />
            Home (Hero & Spotlight)
          </Link>
          <Link href="/admin/off-the-map" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">
            <ImageIcon className="w-4 h-4 text-[#ff6534]" />
            Off The Map Photos
          </Link>
          <Link href="/admin/about" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">
            <Anchor className="w-4 h-4 text-[#de1615]" />
            About Page
          </Link>
          <Link href="/admin/timeline" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">
            <Home className="w-4 h-4 text-[#ff6534]" />
            Vehicle Timeline
          </Link>
          <Link href="/admin/team" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">
            <Users className="w-4 h-4 text-[#de1615]" />
            Team Members
          </Link>
          <Link href="/admin/gallery" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">
            <ImageIcon className="w-4 h-4 text-[#ff6534]" />
            Full Gallery
          </Link>
          <Link href="/admin/sponsors" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">
            <Briefcase className="w-4 h-4 text-[#de1615]" />
            Sponsors
          </Link>
          <Link href="/admin/contact" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">
            <Phone className="w-4 h-4 text-[#ff6534]" />
            Contact Info
          </Link>
          <Link href="/admin/trash" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-4">
            <Trash2 className="w-4 h-4" />
            Recently Deleted
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <form action="/auth/signout" method="post">
            <button type="submit" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#de1615]/20 text-[#de1615] transition-colors text-sm font-medium w-full text-left">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-white/10 bg-[#12151b] flex items-center px-6 md:hidden">
          <h2 className="font-sora font-bold text-white tracking-wider">TRB Admin</h2>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
