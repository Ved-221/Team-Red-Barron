"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FooterClient } from "./FooterClient";

export function Footer() {
  const [contactData, setContactData] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data } = await supabase
        .from("contact_info")
        .select("*")
        .eq("id", 1)
        .single();
      
      if (data) {
        setContactData(data);
      }
    }
    loadData();
  }, []);

  return <FooterClient contactData={contactData} />;
}
