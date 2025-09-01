import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Disable strict mode to prevent double rendering in development
  swcMinify: true, // Enable SWC minification for better performance
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60, // Cache images for at least 60 seconds
  },
  experimental: {
    optimizeCss: true, // Enable CSS optimization
  },
};

export default nextConfig;
