import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.sanity.io"], // Add Sanity's image CDN domain
  },
};

export default nextConfig;
