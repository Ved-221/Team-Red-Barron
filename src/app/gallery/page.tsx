import { supabase } from "@/lib/supabase";
import GalleryClient from "./GalleryClient";
import { Metadata } from "next";
import { getSharedChromeData } from "@/lib/server-data";
import { toLocalMediaUrl } from "@/lib/media";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Media Gallery",
  description: "High resolution action gallery of Team Red Baron's All-Terrain Vehicles, track testing, and BAJA SAE competitions.",
  alternates: {
    canonical: "/gallery",
  },
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

  const galleryItems = (galleryRes.data || []).map((item) => ({
    ...item,
    image_url: toLocalMediaUrl(item.image_url),
  }));

  return <GalleryClient galleryData={galleryItems} chromeData={chromeData} />;
}
