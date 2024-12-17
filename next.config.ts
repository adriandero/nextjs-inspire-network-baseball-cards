import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.sanity.io"], // Add Sanity's image CDN domain
  },
};
module.exports = {
  webpack: (config: { module: { rules: { test: RegExp; use: string }[] } }) => {

    config.module.rules.push({
      test: /\.map$/,
      use: "ignore-loader",
    });

    return config;
  },
};
export default nextConfig;
