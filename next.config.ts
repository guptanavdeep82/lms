import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "next/link": path.join(__dirname, "src/lib/static-link.tsx"),
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      "next/link": "./src/lib/static-link.tsx",
    },
  },
};

export default nextConfig;
