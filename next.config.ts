import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.camara.leg.br',
        port: '',
        pathname: '/internet/deputado/bandep/**',
      },
      {
        protocol: 'https',
        hostname: 'foto.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'foto.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.camara.leg.br',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
