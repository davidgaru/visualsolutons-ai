/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io"
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com"
      },
      {
        protocol: "https",
        hostname: "www.aifilmfestathens.gr",
        pathname: "/images/speakers/**"
      }
    ]
  },
  async headers() {
    return [{
      source: "/videos/optimized/:path*",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }]
    }];
  }
};

export default nextConfig;
