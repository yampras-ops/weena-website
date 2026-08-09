import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: process.env.NETLIFY
    ? { tsconfigPath: "./tsconfig.netlify.json" }
    : undefined,
};

export default nextConfig;
