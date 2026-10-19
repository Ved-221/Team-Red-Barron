import React from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { updateSupportSettings } from "./actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { QrCode, FileText, ExternalLink, Upload, Landmark, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSupportPage() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("site_settings")
    .select("upi_id, qr_code_url, brochure_url")
    .eq("id", 1)
    .single();

  const upiId = settings?.upi_id || "umang19151863gund-2@oksbi";
  const qrCodeUrl = settings?.qr_code_url || "/trb_upi_qr.png";
  const brochureUrl = settings?.brochure_url || "/TRB_BROCHURE_2027.pdf";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#de1615]/20 border border-[#de1615]/40 flex items-center justify-center text-[#de1615]">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono-tech text-[10px] text-[#ff6534] uppercase tracking-widest block">
              FINANCIAL & COLLABORATION SETTINGS
            </span>
            <h1 className="font-sora font-bold text-3xl text-white tracking-tight">
              Support & Brochure
            </h1>
          </div>
        </div>
        <p className="text-[#ae8882] text-sm">
          Update the team's official UPI ID, payment QR code, and sponsorship brochure PDF. Changes immediately reflect across public support modals and sponsorship sections.
        </p>
      </div>

      <form
        action={updateSupportSettings}
        className="space-y-8 glass-card p-6 sm:p-8 rounded-2xl border border-white/10 relative overflow-hidden bg-[#12151b]"
      >
        {/* UPI ID SECTION */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-[#de1615]" />
            <h2 className="font-sora font-bold text-lg text-white">Official Team UPI ID</h2>
          </div>
          <p className="text-xs text-white/50">
            This UPI address is shown with a one-click copy button in the public Support modal.
          </p>
          <input
            key={upiId}
            type="text"
            name="upi_id"
            defaultValue={upiId}
            required
            placeholder="e.g. umang19151863gund-2@oksbi"
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono-tech text-sm focus:outline-none focus:border-[#de1615]/50 transition-all"
          />
        </div>

        {/* QR CODE SECTION */}
        <div className="pt-8 border-t border-white/10 space-y-6">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#ff6534]" />
            <h2 className="font-sora font-bold text-lg text-white">Payment QR Code</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* QR Code Preview */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <span className="text-[11px] font-mono-tech uppercase text-white/50 mb-2">Current QR Preview</span>
              <div className="w-44 h-44 bg-white rounded-2xl p-2.5 flex items-center justify-center border-2 border-[#de1615]/40 shadow-[0_0_25px_rgba(222,22,21,0.25)] relative overflow-hidden">
                <Image
                  src={qrCodeUrl}
                  alt="Team Red Baron Payment QR Code"
                  width={160}
                  height={160}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
            </div>

            {/* QR Code Inputs */}
            <div className="flex-1 space-y-4 w-full">
              <div>
                <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
                  Upload New QR Image File
                </label>
                <input
                  type="file"
                  name="qr_code_file"
                  accept="image/png,image/jpeg,image/webp"
                  className="w-full text-xs text-white/70 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-sora file:font-bold file:bg-[#de1615]/20 file:text-[#de1615] hover:file:bg-[#de1615] hover:file:text-white file:transition-colors file:cursor-pointer cursor-pointer bg-black/40 border border-white/10 rounded-lg p-2"
                />
                <p className="text-[11px] text-white/40 mt-1.5">
                  Uploading a file will upload to Supabase storage bucket `trb-media/support/` (Max 5 MB).
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
                  Or Direct QR Code Image URL
                </label>
                <input
                  key={qrCodeUrl}
                  type="text"
                  name="qr_code_direct_url"
                  defaultValue={qrCodeUrl}
                  placeholder="/trb_upi_qr.png or https://..."
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono-tech text-xs focus:outline-none focus:border-[#de1615]/50 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* BROCHURE SECTION */}
        <div className="pt-8 border-t border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#de1615]" />
              <h2 className="font-sora font-bold text-lg text-white">Sponsorship Brochure (PDF)</h2>
            </div>
            {brochureUrl && (
              <a
                href={brochureUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-sora font-semibold text-[#ff6534] hover:text-white transition-colors"
              >
                <span>Preview Current Brochure</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
                Upload New Brochure PDF File
              </label>
              <input
                type="file"
                name="brochure_file"
                accept="application/pdf"
                className="w-full text-xs text-white/70 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-sora file:font-bold file:bg-[#de1615]/20 file:text-[#de1615] hover:file:bg-[#de1615] hover:file:text-white file:transition-colors file:cursor-pointer cursor-pointer bg-black/40 border border-white/10 rounded-lg p-2"
              />
              <p className="text-[11px] text-white/40 mt-1.5">
                Uploading a file will upload to Supabase storage bucket `trb-media/brochures/` (Max 10 MB PDF).
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider mb-2">
                Or Direct Brochure URL / Path
              </label>
              <input
                key={brochureUrl}
                type="text"
                name="brochure_direct_url"
                defaultValue={brochureUrl}
                placeholder="/TRB_BROCHURE_2027.pdf or https://..."
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono-tech text-xs focus:outline-none focus:border-[#de1615]/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-6 border-t border-white/10 flex justify-end">
          <SubmitButton defaultText="Save Support Settings" loadingText="Saving..." />
        </div>
      </form>
    </div>
  );
}
