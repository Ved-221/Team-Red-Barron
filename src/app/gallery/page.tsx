import { supabase } from "@/lib/supabase";
import GalleryClient from "./GalleryClient";
import { Metadata } from "next";
import { getSharedChromeData } from "@/lib/server-data";

export const revalidate = 3600; // 1-hour ISR cache

export const metadata: Metadata = {
  title: "Gallery | Team Red Baron",
  description: "High resolution action gallery of Team Red Baron's ATVs in action.",
};

export default async function GalleryPage() {
  const [galleryRes, chromeData] = await Promise.all([
    supabase
      .from("gallery_images")
      .select("id, image_url, title, category, sort_order")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
    getSharedChromeData(),
  ]);

  return <GalleryClient galleryData={galleryRes.data || []} chromeData={chromeData} />;
}
