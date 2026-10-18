"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Mail, Sparkles, Send, CheckCircle2, ShieldCheck, Download, Copy, Check, QrCode, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  upiId?: string;
  qrCodeUrl?: string;
  brochureUrl?: string;
}

export function DonateModal({
  isOpen,
  onClose,
  upiId: initialUpiId,
  qrCodeUrl: initialQrCodeUrl,
  brochureUrl: initialBrochureUrl,
}: ModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: "", amount: "" });
  
  const [upiId, setUpiId] = useState(initialUpiId || "umang19151863gund-2@oksbi");
  const [qrCodeUrl, setQrCodeUrl] = useState(initialQrCodeUrl || "/trb_upi_qr.png");
  const [brochureUrl, setBrochureUrl] = useState(initialBrochureUrl || "/TRB_BROCHURE_2027.pdf");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("site_settings")
          .select("upi_id, qr_code_url, brochure_url")
          .eq("id", 1)
          .single();
        if (data) {
          if (data.upi_id) setUpiId(data.upi_id);
          if (data.qr_code_url) setQrCodeUrl(data.qr_code_url);
          if (data.brochure_url) setBrochureUrl(data.brochure_url);
        }
      } catch (err) {
        // Silently fall back to defaults
      }
    }
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl glass-card rounded-3xl p-6 sm:p-8 border border-[#de1615]/50 bg-[#0a0c0e]/95 shadow-[0_0_50px_rgba(222,22,21,0.3)] z-10 overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#de1615]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-white/60 hover:text-white p-2 rounded-full glass-card hover:border-[#de1615] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#de1615]/20 border border-[#de1615]/40 flex items-center justify-center text-[#de1615]">
                <Heart className="w-5 h-5 fill-[#de1615]" />
              </div>
              <div>
                <span className="font-mono-tech text-[10px] text-[#ff6534] uppercase tracking-widest block">
                  SUPPORT MOTORSPORT EXCELLENCE
                </span>
                <h3 className="font-sora font-extrabold text-2xl text-white uppercase tracking-tight">
                  SUPPORT <span className="text-[#de1615]">TEAM RED BARON</span>
                </h3>
              </div>
            </div>

            <p className="font-inter text-sm text-[#e2e2e2]/80 mb-5 leading-relaxed">
              Your contribution directly powers the research, fabrication, composite bodywork, and IoT telemetry of our next-gen Formula Student race car.
            </p>

            {/* Direct UPI ID Quick Support Box */}
            <div className="w-full glass-card p-3 sm:p-4 rounded-2xl border border-[#de1615]/30 bg-black/60 mb-5 flex items-center justify-between gap-3 shadow-inner">
              <div className="text-left min-w-0">
                <span className="font-mono-tech text-[10px] text-[#ff6534] block uppercase tracking-wider font-semibold">
                  Official Team UPI ID
                </span>
                <span className="font-mono-tech font-bold text-xs sm:text-sm text-white select-all truncate block">
                  {upiId}
                </span>
              </div>
              <button
                type="button"
                onClick={copyUpi}
                className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#de1615] text-white hover:bg-[#b81211] active:scale-95 text-xs font-mono-tech font-bold shadow-md transition-all"
                title="Copy UPI ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "COPIED" : "COPY UPI"}
              </button>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="w-52 h-52 sm:w-56 sm:h-56 bg-white rounded-2xl p-3 flex flex-col items-center justify-center shadow-[0_0_35px_rgba(222,22,21,0.45)] border border-[#de1615]/30 overflow-hidden">
                  <div className="relative w-full h-full">
                    <Image
                      src={qrCodeUrl}
                      alt="TRB UPI Payment QR Code"
                      fill
                      unoptimized
                      priority
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-sora font-bold text-xl text-white">
                    Scan to Pay {formData.amount ? `₹${formData.amount}` : "via UPI"}
                  </h4>
                  <p className="font-inter text-xs sm:text-sm text-green-400 font-medium">
                    ✓ Request logged. Open any UPI App (GPay, PhonePe, Paytm) to complete transfer.
                  </p>
                  <p className="font-inter text-[11px] text-white/50 px-4">
                    Upon payment, thank you for powering Team Red Baron's upcoming competition season!
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 glass-card py-3 rounded-xl border border-white/20 text-white font-sora text-xs font-semibold hover:border-[#de1615] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Modify Amount
                  </button>
                  <a
                    href={brochureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 glass-card py-3 rounded-xl border border-white/20 text-white font-sora text-xs font-semibold hover:border-[#de1615] transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-[#de1615]" />
                    View Brochure
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="font-mono-tech text-xs text-[#e8bdb6] block mb-1.5 uppercase">Supporter Name / Organization</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe / Tech Corp"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white font-inter text-sm focus:outline-none focus:border-[#de1615] transition-colors"
                  />
                </div>

                <div>
                  <label className="font-mono-tech text-xs text-[#e8bdb6] block mb-1.5 uppercase">Support Amount (INR)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-sora font-bold">₹</span>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="5000"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-white font-inter text-sm focus:outline-none focus:border-[#de1615] transition-colors appearance-none"
                    />
                  </div>
                </div>

                {/* Pre-defined amounts for convenience */}
                <div className="flex gap-2">
                  {[1000, 5000, 10000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setFormData({ ...formData, amount: amt.toString() })}
                      className="flex-1 py-1.5 glass-card rounded-lg border border-white/10 hover:border-[#de1615]/60 hover:bg-[#de1615]/10 font-mono-tech text-xs text-white/80 transition-all"
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#de1615] to-[#ff6534] text-white py-3 rounded-xl font-sora font-extrabold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(222,22,21,0.3)] relative overflow-hidden group"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    Proceed to Support
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                  </button>
                  <a
                    href={brochureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card px-5 py-3 rounded-xl border border-white/20 text-white font-sora text-sm font-semibold hover:border-[#de1615] transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 text-[#de1615]" />
                    View Brochure
                  </a>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function ContactModal({ isOpen, onClose }: ModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "Sponsorship & Collaboration", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl glass-card rounded-3xl p-6 sm:p-8 border border-white/20 bg-[#0a0c0e]/95 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-white/60 hover:text-white p-2 rounded-full glass-card hover:border-[#de1615] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                <Mail className="w-5 h-5 text-[#ff6534]" />
              </div>
              <div>
                <span className="font-mono-tech text-[10px] text-[#e8bdb6] uppercase tracking-widest block">
                  GET IN TOUCH WITH TRB
                </span>
                <h3 className="font-sora font-extrabold text-2xl text-white uppercase tracking-tight">
                  CONTACT <span className="text-[#de1615]">TEAM RED BARON</span>
                </h3>
              </div>
            </div>

            <p className="font-inter text-sm text-[#e2e2e2]/80 mb-6 leading-relaxed">
              Have questions about corporate sponsorship, industry partnership, or technical collaboration? Send us a message and our team will respond within 24 hours.
            </p>

            {submitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="w-12 h-12 text-[#de1615] mb-3 animate-bounce" />
                <h4 className="font-sora font-bold text-xl text-white mb-1">Message Received!</h4>
                <p className="font-inter text-sm text-white/70">Thank you for reaching out to Team Red Baron. We will connect with you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="font-mono-tech text-xs text-[#e8bdb6] block mb-1 uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white font-inter text-sm focus:outline-none focus:border-[#de1615] transition-colors"
                  />
                </div>

                <div>
                  <label className="font-mono-tech text-xs text-[#e8bdb6] block mb-1 uppercase">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white font-inter text-sm focus:outline-none focus:border-[#de1615] transition-colors"
                  />
                </div>

                <div>
                  <label className="font-mono-tech text-xs text-[#e8bdb6] block mb-1 uppercase">Message / Inquiry</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell us about your organization or inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white font-inter text-sm focus:outline-none focus:border-[#de1615] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-white text-black py-3 rounded-xl font-sora font-extrabold text-sm hover:bg-[#de1615] hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 group shadow-lg"
                >
                  Send Message
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
