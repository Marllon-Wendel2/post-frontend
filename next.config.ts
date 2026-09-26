import type { NextConfig } from 'next';

const API_PROXY_TARGET =
  process.env.API_PROXY_TARGET ?? 'http://localhost:8080';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/auth', destination: `${API_PROXY_TARGET}/auth` },
      { source: '/users', destination: `${API_PROXY_TARGET}/users` },
      { source: '/products', destination: `${API_PROXY_TARGET}/products` },

      { source: '/auth/:path+', destination: `${API_PROXY_TARGET}/auth/:path+` },
      { source: '/users/:path+', destination: `${API_PROXY_TARGET}/users/:path+` },
      { source: '/products/:path+', destination: `${API_PROXY_TARGET}/products/:path+` },
    ];
  },
};

export default nextConfig;