import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@pahal/db", "@pahal/lib", "@pahal/config"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
