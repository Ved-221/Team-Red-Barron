import { ReactNode } from "react";
import { AdminDesktopOnlyGuard } from "@/components/admin/AdminDesktopOnlyGuard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Pitwall | Team Red Baron",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <AdminDesktopOnlyGuard>{children}</AdminDesktopOnlyGuard>;
}
