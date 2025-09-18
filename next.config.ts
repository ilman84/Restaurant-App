import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Explicit domain allowlist (works across Next versions)
    domains: ['foodish-api.com'],
    // Remote patterns for path-level control
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'foodish-api.com',
        port: '',
        pathname: '/images/**',
      },
    ],
    // Optionally, modern formats
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
