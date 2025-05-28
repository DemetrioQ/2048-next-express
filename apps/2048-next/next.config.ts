import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
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
