import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Point file tracing at the monorepo root so the standalone output mirrors
  // the repo structure: server.js lands at apps/2048-next/server.js inside
  // .next/standalone/, rather than at an unpredictable location.
  outputFileTracingRoot: path.join(__dirname, '../../'),
  transpilePackages: ['shared-2048-logic'],
  experimental: {
    externalDir: true
  },
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
          {
        protocol: 'https',
        hostname: 'gnmssp943a.ufs.sh',
        pathname: '/**',
      },
      
    ],
  }
};

export default nextConfig;
