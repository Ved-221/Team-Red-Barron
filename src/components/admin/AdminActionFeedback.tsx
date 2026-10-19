"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";

export function AdminActionFeedback() {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const [resource, config] = args;
      const headers = config?.headers;
      let isNextAction = false;

      if (headers) {
        if (headers instanceof Headers) {
          isNextAction = headers.has("next-action");
        } else if (typeof headers === "object") {
          isNextAction = "next-action" in headers || "Next-Action" in headers;
        }
      }

      // Check if it's not a signout request
      const isSignout = typeof resource === "string" && resource.includes("/auth/signout");

      if (isNextAction && !isSignout) {
        setIsLoading(true);
        setFeedback(null);

        try {
          const res = await originalFetch(...args);
          setIsLoading(false);

          if (res.ok) {
            setFeedback({
              type: "success",
              message: "Changes saved and published to the live website!",
            });
          } else {
            setFeedback({
              type: "error",
              message: "Failed to save changes. Please check your inputs and try again.",
            });
          }
          return res;
        } catch (err: unknown) {
          setIsLoading(false);
          setFeedback({
            type: "error",
            message: err instanceof Error ? err.message : "A network error occurred while updating.",
          });
          throw err;
        }
      }

      return originalFetch(...args);
    };

    // Also listen to submit events for fallback
    const handleSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      if (form && form.action && form.action.includes("/auth/signout")) {
        return;
      }
      setIsLoading(true);
      setFeedback(null);
    };

    window.addEventListener("submit", handleSubmit, true);

    return () => {
      window.fetch = originalFetch;
      window.removeEventListener("submit", handleSubmit, true);
    };
  }, []);

  // Auto-dismiss confirmation after 4 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  return (
    <>
      {/* 1. Full-screen Mach-Red Kinetic Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-all animate-in fade-in duration-200">
          <div className="relative flex flex-col items-center max-w-sm mx-4 p-8 rounded-2xl bg-[#12151b] border border-[#de1615]/50 shadow-[0_0_50px_rgba(222,22,21,0.35)] text-center">
            {/* Glowing red accent rings */}
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-[#de1615] blur-xl opacity-40 animate-pulse" />
              <div className="relative w-16 h-16 rounded-full border-2 border-white/10 border-t-[#de1615] border-r-[#ff6534] animate-spin flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#de1615] animate-spin" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-mono-tech text-[10px] tracking-widest text-[#ff6534] uppercase">
                PITWALL COMMAND // LIVE REVALIDATION
              </span>
              <h3 className="font-sora font-bold text-lg text-white">
                Updating System...
              </h3>
              <p className="font-inter text-xs text-[#ae8882] leading-relaxed">
                Applying updates, updating storage, and purging cache across the website.
              </p>
            </div>

            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-6">
              <div className="h-full bg-gradient-to-r from-[#de1615] to-[#ff6534] w-2/3 animate-[pulse_1.5s_ease-in-out_infinite] rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* 2. Floating High-Octane Confirmation Toast */}
      {feedback && !isLoading && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in slide-in-from-bottom-5 duration-300">
          <div
            className={`p-4 rounded-xl border backdrop-blur-xl flex items-center gap-3 shadow-2xl transition-all ${
              feedback.type === "success"
                ? "bg-[#12151b]/95 border-emerald-500/40 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                : "bg-[#12151b]/95 border-[#de1615]/50 text-red-300 shadow-[0_0_30px_rgba(222,22,21,0.3)]"
            }`}
          >
            {feedback.type === "success" ? (
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
            )}

            <div className="flex-1 pr-2">
              <p className="font-sora font-semibold text-xs text-white uppercase tracking-wider">
                {feedback.type === "success" ? "Action Complete" : "Update Notice"}
              </p>
              <p className="font-inter text-xs text-[#e2e2e2]/80 mt-0.5 leading-snug">
                {feedback.message}
              </p>
            </div>

            <button
              onClick={() => setFeedback(null)}
              className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
