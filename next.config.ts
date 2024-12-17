import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }], // Add Sanity's image CDN domain
  },
};
export default nextConfig;
