import type { NextConfig } from "next";

const nextConfig: any = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "rskkqpmgscsyclbtnkci.supabase.co",
      },
      {
        protocol: "https",
        hostname: "rskkqpmgscsyclbtnkci.storage.supabase.co",
      },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "tse2.mm.bing.net" },
      { protocol: "https", hostname: "tse1.mm.bing.net" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "ccfqsrvqfbigkhcbtoac.supabase.co" },
      {
        protocol: "https",
        hostname: "rskkqpmgscsyclbtnkci.storage.supabase.co",
      },
    ],
  },
};

export default nextConfig;
