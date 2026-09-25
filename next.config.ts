import type { NextConfig } from 'next';

// Mesmo alvo do proxy.conf.json do projeto Angular (CORS do backend só
// libera as origens do Angular, então as chamadas passam pelo servidor Next).
const API_PROXY_TARGET =
  process.env.API_PROXY_TARGET ?? 'http://localhost:8080';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/auth/:path*', destination: `${API_PROXY_TARGET}/auth/:path*` },
      { source: '/users/:path*', destination: `${API_PROXY_TARGET}/users/:path*` },
      { source: '/products/:path*', destination: `${API_PROXY_TARGET}/products/:path*` },
    ];
  },
};

export default nextConfig;
