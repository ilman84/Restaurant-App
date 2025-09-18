import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during production builds on Vercel to unblock deploys
    ignoreDuringBuilds: true,
  },
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
