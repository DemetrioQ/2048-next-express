import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  transpilePackages: ['shared-2048-logic'],
  experimental: {
    externalDir: true
  }
};

export default nextConfig;
