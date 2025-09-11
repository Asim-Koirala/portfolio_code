import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Disable strict mode to prevent double rendering in development
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60, // Cache images for at least 60 seconds
  },
  experimental: {
    optimizeCss: true, // Enable CSS optimization
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'asimkoirala.com.np',
          },
        ],
        destination: 'https://www.asimkoirala.com.np/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
