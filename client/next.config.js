/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,

  images: {
    unoptimized: true,
  },

  /**
   * 🔥 핵심: /api/* 요청을 무조건 Railway로 프록시
   * - 환경변수 조건 제거 (이게 문제의 근원)
   * - next.config 단계에서 강제 rewrite
   */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://forthefreedom-kr-production.up.railway.app/api/:path*",
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
