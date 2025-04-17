import type { NextConfig } from "next";
import type { Configuration as WebpackConfig } from 'webpack'

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  // webpack: (config: WebpackConfig, { dev, isServer }) => {
  //   if (dev && !isServer) {
  //     config.watchOptions = {
  //       poll: 1000,
  //       aggregateTimeout: 300,
  //     }
  //   }
  //   return config
  // },
};

export default nextConfig;
