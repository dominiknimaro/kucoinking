/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable the development overlay
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // You can also disable other dev indicators
  experimental: {
    // Disable other development features if needed
  }
}

export default nextConfig
