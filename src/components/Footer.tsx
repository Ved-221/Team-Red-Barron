"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FooterClient } from "./FooterClient";

import { SharedContactInfo } from "@/lib/server-data";

export function Footer({ contactData: propContactData }: { contactData?: SharedContactInfo | null }) {
  const [contactData, setContactData] = useState<SharedContactInfo | null>(propContactData || null);

  useEffect(() => {
    if (propContactData) {
      return;
    }
    async function loadData() {
      const supabase = createClient();
      const { data } = await supabase
        .from("contact_info")
        .select("email, address, linkedin_url, instagram_url, youtube_url, managing_director_name, managing_director_email, managing_director_phone, marketing_director_name, marketing_director_email, marketing_director_phone")
        .eq("id", 1)
        .single();
      
      if (data) {
        setContactData(data);
      }
    }
    loadData();
  }, [propContactData]);

  return <FooterClient contactData={contactData} />;
}
