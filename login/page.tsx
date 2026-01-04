import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: '로그인 | 자유와혁신',
  description: '자유와혁신 당원 로그인',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center">
      <div className="max-w-md mx-auto px-4 w-full">
        {/* 로고 & 타이틀 */}
        <div className="text-center mb-8">
          <Link href="/">
            <img src="/images/logo.png" alt="자유와혁신" className="h-16 mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">로그인</h1>
        </div>
        
        {/* 로그인 폼 */}
        <Suspense fallback={
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
