"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  defaultText?: string;
  loadingText?: string;
  className?: string;
}

export function SubmitButton({
  defaultText = "Save Changes",
  loadingText = "Saving Changes...",
  className = "bg-[#de1615] hover:bg-[#b81211] text-white font-sora font-bold text-sm uppercase tracking-wider px-8 py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(222,22,21,0.3)] flex items-center justify-center min-w-[180px]"
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className} ${pending ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        defaultText
      )}
    </button>
  );
}
