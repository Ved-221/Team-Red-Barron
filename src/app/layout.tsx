import type { Metadata } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import { AgentationDevTools } from "@/components/AgentationDevTools";
import { NavigationProgress } from "@/components/NavigationProgress";
import { TRBLoadingScreen } from "@/components/TRBLoadingScreen";
import { Toaster } from "react-hot-toast";
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
  metadataBase: new URL("https://teamredbaron.in"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Team Red Baron — Elite Offroad Engineering & Motorsport | PCCOE",
    template: "%s | Team Red Baron",
  },
  description:
    "Official collegiate offroad racing team of Pimpri Chinchwad College of Engineering (PCCOE Pune). Designing, manufacturing, and competing with high-performance All-Terrain Vehicles (ATVs) in national and international BAJA SAE championships.",
  keywords: [
    "Team Red Baron",
    "PCCOE Motorsports",
    "PCCOE Pune",
    "BAJA SAE India",
    "eBAJA",
    "All-Terrain Vehicle",
    "ATV",
    "Offroad Racing",
    "Albatros",
  ],
  authors: [{ name: "Team Red Baron" }],
  creator: "Team Red Baron",
  publisher: "PCCOE Pune",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://teamredbaron.in",
    siteName: "Team Red Baron",
    title: "Team Red Baron — Elite Offroad Engineering & Motorsport | PCCOE",
    description:
      "Official collegiate offroad racing team of PCCOE Pune. Designing, manufacturing, and competing with high-performance All-Terrain Vehicles in BAJA SAE.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Team Red Baron Official Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Team Red Baron — Elite Offroad Engineering & Motorsport | PCCOE",
    description:
      "Official collegiate offroad racing team of PCCOE Pune. Designing, manufacturing, and competing with high-performance All-Terrain Vehicles in BAJA SAE.",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
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
      <head>
        <link rel="preconnect" href="https://axzwucvnrjtenvvrxfew.supabase.co" />
        <link
          rel="preload"
          href="/fonts/AbandoN.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-black text-[#e2e2e2] min-h-screen flex flex-col font-inter selection:bg-[#de1615] selection:text-white">
        <NavigationProgress />
        <TRBLoadingScreen />
        <Toaster position="bottom-right" toastOptions={{ className: "font-inter text-sm", style: { background: "#1e2020", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" } }} />
        {children}
        <AgentationDevTools />
      </body>
    </html>
  );
}
