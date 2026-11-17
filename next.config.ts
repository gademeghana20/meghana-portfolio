import type { NextConfig } from "next";

// Allow optimized images only from this project's public Supabase Storage.
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Pin the project root so a stray lockfile outside this repo is ignored.
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    // Admin image/resume uploads go through server actions (files up to ~5 MB).
    serverActions: { bodySizeLimit: "6mb" },
  },
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
