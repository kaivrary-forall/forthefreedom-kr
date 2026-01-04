'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isLoggedIn, isLoading } = useAuth()
  
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 이미 로그인되어 있으면 마이페이지로
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      const returnUrl = searchParams.get('return') || '/mypage'
      router.push(returnUrl)
    }
  }, [isLoggedIn, isLoading, router, searchParams])

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
      const returnUrl = searchParams.get('return') || '/mypage'
      router.push(returnUrl)
    } else {
      if (result.status === 'pending') {
        setIsPending(true)
      } else {
        setError(result.message || '로그인에 실패했습니다')
      }
    }

    setIsSubmitting(false)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <>
      {/* 로그인 폼 */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <form onSubmit={handleSubmit}>
          {/* 아이디 */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-2">아이디</label>
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
            <label className="block font-medium text-gray-700 mb-2">비밀번호</label>
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
          
          {/* 로그인 버튼 */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </button>
        </form>
        
        {/* 링크들 */}
        <div className="flex justify-center gap-4 mt-6 text-sm text-gray-600">
          <Link href="/forgot-password" className="hover:text-primary">
            비밀번호 찾기
          </Link>
          <span className="text-gray-300">|</span>
          <a 
            href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            회원가입
          </a>
        </div>
      </div>

      {/* 승인 대기 안내 */}
      {isPending && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <i className="fas fa-clock text-yellow-500 mt-1"></i>
            <div className="text-sm">
              <p className="font-semibold text-yellow-800 mb-1">승인 대기 중</p>
              <p className="text-yellow-700">회원가입 신청이 완료되었습니다. 관리자 승인 후 로그인하실 수 있습니다.</p>
            </div>
          </div>
        </div>
      )}

      {/* 홈으로 */}
      <div className="mt-8 text-center">
        <Link href="/" className="text-sm text-gray-500 hover:text-primary">
          <i className="fas fa-home mr-1"></i> 홈으로 돌아가기
        </Link>
      </div>
    </>
  )
}
