import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  transpilePackages: ['shared-2048-logic'],
  experimental: {
    externalDir: true
  },
   images: {
        domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
    },
};

export default nextConfig;
