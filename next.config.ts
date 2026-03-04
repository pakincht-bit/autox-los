import type { NextConfig } from "next";

// @ts-ignore: Next.js 15+ turbopack bypass
const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "lucide-react": "lucide-react/dist/cjs/lucide-react.js",
    };
    return config;
  },
  // @ts-ignore: Next.js 15+ turbopack bypass
  experimental: {
    // @ts-ignore: Next.js 15+ turbopack bypass
    turbopack: {
      resolveAlias: {
        "lucide-react": "lucide-react/dist/cjs/lucide-react.js",
      },
    },
  },
};

export default nextConfig;
