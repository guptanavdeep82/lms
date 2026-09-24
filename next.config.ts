import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  // Keep HTML from being served stale for a year after a rebuild
  // (default SWR is ~1 year and causes 404s on old /_next/static hashes).
  expireTime: 60,
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/((?!_next/static/).*)",
        headers: [
          { key: "Cache-Control", value: "private, no-cache, no-store, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
