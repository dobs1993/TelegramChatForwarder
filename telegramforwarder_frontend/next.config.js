/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:5001/:path*', // Flask backend
        },
      ];
    },
  };
  
  module.exports = nextConfig;
  