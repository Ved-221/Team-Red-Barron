"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundBeams } from "@/components/ui/background-beams";
import {
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  Copy,
  Clock,
  MessageCircle,
  Globe,
  Radio,
  Sparkles,
  Share2,
} from "lucide-react";

const inquiryTypes = [
  { id: "sponsorship", label: "Sponsorship Inquiry" },
  { id: "recruitment", label: "Recruitment / Joining TRB" },
  { id: "media", label: "Media & Press" },
  { id: "tech", label: "Technical Collaboration" },
  { id: "general", label: "General Inquiry" },
];

const InstagramIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedInIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
  </svg>
);

const YouTubeIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const FacebookIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
  </svg>
);

const socials = [
  {
    name: "Instagram",
    handle: "@team_red_baron",
    href: "https://www.instagram.com/team_red_baron?igsh=MWFwcnl6Y2ZlZzlwdA==",
    icon: InstagramIcon,
    color: "#E4405F",
  },
  {
    name: "LinkedIn",
    handle: "Team Red Baron",
    href: "https://www.linkedin.com/company/team-red-baron/posts/?feedView=all",
    icon: LinkedInIcon,
    color: "#0A66C2",
  },
  {
    name: "YouTube",
    handle: "@teamredbaron4316",
    href: "https://youtube.com/@teamredbaron4316?feature=shared",
    icon: YouTubeIcon,
    color: "#FF0000",
  },
  {
    name: "Facebook",
    handle: "Team Red Baron",
    href: "https://www.facebook.com/goteamredbaron/",
    icon: FacebookIcon,
    color: "#1877F2",
  },
];

