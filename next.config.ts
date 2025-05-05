import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Suppress CORS dev warning when running from localhost network
  allowedDevOrigins: ["http://localhost:3000"],

  // Optional: Add basePath, assetPrefix, rewrites, etc., if needed
};

export default nextConfig;
