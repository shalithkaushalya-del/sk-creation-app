import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Meken loku images load wena error eka nathi wenawa
  },
};

export default nextConfig;