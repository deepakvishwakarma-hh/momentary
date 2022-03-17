/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     domains: ["lh3.googleusercontent.com"],
//   },
// }

// module.exports = nextConfig


const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
});