import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@pahal/db", "@pahal/lib", "@pahal/config"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
  },
};

export default nextConfig;
