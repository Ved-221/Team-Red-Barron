import { supabase } from "@/lib/supabase";
import GalleryClient from "./GalleryClient";
import { Metadata } from "next";

export const revalidate = 60; // Revalidate cache every 60 seconds

export const metadata: Metadata = {
  title: "Gallery | Team Red Baron",
  description: "High resolution action gallery of Team Red Baron's ATVs in action.",
};

export default async function GalleryPage() {
  const { data: galleryData } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true });

  return <GalleryClient galleryData={galleryData || []} />;
}
