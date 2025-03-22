/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Enable various experimental features to improve stability
    serverComponentsExternalPackages: ['jsonwebtoken'],
    optimizeCss: true,
    forceSwcTransforms: true,
  },
  // Disable image optimization if not needed
  images: {
    disableStaticImages: true,
  },
  // Increase memory limit for build process
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      };
    }
    
    return config;
  },
};

module.exports = nextConfig; 