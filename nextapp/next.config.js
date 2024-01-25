/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
  }

  
  module.exports = nextConfig

const withTM = require('next-transpile-modules')(['jp-prefectures']);

module.exports = withTM({
  webpack(config, options) {
    // さらなるカスタム設定
    return config;
  },
});