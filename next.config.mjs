import 'dotenv/config';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MY_SECRET_KEY: process.env.MY_SECRET_KEY,
    MY_API: process.env.MY_API,
  },
};

export default nextConfig;
