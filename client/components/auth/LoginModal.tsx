'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginModal() {
  const { login, isLoginModalOpen, closeLoginModal } = useAuth()
  
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 모달 열릴 때 초기화
  useEffect(() => {
    if (isLoginModalOpen) {
      setUserId('')
      setPassword('')
      setError('')
      setIsPending(false)
      setShowPassword(false)
    }
  }, [isLoginModalOpen])

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLoginModalOpen) {
        closeLoginModal()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isLoginModalOpen, closeLoginModal])

  // 모달 열릴 때 스크롤 방지
  useEffect(() => {
    if (isLoginModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isLoginModalOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setError('')
    setIsPending(false)

    if (!userId.trim() || !password) {
      setError('아이디와 비밀번호를 입력해주세요')
      return
    }

    setIsSubmitting(true)

    const result = await login(userId, password)

    if (result.success) {
      // 로그인 성공 - 모달은 AuthContext에서 자동으로 닫힘
    } else {
      if (result.status === 'pending') {
        setIsPending(true)
      } else {
        setError(result.message || '로그인에 실패했습니다')
      }
    }

    setIsSubmitting(false)
  }

  // 배경 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeLoginModal()
    }
  }

  if (!isLoginModalOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 relative animate-in fade-in zoom-in-95 duration-200">
        {/* 닫기 버튼 */}
        <button 
          onClick={closeLoginModal}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
        >
          <i className="fas fa-times"></i>
        </button>

        <div className="p-8">
          {/* 헤더 */}
          <div className="text-center mb-6">
            <img 
              src="/images/logo.png" 
              alt="자유와혁신" 
              className="h-12 mx-auto mb-4"
            />
            <h2 className="text-xl font-bold text-gray-900">로그인</h2>
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit}>
            {/* 아이디 */}
            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-2 text-sm">아이디</label>
              <input 
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                placeholder="아이디를 입력해주세요"
                autoFocus
                autoComplete="username"
              />
            </div>
            
            {/* 비밀번호 */}
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-2 text-sm">비밀번호</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition pr-12"
                  placeholder="비밀번호를 입력해주세요"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* 승인 대기 안내 */}
            {isPending && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <i className="fas fa-clock text-yellow-500 mt-0.5"></i>
                  <div className="text-sm">
                    <p className="font-semibold text-yellow-800">승인 대기 중</p>
                    <p className="text-yellow-700">관리자 승인 후 로그인하실 수 있습니다.</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* 로그인 버튼 */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-spinner fa-spin"></i>
                  로그인 중...
                </span>
              ) : '로그인'}
            </button>
          </form>
          
          {/* 링크들 */}
          <div className="flex justify-center gap-4 mt-6 text-sm text-gray-600">
            <Link 
              href="/forgot-password" 
              onClick={closeLoginModal}
              className="hover:text-primary"
            >
              비밀번호 찾기
            </Link>
            <span className="text-gray-300">|</span>
            <Link 
              href="/register"
              onClick={closeLoginModal}
              className="hover:text-primary"
            >
              회원가입
            </Link>
          </div>

          {/* 당원가입 안내 */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500 mb-3">
              아직 당원이 아니신가요?
            </p>
            <a 
              href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition text-center"
              onClick={() => {
                // GA4 이벤트
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'click_party_join', {
                    event_category: 'engagement',
                    event_label: 'login_modal'
                  })
                }
              }}
            >
              <i className="fas fa-user-plus mr-2"></i>
              당원가입 하기
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
