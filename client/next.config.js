/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  images: {
    unoptimized: true
  },
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
      // 404 박멸: 레거시 URL → 새 URL
      { source: '/news/resources', destination: '/resources', permanent: true },
      { source: '/news/resources/:path*', destination: '/resources/:path*', permanent: true },
      
      // 레거시 .html 패턴
      { source: '/news/notice-detail.html', destination: '/news/notices', permanent: true },
      { source: '/news/press-release-detail.html', destination: '/news/press-releases', permanent: true },
      { source: '/news/event-detail.html', destination: '/news/events', permanent: true },
      { source: '/news/activity-detail.html', destination: '/news/activities', permanent: true },
      { source: '/news/media-detail.html', destination: '/news/media', permanent: true },
      { source: '/news/gallery-detail.html', destination: '/news/gallery', permanent: true },
      
      // 보드 패턴
      { source: '/board/:path*', destination: '/agora', permanent: true },
      
      // 기타 레거시
      { source: '/join', destination: '/participate/join', permanent: true },
      { source: '/donate', destination: '/support', permanent: true },
      { source: '/contact', destination: '/about/location', permanent: true },
    ]
  }
}
module.exports = nextConfig
