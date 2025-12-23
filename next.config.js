/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["i.ibb.co", "i.pinimg.com", "cdn.shopify.com", "akaal-thrifts.myshopify.com"],
    unoptimized: true,
  },
}

module.exports = nextConfig
