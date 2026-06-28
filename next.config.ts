import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [],
    unoptimized: false,
  },
  // Required for Three.js to work properly in Next.js
  transpilePackages: ["three"],
};

export default nextConfig;