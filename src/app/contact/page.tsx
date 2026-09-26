import { supabase } from "@/lib/supabase";
import ContactClient from "./ContactClient";
import { Metadata } from "next";

export const revalidate = 60; // Revalidate cache every 60 seconds

export const metadata: Metadata = {
  title: "Contact | Team Red Baron",
  description: "Get in touch with Team Red Baron for sponsorship, recruitment, and media inquiries.",
};

export default async function ContactPage() {
  const { data: contactData } = await supabase
    .from("contact_info")
    .select("*")
    .eq("id", 1)
    .single();

  return <ContactClient contactData={contactData} />;
}