export default function ContactPage() {
  const [selectedType, setSelectedType] = useState("sponsorship");
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate high-speed telemetry transmit
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-[#000000] text-[#e2e2e2] flex flex-col font-sans relative overflow-hidden">
      <BackgroundBeams />
      <Navbar />

      {/* Hero Header Section */}
      <section className="relative pt-36 pb-16 px-5 sm:px-10 lg:px-20 max-w-[1440px] mx-auto w-full overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-10 left-1/3 w-96 h-96 bg-[#de1615]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-32 right-1/3 w-80 h-80 bg-[#ff6534]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
          <h1 className="font-sora font-extrabold text-4xl sm:text-6xl tracking-tight text-white mb-6 leading-tight">
            GET IN TOUCH WITH <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ffb59f] to-[#de1615]">
              TEAM RED BARON
            </span>
          </h1>

          <p className="font-inter text-base sm:text-lg text-[#e8bdb6] max-w-xl font-normal leading-relaxed">
            Whether you are interested in corporate sponsorship, engineering recruitment, media inquiries, or visiting our workshop at PCCOE Pune—reach out below.
          </p>
        </div>
      </section>

      {/* Interactive Contact Grid (Asymmetric Split Screen) */}
      <section className="py-12 px-5 sm:px-10 lg:px-20 max-w-[1440px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Transmission Hub (Info Cards) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {/* Official Email Card */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#252e39]/50 backdrop-blur-xl hover:border-[#de1615]/50 transition-all flex flex-col gap-4">
              <div>
                <h3 className="font-sora font-bold text-lg text-white mb-1">Team Leadership</h3>
                <p className="font-inter text-xs text-[#ae8882]">Direct inbox for sponsorship, technical docs, and press inquiries.</p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col p-3.5 rounded-xl bg-[#121414] border border-white/10 gap-1">
                  <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest">Managing Director - Tanmay Chaskar</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs sm:text-sm text-[#ffb4a9] font-medium truncate">
                      teamredbaron07@gmail.com
                    </span>
                    <button
                      onClick={() => handleCopyEmail("teamredbaron07@gmail.com")}
                      className="ml-2 p-2 rounded-lg bg-[#252e39] text-white hover:text-[#de1615] hover:bg-white/10 transition-all shrink-0"
                      title="Copy email to clipboard"
                    >
                      {copiedEmail === "teamredbaron07@gmail.com" ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col p-3.5 rounded-xl bg-[#121414] border border-white/10 gap-1">
                  <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest">Marketing Director - Atharva Patil</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs sm:text-sm text-[#ffb4a9] font-medium truncate">
                      marketingteamredbaron@gmail.com
                    </span>
                    <button
                      onClick={() => handleCopyEmail("marketingteamredbaron@gmail.com")}
                      className="ml-2 p-2 rounded-lg bg-[#252e39] text-white hover:text-[#de1615] hover:bg-white/10 transition-all shrink-0"
                      title="Copy email to clipboard"
                    >
                      {copiedEmail === "marketingteamredbaron@gmail.com" ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Location & Workshop Address Card — Auto Flex Height matching Inquiry Form */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#252e39]/50 backdrop-blur-xl hover:border-[#de1615]/50 transition-all flex flex-col justify-between gap-4 flex-1">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#ff6534] tracking-widest uppercase font-semibold">
                    PITWALL COORDINATES
                  </span>
                  <MapPin className="w-5 h-5 text-[#de1615]" />
                </div>

                <div>
                  <h3 className="font-sora font-bold text-lg text-white mb-1">PCCOE Motorsport Lab</h3>
                  <p className="font-inter text-xs text-[#e8bdb6] leading-relaxed">
                    Pimpri Chinchwad College of Engineering (PCCOE)<br />
                    Sector 26, Pradhikaran, Nigdi, Pune, Maharashtra 411044
                  </p>
                </div>
              </div>

              {/* Real Interactive Google Map Embed */}
              <div className="relative w-full h-[220px] sm:h-[240px] lg:h-full lg:min-h-[200px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black">
                <iframe
                  title="Pimpri Chinchwad College of Engineering (PCCOE) Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.266205842881!2d73.75906497593259!3d18.6520647651375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9e76c8fa205%3A0x1b210131915734fd!2sPimpri%20Chinchwad%20College%20Of%20Engineering%20(PCCOE)!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full rounded-2xl"
                />
              </div>
            </div>
          </div>

          {/* Right Column: High-Performance Inquiry Form */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="glass-card p-6 sm:p-8 lg:p-10 rounded-3xl border border-[#de1615]/30 bg-[#252e39]/60 backdrop-blur-2xl shadow-[0_0_30px_rgba(222,22,21,0.15)] relative flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-sora font-bold text-2xl text-white">Transmit Message</h2>
                  <p className="font-inter text-xs text-[#e8bdb6] mt-1">
                    Fill out your query details to connect with the team leadership.
                  </p>
                </div>
                <Sparkles className="w-5 h-5 text-[#ff6534]" />
              </div>

              {submitted ? (
                <div className="py-12 flex flex-col items-center text-center gap-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#de1615]/20 border border-[#de1615] flex items-center justify-center text-[#de1615]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-sora font-bold text-2xl text-white">Transmission Sent!</h3>
                  <p className="font-inter text-sm text-[#e8bdb6] max-w-md">
                    Thank you for reaching out to Team Red Baron. Our pitwall team has received your message and will respond within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", organization: "", message: "" });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-full bg-white/10 text-white font-sora font-semibold text-xs border border-white/20 hover:bg-white/20 transition-all"
                  >
                    Send Another Transmission
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Inquiry Type Selector */}
                  <div>
                    <label className="block font-mono text-xs text-[#ffb4a9] font-medium mb-2.5">
                      INQUIRY TYPE CATEGORY *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {inquiryTypes.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setSelectedType(type.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-sora font-medium transition-all ${
                            selectedType === type.id
                              ? "bg-[#de1615] text-white font-bold shadow-[0_0_15px_rgba(222,22,21,0.4)]"
                              : "bg-[#121414] text-[#e8bdb6] border border-white/10 hover:border-white/30"
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs text-[#ae8882] mb-1.5">
                        FULL NAME *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#121414] border border-white/10 text-white text-sm focus:outline-none focus:border-[#de1615] focus:ring-1 focus:ring-[#de1615] transition-all font-inter placeholder:text-white/30"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-[#ae8882] mb-1.5">
                        EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. rahul@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#121414] border border-white/10 text-white text-sm focus:outline-none focus:border-[#de1615] focus:ring-1 focus:ring-[#de1615] transition-all font-inter placeholder:text-white/30"
                      />
                    </div>
                  </div>

                  {/* Organization */}
                  <div>
                    <label className="block font-mono text-xs text-[#ae8882] mb-1.5">
                      ORGANIZATION / INSTITUTE (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Precision Manufacturing Pvt Ltd / PCCOE Pune"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#121414] border border-white/10 text-white text-sm focus:outline-none focus:border-[#de1615] focus:ring-1 focus:ring-[#de1615] transition-all font-inter placeholder:text-white/30"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block font-mono text-xs text-[#ae8882] mb-1.5">
                      MESSAGE DETAILS *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe your inquiry, sponsorship package request, or recruitment interest..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#121414] border border-white/10 text-white text-sm focus:outline-none focus:border-[#de1615] focus:ring-1 focus:ring-[#de1615] transition-all font-inter placeholder:text-white/30 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#de1615] hover:bg-[#b81211] text-white py-4 rounded-xl font-sora font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="font-mono text-xs animate-pulse">TRANSMITTING TELEMETRY...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        SEND TRANSMISSION
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Social Telemetry Channels Section — Positioned at End of Page */}
      <section className="pb-20 pt-4 px-5 sm:px-10 lg:px-20 max-w-[1440px] mx-auto w-full">
        <div className="glass-card p-8 sm:p-10 rounded-3xl border border-white/10 bg-[#252e39]/50 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
            <div>
              <span className="font-mono text-xs text-[#ff6534] tracking-widest uppercase font-semibold">
                SOCIAL TELEMETRY CHANNELS
              </span>
              <h3 className="font-sora font-extrabold text-2xl text-white mt-1 uppercase">
                Connect Across Platforms
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {socials.map((soc) => {
              const Icon = soc.icon;
              return (
                <a
                  key={soc.name}
                  href={soc.href}
                  target="_blank"
                  rel="noreferrer"
                  className="p-5 rounded-2xl bg-[#121414] border border-white/10 hover:border-white/30 flex items-center gap-4 group transition-all hover:bg-[#1e2020]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1e2020] border border-white/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" style={{ color: soc.color }} />
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="font-sora text-sm font-bold text-white group-hover:text-[#ffb59f] transition-colors truncate">
                      {soc.name}
                    </span>
                    <span className="font-mono text-xs text-[#ae8882] truncate">{soc.handle}</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
