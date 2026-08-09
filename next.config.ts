import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.NETLIFY ? "export" : undefined,
  typescript: process.env.NETLIFY
    ? { tsconfigPath: "./tsconfig.netlify.json" }
    : undefined,
};

export default nextConfig;
