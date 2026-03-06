import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "lucide-react": "lucide-react/dist/cjs/lucide-react.js",
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      "lucide-react": "lucide-react/dist/cjs/lucide-react.js",
    },
  },
};

export default nextConfig;
