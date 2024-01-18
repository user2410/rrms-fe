/** @type {import('next').NextConfig} */
const nextConfig = {
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'https://maps.app.goo.gl/:path*', // Replace with your target API URL
  //     },
  //   ];
  // },
  // async headers() {
  //   return [
  //     {
  //       source: 'https://maps.app.goo.gl/:path*',
  //       headers: [
  //         { key: "Access-Control-Allow-Credentials", value: "true" },
  //         { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
  //         { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
  //         { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
  //       ],
  //     },
  //   ];
  // }
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.s3.ap-southeast-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.batdongsan.com.vn',
      },
      {
        protocol: 'https',
        hostname: '**.cdn.static123.com',
      },
    ]
  }
};

module.exports = nextConfig;
