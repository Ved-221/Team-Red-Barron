import ContactClient from "./ContactClient";
import { Metadata } from "next";
import { getSharedChromeData } from "@/lib/server-data";

export const revalidate = 3600; // 1-hour ISR cache

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Team Red Baron for sponsorship, recruitment, and media inquiries at PCCOE Pune.",
  alternates: {
    canonical: "/contact",
  },
};

export default async function ContactPage() {
  const chromeData = await getSharedChromeData();

  return <ContactClient contactData={chromeData.contactInfo} chromeData={chromeData} />;
}
