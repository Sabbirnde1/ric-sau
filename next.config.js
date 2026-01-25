/** @type {import('next').NextConfig} */
const nextConfig = {
  //output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    outputFileTracingIncludes: {
      "/events/[slug]": ["./app/api/content/route.ts"],
    },
  },
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  },
};

module.exports = nextConfig;

