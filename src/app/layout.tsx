import type { Metadata } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import { AgentationDevTools } from "@/components/AgentationDevTools";
import { NavigationProgress } from "@/components/NavigationProgress";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Team Red Baron — Elite Offroad Engineering & Motorsport",
  description:
    "PCCOE's collegiate offroad/ATV racing team. Pushing mechanical boundaries with aerospace precision and high-octane performance.",
  keywords: ["Team Red Baron", "BAJA SAE", "Offroad Racing", "PCCOE Motorsports", "ATV", "Albatros"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="bg-black text-[#e2e2e2] min-h-screen flex flex-col font-inter selection:bg-[#de1615] selection:text-white">
        <NavigationProgress />
        {children}
        <AgentationDevTools />
      </body>
    </html>
  );
}
