import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/webtrix_world_refined/Build/:all*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Content-Type', value: 'application/octet-stream' },
        ],
      },
    ];
  },
};

export default nextConfig;
