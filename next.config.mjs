/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/find',
        permanent: true,
      },
      {
        source: '/:langcode(\\w{2})/:slug*',
        destination: '/:slug*',
        permanent: true,
      },
    ];
  },
    // las imágenes se sirven a través de /api/media_proxy: cada <Image> lleva la
  // prop unoptimized, porque Next 12 no admite desactivar el optimizador desde
  // la configuración global. El redimensionado ya lo hace IMDb vía
  // modifyIMDbImg (400px pesa 54 KB frente a 326 KB del original).
  images: {
    domains: ['m.media-amazon.com'],
  },
  experimental: {
    images: {
      allowFutureImage: true,
    },
    isrMemoryCacheSize: 20 * 1024 * 1024,
  },
  poweredByHeader: false,
};

export default nextConfig;
