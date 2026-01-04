'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// 경로별 한글 매핑
const pathNames: Record<string, string> = {
  // 메인
  '': '홈',
  'en': 'Home',
  
  // 소개
  'about': '소개',
  'greeting': '인사말',
  'vision': '비전',
  'history': '연혁',
  'organization': '조직도',
  'location': '오시는 길',
  'schedule': '주요 일정',
  'founding': '창당선언문',
  'logo': '로고/CI',
  'principles': '강령',
  'people-central': '중앙당 인물',
  'people-regional': '시도당 인물',
  
  // 조직
  'local-chapters': '시도당·당협',
  'committees': '직능위원회',
  
  // 소식
  'news': '소식',
  'press': '보도자료',
  'press-releases': '보도자료',
  'notices': '공지사항',
  'photos': '포토갤러리',
  'gallery': '갤러리',
  'videos': '영상',
  'spokesperson': '대변인실',
  'activities': '활동소식',
  'card-news': '카드뉴스',
  'media': '언론보도',
  'events-news': '행사안내',
  'personnel': '인사공고',
  'congratulations': '경조사',
  
  // 아고라
  'agora': '아고라',
  'write': '글쓰기',
  
  // FAIN
  'fain': 'FAIN',
  
  // 당원
  'participate': '참여',
  'join': '당원가입',
  'benefits': '당원 혜택',
  'faq': 'FAQ',
  'volunteer': '자원봉사',
  'members': '회원',
  
  // 후원
  'support': '후원',
  'guide': '후원 안내',
  'receipt': '영수증 신청',
  'support-receipt': '영수증 신청',
  
  // 제보센터
  'report': '제보센터',
  'report-center': '제보센터',
  
  // 자료실
  'resources': '자료실',
  'downloads': '다운로드',
  'election-materials': '선거자료',
  'party-constitution': '당헌',
  'policy-materials': '정책자료',
  
  // 정책
  'policy': '정강정책',
  'platform': '정강정책',
  'promises': '공약',
  
  // 정보공개
  'disclosure': '정보공개',
  
  // QR/랜딩
  'qr': 'QR 코드',
  'landing': '랜딩페이지',
  'l': '랜딩페이지',
  
  // 기타
  'privacy': '개인정보처리방침',
  'terms': '이용약관',
  'sitemap': '사이트맵',
  'calendar': '일정',
  'hr': '인사공고',
  'events': '경조사',
  'mypage': '마이페이지',
  'profile': '프로필',
  'login': '로그인',
  'register': '회원가입',
}

// 영어 경로 매핑
const pathNamesEn: Record<string, string> = {
  '': 'Home',
  'en': 'Home',
  
  // About
  'about': 'About',
  'greeting': 'Greeting',
  'vision': 'Vision',
  'history': 'History',
  'organization': 'Organization',
  'location': 'Location',
  'schedule': 'Schedule',
  'founding': 'Founding Declaration',
  'logo': 'Logo/CI',
  'principles': 'Principles',
  'people-central': 'Central Leadership',
  'people-regional': 'Regional Leadership',
  
  // Organization
  'local-chapters': 'Local Chapters',
  'committees': 'Committees',
  
  // News
  'news': 'News',
  'press': 'Press Releases',
  'press-releases': 'Press Releases',
  'notices': 'Notices',
  'photos': 'Photos',
  'gallery': 'Gallery',
  'videos': 'Videos',
  'spokesperson': 'Spokesperson',
  'activities': 'Activities',
  'card-news': 'Card News',
  'media': 'Media Coverage',
  'events-news': 'Events',
  'personnel': 'Personnel',
  'congratulations': 'Announcements',
  
  // Agora
  'agora': 'Agora',
  'write': 'Write',
  
  // FAIN
  'fain': 'FAIN',
  
  // Participate
  'participate': 'Participate',
  'join': 'Join',
  'benefits': 'Benefits',
  'faq': 'FAQ',
  'volunteer': 'Volunteer',
  'members': 'Members',
  
  // Support
  'support': 'Support',
  'guide': 'Guide',
  'receipt': 'Receipt',
  'support-receipt': 'Receipt Request',
  
  // Report Center
  'report': 'Report Center',
  'report-center': 'Report Center',
  
  // Resources
  'resources': 'Resources',
  'downloads': 'Downloads',
  'election-materials': 'Election Materials',
  'party-constitution': 'Party Constitution',
  'policy-materials': 'Policy Materials',
  
  // Policy
  'policy': 'Policy',
  'platform': 'Platform',
  'promises': 'Promises',
  
  // Disclosure
  'disclosure': 'Disclosure',
  
  // Others
  'privacy': 'Privacy Policy',
  'terms': 'Terms',
  'sitemap': 'Sitemap',
  'calendar': 'Calendar',
  'hr': 'HR',
  'events': 'Events',
  'mypage': 'My Page',
  'profile': 'Profile',
  'login': 'Login',
  'register': 'Register',
}

export default function Breadcrumb() {
  const pathname = usePathname()
  
  // 홈페이지면 breadcrumb 표시 안 함
  if (pathname === '/' || pathname === '/en') {
    return null
  }
  
  const isEnglish = pathname.startsWith('/en')
  const names = isEnglish ? pathNamesEn : pathNames
  const homeLabel = isEnglish ? 'Home' : '홈'
  const homePath = isEnglish ? '/en' : '/'
  
  // 경로 분리
  const segments = pathname.split('/').filter(Boolean)
  
  // 영어 페이지면 'en' 제거
  const pathSegments = isEnglish ? segments.slice(1) : segments
  
  // breadcrumb 아이템 생성
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = isEnglish 
      ? '/en/' + pathSegments.slice(0, index + 1).join('/')
      : '/' + pathSegments.slice(0, index + 1).join('/')
    const name = names[segment] || segment
    const isLast = index === pathSegments.length - 1
    
    return { path, name, isLast }
  })

  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="py-2.5">
          <ol className="flex items-center text-xs sm:text-sm text-gray-500">
            <li>
              <Link 
                href={homePath} 
                className="hover:text-primary transition-colors"
              >
                {homeLabel}
              </Link>
            </li>
            {breadcrumbs.map((item, index) => (
              <li key={index} className="flex items-center">
                <svg className="w-3 h-3 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                {item.isLast ? (
                  <span className="text-gray-900 font-medium">{item.name}</span>
                ) : (
                  <Link 
                    href={item.path} 
                    className="hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  )
}
