import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '내 정보 | 자유와혁신',
  robots: { index: false, follow: false },
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <i className="fas fa-user-cog text-gray-400 text-3xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">내 정보</h1>
          <p className="text-gray-600 mb-8">로그인이 필요합니다.</p>
          <Link href="/login" className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark">
            로그인하기
          </Link>
        </div>
      </div>
    </div>
  )
}
