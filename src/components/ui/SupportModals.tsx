"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Mail, Sparkles, Send, CheckCircle2, ShieldCheck, Download, Copy, Check } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DonateModal({ isOpen, onClose }: ModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: "", amount: "" });
  const upiId = "teamredbaron@upi";

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
                  DONATE TO <span className="text-[#de1615]">TEAM RED BARON</span>
                </h3>
              </div>
            </div>

            <p className="font-inter text-sm text-[#e2e2e2]/80 mb-6 leading-relaxed">
              Your contribution directly powers the research, fabrication, composite bodywork, and IoT telemetry of our next-gen Formula Student race car.
            </p>

            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="w-48 h-48 bg-white rounded-xl p-4 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(222,22,21,0.4)]">
                  {/* Space for QR Image */}
                  <div className="w-full h-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 font-mono-tech text-xs text-center">
                    PLACE QR IMAGE HERE<br />(400x400)
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-sora font-bold text-xl text-white">Scan to Pay ₹{formData.amount}</h4>
                  <p className="font-inter text-sm text-green-400 font-medium">
                    ✓ Request logged. Awaiting transfer.
                  </p>
                  <p className="font-inter text-xs text-white/50 px-4">
                    Upon successful payment, these details will be sent to the official TRB mail and logged in the Admin Panel for verification.
                  </p>
                </div>

                {/* Direct UPI / Bank Details Box */}
                <div className="w-full glass-card p-4 rounded-2xl border border-white/15 bg-black/50 mt-4 flex items-center justify-between">
                  <div className="text-left">
                    <span className="font-mono-tech text-[10px] text-white/50 block uppercase">Official Team UPI ID</span>
                    <span className="font-mono-tech font-bold text-sm text-white">{upiId}</span>
                  </div>
                  <button
                    onClick={copyUpi}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#de1615]/20 text-[#de1615] border border-[#de1615]/40 text-xs font-mono-tech hover:bg-[#de1615] hover:text-white transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "COPIED" : "COPY UPI"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="font-mono-tech text-xs text-[#e8bdb6] block mb-1.5 uppercase">Donor Name / Organization</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe / Tech Corp"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white font-inter text-sm focus:outline-none focus:border-[#de1615] transition-colors"
                  />
                </div>

                <div>
                  <label className="font-mono-tech text-xs text-[#e8bdb6] block mb-1.5 uppercase">Donation Amount (INR)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-sora font-bold">₹</span>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="5000"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 rounded-xl pl-9 pr-4 py-3 text-white font-inter text-sm focus:outline-none focus:border-[#de1615] transition-colors appearance-none"
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
                      className="flex-1 py-2 glass-card rounded-lg border border-white/10 hover:border-[#de1615]/60 hover:bg-[#de1615]/10 font-mono-tech text-xs text-white/80 transition-all"
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#de1615] to-[#ff6534] text-white py-3.5 rounded-xl font-sora font-extrabold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(222,22,21,0.3)] relative overflow-hidden group"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    Proceed to Donate
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                  </button>
                  <a
                    href="#sponsors"
                    onClick={onClose}
                    className="glass-card px-5 py-3.5 rounded-xl border border-white/20 text-white font-sora text-sm font-semibold hover:border-[#de1615] transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 text-[#de1615]" />
                    Sponsorship Deck
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
