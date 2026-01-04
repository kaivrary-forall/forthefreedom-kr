'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

interface AdminGuardProps {
  children: React.ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter()
  const { isLoggedIn, isLoading, member, token } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function checkAdmin() {
      if (isLoading) return

      if (!isLoggedIn || !token) {
        router.push('/login?return=/admin')
        return
      }

      // 서버에서 admin 권한 확인
      try {
        const response = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await response.json()

        if (data.success && data.data) {
          // admin 권한 체크 (role === 'admin' 또는 isAdmin === true 또는 memberType이 admin 계열)
          const memberData = data.data
          const hasAdminRole = 
            memberData.role === 'admin' || 
            memberData.isAdmin === true ||
            memberData.memberType === 'admin' ||
            memberData.memberType === '관리자'

          setIsAdmin(hasAdminRole)
        } else {
          setIsAdmin(false)
        }
      } catch (error) {
        console.error('Admin check failed:', error)
        setIsAdmin(false)
      } finally {
        setChecking(false)
      }
    }

    checkAdmin()
  }, [isLoggedIn, isLoading, token, router])

  // 로딩 중
  if (isLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">권한 확인 중...</p>
        </div>
      </div>
    )
  }

  // 권한 없음
  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">접근 권한 없음</h1>
            <p className="text-gray-600 mb-8">
              관리자 권한이 필요합니다.<br />
              문의사항은 관리자에게 연락해주세요.
            </p>
            <div className="space-y-3">
              <Link 
                href="/"
                className="block w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
              >
                홈으로 돌아가기
              </Link>
              <Link 
                href="/mypage"
                className="block w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                마이페이지
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 권한 있음 - children 렌더
  return <>{children}</>
}
