/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    CLAUDE_API_KEY: process.env.CLAUDE_API_KEY
  },
  async rewrites() {
    return [
      {
        source: '/api/claude',
        destination: 'https://api.anthropic.com/v1/messages'
      }
    ];
  },
  webpack: (config, { isServer }) => {
    // Fix for node modules not being recognized
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  }
};

module.exports = nextConfig;