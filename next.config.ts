import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    deviceSizes: [640, 1080, 1920],
    imageSizes: [160, 320],
    formats: ["image/webp"],
    minimumCacheTTL: 2592000,
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "axzwucvnrjtenvvrxfew.supabase.co",
      },
    ],
  },
};

export default nextConfig;
