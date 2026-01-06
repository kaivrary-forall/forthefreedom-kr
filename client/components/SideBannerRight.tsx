'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function SideBannerRight() {
  const pathname = usePathname()
  const router = useRouter()
  const isEnPage = pathname?.startsWith('/en')
  const linkPrefix = isEnPage ? '/en' : ''
  const { member, isLoggedIn, isLoading, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div 
      className="fixed z-40 hidden xl:flex flex-col gap-3 w-[140px] transition-[top] duration-200 ease-out"
      style={{ 
        left: 'calc(50% + 576px + 16px)',
        top: 'calc(88px + var(--top-notice-h, 0px))'
      }}
    >
      {/* 로그인/프로필 영역 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
        {/* 프로필 아이콘 */}
        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
          {isLoggedIn && member?.profileImage ? (
            <img 
              src={member.profileImage} 
              alt={member.nickname}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg className="w-7 h-7 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-1.5">
            <div className="h-8 bg-gray-100 rounded-lg animate-pulse"></div>
            <div className="h-8 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
        ) : isLoggedIn && member ? (
          // 로그인 상태
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-gray-900 truncate mb-1">
              {member.nickname}
            </p>
            {/* [정보] [로그아웃] 버튼 가로 배치 */}
            <div className="flex gap-1.5">
              <Link
                href={`${linkPrefix}/mypage`}
                className="flex-1 py-2 px-2 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors text-center"
              >
                {isEnPage ? 'Info' : '정보'}
              </Link>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 px-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {isEnPage ? 'Logout' : '로그아웃'}
              </button>
            </div>
          </div>
        ) : (
          // 비로그인 상태
          <div className="flex flex-col gap-1.5">
            <Link
              href={`${linkPrefix}/login`}
              className="block w-full py-2 px-3 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
            >
              {isEnPage ? 'Login' : '로그인'}
            </Link>
            <a
              href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2 px-3 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {isEnPage ? 'Sign Up' : '회원가입'}
            </a>
          </div>
        )}
      </div>

      {/* 당원가입/후원/영수증 버튼 영역 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 flex flex-col gap-2">
        {/* 당원가입 */}
        <a
          href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-medium text-white bg-primary rounded-full hover:bg-primary-dark transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          {isEnPage ? 'Join Party' : '당원가입'}
        </a>

        {/* 후원하기 */}
        <Link
          href={`${linkPrefix}/support`}
          className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-medium text-white bg-primary rounded-full hover:bg-primary-dark transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          {isEnPage ? 'Donate' : '후원하기'}
        </Link>

        {/* 영수증신청 */}
        <Link
          href={`${linkPrefix}/support/receipt`}
          className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-medium text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
          {isEnPage ? 'Receipt' : '영수증신청'}
        </Link>
      </div>
    </div>
  )
}
