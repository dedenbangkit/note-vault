import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/note-vault",
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
