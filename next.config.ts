import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: []
    },
  },
  images:{
    domains: ['tfrcrrtavnbqgselqkdz.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tfrcrrtavnbqgselqkdz.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/claim-attachments/**',
      },
    ],
  },
  // This ensures that API routes are properly bundled
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
      }
    }
    return config
  },
};

export default nextConfig;
