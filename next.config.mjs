import 'dotenv/config';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MY_SECRET_KEY: process.env.MY_SECRET_KEY,
    MY_API: process.env.MY_API,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://naveropenapi.apigw.ntruss.com/:path*', // 네이버 지도 API 엔드포인트
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        module: false,
      };
    }
    return config;
  },
};

export default nextConfig;
