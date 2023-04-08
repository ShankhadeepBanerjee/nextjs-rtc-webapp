/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NX_BASE_URL: process.env.NX_BASE_URL,
  },
};

module.exports = nextConfig;
