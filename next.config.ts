import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isGitHubPages ? '/AIBAPT' : '',
  assetPrefix: isGitHubPages ? '/AIBAPT/' : undefined,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'movrahslqtxeuvdnbesi.supabase.co',
      },
    ],
  },
};

export default nextConfig;
