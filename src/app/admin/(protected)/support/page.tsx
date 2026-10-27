import React from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { updateSupportSettings } from "./actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { PdfUploadField } from "@/components/admin/PdfUploadField";
import { QrCode, FileText, ExternalLink, Landmark } from "lucide-react";

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
          Update the team&apos;s official UPI ID, payment QR code, and sponsorship brochure PDF. Changes immediately reflect across public support modals and sponsorship sections.
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

          {/* QR Code Upload Field (with client-side compression and 5 MB size limit) */}
          <div className="w-full">
            <ImageUploadField
              name="qr_code_file"
              defaultValue={qrCodeUrl}
              label="Payment QR Code Image (Max 5 MB • Auto-optimized)"
              maxDimension={800}
            />
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

          <div className="w-full">
            <PdfUploadField
              name="brochure_file"
              defaultValue={brochureUrl}
              label="Sponsorship Brochure (PDF • Max 10 MB)"
              maxSizeMb={10}
            />
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
