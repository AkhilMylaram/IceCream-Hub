/** @type {import('next').NextConfig} */

const GATEWAY_URL = process.env.GATEWAY_URL || 'http://api-gateway:8080';

const nextConfig = {
  async rewrites() {
    return [
      { source: '/api/auth/:path*', destination: `${GATEWAY_URL}/api/auth/:path*` },
      { source: '/api/products/:path*', destination: `${GATEWAY_URL}/api/products/:path*` },
      { source: '/api/orders/:path*', destination: `${GATEWAY_URL}/api/orders/:path*` },
      { source: '/api/cart/:path*', destination: `${GATEWAY_URL}/api/cart/:path*` },
      { source: '/api/recommendations/:path*', destination: `${GATEWAY_URL}/api/recommendations/:path*` },
    ];
  },
};

export default nextConfig;
