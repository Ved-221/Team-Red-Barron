"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { emptyAllTrash } from "@/app/admin/(protected)/trash/actions";

export function EmptyTrashButton() {
  const [isPending, startTransition] = useTransition();

  const handleEmpty = () => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete ALL items in Trash? This will permanently remove all database records and purge their uploaded files from Supabase Storage. This action cannot be undone."
      )
    ) {
      startTransition(async () => {
        await emptyAllTrash();
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleEmpty}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-sora font-bold uppercase tracking-wider transition-all border border-red-500/30 cursor-pointer disabled:opacity-50"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
      Empty All Trash
    </button>
  );
}
