import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  outputFileTracingIncludes: {
    "*": ["../node_modules/@sparticuz/chromium/**"],
  },
};
export default nextConfig;
