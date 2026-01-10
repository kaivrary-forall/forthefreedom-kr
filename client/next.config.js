/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    if (!apiBase) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${apiBase}/api/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      { source: "/news/resources", destination: "/resources", permanent: true },
      { source: "/news/resources/:path*", destination: "/resources/:path*", permanent: true },
      { source: "/news/notice-detail.html", destination: "/news/notices", permanent: true },
      { source: "/news/press-release-detail.html", destination: "/news/press-releases", permanent: true },
      { source: "/news/event-detail.html", destination: "/news/events", permanent: true },
      { source: "/news/activity-detail.html", destination: "/news/activities", permanent: true },
      { source: "/news/media-detail.html", destination: "/news/media", permanent: true },
      { source: "/news/gallery-detail.html", destination: "/news/gallery", permanent: true },
      { source: "/board/:path*", destination: "/agora", permanent: true },
      { source: "/join", destination: "/participate/join", permanent: true },
      { source: "/donate", destination: "/support", permanent: true },
      { source: "/contact", destination: "/about/location", permanent: true },
    ];
  },
};
module.exports = nextConfig;
