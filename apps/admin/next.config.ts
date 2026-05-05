import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@pahal/db", "@pahal/lib", "@pahal/config"],
};

export default nextConfig;
