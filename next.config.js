/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  assetPrefix: "/audio/", //加前缀
  basePath: "/audio", //node	
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
        config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });
    return config;
  }
}

module.exports = nextConfig
