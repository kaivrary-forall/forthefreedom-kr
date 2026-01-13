'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface MenuItem {
  label: string
  href: string
  icon: React.ReactNode
  children?: { label: string; href: string }[]
}

const menuItems: MenuItem[] = [
  {
    label: '대시보드',
    href: '/admin',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'QR/랜딩페이지',
    href: '/admin/qr',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
      </svg>
    ),
    children: [
      { label: 'QR 코드 관리', href: '/admin/qr' },
      { label: '랜딩페이지', href: '/admin/landing' },
    ],
  },
  {
    label: '사이트 설정',
    href: '/admin/site-settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    children: [
      { label: '푸터 설정', href: '/admin/site-settings/footer' },
      { label: '기본 정보', href: '/admin/site-settings/basic' },
      { label: '한줄 공지', href: '/admin/announcement' },
      { label: '모달 팝업', href: '/admin/popup' },
    ],
  },
  {
    label: '콘텐츠 관리',
    href: '/admin/content',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
    children: [
      { label: '공지사항', href: '/admin/content/notices' },
      { label: '보도자료', href: '/admin/content/press' },
      { label: '활동소식', href: '/admin/content/activities' },
      { label: '갤러리', href: '/admin/content/gallery' },
      { label: '인사공고', href: '/admin/personnel' },
      { label: '경조사', href: '/admin/congratulations' },
      { label: '배너 관리', href: '/admin/content/banners' },
      { label: '사이드카드', href: '/admin/content/side-cards' },
    ],
  },
  {
    label: '아고라 관리',
    href: '/admin/agora',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
    children: [
      { label: '게시글 관리', href: '/admin/agora/posts' },
    ],
  },
  {
    label: '의자 배치',
    href: '/admin/slots',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { member, logout } = useAuth()
  const [openMenus, setOpenMenus] = useState<string[]>([])

  // 초기 로드 시 현재 경로에 해당하는 메뉴 열기
  useEffect(() => {
    menuItems.forEach(item => {
      if (item.children?.some(child => pathname === child.href || pathname?.startsWith(child.href + '/'))) {
        setOpenMenus(prev => prev.includes(item.href) ? prev : [...prev, item.href])
      }
    })
  }, [pathname])

  const toggleMenu = (href: string) => {
    setOpenMenus(prev => 
      prev.includes(href) ? prev.filter(h => h !== href) : [...prev, href]
    )
  }

  const isMenuOpen = (href: string) => openMenus.includes(href)

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname === href || pathname?.startsWith(href + '/')
  }

  return (
    <aside className="w-64 bg-gray-900 min-h-screen flex flex-col fixed left-0 top-0">
      {/* 로고 */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <div>
            <div className="text-white font-bold">자유와혁신</div>
            <div className="text-gray-400 text-xs">관리자</div>
          </div>
        </Link>
      </div>

      {/* 메뉴 */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.href}>
            {item.children ? (
              // 하위 메뉴가 있는 경우: 클릭하면 토글
              <button
                onClick={() => toggleMenu(item.href)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isMenuOpen(item.href) || item.children.some(c => isActive(c.href))
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <svg 
                  className={`w-4 h-4 transition-transform ${isMenuOpen(item.href) ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            ) : (
              // 하위 메뉴 없는 경우: 링크
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            )}

            {item.children && isMenuOpen(item.href) && (
              <div className="ml-8 mt-1 space-y-1">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                      pathname === child.href
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* 사용자 정보 */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            {member?.profileImage ? (
              <img src={member.profileImage} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-gray-400">👤</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium truncate">{member?.nickname}</div>
            <div className="text-gray-400 text-xs truncate">관리자</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/"
            className="flex-1 px-3 py-2 bg-gray-800 text-gray-300 text-sm rounded-lg hover:bg-gray-700 text-center"
          >
            사이트 보기
          </Link>
          <button
            onClick={logout}
            className="flex-1 px-3 py-2 bg-gray-800 text-gray-300 text-sm rounded-lg hover:bg-gray-700"
          >
            로그아웃
          </button>
        </div>
      </div>
    </aside>
  )
}
