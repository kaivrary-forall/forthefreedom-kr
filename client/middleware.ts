import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const id = searchParams.get('id')

  /**
   * ✅ 절대 건드리면 안 되는 경로들 (가장 먼저 탈출)
   * - /api/* : 백엔드 프록시(rewrites)로 보내야 함
   * - Next 내부 리소스, 아이콘 등
   */
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next()
  }

  /**
   * ✅ 이 미들웨어의 목적은 "레거시 .html URL 리다이렉트" 뿐
   * .html이 아니면 절대 개입하지 않음
   */
  if (!pathname.endsWith('.html')) {
    return NextResponse.next()
  }

  // 레거시 HTML 상세 페이지 리다이렉트 (쿼리 id 필요)
  const legacyDetailRoutes: Record<string, string> = {
    '/news/notice-detail.html': '/news/notices',
    '/news/press-release-detail.html': '/news/press-releases',
    '/news/card-news-detail.html': '/news/card-news',
    '/news/media-detail.html': '/news/media',
    '/news/activity-detail.html': '/news/activities',
    '/news/gallery-detail.html': '/news/gallery',
    '/news/event-detail.html': '/news/events',
    '/agora/detail.html': '/agora',
  }

  // 레거시 HTML 목록 페이지 리다이렉트
  const legacyListRoutes: Record<string, string> = {
    '/news/notices.html': '/news/notices',
    '/news/press-releases.html': '/news/press-releases',
    '/news/card-news.html': '/news/card-news',
    '/news/media.html': '/news/media',
    '/news/activities.html': '/news/activities',
    '/news/gallery.html': '/news/gallery',
    '/news/events.html': '/news/events',
    '/news/personnel.html': '/news/personnel',
    '/news/congratulations.html': '/news/congratulations',
    '/news/resources.html': '/resources',
    '/news.html': '/news',
    '/news/index.html': '/news',
    '/agora.html': '/agora',
    '/agora/index.html': '/agora',
    '/fain.html': '/fain',
    '/fain/index.html': '/fain',
    '/about.html': '/about',
    '/about/index.html': '/about',
    '/about/founding.html': '/about/founding',
    '/about/principles.html': '/about/principles',
    '/about/policy.html': '/about/policy',
    '/about/organization.html': '/about/organization',
    '/about/logo.html': '/about/logo',
    '/about/location.html': '/about/location',
    '/about/schedule.html': '/about/schedule',
    '/participate.html': '/participate',
    '/participate/index.html': '/participate',
    '/participate/join.html': '/participate/join',
    '/participate/volunteer.html': '/participate/volunteer',
    '/participate/faq.html': '/participate/faq',
    '/support.html': '/support',
    '/support/index.html': '/support',
    '/support/guide.html': '/support/guide',
    '/support/receipt.html': '/support/receipt',
    '/report-center.html': '/report-center',
    '/local-chapters.html': '/local-chapters',
    '/resources.html': '/resources',
    '/resources/index.html': '/resources',
    '/resources/downloads.html': '/resources/downloads',
    '/disclosure.html': '/disclosure',
    '/privacy.html': '/privacy',
    '/terms.html': '/terms',
    '/login.html': '/login',
    '/mypage.html': '/mypage',
    '/index.html': '/',
  }

  // 상세 페이지 리다이렉트 (쿼리 id 필요)
  if (legacyDetailRoutes[pathname]) {
    const newPath = id
      ? `${legacyDetailRoutes[pathname]}/${id}`
      : legacyDetailRoutes[pathname]
    return NextResponse.redirect(new URL(newPath, request.url), 301)
  }

  // 목록 페이지 리다이렉트
  if (legacyListRoutes[pathname]) {
    return NextResponse.redirect(new URL(legacyListRoutes[pathname], request.url), 301)
  }

  // 그 외 .html 확장자 일반 처리
  const newPath = pathname.replace('.html', '')
  return NextResponse.redirect(new URL(newPath, request.url), 301)
}

/**
 * ✅ 핵심: 미들웨어 자체가 ".html" 요청에만 걸리게 제한
 * - 이렇게 하면 /api/*, /mypage, /committees/... 같은 건 아예 미들웨어가 실행되지 않음
 * - 가장 안전하고, 목적(레거시 .html 리다이렉트)에도 딱 맞음
 */
export const config = {
  matcher: ['/:path*.html'],
}
