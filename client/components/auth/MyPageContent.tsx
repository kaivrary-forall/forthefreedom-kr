'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function MyPageContent() {
  const router = useRouter()
  const { member, isLoggedIn, isLoading, logout } = useAuth()

  // 로그인 안 되어 있으면 로그인 페이지로
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login?return=/mypage')
    }
  }, [isLoggedIn, isLoading, router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isLoggedIn || !member) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* 프로필 카드 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-6">
            {/* 프로필 이미지 */}
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
              {member.profileImage ? (
                <img 
                  src={member.profileImage} 
                  alt={member.nickname}
                  className="w-full h-full object-cover"
                />
              ) : (
                <i className="fas fa-user text-gray-400 text-3xl"></i>
              )}
            </div>
            
            {/* 정보 */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{member.nickname}</h1>
              <p className="text-gray-500">@{member.userId}</p>
              {member.role && (
                <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  {member.role}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 회원 정보 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">회원 정보</h2>
          <div className="space-y-4">
            {member.name && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">이름</span>
                <span className="font-medium">{member.name}</span>
              </div>
            )}
            {member.email && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">이메일</span>
                <span className="font-medium">{member.email}</span>
              </div>
            )}
            {member.phone && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">연락처</span>
                <span className="font-medium">{member.phone}</span>
              </div>
            )}
            <div className="flex justify-between py-2">
              <span className="text-gray-500">상태</span>
              <span className={`font-medium ${
                member.status === 'active' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {member.status === 'active' ? '정상' : member.status}
              </span>
            </div>
          </div>
        </div>

        {/* 메뉴 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <Link 
            href="/profile"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <i className="fas fa-user-edit text-gray-400"></i>
              <span>프로필 수정</span>
            </div>
            <i className="fas fa-chevron-right text-gray-300"></i>
          </Link>
          <Link 
            href="/agora"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <i className="fas fa-comments text-gray-400"></i>
              <span>내 게시글</span>
            </div>
            <i className="fas fa-chevron-right text-gray-300"></i>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 text-left"
          >
            <div className="flex items-center gap-3">
              <i className="fas fa-sign-out-alt text-red-400"></i>
              <span className="text-red-600">로그아웃</span>
            </div>
          </button>
        </div>

        {/* 홈으로 */}
        <div className="text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-primary">
            <i className="fas fa-home mr-1"></i> 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
