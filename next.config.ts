import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Hide the dev-only Next.js indicator in the corner.
  // (Compile/runtime errors still surface; only the static "N" badge is hidden.)
  devIndicators: false,
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
