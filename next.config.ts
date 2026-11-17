import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Pin the project root so a stray lockfile outside this repo is ignored.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
