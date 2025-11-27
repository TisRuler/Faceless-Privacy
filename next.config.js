/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', 
  trailingSlash: true, 
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  eslint: {
    ignoreDuringBuilds: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  images: {
    unoptimized: true // ✅ Required for static export
  },
  webpack: (config, options) => {
    // Adding fallbacks for certain Node.js modules
    config.resolve.fallback = { 
      fs: false, 
      net: false, 
      tls: false 
    };
    return config;
  },
};

module.exports = nextConfig;